const User = require("../models/User");
const Post = require("../models/Post");
const PostLike = require("../models/PostLike");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");
const { default: mongoose } = require("mongoose");

const getUserDict = (token, user) => {
  return {
    token,
    username: user.username,
    userId: user._id,
    role: user.role,
  };
};

const buildToken = (user) => {
  return {
    userId: user._id,
    role: user.role,
  };
};

const getRandomIndices = (size, max) => {
  const indices = new Set();
  while (indices.size < size) {
    const randomIndex = Math.floor(Math.random() * max);
    indices.add(randomIndex);
  }
  return Array.from(indices);
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(username && email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role: "reader",
    });

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY, {
      expiresIn: "1h",
    });

    return res.status(201).json(getUserDict(token, user));
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new Error("All input required");
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (user.status === "suspended") {
      throw new Error("Account is suspended");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(buildToken(user), process.env.TOKEN_KEY, {
      expiresIn: "1h",
    });

    return res.json(getUserDict(token, user));
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const follow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(followingId)
    ) {
      throw new Error("Invalid user ID");
    }

    if (userId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await Follow.findOne({ userId, followingId });

    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const follow = await Follow.create({ userId, followingId });

    return res.status(200).json({ data: follow });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const unfollow = async (req, res) => {
  try {
    const { userId } = req.body;
    const followingId = req.params.id;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(followingId)
    ) {
      throw new Error("Invalid user ID");
    }

    const existingFollow = await Follow.findOne({ userId, followingId });

    if (!existingFollow) {
      throw new Error("Not following this user");
    }

    await existingFollow.deleteOne();

    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId, biography, profileImage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (typeof biography === "string") {
      user.biography = biography;
    }

    if (typeof profileImage === "string") {
      user.profileImage = profileImage;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        username: user.username,
        biography: user.biography,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const followers = await Follow.find({ followingId: userId }).populate(
      "userId",
      "username"
    );

    return res.status(200).json({ data: followers });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const following = await Follow.find({ userId }).populate(
      "followingId",
      "username"
    );

    return res.status(200).json({ data: following });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      throw new Error("User does not exist");
    }

    const posts = await Post.find({ poster: user._id })
      .populate("poster", "username")
      .sort({ createdAt: -1 });

    let likeCount = 0;
    for (const post of posts) {
      const postLikes = await PostLike.countDocuments({ postId: post._id });
      likeCount += postLikes;
    }

    const data = {
      user,
      posts: {
        count: posts.length,
        likeCount,
        data: posts,
      },
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getRandomUsers = async (req, res) => {
  try {
    let { size = 10 } = req.query;
    size = parseInt(size);

    const users = await User.find({ status: "active" }).select("-password");

    const randomUsers = [];
    if (size > users.length) {
      size = users.length;
    }

    const randomIndices = getRandomIndices(size, users.length);

    for (const index of randomIndices) {
      randomUsers.push(users[index]);
    }

    return res.status(200).json(randomUsers);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    // Calculate posts for the current month
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const startOfMonth = new Date(`${currentMonth}-01T00:00:00Z`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const usersWithPostCount = await Promise.all(
      users.map(async (user) => {
        const postCount = await Post.countDocuments({
          poster: user._id,
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        });
        return {
          ...user.toObject(),
          monthlyPostCount: postCount,
        };
      })
    );

    return res.status(200).json({ data: usersWithPostCount });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const requestWriterRole = async (req, res) => {
  try {
    const { userId, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    if (!reason || typeof reason !== "string" || reason.length < 10) {
      throw new Error("Reason must be a string with at least 10 characters");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User does not exist");
    }

    if (user.role !== "reader") {
      throw new Error("Only readers can request writer role");
    }

    const existingRequest = user.roleChangeRequests.find(
      (request) => request.status === "pending"
    );

    if (existingRequest) {
      throw new Error("A pending role change request already exists");
    }

    user.roleChangeRequests.push({
      requestedRole: "writer",
      reason,
      status: "pending",
      createdAt: new Date(),
    });

    await user.save();

    return res
      .status(200)
      .json({ message: "Writer role request submitted successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const handleWriterRoleRequest = async (req, res) => {
  try {
    const { userId, requestId, action } = req.body;
    const adminId = req.user.userId;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(requestId)
    ) {
      throw new Error("Invalid user or request ID");
    }

    if (!["approve", "reject"].includes(action)) {
      throw new Error("Invalid action. Must be 'approve' or 'reject'");
    }

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      throw new Error("Only admins can handle role change requests");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const roleRequest = user.roleChangeRequests.id(requestId);
    if (!roleRequest || roleRequest.status !== "pending") {
      throw new Error("Invalid or already processed request");
    }

    roleRequest.status = action === "approve" ? "approved" : "rejected";
    roleRequest.reviewedBy = adminId;

    if (action === "approve") {
      user.role = "writer";
      user.isTrialWriter = true;
      user.trialStartDate = new Date();
    }

    await user.save();

    return res
      .status(200)
      .json({ message: `Writer role request ${action}d successfully` });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// New endpoint: Get Profile
const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    if (!username) {
      throw new Error("Username is required");
    }

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      throw new Error("User does not exist");
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const posts = await Post.find({ poster: user._id })
      .populate("poster", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(pageSize));

    const totalPosts = await Post.countDocuments({ poster: user._id });

    let likeCount = 0;
    for (const post of posts) {
      const postLikes = await PostLike.countDocuments({ postId: post._id });
      likeCount += postLikes;
    }

    const data = {
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName || "",
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        avatar: user.profileImage || "",
        role: user.role,
        biography: user.biography || "",
      },
      posts: {
        count: totalPosts,
        likeCount,
        data: posts,
      },
      currentPage: parseInt(page),
      totalPosts,
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// New endpoint: Delete User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User does not exist");
    }

    const requestingUser = await User.findById(requestingUserId);
    if (
      !requestingUser ||
      (requestingUser.role !== "admin" && requestingUserId !== userId)
    ) {
      throw new Error("Unauthorized to delete this user");
    }

    // Delete associated data
    await Post.deleteMany({ poster: userId });
    await PostLike.deleteMany({ userId });
    await Follow.deleteMany({ $or: [{ userId }, { followingId: userId }] });

    await user.deleteOne();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// New endpoint: Logout
const logout = async (req, res) => {
  try {
    // Optionally implement token blacklisting (e.g., using Redis)
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  getRandomUsers,
  getAllUsers,
  requestWriterRole,
  handleWriterRoleRequest,
  updateUser,
  getProfile,
  deleteUser,
  logout,
};
