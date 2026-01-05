import admin from "../config/firebase.js";
import { db } from "../config/firebase.js";

export async function getEarningsSummary(req, res, next) {
  try {
    const uid = req.user.uid;

    // Fetch active investments to count active plans
    const investmentsSnap = await db
      .collection("investments")
      .where("uid", "==", uid)
      .where("status", "==", "active")
      .get();

    // Fetch all earnings from the 'earnings' collection
    const earningsSnap = await db
      .collection("earnings")
      .where("uid", "==", uid)
      .get();

    const activePlans = investmentsSnap.size;
    let totalEarned = 0;
    let todayEarned = 0;

    // Get timestamp for the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    earningsSnap.forEach((doc) => {
      const data = doc.data();
      const amount = parseFloat(data.amount) || 0;

      // Accumulate Total
      totalEarned += amount;

      // Check if this earning record was generated today
      if (data.createdAt && data.createdAt.toDate() >= today) {
        todayEarned += amount;
      }
    });

    // Calculate Projected Monthly Income
    let dailyProjection = 0;
    investmentsSnap.forEach((doc) => {
      dailyProjection += Number(doc.data().dailyIncome) || 0;
    });

    res.json({
      activePlans,
      totalEarned,
      todayEarned,
      dailyProjection,
      monthlyProjection: dailyProjection * 30,
    });
  } catch (err) {
    console.error("Error fetching earnings summary:", err);
    next(err);
  }
}

export async function getActiveInvestments(req, res, next) {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("investments")
      .where("uid", "==", uid)
      .where("status", "==", "active")
      .get();

    const investments = snap.docs.map((doc) => {
      const data = doc.data();

      const now = new Date();
      const start = data.startDate.toDate();
      const end = data.endDate.toDate();

      const progress = ((now - start) / (end - start)) * 100;

      return {
        id: doc.id,
        ...data,
        progress: Math.min(Math.max(progress, 0), 100),
        daysLeft: Math.ceil((end - now) / (1000 * 60 * 60 * 24)),
      };
    });

    res.json({ investments });
  } catch (err) {
    next(err);
  }
}

export async function getEarningsHistory(req, res, next) {
  try {
    const uid = req.user.uid;

    const snap = await db
      .collection("earnings")
      .where("uid", "==", uid)
      .orderBy("createdAt", "asc")
      .get();

    const dailyMap = {};

    snap.forEach((doc) => {
      const data = doc.data();
      const amount = Number(data.amount) || 0;

      if (data.createdAt) {
        // Convert timestamp to YYYY-MM-DD string for grouping
        const date = data.createdAt.toDate().toISOString().split("T")[0];
        dailyMap[date] = (dailyMap[date] || 0) + amount;
      }
    });

    // Convert map to sorted array of objects
    const chartData = Object.entries(dailyMap).map(([date, total]) => ({
      date,
      total,
    }));

    res.json({ chartData });
  } catch (err) {
    next(err);
  }
}
