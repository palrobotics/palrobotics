import express from "express";
import {
  getUsers,
  getUser,
  blockUser,
  unblockUser,
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyFirebaseToken, requireAdmin);

router.get("/", getUsers);
router.get("/:uid", getUser);
router.patch("/:uid/block", blockUser);
router.patch("/:uid/unblock", unblockUser);

export default router;
