const mongoose = require("mongoose");
const { isEmail, contains } = require("validator");
const filter = require("../util/filter");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: [6, "Must be at least 6 characters long"],
      maxlength: [30, "Must be no more than 30 characters long"],
      validate: {
        validator: (val) => !contains(val, " "),
        message: "Must contain no spaces",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Must be valid email address"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Must be at least 8 characters long"],
    },
    biography: {
      type: String,
      default: "",
      maxLength: [250, "Must be at most 250 characters long"],
    },
    role: {
      type: String,
      enum: ["reader", "writer", "admin"],
      default: "reader",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    isTrialWriter: {
      type: Boolean,
      default: false,
    },
    trialStartDate: {
      type: Date,
      default: null,
    },
    lastPostDate: {
      type: Date,
      default: null,
    },
    // Add to UserSchema in models/User.js
    isAgency: {
      type: Boolean,
      default: false,
    },
    categories: [
      {
        type: String, // Stores category slugs (e.g., "literature", "politics", etc.)
      },
    ],
    profileImage: {
      type: String,
      default: null,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    roleChangeRequests: [
      {
        requestedRole: {
          type: String,
          enum: ["writer", "reader"],
        },
        reason: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        reviewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to filter profanity in the username and biography
UserSchema.pre("save", function (next) {
  if (filter.isProfane(this.username)) {
    throw new Error("Username cannot contain profanity");
  }

  if (this.biography.length > 0) {
    this.biography = filter.clean(this.biography);
  }

  next();
});

// Virtual for full name (could be useful if you plan to expand later)
UserSchema.virtual("fullName").get(function () {
  return `${this.username}`;
});

// Method to check if the user should be downgraded from writer to reader
UserSchema.methods.checkPostActivity = function () {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.setMonth(now.getMonth() - 1));

  // If no post in the last 30 days and the user is a writer, downgrade to reader
  if (
    this.role === "writer" &&
    this.lastPostDate &&
    this.lastPostDate < thirtyDaysAgo
  ) {
    this.role = "reader";
    this.isTrialWriter = false;
    this.save();
  }
};

// Method to update the last post date
UserSchema.methods.updateLastPostDate = function () {
  this.lastPostDate = new Date();
  this.save();
};

module.exports = mongoose.model("user", UserSchema);
