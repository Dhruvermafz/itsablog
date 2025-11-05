// models/Newsroom.js
const mongoose = require("mongoose");
const CustomFilter = require("../util/filter");

const NewsroomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title must be at most 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [10000, "Content must be at most 10000 characters"],
    },
    agency: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
      validate: {
        validator: async function (userId) {
          const user = await mongoose.model("user").findById(userId);
          return user && (user.role === "admin" || user.isAgency); // Assuming isAgency field added to User
        },
        message: "Only admins or agencies can create newsroom announcements",
      },
    },
    category: {
      type: String,
      required: true, // Categorize announcement (e.g., "technology", "politics")
    },
    hashtags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        match: [
          /^[a-z0-9]+$/,
          "Hashtags must contain only letters and numbers",
        ],
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

// Middleware to clean title and content
NewsroomSchema.pre("save", function (next) {
  const customFilter = new CustomFilter();
  if (this.title.length > 0) {
    this.title = customFilter.cleanHacked(this.title);
  }
  if (this.content.length > 0) {
    this.content = customFilter.cleanHacked(this.content);
  }
  next();
});

module.exports = mongoose.model("newsroom", NewsroomSchema);
