import express from "express";
import clubController from "./club.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// ====================== PUBLIC ROUTES ======================

// Get all clubs (public)
router.get("/", clubController.getClubs);

// ====================== PROTECTED ROUTES ======================
// Everything below this line requires authentication
router.use(protect);

// Club feed (FIXED: now req.user exists)
router.get("/feed", clubController.getFeed);

// Following clubs (FIXED: now req.user exists)
router.get("/following", clubController.getFollowingClubs);

// Create club
router.post("/", clubController.createClub);

// Join club
router.post("/:id/join", clubController.joinClub);

// Check membership
router.get("/:id/membership", clubController.checkMembership);

// Get single club (keep AFTER static routes like /feed, /following)
router.get("/:id", clubController.getClub);

// ====================== CLUB POSTS ======================

// Create post in club
router.post("/:clubId/posts", clubController.createPost);

// Get club posts
router.get("/:clubId/posts", clubController.getClubPosts);

// Get single post
router.get("/posts/:postId", clubController.getPost);

// ====================== POST INTERACTIONS ======================

// Like / unlike post
router.post("/posts/:postId/like", clubController.toggleLike);

// Comments
router.post("/posts/:postId/comments", clubController.createComment);
router.get("/posts/:postId/comments", clubController.getPostComments);

// Edit comment
router.put("/posts/comments/:commentId", clubController.editComment);

// Delete comment
router.delete("/posts/comments/:commentId", clubController.deleteComment);

export default router;
