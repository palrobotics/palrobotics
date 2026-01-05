import { db } from "../config/firebase.js";

export async function requireAdmin(req, res, next) {
  try {
    const uid = req.user.uid;
    const snap = await db.collection("users").doc(uid).get();

    if (!snap.exists || snap.data().role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    next(err);
  }
}
