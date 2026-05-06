const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Import your Post model
const Post = require("../models/Post"); // adjust path if needed

// Mongo URI (use env in real projects)
const MONGO_URI =
  "mongodb+srv://dhruvermafz:09112002@cluster0.wwx10kf.mongodb.net/social-app?retryWrites=true&w=majority";

async function backupPosts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Fetch all posts
    const posts = await Post.find().lean();

    if (!posts.length) {
      console.log("⚠️ No posts found to backup");
      return;
    }

    // File path
    const filePath = path.join(__dirname, `posts-backup-${Date.now()}.json`);

    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

    console.log(`✅ Backup successful: ${filePath}`);
  } catch (error) {
    console.error("❌ Backup failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB disconnected");
  }
}

backupPosts();
