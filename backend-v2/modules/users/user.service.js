import user from "../../models/user.js";
import follow from "../../models/follow.js";
import readingLog from "../../models/readingLog.js";
import logEntry from "../../models/logEntry.js";
import bcrypt from "bcryptjs";

class UserService {
  // ====================== User Profile ======================
  async getUserProfile(username) {
    const foundUser = await user
      .findOne({ username })
      .select("-password")
      .lean();

    if (!foundUser) throw new Error("User not found");
    return foundUser;
  }

  async updateProfile(userId, updateData) {
    const { password, ...rest } = updateData;

    if (password) {
      rest.password = await bcrypt.hash(password, 12);
    }

    return await user
      .findByIdAndUpdate(userId, rest, {
        new: true,
      })
      .select("-password");
  }

  // ====================== Follow System ======================
  async followUser(followerId, followingId) {
    if (followerId.toString() === followingId.toString()) {
      throw new Error("You cannot follow yourself");
    }

    const existing = await follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existing) throw new Error("Already following");

    await follow.create({ follower: followerId, following: followingId });

    await Promise.all([
      user.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } }),
      user.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } }),
    ]);

    return { message: "Followed successfully" };
  }

  async unfollowUser(followerId, followingId) {
    const deleted = await follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!deleted) throw new Error("Not following");

    await Promise.all([
      user.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } }),
      user.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } }),
    ]);

    return { message: "Unfollowed successfully" };
  }

  async getFollowers(userId, { page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const followers = await follow
      .find({ following: userId })
      .populate("follower", "username avatar bio")
      .skip(skip)
      .limit(limit);

    return { followers };
  }

  async getFollowing(userId, { page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const followingList = await follow
      .find({ follower: userId })
      .populate("following", "username avatar bio")
      .skip(skip)
      .limit(limit);

    return { following: followingList };
  }

  // ====================== Reading Logs ======================
  async createOrUpdateReadingLog(userId, bookId, logData) {
    const log = await readingLog
      .findOneAndUpdate(
        { user: userId, book: bookId },
        { ...logData, user: userId, book: bookId },
        { upsert: true, new: true, runValidators: true },
      )
      .populate("book", "title author coverUrl");

    return log;
  }

  async getUserReadingLogs(userId, { status, page = 1, limit = 15 }) {
    const query = { user: userId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    return await readingLog
      .find(query)
      .populate("book", "title author coverUrl year")
      .sort("-updatedAt")
      .skip(skip)
      .limit(limit);
  }

  async addLogEntry(logId, userId, entryData) {
    const entry = await logEntry.create({
      log: logId,
      user: userId,
      ...entryData,
    });

    // Update main log progress
    await readingLog.findByIdAndUpdate(logId, {
      currentPage: entryData.page,
      progressPercent: entryData.progressPercent,
      lastNote: entryData.note,
    });

    return entry;
  }

  async getLogEntries(logId, { page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    return await logEntry
      .find({ log: logId })
      .sort("-entryDate")
      .skip(skip)
      .limit(limit);
  }
}

export default new UserService();
