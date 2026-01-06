import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";
import { handleEarningsReferrals } from "../controllers/referrals.controller.js";

const DAY_MS = 1000 * 60 * 60 * 24;
const BATCH_SIZE = 50; // Process 50 investments in parallel

export async function processDailyEarnings() {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  console.log("Starting daily earnings processing...");

  // Fetch all active investments
  const snap = await db
    .collection("investments")
    .where("status", "==", "active")
    .get();

  const totalDocs = snap.docs.length;
  console.log(`Found ${totalDocs} active investments.`);

  if (totalDocs === 0) return;

  // 2. Helper function to process a single investment
  const processInvestment = async (docSnapshot) => {
    const invRef = db.collection("investments").doc(docSnapshot.id);

    try {
      await db.runTransaction(async (tx) => {
        const freshInvSnap = await tx.get(invRef);
        if (!freshInvSnap.exists) return;

        const inv = freshInvSnap.data();
        if (inv.status !== "active") return;

        const start = inv.startDate.toDate();
        const end = inv.endDate.toDate();
        const lastPayout = inv.lastPayoutAt ? inv.lastPayoutAt.toDate() : start;

        const d1 = new Date(lastPayout).setHours(0, 0, 0, 0);
        const d2 = new Date(todayStart).setHours(0, 0, 0, 0);
        const daysToPay = Math.floor((d2 - d1) / DAY_MS);

        if (daysToPay <= 0) return; // Idempotency check

        const earnings = daysToPay * inv.dailyIncome;
        const walletRef = db.collection("wallets").doc(inv.uid);

        // Ensure wallet exists before update
        const walletSnap = await tx.get(walletRef);
        if (!walletSnap.exists) {
          throw new Error(`Wallet not found for user ${inv.uid}`);
        }

        // Credit User
        tx.update(walletRef, {
          balance: admin.firestore.FieldValue.increment(earnings),
          totalEarned: admin.firestore.FieldValue.increment(earnings),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Update Investment
        const isFinished = todayStart >= end;
        tx.update(invRef, {
          lastPayoutAt: admin.firestore.Timestamp.fromDate(todayStart),
          status: isFinished ? "completed" : "active",
        });

        // Ledger Entry
        tx.set(db.collection("earnings").doc(), {
          uid: inv.uid,
          investmentId: freshInvSnap.id,
          amount: earnings,
          daysPaid: daysToPay,
          paidAt: admin.firestore.Timestamp.fromDate(todayStart),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Referral Commission
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
        `Error processing investment ${docSnapshot.id}:`,
        err.message
      );
    }
  };

  // 3. Process in chunks to prevent timeouts and rate limits
  const docs = snap.docs;
  for (let i = 0; i < totalDocs; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);

    console.log(
      `Processing batch ${i / BATCH_SIZE + 1} (${chunk.length} items)...`
    );

    // Execute the current batch in parallel
    await Promise.all(chunk.map((doc) => processInvestment(doc)));
  }

  console.log("Daily earnings processing completed.");
}
