import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "follow",
        "like_review",
        "comment_review",
        "list_like",
        "club_activity",
      ],
      required: true,
    },

    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    entityType: {
      type: String,
      enum: ["review", "list", "club"],
    },

    message: String, // optional prebuilt message

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
