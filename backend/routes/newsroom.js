const express = require("express");
const router = express.Router();
const NewsroomController = require("../controllers/newsroomController");

// Newsroom routes
router.post("/newsroom", NewsroomController.createAnnouncement);
router.get("/newsroom", NewsroomController.getAnnouncements);
router.get("/newsroom/:announcementId", NewsroomController.getAnnouncement);
router.post(
  "/newsroom/:announcementId/posts",
  NewsroomController.createPostForAnnouncement
);

module.exports = router;
