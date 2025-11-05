// controllers/GroupController.js
const Group = require("../models/Group");
const Post = require("../models/Post");
const CustomError = require("../util/customError");

class GroupController {
  // Create a new group
  static async createGroup(req, res) {
    const { name, description, category } = req.body;
    const userId = req.user._id; // Assuming user is authenticated

    try {
      const group = new Group({
        name,
        description,
        creator: userId,
        members: [userId],
        category,
      });
      await group.save();
      res.status(201).json({ message: "Group created successfully", group });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Join a group
  static async joinGroup(req, res) {
    const { groupId } = req.params;
    const userId = req.user._id;

    try {
      const group = await Group.findById(groupId);
      if (!group) {
        throw new CustomError("Group not found", 404);
      }
      if (group.members.includes(userId)) {
        throw new CustomError("User already a member", 400);
      }
      group.members.push(userId);
      await group.save();
      res.status(200).json({ message: "Joined group successfully", group });
    } catch (error) {
      res.status(error.status || 400).json({ message: error.message });
    }
  }

  // Create a post in a group
  static async createPostInGroup(req, res) {
    const { groupId } = req.params;
    const { title, content, category } = req.body;
    const userId = req.user._id;

    try {
      const group = await Group.findById(groupId);
      if (!group) {
        throw new CustomError("Group not found", 404);
      }
      if (!group.members.includes(userId)) {
        throw new CustomError("User is not a member of this group", 403);
      }

      const post = new Post({
        poster: userId,
        title,
        content,
        category: category || group.category, // Use group's category if not provided
        status: "published",
      });
      await post.save();

      group.posts.push(post._id);
      await group.save();

      // Update user's last post date
      const user = await User.findById(userId);
      await user.updateLastPostDate();

      res.status(201).json({ message: "Post created in group", post });
    } catch (error) {
      res.status(error.status || 400).json({ message: error.message });
    }
  }

  // Get group details and posts
  static async getGroup(req, res) {
    const { groupId } = req.params;

    try {
      const group = await Group.findById(groupId)
        .populate("creator", "username")
        .populate("members", "username")
        .populate({
          path: "posts",
          populate: [
            { path: "poster", select: "username" },
            { path: "reports", select: "username" },
          ],
        });
      if (!group) {
        throw new CustomError("Group not found", 404);
      }
      res.status(200).json(group);
    } catch (error) {
      res.status(error.status || 400).json({ message: error.message });
    }
  }
  // Get all groups
  static async getAllGroups(req, res) {
    try {
      const groups = await Group.find({ status: "active" })
        .populate("creator", "username")
        .populate("members", "username")
        .populate({
          path: "posts",
          populate: [{ path: "poster", select: "username" }],
        });
      res.status(200).json(groups);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Search groups
  static async searchGroups(req, res) {
    const { query } = req.query;
    try {
      const groups = await Group.find({
        status: "active",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
        .populate("creator", "username")
        .populate("members", "username");
      res.status(200).json(groups);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get popular groups (sorted by member count, limited to top 5)
  static async getPopularGroups(req, res) {
    try {
      const groups = await Group.find({ status: "active" })
        .sort({ members: -1 }) // Sort by member count descending
        .limit(5)
        .populate("creator", "username")
        .populate("members", "username");
      res.status(200).json(groups);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get user's groups
  static async getMyGroups(req, res) {
    const userId = req.user._id;
    try {
      const groups = await Group.find({
        status: "active",
        members: userId,
      })
        .populate("creator", "username")
        .populate("members", "username")
        .populate({
          path: "posts",
          populate: [{ path: "poster", select: "username" }],
        });
      res.status(200).json(groups);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = GroupController;
