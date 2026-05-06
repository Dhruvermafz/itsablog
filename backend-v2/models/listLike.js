import mongoose from "mongoose";

const listLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
  },
  { timestamps: true },
);

listLikeSchema.index({ user: 1, list: 1 }, { unique: true });

export default mongoose.model("ListLike", listLikeSchema);
