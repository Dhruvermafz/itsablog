import club from "../../models/club.js";
import clubMember from "../../models/clubMember.js";
import clubPost from "../../models/clubPost.js";
import postLike from "../../models/postLike.js";
import postComment from "../../models/postComment.js";

class ClubService {
  // ====================== Club ======================
  async createClub(clubData, userId) {
    const newClub = await club.create({ ...clubData, createdBy: userId });

    // Auto join as admin
    await clubMember.create({
      club: newClub._id,
      user: userId,
      role: "admin",
    });

    return newClub;
  }

  async getClubs({ page = 1, limit = 20, category }) {
    const query = category ? { category } : {};
    const skip = (page - 1) * limit;

    const clubs = await club
      .find(query)
      .sort("-memberCount")
      .skip(skip)
      .limit(limit);

    return { clubs, pagination: { page, limit } };
  }

  async getClubById(id) {
    return await club.findById(id).populate("createdBy", "name avatar");
  }

  // ====================== Membership ======================
  async joinClub(clubId, userId) {
    const existing = await clubMember.findOne({ club: clubId, user: userId });
    if (existing) throw new Error("Already a member");

    await clubMember.create({ club: clubId, user: userId });
    await club.findByIdAndUpdate(clubId, { $inc: { memberCount: 1 } });

    return { message: "Joined club successfully" };
  }

  // ====================== Club Posts ======================
  async createPost(clubId, userId, postData) {
    const membership = await clubMember.findOne({ club: clubId, user: userId });
    if (!membership) throw new Error("You are not a member of this club");

    const post = await clubPost.create({
      club: clubId,
      author: userId,
      ...postData,
    });

    await club.findByIdAndUpdate(clubId, { $inc: { postCount: 1 } });

    return post.populate("author", "name avatar");
  }

  async getClubPosts(clubId, { page = 1, limit = 15 }) {
    const skip = (page - 1) * limit;

    return await clubPost
      .find({ club: clubId })
      .populate("author", "name avatar")
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  // ====================== Likes ======================
  async toggleLike(postId, userId) {
    const existing = await postLike.findOne({ post: postId, user: userId });

    if (existing) {
      await existing.deleteOne();
      await clubPost.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
      return { liked: false };
    } else {
      await postLike.create({ post: postId, user: userId });
      await clubPost.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });
      return { liked: true };
    }
  }

  // ====================== Comments ======================
  async createComment(postId, userId, content, parentId = null) {
    const comment = await postComment.create({
      post: postId,
      user: userId,
      content,
      parent: parentId,
    });

    await clubPost.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    return comment.populate("user", "name avatar");
  }

  async getPostComments(postId, { page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    return await postComment
      .find({ post: postId, parent: null })
      .populate("user", "name avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
  }
}

export default new ClubService();
