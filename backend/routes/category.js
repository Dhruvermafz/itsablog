const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const adminMiddleware = require("../middleware/admin");

router.post("/", adminMiddleware, createCategory);
router.get("/", getCategories); // Public access
router.get("/:slug", getCategory); // Public access
router.put("/:slug", adminMiddleware, updateCategory);
router.delete("/:slug", adminMiddleware, deleteCategory);

module.exports = router;
