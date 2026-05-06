import express from "express";
import bookController from "./book.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", bookController.getBooks);
router.get("/:id", bookController.getBook);
router.get("/category/:slug", bookController.getBooksByCategory);

// Protected routes
router.use(protect);

router.post("/", bookController.createBook);
router.put("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

router.post("/:id/categories", bookController.addCategories);

// Reviews
router.post("/:bookId/reviews", bookController.createReview);
router.get("/:bookId/reviews", bookController.getBookReviews);

// Bookmark
router.post("/:id/bookmark", bookController.toggleBookmark);
// Reviews
router.post("/:bookId/reviews", protect, bookController.createReview);
router.get("/:bookId/reviews", bookController.getBookReviews);

router.post(
  "/reviews/:reviewId/like",
  protect,
  bookController.toggleReviewLike,
);
router.post(
  "/reviews/:reviewId/comments",
  protect,
  bookController.addReviewComment,
);
export default router;
