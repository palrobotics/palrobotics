import express from "express";
import { initiateDeposit } from "../services/mobileMoney.deposit.js";
import { initiateMobileInvestment } from "../services/mobileMoney.invest.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/deposit", verifyFirebaseToken, async (req, res) => {
  const { amount, method, phone } = req.body;
  const result = await initiateDeposit({
    uid: req.user.uid,
    amount,
    method,
    phone,
  });
  res.json(result);
});

router.post("/invest", verifyFirebaseToken, async (req, res) => {
  const { planId, method, phone } = req.body;
  const result = await initiateMobileInvestment({
    uid: req.user.uid,
    planId,
    method,
    phone,
  });
  res.json(result);
});

export default router;
