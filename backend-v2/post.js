// File: models/Post.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  tags: [String],
  isDraft: { type: Boolean, default: false },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  readTime: String,
  views: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Post", postSchema);

// File: models/Category.js
const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Category", categorySchema);

// File: routes/postRoutes.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { isAuth, isWriter, isAdmin } = require("../middleware/authMiddleware");
const slugify = require("slugify");

// Create Post
router.post("/", isAuth, isWriter, async (req, res) => {
  try {
    const { title, content, category, tags, isDraft } = req.body;
    const slug = slugify(title, { lower: true });

    const newPost = await Post.create({
      title,
      slug,
      content,
      category,
      tags,
      isDraft,
      author: req.user._id,
      readTime: Math.ceil(content.split(" ").length / 200) + " min read",
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ isDraft: false }).populate(
      "author",
      "username"
    );
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Post by Slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "author",
      "username"
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.views++;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Post
router.put("/:id", isAuth, isWriter, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!post.author.equals(req.user._id))
      return res.status(403).json({ error: "Not your post" });

    Object.assign(post, req.body);
    post.updatedAt = new Date();
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Post
router.delete("/:id", isAuth, isWriter, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (!post.author.equals(req.user._id) && req.user.role !== "ROLE_ADMIN")
      return res.status(403).json({ error: "Unauthorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like Post
router.post("/:id/like", isAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (!post.likes.includes(req.user._id)) post.likes.push(req.user._id);
  else
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  await post.save();
  res.json(post);
});

// Bookmark Post
router.post("/:id/bookmark", isAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (!post.bookmarks.includes(req.user._id)) post.bookmarks.push(req.user._id);
  else
    post.bookmarks = post.bookmarks.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  await post.save();
  res.json(post);
});

module.exports = router;

// File: routes/categoryRoutes.js
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.post("/", isAuth, isAdmin, async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true });
  const category = await Category.create({ name, slug });
  res.status(201).json(category);
});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

module.exports = router;
