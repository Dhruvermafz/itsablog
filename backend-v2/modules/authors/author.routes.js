import express from "express";
import authorController from "./author.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", authorController.getAuthors);
router.get("/:id", authorController.getAuthor);

// Protected
router.use(protect);

router.post("/", authorController.createAuthor);
router.put("/:id", authorController.updateAuthor);
router.delete("/:id", authorController.deleteAuthor);

// Follow system
router.post("/:id/follow", authorController.followAuthor);
router.delete("/:id/follow", authorController.unfollowAuthor);

export default router;
