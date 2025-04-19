// models/BookReview.js
import mongoose from "mongoose";

const BookReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  googleBookId: { type: String, required: true },
  title: { type: String, required: true },
  bookLink: { type: String, required: true },
  author: { type: String },
  review: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("BookReview", BookReviewSchema);
