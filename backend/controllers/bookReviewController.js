// controllers/bookReviewController.js
import BookReview from "../models/BookReview.js";
import { fetchBookFromGoogle } from "../util/googlebooks.js";
export const addBookReview = async (req, res) => {
  const { title, review, rating } = req.body;
  const userId = req.user?._id;

  if (!userId || !title || !review || !rating)
    return res.status(400).json({ error: "All fields required" });

  const bookData = await fetchBookFromGoogle(title);
  if (!bookData)
    return res.status(404).json({ error: "Book not found on Google Books" });

  const existingReview = await BookReview.findOne({
    user: userId,
    googleBookId: bookData.googleBookId,
  });
  if (existingReview)
    return res.status(400).json({ error: "You already reviewed this book" });

  const newReview = new BookReview({
    user: userId,
    googleBookId: bookData.googleBookId,
    title: bookData.title,
    bookLink: bookData.bookLink,
    author: bookData.author,
    review,
    rating,
  });

  await newReview.save();
  res.status(201).json(newReview);
};

export const getBookReviews = async (req, res) => {
  const reviews = await BookReview.find()
    .populate("user", "username")
    .sort({ createdAt: -1 });
  res.status(200).json(reviews);
};

export const getUserReviews = async (req, res) => {
  const userId = req.params.userId;
  const reviews = await BookReview.find({ user: userId }).sort({
    createdAt: -1,
  });
  res.status(200).json(reviews);
};
