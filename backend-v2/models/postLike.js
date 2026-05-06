import mongoose from "mongoose";

const postLikeSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClubPost",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate likes
postLikeSchema.index({ post: 1, user: 1 }, { unique: true });

export default mongoose.model("PostLike", postLikeSchema);
