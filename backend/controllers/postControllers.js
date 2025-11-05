const mongoose = require("mongoose");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const PostLike = require("../models/PostLike");
const Category = require("../models/Category");
const paginate = require("../util/paginate");

const USER_LIKES_PAGE_SIZE = 9;
const cooldown = new Set();

const createPost = async (req, res) => {
  try {
    const { title, content, category, userId } = req.body;

    if (!(title && content && category)) {
      return res
        .status(400)
        .json({ error: "Title, content, and category are required" });
    }

    const user = await User.findById(userId);
    if (!user || (user.role !== "writer" && user.role !== "admin")) {
      return res
        .status(403)
        .json({ error: "Only writers or admins can create posts" });
    }

    if (user.status === "suspended") {
      return res
        .status(403)
        .json({ error: "Suspended users cannot create posts" });
    }

    const categoryDoc = await Category.findOne({ slug: category });
    if (!categoryDoc) {
      return res.status(400).json({ error: "Invalid category" });
    }

    if (cooldown.has(userId)) {
      return res.status(429).json({
        error: "You are posting too frequently. Please try again shortly.",
      });
    }

    cooldown.add(userId);
    setTimeout(() => cooldown.delete(userId), 60000); // 1-minute cooldown

    const post = await Post.create({
      title,
      content,
      poster: userId,
      category: categoryDoc.slug,
      status: user.role === "admin" ? "published" : "draft", // Admins publish directly
    });

    await user.updateLastPostDate(); // Update last post date for writer activity tracking

    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId)
      .populate("poster", "username")
      .populate("category", "name slug")
      .lean();

    if (!post || post.status === "archived") {
      return res.status(404).json({ error: "Post not found or archived" });
    }

    if (userId) {
      await setLiked([post], userId);
    }

    await enrichWithUserLikePreview([post]);

    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, title, category, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user || (post.poster.toString() !== userId && user.role !== "admin")) {
      return res.status(403).json({ error: "Not authorized to update post" });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (!categoryDoc) {
        return res.status(400).json({ error: "Invalid category" });
      }
      post.category = categoryDoc.slug;
    }

    post.edited = true;

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user || (post.poster.toString() !== userId && user.role !== "admin")) {
      return res.status(403).json({ error: "Not authorized to delete post" });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: post._id });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const publishPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user || (post.poster.toString() !== userId && user.role !== "admin")) {
      return res.status(403).json({ error: "Not authorized to publish post" });
    }

    if (post.status === "published") {
      return res.status(400).json({ error: "Post is already published" });
    }

    post.status = "published";
    await post.save();

    return res
      .status(200)
      .json({ message: "Post published successfully", post });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const archivePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user || (post.poster.toString() !== userId && user.role !== "admin")) {
      return res.status(403).json({ error: "Not authorized to archive post" });
    }

    if (post.status === "archived") {
      return res.status(400).json({ error: "Post is already archived" });
    }

    post.status = "archived";
    await post.save();

    return res
      .status(200)
      .json({ message: "Post archived successfully", post });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const reportPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    if (!reason || typeof reason !== "string" || reason.length < 10) {
      return res
        .status(400)
        .json({ error: "Reason must be a string with at least 10 characters" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.reports.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already reported this post" });
    }

    post.reports.push(userId);
    await post.save();

    // Optionally, notify admins if report count exceeds a threshold
    if (post.reports.length >= 5) {
      // Implement notification logic (e.g., email or in-app notification)
      console.log(
        `Post ${postId} has ${post.reports.length} reports and may need review.`
      );
    }

    return res.status(200).json({ message: "Post reported successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getReportedPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const posts = await Post.find({ reports: { $exists: true, $ne: [] } })
      .populate("poster", "username")
      .populate("category", "name slug")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const count = await Post.countDocuments({
      reports: { $exists: true, $ne: [] },
    });

    return res.status(200).json({ data: posts, count });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const setLiked = async (posts, userId) => {
  const userPostLikes = await PostLike.find({ userId });
  posts.forEach((post) => {
    post.liked = userPostLikes.some((like) => like.postId.equals(post._id));
  });
};

const enrichWithUserLikePreview = async (posts) => {
  const postMap = posts.reduce((result, post) => {
    result[post._id] = post;
    return result;
  }, {});

  const postLikes = await PostLike.find({
    postId: { $in: Object.keys(postMap) },
  })
    .limit(200)
    .populate("userId", "username")
    .lean();

  postLikes.forEach((postLike) => {
    const post = postMap[postLike.postId];
    if (!post.userLikePreview) {
      post.userLikePreview = [];
    }
    post.userLikePreview.push({
      _id: postLike.userId._id,
      username: postLike.userId.username,
    });
  });
};

const getPosts = async (req, res) => {
  try {
    const { userId } = req.body;
    let {
      page = 1,
      limit = 10,
      sortBy = "-createdAt",
      author,
      search,
      category,
    } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const query = { status: "published" };

    if (author) {
      const user = await User.findOne({ username: author })
        .select("_id")
        .lean();
      if (user) {
        query.poster = user._id;
      } else {
        return res.status(200).json({ data: [], count: 0 });
      }
    }

    if (search) {
      query.title = { $regex: `^${search}`, $options: "i" }; // Prefix search for better index usage
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category }).lean();
      if (!categoryDoc) {
        return res.status(400).json({ error: "Invalid category" });
      }
      query.category = categoryDoc.slug;
    }

    const [count, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .populate("poster", "username")
        .populate("category", "name slug")
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    if (userId) {
      await setLiked(posts, userId);
    }

    await enrichWithUserLikePreview(posts);

    return res.status(200).json({ data: posts, count });
  } catch (err) {
    console.error("Error in getPosts:", err);
    if (
      err.name === "MongooseError" &&
      err.message.includes("buffering timed out")
    ) {
      return res
        .status(503)
        .json({
          error: "Database operation timed out. Please try again later.",
        });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post || post.status === "archived") {
      return res.status(404).json({ error: "Post not found or archived" });
    }

    const existingPostLike = await PostLike.findOne({ postId, userId });
    if (existingPostLike) {
      return res.status(400).json({ error: "Post is already liked" });
    }

    await PostLike.create({ postId, userId });

    post.likeCount = await PostLike.countDocuments({ postId });
    await post.save();

    return res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post || post.status === "archived") {
      return res.status(404).json({ error: "Post not found or archived" });
    }

    const existingPostLike = await PostLike.findOne({ postId, userId });
    if (!existingPostLike) {
      return res.status(400).json({ error: "Post is not liked" });
    }

    await existingPostLike.deleteOne();

    post.likeCount = await PostLike.countDocuments({ postId });
    await post.save();

    return res.status(200).json({ message: "Post unliked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getUserLikedPosts = async (req, res) => {
  try {
    const likerId = req.params.id;
    const { userId } = req.body;
    let { page = 1, sortBy = "-createdAt" } = req.query;

    page = parseInt(page, 10);
    if (page < 1) page = 1;

    const postLikes = await PostLike.find({ userId: likerId })
      .sort(sortBy)
      .populate({
        path: "postId",
        match: { status: "published" },
        populate: [
          { path: "poster", select: "username" },
          { path: "category", select: "name slug" },
        ],
      })
      .skip((page - 1) * 10)
      .limit(10)
      .lean();

    const posts = postLikes.map((like) => like.postId).filter(Boolean);
    const count = await PostLike.countDocuments({
      userId: likerId,
      postId: { $in: await Post.find({ status: "published" }).distinct("_id") },
    });

    if (userId) {
      await setLiked(posts, userId);
    }

    await enrichWithUserLikePreview(posts);

    return res.status(200).json({ data: posts, count });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getUserLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    let { page = 1, limit = USER_LIKES_PAGE_SIZE } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const postLikes = await PostLike.find({ postId })
      .populate("userId", "username")
      .skip((page - 1) * limit)
      .limit(limit + 1)
      .lean();

    const hasMorePages = postLikes.length > limit;
    if (hasMorePages) postLikes.pop();

    const userLikes = postLikes.map((like) => ({
      id: like._id,
      username: like.userId.username,
    }));

    return res.status(200).json({ userLikes, hasMorePages }); // Fixed status code (was 400)
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);
    if (!post || post.status === "archived") {
      return res.status(404).json({ error: "Post not found or archived" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.saved.includes(postId)) {
      return res.status(400).json({ error: "Post already saved" });
    }

    user.saved.push(postId);
    await user.save();

    return res.status(200).json({ message: "Post saved successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const unSavePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.saved.includes(postId)) {
      return res.status(400).json({ error: "Post not saved" });
    }

    user.saved.pull(postId);
    await user.save();

    return res.status(200).json({ message: "Post removed from saved posts" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getSavePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({
      _id: { $in: user.saved },
      status: "published",
    })
      .populate("poster", "username")
      .populate("category", "name slug")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const count = await Post.countDocuments({
      _id: { $in: user.saved },
      status: "published",
    });

    if (req.user.userId) {
      await setLiked(posts, req.user.userId);
    }

    await enrichWithUserLikePreview(posts);

    return res.status(200).json({ data: posts, count });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  publishPost,
  archivePost,
  likePost,
  unlikePost,
  getUserLikedPosts,
  getUserLikes,
  reportPost,
  getReportedPosts,
  savePost,
  unSavePost,
  getSavePost,
};
