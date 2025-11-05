// controllers/NewsroomController.js
const Newsroom = require("../models/newsroom");
const Post = require("../models/Post");
const CustomError = require("../util/customError");

class NewsroomController {
  // Create a newsroom announcement (only for admins or agencies)
  static async createAnnouncement(req, res) {
    const { title, content, category, hashtags } = req.body;
    const userId = req.user._id;

    try {
      const user = await User.findById(userId);
      if (!user || !(user.role === "admin" || user.isAgency)) {
        throw new CustomError(
          "Only admins or agencies can create announcements",
          403
        );
      }

      const announcement = new Newsroom({
        title,
        content,
        agency: userId,
        category,
        hashtags,
        status: "published",
      });
      await announcement.save();
      res
        .status(201)
        .json({ message: "Announcement created successfully", announcement });
    } catch (error) {
      res.status(error.status || 400).json({ message: error.message });
    }
  }

  // Get all published announcements
  static async getAnnouncements(req, res) {
    try {
      const announcements = await Newsroom.find({ status: "published" })
        .populate("agency", "username")
        .sort({ createdAt: -1 });
      res.status(200).json(announcements);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get a single announcement by ID
  static async getAnnouncement(req, res) {
    const { announcementId } = req.params;

    try {
      const announcement = await Newsroom.findById(announcementId).populate(
        "agency",
        "username"
      );
      if (!announcement) {
        throw new CustomError("Announcement not found", 404);
      }
      res.status(200).json(announcement);
    } catch (error) {
      res.status(error.status || 400).json({ message: error.message });
    }
  }

  // Create a post referencing an announcement
  static async createPostForAnnouncement(req, res) {
    const { announcementId } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;

    try {
      const announcement = await Newsroom.findById(announcementId);
      if (!announcement) {
        throw new CustomError("Announcement not found", 404);
      }

      const post = new Post({
        poster: userId,
        title,
        content,
        category: announcement.category,
        status: "published",
      });
      await post.save();

      // Update user's last post date
      const user = await User.findById(userId);
      await user.updateLastPostDate();

      res.status(201).json({ message: "Post created for announcement", post });
    } catch (error) {
      res.status(error.status || 400).json({ message: error.message });
    }
  }
}

module.exports = NewsroomController;
