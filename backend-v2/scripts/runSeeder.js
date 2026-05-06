import "dotenv/config";
import mongoose from "mongoose";
import { runDailySeed } from "../services/seed.service.js";

const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🟢 DB connected");

    await runDailySeed();

    console.log("✅ Seeding done");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

start();
