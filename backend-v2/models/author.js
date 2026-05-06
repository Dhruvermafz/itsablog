import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    avatar: String,

    bio: String,

    birthYear: Number,

    nationality: String,

    booksCount: {
      type: Number,
      default: 0,
    },

    followersCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

authorSchema.index({ name: "text" });

export default mongoose.model("Author", authorSchema);
