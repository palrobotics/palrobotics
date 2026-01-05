import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { getReferralEarningsSummary } from "../controllers/referrals.controller.js";
import { getTeamCount } from "../controllers/referrals.controller.js";

const router = express.Router();

router.get("/summary", verifyFirebaseToken, getReferralEarningsSummary);
router.get("/team_count", verifyFirebaseToken, getTeamCount);

export default router;
