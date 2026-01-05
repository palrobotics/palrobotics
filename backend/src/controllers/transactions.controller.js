import { db } from "../config/firebase.js";
import { z } from "zod";

export async function getUserTransactions(req, res, next) {
  try {
    const uid = req.user.uid;
    const querySchema = z.object({
      type: z.string().optional(),
      limit: z.preprocess((v) => {
        // Accept undefined/null/empty string as not provided
        if (v === undefined || v === null || v === "") return undefined;

        // If query param comes as array (e.g., ?limit=10&limit=20), take first
        if (Array.isArray(v)) v = v[0];

        // Coerce numeric strings to Number; invalid values will become NaN and be rejected
        return Number(v);
      }, z.number().int().positive().max(500).optional()),
    });

    const parsed = querySchema.parse(req.query || {});
    const { type, limit = 50 } = parsed;

    let queryRef = db
      .collection("transactions")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(Number(limit));

    if (type) {
      queryRef = queryRef.where("type", "==", type);
    }

    const snap = await queryRef.get();

    const transactions = snap.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,

        //Normalize Firestore Timestamp → ISO string
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : null,

        updatedAt: data.updatedAt
          ? data.updatedAt.toDate().toISOString()
          : null,

        completedAt: data.completedAt
          ? data.completedAt.toDate().toISOString()
          : null,
      };
    });

    res.json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
}

export async function getTransactionByReference(req, res, next) {
  try {
    const { reference } = req.params;
    const uid = req.user.uid;

    const snap = await db
      .collection("transactions")
      .where("reference", "==", reference)
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const doc = snap.docs[0];

    res.json({
      success: true,
      transaction: { id: doc.id, ...doc.data() },
    });
  } catch (err) {
    next(err);
  }
}
