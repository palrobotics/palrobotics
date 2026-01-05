import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/me", verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
