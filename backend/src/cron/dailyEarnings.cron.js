import cron from "node-cron";
import { processDailyEarnings } from "../services/earnings.sevice.js";

export function startEarningsCron() {
  cron.schedule("0 0 * * *", async () => {
    const lockRef = db.collection("system_locks").doc("daily_earnings");

    try {
      await db.runTransaction(async (tx) => {
        const doc = await tx.get(lockRef);
        const now = new Date().toDateString();

        // If we already ran today, throw error to exit transaction
        if (doc.exists && doc.data().lastRun === now) {
          throw new Error("ALREADY_RAN_TODAY");
        }

        // Claim the lock
        tx.set(lockRef, { lastRun: now });
      });

      // If transaction succeeded, we process
      console.log("Running daily earnings cron...");
      await processDailyEarnings();
      console.log("Completed daily Earnings");
    } catch (err) {
      if (err.message === "ALREADY_RAN_TODAY") {
        console.log("Skipping earnings job (already ran today).");
      } else {
        console.error("Earnings cron failed:", err);
      }
    }
  });
}
