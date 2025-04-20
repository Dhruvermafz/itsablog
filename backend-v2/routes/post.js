const express = require("express");
const router = express.Router();
const { createPost, getPosts } = require("../controllers/postController");
const auth = require("../middleware/auth");

router.post("/", auth(["Writer", "Admin"]), createPost);
router.get("/", getPosts);

module.exports = router;
