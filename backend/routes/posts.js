const express = require("express");
const router = express.Router();
const postControllers = require("../controllers/postControllers");
const { verifyToken, optionallyVerifyToken } = require("../middleware/auth");

router.get("/", optionallyVerifyToken, postControllers.getPosts);
router.post("/", verifyToken, postControllers.createPost);

router.get("/:id", optionallyVerifyToken, postControllers.getPost);
router.patch("/:id", verifyToken, postControllers.updatePost);
router.delete("/:id", verifyToken, postControllers.deletePost);

router.post("/like/:id", verifyToken, postControllers.likePost);
router.delete("/like/:id", verifyToken, postControllers.unlikePost);
router.get(
  "/liked/:id",
  optionallyVerifyToken,
  postControllers.getUserLikedPosts
);
router.get("/like/:postId/users", postControllers.getUserLikes);

router.patch("/:id/report", postControllers.reportPost);
router.patch("/savePost/:id", postControllers.savePost);
router.patch("/unSavePost/:id", postControllers.unSavePost);
router.get("/getSavePosts", postControllers.getSavePost);

module.exports = router;
