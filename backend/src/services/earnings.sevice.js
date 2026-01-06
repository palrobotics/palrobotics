import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";
import { handleEarningsReferrals } from "../controllers/referrals.controller.js";

const DAY_MS = 1000 * 60 * 60 * 24;

export async function processDailyEarnings() {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  // Get the list of IDs only (or refs) to iterate over
  const snap = await db
    .collection("investments")
    .where("status", "==", "active")
    .get();

  console.log(`Processing ${snap.docs.length} active investments...`);

  for (const docSnapshot of snap.docs) {
    const invRef = db.collection("investments").doc(docSnapshot.id);

    try {
      await db.runTransaction(async (tx) => {
        // This ensures if another process just updated it, we see the new data.
        const freshInvSnap = await tx.get(invRef);

        if (!freshInvSnap.exists) return; // Document might have been deleted
        const inv = freshInvSnap.data();

        // Double check status inside transaction
        if (inv.status !== "active") return;

        const start = inv.startDate.toDate();
        const end = inv.endDate.toDate();

        // Use the fresh lastPayoutAt
        const lastPayout = inv.lastPayoutAt ? inv.lastPayoutAt.toDate() : start;

        const d1 = new Date(lastPayout).setHours(0, 0, 0, 0);
        const d2 = new Date(todayStart).setHours(0, 0, 0, 0);
        const daysToPay = Math.floor((d2 - d1) / DAY_MS);

        // 3. Idempotency Check: If daysToPay is 0 or negative, STOP.
        // This prevents double payment if the script runs twice.
        if (daysToPay <= 0) {
          return;
        }

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
        tx.update(invRef, {
          lastPayoutAt: admin.firestore.Timestamp.fromDate(todayStart),
          status: isFinished ? "completed" : "active",
        });

        // Earnings ledger
        tx.set(db.collection("earnings").doc(), {
          uid: inv.uid,
          investmentId: freshInvSnap.id,
          amount: earnings,
          daysPaid: daysToPay,
          paidAt: admin.firestore.Timestamp.fromDate(todayStart),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Referral earnings
        await handleEarningsReferrals(
          tx,
          inv.uid,
          earnings,
          "daily_income",
          freshInvSnap.id
        );
      });
    } catch (err) {
      console.error(
        `Failed to process investment ${docSnapshot.id}:`,
        err.message
      );
    }
  }
}
