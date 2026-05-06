import mongoose from "mongoose";

const reviewLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookReview",
    },
  },
  { timestamps: true },
);

reviewLikeSchema.index({ user: 1, review: 1 }, { unique: true });

export default mongoose.model("ReviewLike", reviewLikeSchema);
