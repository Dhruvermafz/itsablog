import mongoose from "mongoose";

const reviewCommentSchema = new mongoose.Schema(
  {
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookReview",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    content: String,
  },
  { timestamps: true },
);

export default mongoose.model("ReviewComment", reviewCommentSchema);
