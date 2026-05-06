import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    itemsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("List", listSchema);
