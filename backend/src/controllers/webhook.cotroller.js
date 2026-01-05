import { processMobileMoneyWebhook } from "../services/mobileMoney.webhook.js";
import crypto from "crypto";

const SIGNATURE_HEADERS = [
  "x-webhook-signature",
  "x-signature",
  "x-hub-signature",
];

function getSignatureHeader(req) {
  for (const h of SIGNATURE_HEADERS) {
    const val = req.headers[h];
    if (val) return val;
  }
  return null;
}

export const handleMobileMoneyWebhook = async (req, res) => {
  try {
    // req.body is raw for /webhook route (express.raw). Keep raw copy for HMAC verification.
    const rawBody =
      req.body && Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(JSON.stringify(req.body || {}));

    // If a WEBHOOK_SECRET is configured, verify HMAC SHA256 signature
    const secret = process.env.WEBHOOK_SECRET;
    if (secret) {
      const signature = getSignatureHeader(req);
      if (!signature) {
        console.warn("Webhook missing signature header");
        return res.status(401).send("Missing signature");
      }

      const hmac = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      // signature may arrive with prefix like sha256=..., normalize
      const normalized = signature.includes("=")
        ? signature.split("=").pop()
        : signature;

      const a = Buffer.from(hmac, "utf8");
      const b = Buffer.from(normalized, "utf8");

      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        console.warn("Webhook signature mismatch");
        return res.status(401).send("Invalid signature");
      }
    }

    // Parse JSON safely
    let payload = {};
    try {
      payload = rawBody.length ? JSON.parse(rawBody.toString("utf8")) : {};
    } catch (err) {
      console.warn("Webhook JSON parse failed", err?.message || err);
      return res.status(400).send("Invalid JSON");
    }

    // Minimal logging to avoid PII leakage
    console.info("Webhook received", {
      reference: payload?.reference,
      status: payload?.status,
    });

    // Process asynchronously but respond quickly — still catch processing errors
    try {
      await processMobileMoneyWebhook(payload);
    } catch (procErr) {
      console.error("Webhook processing failed:", procErr?.message || procErr);
      // Return 200 to prevent provider retries in many cases, but indicate processed-with-error
      return res.status(200).send("Processed with error");
    }

    return res.status(200).send("OK");
  } catch (error) {
    console.error("Unhandled webhook error:", error?.message || error);
    return res.status(500).send("Server error");
  }
};
