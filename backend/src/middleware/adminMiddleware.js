import { db } from "../config/firebase.js";

// Caching layer for frequent admin checks
const adminCache = new Map(); // In-memory cache

export async function requireAdmin(req, res, next) {
  try {
    const uid = req.user.uid;

    // Check cache first
    if (adminCache.has(uid) && adminCache.get(uid).expiry > Date.now()) {
      if (!adminCache.get(uid).isAdmin) {
        return res.status(403).json({ message: "Admin access only" });
      }
      return next();
    }

    // Database lookup
    const snap = await db.collection("users").doc(uid).get();
    const isAdmin = snap.exists && snap.data().role === "admin";

    // Cache for 5 minutes
    adminCache.set(uid, {
      isAdmin,
      expiry: Date.now() + 300000,
    });

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    next(err);
  }
}
