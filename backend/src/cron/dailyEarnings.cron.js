import cron from "node-cron";
import { processDailyEarnings } from "../services/earnings.sevice.js";

export function startEarningsCron() {
  // Runs every day at 00:00 AM
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily earnings cron...");
    try {
      await processDailyEarnings();
    } catch (err) {
      console.error("Earnings cron failed:", err);
    }
    console.log("Completed daily Earnings");
  });
}
