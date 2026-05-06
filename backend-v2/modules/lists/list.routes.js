import express from "express";
import listController from "./list.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", listController.getLists);
router.get("/:id", listController.getList);
router.get("/:id/items", listController.getListItems);

// Protected routes
router.use(protect);

router.post("/", listController.createList);
router.put("/:id", listController.updateList);
router.delete("/:id", listController.deleteList);

router.post("/:listId/items", listController.addItem);
router.delete("/:listId/items/:bookId", listController.removeItem);

router.post("/:listId/like", listController.toggleLike);

// Get user's lists
router.get("/user/me", listController.getUserLists);
router.get("/user/:userId", listController.getUserLists);

export default router;
