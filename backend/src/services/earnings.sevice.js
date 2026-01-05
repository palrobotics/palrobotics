import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";
import { handleEarningsReferrals } from "../controllers/referrals.controller.js";

const DAY_MS = 1000 * 60 * 60 * 24;

export async function processDailyEarnings() {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  const snap = await db
    .collection("investments")
    .where("status", "==", "active")
    .get();

  for (const doc of snap.docs) {
    try {
      await db.runTransaction(async (tx) => {
        const inv = doc.data();
        const start = inv.startDate.toDate();
        const end = inv.endDate.toDate();

        const lastPayout = inv.lastPayoutAt ? inv.lastPayoutAt.toDate() : start;

        const d1 = new Date(lastPayout).setHours(0, 0, 0, 0);
        const d2 = new Date(todayStart).setHours(0, 0, 0, 0);
        const daysToPay = Math.floor((d2 - d1) / DAY_MS);

        if (daysToPay <= 0) return;

        const earnings = daysToPay * inv.dailyIncome;
        const walletRef = db.collection("wallets").doc(inv.uid);

        const walletSnap = await tx.get(walletRef);
        if (!walletSnap.exists) throw new Error("Wallet not found");

        // User earnings
        tx.update(walletRef, {
          balance: admin.firestore.FieldValue.increment(earnings),
          totalEarned: admin.firestore.FieldValue.increment(earnings),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Investment update
        const isFinished = todayStart >= end;
        tx.update(doc.ref, {
          lastPayoutAt: admin.firestore.Timestamp.fromDate(todayStart),
          status: isFinished ? "completed" : "active",
        });

        // Earnings ledger
        tx.set(db.collection("earnings").doc(), {
          uid: inv.uid,
          investmentId: doc.id,
          amount: earnings,
          daysPaid: daysToPay,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Referral earnings (Level 2 & 3)
        await handleEarningsReferrals(
          tx,
          inv.uid,
          earnings,
          "daily_income",
          doc.id
        );
      });
    } catch (err) {
      console.error(`Failed to process investment ${doc.id}:`, err.message);
    }
  }
}
