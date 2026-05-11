import club from "../../models/club.js";
import clubMember from "../../models/clubMember.js";
import clubPost from "../../models/clubPost.js";
import postLike from "../../models/postLike.js";
import postComment from "../../models/postComment.js";

class ClubService {
  // ====================== Club ======================
  async createClub(clubData, userId) {
    const newClub = await club.create({ ...clubData, createdBy: userId });

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
    const foundClub = await club
      .findById(id)
      .populate("createdBy", "name avatar")
      .lean();

    if (!foundClub) return null;

    const members = await clubMember
      .find({ club: id })
      .populate("user", "name avatar");

    foundClub.members = members;
    return foundClub;
  }

  async checkMembership(clubId, userId) {
    const membership = await clubMember.findOne({
      club: clubId,
      user: userId,
    });

    return {
      isMember: !!membership,
      role: membership?.role || null,
    };
  }

  // ====================== Following Clubs ======================
  async getFollowingClubs(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;

    const memberships = await clubMember
      .find({ user: userId })
      .populate({
        path: "club",
        populate: { path: "createdBy", select: "name avatar" },
      })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const clubs = memberships.map((m) => m.club);

    return {
      clubs,
      pagination: { page, limit, total: memberships.length },
    };
  }

  // ====================== Feed (Posts from followed clubs) ======================
  async getFeed(userId, { page = 1, limit = 15 } = {}) {
    const skip = (page - 1) * limit;

    // Get club IDs user is member of
    const memberships = await clubMember.find({ user: userId }).select("club");
    const clubIds = memberships.map((m) => m.club);

    if (clubIds.length === 0) {
      return { posts: [], pagination: { page, limit, total: 0 } };
    }

    const posts = await clubPost
      .find({ club: { $in: clubIds } })
      .populate("author", "name avatar")
      .populate("club", "name coverImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      posts,
      pagination: { page, limit },
    };
  }

  // ====================== Single Post ======================
  async getPostById(postId) {
    return await clubPost
      .findById(postId)
      .populate("author", "name avatar")
      .populate("club", "name coverImage");
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

  async editComment(commentId, userId, content) {
    const comment = await postComment.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.user.toString() !== userId.toString())
      throw new Error("Unauthorized");

    const TEN_MINUTES = 10 * 60 * 1000;
    if (Date.now() - new Date(comment.createdAt).getTime() > TEN_MINUTES) {
      throw new Error("Comment can only be edited within 10 minutes");
    }

    comment.content = content;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    return comment.populate("user", "name avatar");
  }

  async deleteComment(commentId, userId) {
    const comment = await postComment.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.user.toString() !== userId.toString())
      throw new Error("Unauthorized");

    await comment.deleteOne();
    await clubPost.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    return { message: "Comment deleted successfully" };
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
