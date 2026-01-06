import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import { handleFirstDepositReferral } from "../controllers/referrals.controller.js";

export async function processMobileMoneyWebhook(payload) {
  const { reference, status } = payload;
  if (!reference) return;

  // 1. Get the transaction reference outside the transaction to find the doc path
  const snap = await db
    .collection("transactions")
    .where("reference", "==", reference)
    .limit(1)
    .get();

  if (snap.empty) return;
  const txRef = snap.docs[0].ref;

  await db.runTransaction(async (t) => {
    // --- READ SECTION ---
    const txSnap = await t.get(txRef);
    if (!txSnap.exists) return;

    const tx = txSnap.data();
    if (tx.status !== "pending") return;

    // Fetch wallet (needed for both deposit and investment)
    const walletRef = db.collection("wallets").doc(tx.uid);
    const walletSnap = await t.get(walletRef);
    if (!walletSnap.exists) throw new Error("Wallet not found");

    // --- WRITE SECTION ---
    if (status !== "SUCCESS") {
      t.update(txRef, {
        status: "failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    let balanceChange = tx.amount;

    // Case A: Transaction is an Investment Plan Purchase
    if (tx.type === "investment") {
      const planRef = db.collection("plans").doc(tx.planId);
      const planSnap = await t.get(planRef);

      if (!planSnap.exists) throw new Error("Investment plan no longer exists");

      const plan = planSnap.data();
      const startDate = admin.firestore.Timestamp.now();
      const endDate = admin.firestore.Timestamp.fromMillis(
        startDate.toMillis() + plan.durationDays * 24 * 60 * 60 * 1000
      );

      t.set(db.collection("investments").doc(), {
        uid: tx.uid,
        planId: tx.planId,
        planName: plan.name,
        amount: plan.price,
        dailyIncome: plan.dailyIncome,
        status: "active",
        startDate,
        endDate,
      });

      balanceChange = tx.amount - plan.price;
    }

    // Case B: Transaction is a standard Deposit (Trigger Referral)
    if (tx.type === "deposit") {
      await handleFirstDepositReferral(t, tx);
    }

    // Final Updates
    t.update(walletRef, {
      balance: admin.firestore.FieldValue.increment(balanceChange),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    t.update(txRef, {
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
}
