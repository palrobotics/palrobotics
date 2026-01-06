import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";
import { handleEarningsReferrals } from "../controllers/referrals.controller.js";

const DAY_MS = 1000 * 60 * 60 * 24;
const BATCH_SIZE = 50; // Process 50 investments in parallel

export async function processDailyEarnings() {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  console.log("Starting daily earnings processing...");

  // Paginate through active investments to avoid fetching the entire collection at once
  // Processed in pages of BATCH_SIZE
  let lastDoc = null;

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

  // 3. Page through active investments using a cursor
  let page = 0;
  while (true) {
    let q = db
      .collection("investments")
      .where("status", "==", "active")
      .orderBy(admin.firestore.FieldPath.documentId())
      .limit(BATCH_SIZE);

    if (lastDoc) q = q.startAfter(lastDoc);

    const snap = await q.get();
    if (snap.empty) break;

    page++;
    console.log(`Processing page ${page} (${snap.docs.length} items)...`);

    // Execute the current page in parallel
    await Promise.all(snap.docs.map((doc) => processInvestment(doc)));

    lastDoc = snap.docs[snap.docs.length - 1];
  }

  console.log("Daily earnings processing completed.");
}
