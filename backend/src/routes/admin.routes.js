import express from "express";
import {
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  approveDeposit,
  approveInvestment,
  rejectManualTransaction,
  getPendingManualTransactions,
} from "../controllers/admin.controller.js";

import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(verifyFirebaseToken, requireAdmin);

router.get("/withdrawals/pending", getPendingWithdrawals);
router.get("/deposits/pending", getPendingManualTransactions);
router.post("/withdrawals/approve", approveWithdrawal);
router.post("/withdrawals/reject", rejectWithdrawal);
router.post("/deposits/reject_manual", rejectManualTransaction);
router.post("/deposits/approve_deposit", approveDeposit);
router.post("/deposits/approve_investment", approveInvestment);

export default router;
