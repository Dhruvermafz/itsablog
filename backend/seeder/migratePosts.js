const mongoose = require("mongoose");
const Post = require("../models/Post"); // Adjust path to your Post model
require("dotenv").config();
async function migratePosts() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        console.log("MongoDB connected");
      }
    );

    // Update all posts that lack the status field to have status: "draft"
    const result = await Post.updateMany(
      {}, // Match all posts
      { $set: { status: "published" } } // Set status to "published"
    );

    console.log(`Updated ${result.modifiedCount} posts with status: "draft"`);

    // Optionally, verify the update
    const posts = await Post.find({}).select("title status");
    console.log("Posts after migration:", posts);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Migration error:", err);
  }
}

migratePosts();
