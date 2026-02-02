import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

/* ========== SECURITY MIDDLEWARE ========== */
// Basic security headers
app.use(helmet());

app.set("trust proxy", 1);

// Rate limiters
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }); // 15 min, 200 req
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); // for auth/secure routes
const adminLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 60 }); // admin endpoints
const sensitiveLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 }); // per minute for very sensitive endpoints

// Apply a general limiter to all requests first
app.use(generalLimiter);

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: ["https://palroboticsandinvestment.com"],
  }),
);
app.use("/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// Apply stricter limiters on high-risk route prefixes
app.use("/secure", authLimiter);
app.use("/transactions", sensitiveLimiter);
app.use("/earnings", sensitiveLimiter);
app.use("/admin", adminLimiter);

/* ================= ROUTES ================= */

import secureRoutes from "./routes/secure.routes.js";
import mobileMoneyRoutes from "./routes/mobileMoney.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import withdrawRoutes from "./routes/withdraw.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminUsersRoutes from "./routes/adminUsers.routes.js";
import earningsRoutes from "./routes/earnings.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import plansRoutes from "./routes/plans.routes.js";
import referralsRoutes from "./routes/referrals.routes.js";
import createUsersRoutes from "./routes/createUser.routes.js";

app.use("/users", createUsersRoutes);
app.use("/referrals", referralsRoutes);
app.use("/api", plansRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/earnings", earningsRoutes);
app.use("/admin/users", adminUsersRoutes);
app.use("/admin", adminRoutes);
app.use("/withdraw", withdrawRoutes);
app.use("/wallet", walletRoutes);
app.use("/webhook", webhookRoutes);
app.use("/mobile-money", mobileMoneyRoutes);
app.use("/secure", secureRoutes);

app.get("/health", (req, res) => res.status(200).send("Awake"));

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Error occurred:", err.message || err);

  // Known, expected errors
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown / programming errors
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

import { startEarningsCron } from "./cron/dailyEarnings.cron.js";

startEarningsCron();

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
