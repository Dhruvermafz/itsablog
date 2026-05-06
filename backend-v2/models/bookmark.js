import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    entityType: {
      type: String,
      enum: ["book", "list", "review", "author"],
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate bookmarks
bookmarkSchema.index({ user: 1, entityId: 1, entityType: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
