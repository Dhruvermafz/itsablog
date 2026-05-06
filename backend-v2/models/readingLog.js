import mongoose from "mongoose";

const readingLogSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["reading", "completed", "dropped"],
      default: "reading",
      index: true,
    },

    currentPage: {
      type: Number,
      default: 0,
    },

    totalPages: Number,

    progressPercent: {
      type: Number,
      default: 0,
    },

    startedAt: Date,
    finishedAt: Date,

    isPrivate: {
      type: Boolean,
      default: false,
    },

    // Optional quick note
    lastNote: String,
  },
  { timestamps: true },
);

// 🔥 Only ONE active log per user per book
readingLogSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model("ReadingLog", readingLogSchema);
