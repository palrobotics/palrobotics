import { db } from "../config/firebase.js";

export async function getReferralChain(uid) {
  const chain = [];

  let currentUid = uid;
  let level = 1;

  while (level <= 3) {
    const userSnap = await db.collection("users").doc(currentUid).get();
    if (!userSnap.exists) break;

    const referredByCode = userSnap.data().referredBy;
    if (!referredByCode) break;

    const referrerSnap = await db
      .collection("users")
      .where("referralCode", "==", referredByCode)
      .limit(1)
      .get();

    if (referrerSnap.empty) break;

    const referrerDoc = referrerSnap.docs[0];

    chain.push({
      level,
      uid: referrerDoc.id,
    });

    currentUid = referrerDoc.id;
    level++;
  }

  return chain;
}
