import mongoose from "mongoose";

const clubPostSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },

    image: String, // optional image
    imageCaption: String,

    // Aggregated fields
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes
clubPostSchema.index({ club: 1, createdAt: -1 });
clubPostSchema.index({ author: 1 });

export default mongoose.model("ClubPost", clubPostSchema);
