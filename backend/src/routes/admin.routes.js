import express from "express";
import {
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../controllers/admin.controller.js";

import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(verifyFirebaseToken, requireAdmin);

router.get("/withdrawals/pending", getPendingWithdrawals);
router.post("/withdrawals/approve", approveWithdrawal);
router.post("/withdrawals/reject", rejectWithdrawal);

export default router;
