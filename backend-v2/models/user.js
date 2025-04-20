const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Reader", "Writer", "Admin"],
    default: "Reader",
  },
  isBanned: { type: Boolean, default: false },
  categories: [{ type: String }], // e.g., ['Literature', 'Politics']
  postCount: { type: Number, default: 0 }, // For tracking Writer activity
  trialPhase: { type: Boolean, default: false }, // For reactivated Writers
  trialStart: { type: Date }, // Trial period start
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
