const Post = require("../models/post");

exports.createPost = async (req, res) => {
  const { title, content, category, tags, status } = req.body;

  try {
    const post = new Post({
      title,
      content,
      category,
      tags,
      status,
      author: req.user.id,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" })
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
