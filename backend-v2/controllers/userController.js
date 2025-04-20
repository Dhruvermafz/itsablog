const User = require("../models/user");
const Post = require("../models/post");

exports.requestWriterRole = async (req, res) => {
  const { categories } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.role === "Writer") {
      return res.status(400).json({ message: "Already a Writer" });
    }

    // In a real app, this would trigger an admin notification
    user.categories = categories;
    await user.save();

    res.json({ message: "Writer role request submitted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Check Writer activity (run via cron job monthly)
exports.checkWriterActivity = async () => {
  const writers = await User.find({ role: "Writer" });

  for (const writer of writers) {
    const postCount = await Post.countDocuments({
      author: writer._id,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    if (postCount < 2) {
      writer.role = "Reader";
      writer.categories = [];
      await writer.save();
      console.log(`Downgraded ${writer.email} to Reader`);
    }
  }
};
