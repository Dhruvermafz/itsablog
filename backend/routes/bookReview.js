// routes/bookReviewRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const {
  addBookReview,
  getBookReviews,
  getUserReviews,
} = require("../controllers/bookReviewController");

const router = express.Router();

router.post("/", auth, addBookReview);
router.get("/", getBookReviews);
router.get("/user/:userId", getUserReviews);

export default router;
