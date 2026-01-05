import express from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { getUserTransactions } from "../controllers/transactions.controller.js";
import { getTransactionByReference } from "../controllers/transactions.controller.js";

const router = express.Router();

router.use(verifyFirebaseToken);

router.get("/", getUserTransactions);
router.get(
  "/reference/:reference",
  verifyFirebaseToken,
  getTransactionByReference
);

export default router;
