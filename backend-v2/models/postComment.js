import mongoose from "mongoose";

const postCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClubPost",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostComment", // for replies
    },
  },
  { timestamps: true },
);

export default mongoose.model("PostComment", postCommentSchema);
