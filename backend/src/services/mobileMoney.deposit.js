import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import crypto from "crypto";
import { initiateMTNPayment } from "./providers/mtn.provider.js";
import { initiateAirtelPayment } from "./providers/airtel.provider.js";

export async function initiateDeposit({
  uid,
  amount,
  method,
  phone,
  transactionId,
}) {
  if (!amount || amount <= 0) {
    throw new Error("Invalid deposit amount");
  }

  if (!["MTN", "Airtel"].includes(method)) {
    throw new Error("Invalid payment method");
  }

  const reference = crypto.randomUUID();

  //Manual Verification-Creating a pending transaction waiting for admin approval
  if (transactionId !== "") {
    await db.collection("transactions").add({
      uid,
      reference,
      type: "deposit",
      source: "mobile_money",
      method,
      amount,
      phone,
      transactionId,
      status: "pending_admin_approval",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      reference,
      manual: true,
      message: "Deposit pending admin approval",
    };
  }

  //Automatic verification-creating a transaction for MTN/Airtel
  await db.collection("transactions").add({
    uid,
    reference,
    type: "deposit",
    source: "mobile_money",
    method,
    amount,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (method === "MTN") {
    await initiateMTNPayment({ amount, phone, reference });
  } else {
    await initiateAirtelPayment({ amount, phone, reference });
  }

  return { reference };
}
