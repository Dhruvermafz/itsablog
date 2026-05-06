import express from "express";
import authController from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route
router.get("/me", protect, authController.getMe);

export default router;
