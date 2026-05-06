import mongoose from "mongoose";

const logEntrySchema = new mongoose.Schema(
  {
    log: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReadingLog",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    page: Number,

    progressPercent: Number,

    note: {
      type: String,
      maxlength: 1000,
    },

    mood: {
      type: String,
      enum: ["excited", "bored", "sad", "confused", "happy"],
    },

    timeSpent: Number, // minutes

    entryDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("LogEntry", logEntrySchema);
