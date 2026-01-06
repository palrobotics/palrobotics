import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import { handleFirstDepositReferral } from "../controllers/referrals.controller.js";

export async function processMobileMoneyWebhook(payload) {
  const { reference, status } = payload;
  if (!reference) return;

  // Get the transaction reference first
  const snap = await db
    .collection("transactions")
    .where("reference", "==", reference)
    .limit(1)
    .get();

  if (snap.empty) return;
  const txRef = snap.docs[0].ref;

  // First Referral Hook
  if (tx.type === "deposit" || tx.type === "investment") {
    await handleFirstDepositReferral(t, tx);
  }

  // 2. Run the logic inside a single transaction
  await db.runTransaction(async (t) => {
    const txSnap = await t.get(txRef);
    if (!txSnap.exists) return; // transaction removed concurrently

    const tx = txSnap.data();

    if (tx.status !== "pending") return;

    if (status !== "SUCCESS") {
      t.update(txRef, {
        status: "failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    const walletRef = db.collection("wallets").doc(tx.uid);
    const walletSnap = await t.get(walletRef);
    if (!walletSnap.exists) throw new Error("Wallet not found");

    let balanceChange = tx.amount;

    if (tx.type === "investment") {
      const planRef = db.collection("plans").doc(tx.planId);
      const planSnap = await t.get(planRef);
      if (!planSnap.exists) throw new Error("Investment plan no longer exists");

      const plan = planSnap.data();

      // Calculate dates
      const startDate = admin.firestore.Timestamp.now();
      const endDate = admin.firestore.Timestamp.fromMillis(
        startDate.toMillis() + plan.durationDays * 24 * 60 * 60 * 1000
      );

      // Create investment record
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

      // Net change is 0 (Money in -> Money out for plan)
      // Or tx.amount - plan.price if they deposited extra
      balanceChange = tx.amount - plan.price;
    }

    // Single Wallet Update
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
