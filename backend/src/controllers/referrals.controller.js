import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";
import { getReferralChain } from "../helpers/referrals.helper.js";

export async function handleFirstDepositReferral(t, tx) {
  const userRef = db.collection("users").doc(tx.uid);
  const userSnap = await t.get(userRef);

  if (!userSnap.exists) return;

  const user = userSnap.data();

  // Guard 1: Already rewarded
  if (user.firstDepositRewarded) return;

  // Guard 2: No referrer
  if (!user.referredBy) return;

  // Find referrer by referralCode
  const refSnap = await db
    .collection("users")
    .where("referralCode", "==", user.referredBy)
    .limit(1)
    .get();

  if (refSnap.empty) return;

  const referrerDoc = refSnap.docs[0];
  const referrerUid = referrerDoc.id;

  const reward = Math.floor(tx.amount * 0.3); // 30%

  const refWalletRef = db.collection("wallets").doc(referrerUid);

  // Credit referrer
  t.update(refWalletRef, {
    balance: admin.firestore.FieldValue.increment(reward),
    totalEarned: admin.firestore.FieldValue.increment(reward),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Record referral transaction
  t.set(db.collection("transactions").doc(), {
    uid: referrerUid,
    type: "referral_bonus",
    level: 1,
    amount: reward,
    sourceUid: tx.uid,
    status: "completed",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Lock reward so it never happens again
  t.update(userRef, {
    firstDepositRewarded: true,
  });
}

export async function handleEarningsReferrals(
  tx,
  uid,
  earningAmount,
  source = "daily_income",
  investmentId = null
) {
  const chain = await getReferralChain(uid);

  for (const ref of chain) {
    let rate = 0;

    if (ref.level === 2) rate = 0.03;
    if (ref.level === 3) rate = 0.02;

    if (!rate) continue;

    const reward = earningAmount * rate;
    const walletRef = db.collection("wallets").doc(ref.uid);

    // Update wallet
    tx.update(walletRef, {
      balance: admin.firestore.FieldValue.increment(reward),
      totalEarned: admin.firestore.FieldValue.increment(reward),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Store referral breakdown
    tx.set(db.collection("referral_earnings").doc(), {
      uid: ref.uid,
      fromUid: uid,
      level: ref.level,
      amount: reward,
      source,
      investmentId,
      status: "credited",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    //transaction log
    tx.set(db.collection("transactions").doc(), {
      uid: ref.uid,
      amount: reward,
      type: "referral_bonus",
      level: ref.level,
      sourceUid: uid,
      status: "completed",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

export async function getReferralEarningsSummary(req, res) {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("referral_earnings")
      .where("uid", "==", uid)
      .get();

    let summary = {
      level1: 0,
      level2: 0,
      level3: 0,
      total: 0,
    };

    snap.forEach((doc) => {
      const { level, amount } = doc.data();

      if (level === 1) summary.level1 += amount;
      if (level === 2) summary.level2 += amount;
      if (level === 3) summary.level3 += amount;

      summary.total += amount;
    });

    return res.json(summary);
  } catch (err) {
    console.error("Referral summary error:", err);
    return res
      .status(500)
      .json({ message: "Failed to load referral earnings" });
  }
}

export async function getTeamCount(req, res) {
  try {
    const uid = req.user.uid;

    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) {
      return res.json({ count: 0 });
    }

    const myReferralCode = userSnap.data().referralCode;
    if (!myReferralCode) {
      return res.json({ count: 0 });
    }

    let total = 0;

    // LEVEL 1
    const level1Snap = await db
      .collection("users")
      .where("referredBy", "==", myReferralCode)
      .get();

    total += level1Snap.size;

    if (level1Snap.empty) {
      return res.json({ count: total });
    }

    // LEVEL 2
    const level1Codes = level1Snap.docs
      .map((d) => d.data().referralCode)
      .filter(Boolean);

    let level2Codes = [];

    for (const code of level1Codes) {
      const snap = await db
        .collection("users")
        .where("referredBy", "==", code)
        .get();

      total += snap.size;

      snap.docs.forEach((d) => {
        if (d.data().referralCode) {
          level2Codes.push(d.data().referralCode);
        }
      });
    }

    // LEVEL 3
    for (const code of level2Codes) {
      const snap = await db
        .collection("users")
        .where("referredBy", "==", code)
        .get();

      total += snap.size;
    }

    return res.json({ count: total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to fetch team count",
    });
  }
}
