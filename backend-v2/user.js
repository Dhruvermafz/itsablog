// 📁 /models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["READER", "WRITER", "ADMIN"],
    default: "READER",
  },
  status: {
    type: String,
    enum: ["ACTIVE", "TRIAL", "BANNED"],
    default: "ACTIVE",
  },
  postsThisMonth: { type: Number, default: 0 },
  lastRoleChangeDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);

// 📁 /routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token });
});

module.exports = router;

// 📁 /middleware/auth.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// 📁 /middleware/role.js
module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden: Access Denied" });
  }
  next();
};

// 📁 /routes/users.js
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// Reader requests to be Writer
router.patch("/request-writer", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== "READER")
      return res.status(400).json({ error: "Only READER can request" });
    user.status = "TRIAL";
    user.lastRoleChangeDate = new Date();
    await user.save();
    res.json({ message: "Request sent. Await admin approval." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin approves writer
router.patch("/approve-writer/:id", auth, role(["ADMIN"]), async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.role = "WRITER";
  user.status = "ACTIVE";
  user.lastRoleChangeDate = new Date();
  user.postsThisMonth = 0;
  await user.save();
  res.json({ message: "User promoted to WRITER" });
});

module.exports = router;

// 📁 /cron/downgradeWriters.js
const cron = require("node-cron");
const User = require("../models/User");

cron.schedule("0 0 * * *", async () => {
  const writers = await User.find({ role: "WRITER" });
  for (const writer of writers) {
    if (writer.postsThisMonth < 2) {
      if (writer.status === "TRIAL") {
        writer.role = "READER";
        writer.status = "BANNED";
      } else {
        writer.status = "TRIAL";
      }
    } else {
      if (writer.status === "TRIAL") writer.status = "ACTIVE";
    }
    writer.postsThisMonth = 0;
    await writer.save();
  }
  console.log("[CRON] Writer role evaluation completed");
});
