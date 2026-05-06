import mongoose from "mongoose";

const bookReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    content: {
      type: String,
      maxlength: 2000,
    },

    // 🔥 Keep counts, not arrays
    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isSpoiler: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// ✅ One review per user per book
bookReviewSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model("BookReview", bookReviewSchema);
