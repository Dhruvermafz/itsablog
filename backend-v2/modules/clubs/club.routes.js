import express from "express";
import clubController from "./club.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", clubController.getClubs);
router.get("/:id", clubController.getClub);

// Protected
router.use(protect);

router.post("/", clubController.createClub);
router.post("/:id/join", clubController.joinClub);
router.get("/:id/membership", clubController.checkMembership);
// Club Posts
router.post("/:clubId/posts", clubController.createPost);
router.get("/:clubId/posts", clubController.getClubPosts);
router.get("/posts/:postId", clubController.getPost);
// Post Interactions
router.post("/posts/:postId/like", clubController.toggleLike);
router.post("/posts/:postId/comments", clubController.createComment);
router.get("/posts/:postId/comments", clubController.getPostComments);

export default router;
