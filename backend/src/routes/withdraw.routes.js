import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { requestWithdrawal } from "../controllers/withdraw.controller.js";

const router = express.Router();

router.post("/request", verifyFirebaseToken, requestWithdrawal);

export default router;
