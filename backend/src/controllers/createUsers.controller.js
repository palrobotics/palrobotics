import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";
import { z } from "zod";

export async function createUserAndWallet(req, res) {
  try {
    const uid = req.user.uid;
    const bodySchema = z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      countryCode: z.string().min(1),
      phone: z.string().min(4),
      referralCode: z.string().nullish().default(null),
      referredBy: z.string().nullish().default(null),
    });

    const { fullName, email, countryCode, phone, referralCode, referredBy } =
      bodySchema.parse(req.body);

    const userRef = db.collection("users").doc(uid);
    const walletRef = db.collection("wallets").doc(uid);

    await db.runTransaction(async (tx) => {
      const userSnap = await tx.get(userRef);

      // Idempotency: user already exists
      if (userSnap.exists) return;

      // Validate referral
      let referrerCode = null;
      if (referredBy) {
        const refSnap = await db
          .collection("users")
          .where("referralCode", "==", referredBy)
          .limit(1)
          .get();

        if (!refSnap.empty) {
          referrerCode = referredBy;
        }
      }

      // Create user
      tx.set(userRef, {
        uid,
        fullName,
        email,
        phoneNumber: `${countryCode} ${phone}`,
        referralCode,
        referredBy: referrerCode,
        role: "user",
        isBlocked: false,
        firstDepositRewarded: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create wallet
      tx.set(walletRef, {
        uid,
        balance: 2000,
        lockedBalance: 0,
        blockedBalance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        totalEarned: 0,
        currency: "UGX",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
}
