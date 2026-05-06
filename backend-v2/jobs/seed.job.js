import cron from "node-cron";
import mongoose from "mongoose";
import { runDailySeed } from "../services/seed.service.js";

const MONGO_URI = process.env.MONGO_URI;

export const startSeeder = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("🟢 DB connected for seeding");

  // Run once daily at 2 AM
  cron.schedule("0 2 * * *", async () => {
    console.log("📚 Daily seeding started...");

    try {
      await runDailySeed();
      console.log("✅ Seeding completed");
    } catch (err) {
      console.error("❌ Seeding failed:", err.message);
    }
  });
};
