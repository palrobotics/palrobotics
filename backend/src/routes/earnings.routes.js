import express from "express";
import {
  getEarningsSummary,
  getActiveInvestments,
  getEarningsHistory,
} from "../controllers/earnings.controller.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyFirebaseToken);

router.get("/summary", getEarningsSummary);
router.get("/active-investments", getActiveInvestments);
router.get("/history", getEarningsHistory);

export default router;
