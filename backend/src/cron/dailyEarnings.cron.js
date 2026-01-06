import cron from "node-cron";
import { db } from "../config/firebase.js"; // Ensure db is imported
import { processDailyEarnings } from "../services/earnings.sevice.js";

async function runEarningsWithLock() {
  const lockRef = db.collection("system_locks").doc("daily_earnings");

  try {
    await db.runTransaction(async (tx) => {
      const doc = await tx.get(lockRef);
      const now = new Date().toDateString();

      if (doc.exists && doc.data().lastRun === now) {
        throw new Error("ALREADY_RAN_TODAY");
      }

      tx.set(lockRef, { lastRun: now });
    });

    console.log("Processing earnings...");
    await processDailyEarnings();
    console.log("Completed earnings processing.");
  } catch (err) {
    if (err.message === "ALREADY_RAN_TODAY") {
      console.log("Earnings already processed for today. Skipping.");
    } else {
      console.error("Earnings process failed:", err);
    }
  }
}

export function startEarningsCron() {
  // CATCH-UP: Run immediately when the server boots
  console.log("Server boot: Checking for missed earnings...");
  runEarningsWithLock();

  //  SCHEDULE: Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Scheduled Cron Triggered...");
    await runEarningsWithLock();
  });
}
