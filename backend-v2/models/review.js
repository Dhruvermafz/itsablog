import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    content: String,

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// One review per user per book
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
