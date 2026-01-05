import { db } from "../config/firebase.js";

export async function getPlans(req, res, next) {
  try {
    const snap = await db.collection("plans").where("active", "==", true).get();

    const plans = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(plans);
  } catch (err) {
    next(err);
  }
}
