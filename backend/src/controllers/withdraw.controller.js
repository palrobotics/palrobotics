import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";
import AppError from "../utils/AppError.js";
import { z } from "zod";

export async function requestWithdrawal(req, res, next) {
  try {
    const bodySchema = z.object({
      amount: z.number().min(7000),
      method: z.enum(["MTN", "Airtel"]),
      phoneNumber: z.string().min(4),
      accountName: z.string().min(2),
    });

    // parse and validate body
    const { amount, method, phoneNumber, accountName } = bodySchema.parse(
      req.body
    );
    const uid = req.user.uid;

    // validated by Zod above

    const fee = Math.floor(amount * 0.1);
    const netAmount = amount - fee;

    //SERVER-SIDE "TODAY"
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    await db.runTransaction(async (tx) => {
      /** ================= WALLET CHECK ================= */
      const walletRef = db.collection("wallets").doc(uid);
      const walletSnap = await tx.get(walletRef);

      if (!walletSnap.exists) {
        throw new AppError("Wallet not found", 400);
      }

      const wallet = walletSnap.data();

      /** ================= DAILY WITHDRAW RULE ================= */
      const withdrawQuery = db
        .collection("transactions")
        .where("uid", "==", uid)
        .where("type", "==", "withdraw")
        .where(
          "createdAt",
          ">=",
          admin.firestore.Timestamp.fromDate(startOfDay)
        )
        .where("createdAt", "<", admin.firestore.Timestamp.fromDate(endOfDay))
        .orderBy("createdAt", "desc")
        .limit(1);

      const withdrawSnap = await tx.get(withdrawQuery);

      const availableBalance = wallet.balance || 0;

      if (availableBalance < amount) {
        throw new AppError("Insufficient balance", 400);
      }

      if (!withdrawSnap.empty) {
        const lastWithdraw = withdrawSnap.docs[0].data();

        if (lastWithdraw.status === "pending") {
          throw new AppError(
            "You already have a pending withdrawal request",
            400
          );
        }

        if (lastWithdraw.status === "approved") {
          throw new AppError("You can only withdraw once per day", 400);
        }

        // status === "rejected" → allowed to retry
      }

      // LOCK FUNDS
      tx.update(walletRef, {
        balance: admin.firestore.FieldValue.increment(-amount),
        lockedBalance: admin.firestore.FieldValue.increment(amount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      /** ================= CREATE WITHDRAW REQUEST ================= */
      const txRef = db.collection("transactions").doc();

      tx.set(txRef, {
        uid,
        type: "withdraw",
        source: "wallet",
        amount,
        fee,
        netAmount,
        phoneNumber,
        accountName,
        method,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
