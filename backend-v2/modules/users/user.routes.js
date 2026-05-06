import express from "express";
import userController from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/profile/:username", userController.getProfile);
router.get("/:userId/followers", userController.getFollowers);
router.get("/:userId/following", userController.getFollowing);

// Protected routes
router.use(protect);

router.put("/profile", userController.updateProfile);

// Follow System
router.post("/:userId/follow", userController.follow);
router.delete("/:userId/follow", userController.unfollow);

// Reading Progress
router.post("/reading-log/:bookId", userController.upsertReadingLog);
router.get("/reading-logs", userController.getReadingLogs);

router.post("/reading-log/:logId/entries", userController.addLogEntry);
router.get("/reading-log/:logId/entries", userController.getLogEntries);

export default router;
