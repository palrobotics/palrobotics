import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { investFromWallet } from "../services/wallet.service.js";

const router = express.Router();

router.post("/invest", verifyFirebaseToken, investFromWallet);

export default router;
