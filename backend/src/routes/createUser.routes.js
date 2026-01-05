import express from "express";
import { createUserAndWallet } from "../controllers/createUsers.controller.js";

import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyFirebaseToken, createUserAndWallet);

export default router;
