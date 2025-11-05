// routes/group.js
const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/groupController");
const authMiddleware = require("../middleware/auth"); // Assuming you have auth middleware

router.get("/groups", GroupController.getAllGroups);
router.get("/groups/search", GroupController.searchGroups);
router.post("/groups", GroupController.createGroup);
router.post("/groups/:groupId/join", GroupController.joinGroup);
router.post(
  "/groups/:groupId/posts",

  GroupController.createPostInGroup
);
router.get("/groups/:groupId", GroupController.getGroup);
router.get("/groups/popular", GroupController.getPopularGroups);
router.get("/groups/my-groups", GroupController.getMyGroups);

module.exports = router;
