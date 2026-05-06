import mongoose from "mongoose";

const clubMemberSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
  },
  { timestamps: true },
);

// Prevent duplicates
clubMemberSchema.index({ club: 1, user: 1 }, { unique: true });

export default mongoose.model("ClubMember", clubMemberSchema);
