const mongoose = require("mongoose");
const CustomFilter = require("../util/filter");
const PostLike = require("./PostLike");

const PostSchema = new mongoose.Schema(
  {
    poster: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: [80, "Must be no more than 80 characters"],
    },
    content: {
      type: String,
      required: true,
      maxLength: [8000, "Must be no more than 8000 characters"],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null, // Timestamp of when the post was last edited
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft", // Post status to track whether the post is active or archived
    },
    category: {
      type: String,
      required: true, // Categorize posts (e.g., "technology", "politics")
    },
    reports: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
        unique: true, // Prevent duplicate reports from the same user
      },
    ],
  },
  { timestamps: true }
);

// Middleware for cleaning content and title
PostSchema.pre("save", function (next) {
  const customFilter = new CustomFilter();

  if (this.title.length > 0) {
    this.title = customFilter.cleanHacked(this.title);
  }

  if (this.content.length > 0) {
    this.content = customFilter.cleanHacked(this.content);
  }

  // Track editing time
  if (this.edited) {
    this.editedAt = Date.now();
  }

  next();
});

// Middleware for deleting associated likes when the post is removed
PostSchema.pre("remove", async function (next) {
  console.log(this._id);
  await PostLike.deleteMany({ postId: this._id });

  next();
});

module.exports = mongoose.model("post", PostSchema);
