import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    coverImage: String,

    category: {
      type: String, // later can normalize
    },

    termsAndConditions: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    memberCount: {
      type: Number,
      default: 0,
    },

    postCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Club", clubSchema);
