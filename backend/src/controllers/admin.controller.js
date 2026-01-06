import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  setUserBlocked,
} from "../services/user.service.js";

/* ================= Withdrawals ================= */

export async function getPendingWithdrawals(req, res, next) {
  try {
    const snap = await db
      .collection("transactions")
      .where("type", "==", "withdraw")
      .where("status", "==", "pending")
      .orderBy("createdAt", "desc")
      .get();

    const withdrawals = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, withdrawals });
  } catch (err) {
    next(err);
  }
}

export async function getPendingManualTransactions(req, res, next) {
  try {
    const snap = await db
      .collection("transactions")
      .where("status", "==", "pending_admin_approval")
      .orderBy("createdAt", "desc")
      .get();

    const transactions = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
}

export async function approveWithdrawal(req, res, next) {
  try {
    const { transactionId } = req.body;

    if (!transactionId || typeof transactionId !== "string") {
      return res
        .status(400)
        .json({ message: "Valid Transaction ID is required" });
    }

    await db.runTransaction(async (fireTx) => {
      const txRef = db.collection("transactions").doc(transactionId);
      const txSnap = await fireTx.get(txRef);

      if (!txSnap.exists) {
        throw new Error("Transaction does not exist");
      }

      const txData = txSnap.data();

      //Only allow approval if status is 'pending'
      if (txData.status !== "pending") {
        throw new Error(
          `Cannot approve: Transaction is already ${txData.status}`
        );
      }

      const userId = txData.uid;
      const amount = Number(txData.amount);

      const walletRef = db.collection("wallets").doc(userId);
      const walletSnap = await fireTx.get(walletRef);

      if (!walletSnap.exists) {
        throw new Error("User wallet record not found");
      }

      const wallet = walletSnap.data();
      const lockedBalance = wallet.lockedBalance || 0;

      if (lockedBalance < amount) {
        throw new Error(
          "Locked balance insufficient — possible data inconsistency"
        );
      }

      // CONSUME LOCKED FUNDS
      fireTx.update(walletRef, {
        lockedBalance: admin.firestore.FieldValue.increment(-amount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update Transaction Status
      fireTx.update(txRef, {
        status: "approved",
        approvedBy: req.user?.uid || "system",
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return res.json({
      success: true,
      message: "Withdrawal approved and balance updated",
    });
  } catch (err) {
    console.error("Transaction Error:", err.message);
    res.status(400).json({ message: err.message });
  }
}

export async function rejectWithdrawal(req, res, next) {
  try {
    const { transactionId, reason } = req.body;

    //Input Validation
    if (!transactionId || typeof transactionId !== "string") {
      return res
        .status(400)
        .json({ message: "Valid Transaction ID is required" });
    }

    if (!reason || typeof reason !== "string" || reason.trim().length < 3) {
      return res.status(400).json({
        message:
          "A valid reason (at least 3 characters) is required for rejection",
      });
    }

    await db.runTransaction(async (fireTx) => {
      const txRef = db.collection("transactions").doc(transactionId);
      const txSnap = await fireTx.get(txRef);

      //Existence Check
      if (!txSnap.exists) {
        throw new Error("Transaction not found");
      }

      const txData = txSnap.data();

      //State Guard
      // Prevents rejecting something that was already approved or rejected
      if (txData.status !== "pending") {
        throw new Error(
          `Transaction cannot be rejected because it is already ${txData.status}`
        );
      }

      const walletRef = db.collection("wallets").doc(txData.uid);
      const walletSnap = await fireTx.get(walletRef);

      if (!walletSnap.exists) {
        throw new Error("Wallet not found");
      }

      const amount = Number(txData.amount);

      // UNLOCK FUNDS
      fireTx.update(walletRef, {
        balance: admin.firestore.FieldValue.increment(amount),
        lockedBalance: admin.firestore.FieldValue.increment(-amount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      //Atomic Update
      fireTx.update(txRef, {
        status: "rejected",
        rejectionReason: reason.trim(),
        rejectedBy: req.user?.uid || "system",
        rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    //Success Response
    return res.json({
      success: true,
      message: "Withdrawal request has been rejected.",
    });
  } catch (err) {
    console.error(`Reject Error [ID: ${req.body.transactionId}]:`, err.message);
    const statusCode =
      err.message.includes("not found") || err.message.includes("already")
        ? 400
        : 500;

    res.status(statusCode).json({ message: err.message });
  }
}

export async function approveDeposit(req, res) {
  const { transactionId } = req.body;

  try {
    await db.runTransaction(async (fireTx) => {
      // Read 1: The Transaction
      const txRef = db.collection("transactions").doc(transactionId);
      const txSnap = await fireTx.get(txRef);
      if (!txSnap.exists) throw new Error("Transaction not found");
      const tx = txSnap.data();

      if (tx.status !== "pending_admin_approval") {
        throw new Error("Transaction not pending admin approval");
      }

      // Read 2: The User (to check if they've been rewarded before)
      const userRef = db.collection("users").doc(tx.uid);
      const userSnap = await fireTx.get(userRef);
      if (!userSnap.exists) throw new Error("User not found");
      const userData = userSnap.data();

      // Read 3: The Referrer (Conditional Read)
      let referrerDoc = null;
      if (!userData.firstDepositRewarded && userData.referredBy) {
        const referrerQuery = await db
          .collection("users")
          .where("referralCode", "==", userData.referredBy)
          .limit(1)
          .get();

        if (!referrerQuery.empty) {
          referrerDoc = referrerQuery.docs[0];
        }
      }

      // Write 1: Update User Wallet
      const userWalletRef = db.collection("wallets").doc(tx.uid);
      fireTx.update(userWalletRef, {
        balance: admin.firestore.FieldValue.increment(tx.amount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Write 2: Update Deposit Transaction Status
      fireTx.update(txRef, {
        status: "approved",
        approvedBy: req.user.uid,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Write 3: Handle Referral Bonus if applicable
      if (referrerDoc) {
        const referrerUid = referrerDoc.id;
        const rewardAmount = Math.floor(tx.amount * 0.3);
        const referrerWalletRef = db.collection("wallets").doc(referrerUid);

        // Credit Referrer
        fireTx.update(referrerWalletRef, {
          balance: admin.firestore.FieldValue.increment(rewardAmount),
          totalEarned: admin.firestore.FieldValue.increment(rewardAmount),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Record Bonus Transaction
        const bonusTxRef = db.collection("transactions").doc();
        fireTx.set(bonusTxRef, {
          uid: referrerUid,
          amount: rewardAmount,
          type: "referral_bonus",
          sourceUid: tx.uid,
          level: 1,
          status: "completed",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Lock the reward on the User doc
        fireTx.update(userRef, {
          firstDepositRewarded: true,
        });
      }
    });

    res.json({
      success: true,
      message: "Approved and referral bonus processed",
    });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function approveInvestment(req, res) {
  const { transactionId } = req.body;

  await db.runTransaction(async (fireTx) => {
    const txRef = db.collection("transactions").doc(transactionId);
    const txSnap = await fireTx.get(txRef);

    if (!txSnap.exists) throw new Error("Transaction not found");

    const tx = txSnap.data();
    if (tx.status !== "pending_admin_approval") {
      throw new Error("Transaction not pending admin approval");
    }

    fireTx.update(txRef, {
      status: "approved",
      approvedBy: req.user.uid,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    fireTx.set(db.collection("investments").doc(), {
      uid: tx.uid,
      planId: tx.planId,
      amount: tx.amount,
      status: "active",
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  res.json({ success: true });
}

export async function rejectManualTransaction(req, res) {
  const { transactionId, reason } = req.body;

  await db.collection("transactions").doc(transactionId).update({
    status: "rejected",
    rejectionReason: reason,
    rejectedBy: req.user.uid,
    rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({ success: true });
}

//GET /admin/users
export async function getUsers(req, res, next) {
  try {
    const users = await getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

// GET /admin/users/:uid
export async function getUser(req, res, next) {
  try {
    const user = await getUserById(req.params.uid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

// PATCH /admin/users/:uid/block
export async function blockUser(req, res, next) {
  try {
    await setUserBlocked(req.params.uid, true);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// PATCH /admin/users/:uid/unblock
export async function unblockUser(req, res, next) {
  try {
    await setUserBlocked(req.params.uid, false);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
