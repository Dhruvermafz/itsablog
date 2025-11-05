// models/Group.js
const mongoose = require("mongoose");
const CustomFilter = require("../util/filter");
const PostLike = require("./PostLike");

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Group name must be at least 3 characters"],
      maxlength: [50, "Group name must be at most 50 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description must be at most 500 characters"],
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    members: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "post",
      },
    ],
    category: {
      type: String,
      required: true, // Categorize group (e.g., "technology", "politics")
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Middleware to clean name and description
GroupSchema.pre("save", function (next) {
  const customFilter = new CustomFilter();
  if (this.name.length > 0) {
    this.name = customFilter.cleanHacked(this.name);
  }
  if (this.description.length > 0) {
    this.description = customFilter.cleanHacked(this.description);
  }
  next();
});

module.exports = mongoose.model("group", GroupSchema);
