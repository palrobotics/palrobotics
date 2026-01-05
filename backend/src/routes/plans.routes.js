import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { getPlans } from "../controllers/plans.controller.js";

const router = express.Router();

router.get("/plans", verifyFirebaseToken, getPlans);

export default router;
