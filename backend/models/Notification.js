const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["follow", "like", "comment-like", "comment", "reply"],
    },
    initiator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unread: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
      getters: true,
    },
  }
);

const Notification = model("Notification", NotificationSchema);

module.exports = Notification;
