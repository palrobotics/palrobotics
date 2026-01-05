import express from "express";
import rateLimit from "express-rate-limit";
import { handleMobileMoneyWebhook } from "../controllers/webhook.cotroller.js";

const router = express.Router();

// Very strict rate limiter for webhook callbacks to avoid abuse
const webhookLimiter = rateLimit({ windowMs: 60 * 1000, max: 30 });

router.post("/callback", webhookLimiter, handleMobileMoneyWebhook);

export default router;
