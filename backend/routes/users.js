const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { check } = require("express-validator");
const { verifyToken } = require("../middleware/auth");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/random", userControllers.getRandomUsers);
router.get("/all", userControllers.getAllUsers);
router.get("/:username", userControllers.getUser);
router.patch("/:id", verifyToken, userControllers.updateUser);
router.post("/follow/:id", verifyToken, userControllers.follow);
router.delete("/unfollow/:id", verifyToken, userControllers.unfollow);
router.get("/followers/:id", userControllers.getFollowers);
router.get("/following/:id", userControllers.getFollowing);
router.post("/request-writer", verifyToken, userControllers.requestWriterRole);
router.post(
  "/handle-writer-request",
  verifyToken,
  userControllers.handleWriterRoleRequest
);
router.get("/profile/:username", userControllers.getProfile);
router.delete("/delete/:id", verifyToken, userControllers.deleteUser);
router.post("/logout", verifyToken, userControllers.logout);

module.exports = router;
