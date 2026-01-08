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
    // Reads
    const txSnap = await t.get(txRef);
    if (!txSnap.exists) return;
    const tx = txSnap.data();
    if (tx.status !== "pending") return;

    const userRef = db.collection("users").doc(tx.uid);
    const userSnap = await t.get(userRef);
    const user = userSnap.data();

    // Find referrer ID (Read)
    let referrerUid = null;
    if (!user.firstDepositRewarded && user.referredBy) {
      const refSnap = await db
        .collection("users")
        .where("referralCode", "==", user.referredBy)
        .limit(1)
        .get();

      if (!refSnap.empty) {
        referrerUid = refSnap.docs[0].id;
      }
    }

    const walletRef = db.collection("wallets").doc(tx.uid);
    const walletSnap = await t.get(walletRef);
    if (!walletSnap.exists) throw new Error("Wallet not found");

    let planData = null;
    if (tx.type === "investment") {
      const planRef = db.collection("plans").doc(tx.planId);
      const planSnap = await t.get(planRef);
      if (!planSnap.exists) throw new Error("Investment plan no longer exists");
      planData = planSnap.data();
    }

    // Writes
    if (status !== "SUCCESS") {
      t.update(txRef, {
        status: "failed",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    if (tx.type === "investment") {
      const startDate = admin.firestore.Timestamp.now();
      const endDate = admin.firestore.Timestamp.fromMillis(
        startDate.toMillis() + planData.durationDays * 24 * 60 * 60 * 1000
      );

      // Create investment
      t.set(db.collection("investments").doc(), {
        uid: tx.uid,
        planId: tx.planId,
        planName: planData.name,
        amount: planData.price,
        dailyIncome: planData.dailyIncome,
        durationDays: planData.durationDays,
        status: "active",
        startDate,
        endDate,
        lastPayoutAt: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update Wallet (Locked Balance for the plan price)
      t.update(walletRef, {
        lockedBalance: admin.firestore.FieldValue.increment(planData.price),
        // If the user paid more than the plan price, add the 'change' to balance
        balance: admin.firestore.FieldValue.increment(
          tx.amount - planData.price
        ),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    if (tx.type === "deposit" && referrerUid) {
      await handleFirstDepositReferral(t, tx, referrerUid, userRef);

      t.update(walletRef, {
        balance: admin.firestore.FieldValue.increment(tx.amount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    t.update(txRef, {
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
}
