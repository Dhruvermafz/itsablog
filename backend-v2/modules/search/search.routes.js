// routes/search.routes.js
import express from "express";
import { globalSearch } from "./search.controller.js";

const router = express.Router();

// GET /api/search?q=harry&limit=10&type=book
router.get("/", globalSearch);

export default router;
