const mongoose = require("mongoose");
const Post = require("./Post");
const CustomFilter = require("../util/filter");

const CommentSchema = new mongoose.Schema(
  {
    commenter: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: [1000, "Comment can't be longer than 1000 characters"], // Max length for comment
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "comment", // Parent comment, for nested threads
    },
    children: [
      {
        type: mongoose.Types.ObjectId,
        ref: "comment", // Replies to this comment
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null, // Timestamp when comment was last edited
    },
  },
  { timestamps: true }
);

// Middleware to clean content before saving
CommentSchema.pre("save", function (next) {
  if (this.content.length > 0) {
    const customFilter = new CustomFilter();
    this.content = customFilter.cleanHacked(this.content);
  }

  // Track the timestamp if edited
  if (this.edited) {
    this.editedAt = Date.now();
  }

  next();
});

// Remove children when a parent comment is deleted
CommentSchema.post("remove", async function (res, next) {
  const comments = await this.model("comment").find({ parent: this._id });

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    await comment.remove();
  }

  next();
});

// Index on parent field for faster retrieval of replies
CommentSchema.index({ parent: 1 });

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
