import { db } from "../config/firebase.js";
import admin from "../config/firebase.js";

export async function investFromWallet(req, res) {
  try {
    const { planId } = req.body;
    const uid = req.user.uid;

    if (!planId) {
      return res.status(400).json({ message: "Plan ID is required" });
    }

    await db.runTransaction(async (tx) => {
      // Fetch plan
      const planRef = db.collection("plans").doc(planId);
      const planSnap = await tx.get(planRef);

      if (!planSnap.exists) {
        throw new Error("Plan not found");
      }

      const plan = planSnap.data();

      // Fetch wallet
      const walletRef = db.collection("wallets").doc(uid);
      const walletSnap = await tx.get(walletRef);

      if (!walletSnap.exists) {
        throw new Error("Wallet not found");
      }

      const wallet = walletSnap.data();
      const balance = wallet.balance || 0;
      const lockedBalance = wallet.lockedBalance || 0;

      // Validate spendable balance
      if (balance < plan.price) {
        throw new Error("Insufficient wallet balance");
      }

      // LOCK FUNDS
      tx.update(walletRef, {
        balance: admin.firestore.FieldValue.increment(-plan.price),
        lockedBalance: admin.firestore.FieldValue.increment(plan.price),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create investment
      const startDate = admin.firestore.Timestamp.now();
      const endDate = admin.firestore.Timestamp.fromMillis(
        startDate.toMillis() + plan.durationDays * 24 * 60 * 60 * 1000
      );

      tx.set(db.collection("investments").doc(), {
        uid,
        planId,
        planName: plan.name,
        amount: plan.price,
        dailyIncome: plan.dailyIncome,
        durationDays: plan.durationDays,
        startDate,
        endDate,
        lastPayoutAt: null,
        status: "active",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Record transaction
      tx.set(db.collection("transactions").doc(), {
        uid,
        amount: plan.price,
        method: "WALLET",
        type: "investment",
        planId,
        status: "completed",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return res.json({
      success: true,
      message: "Investment successful",
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      message: err.message || "Failed to invest from wallet",
    });
  }
}
