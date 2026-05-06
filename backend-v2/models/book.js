import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
      index: true,
    },

    coverUrl: String,

    synopsis: String,

    year: Number,

    pages: Number,

    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },

    genres: [
      {
        type: String,
        index: true,
      },
    ],

    // 🔥 Aggregated fields (important)
    avgRating: {
      type: Number,
      default: 0,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Full-text search
bookSchema.index({ title: "text", synopsis: "text" });

export default mongoose.model("Book", bookSchema);
