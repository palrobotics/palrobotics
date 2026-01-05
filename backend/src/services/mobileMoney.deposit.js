import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import crypto from "crypto";
import { initiateMTNPayment } from "./providers/mtn.provider.js";
import { initiateAirtelPayment } from "./providers/airtel.provider.js";

export async function initiateDeposit({ uid, amount, method, phone }) {
  if (!amount || amount <= 0) {
    throw new Error("Invalid deposit amount");
  }

  if (!["MTN", "Airtel"].includes(method)) {
    throw new Error("Invalid payment method");
  }

  const reference = crypto.randomUUID();

  await db.collection("transactions").add({
    uid,
    reference,
    type: "deposit",
    source: "mobile_money",
    method,
    amount,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (method === "MTN") {
    await initiateMTNPayment({ amount, phone, reference });
  } else {
    await initiateAirtelPayment({ amount, phone, reference });
  }

  return { reference };
}
