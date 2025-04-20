const mongoose = require("mongoose");

const PostLikeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent a user from liking the same post multiple times
PostLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("postLike", PostLikeSchema);
