import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import crypto from "crypto";
import { initiateMTNPayment } from "./providers/mtn.provider.js";
import { initiateAirtelPayment } from "./providers/airtel.provider.js";

export async function initiateMobileInvestment({ uid, planId, method, phone }) {
  const planSnap = await db.collection("plans").doc(planId).get();
  if (!planSnap.exists) throw new Error("Plan not found");

  const plan = planSnap.data();
  const reference = crypto.randomUUID();

  await db.collection("transactions").add({
    uid,
    reference,
    type: "investment",
    source: "mobile_money",
    method,
    amount: plan.price,
    planId,
    status: "pending",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (method === "MTN") {
    await initiateMTNPayment({
      amount: plan.price,
      phone,
      reference,
    });
  } else {
    await initiateAirtelPayment({
      amount: plan.price,
      phone,
      reference,
    });
  }

  return { reference };
}
