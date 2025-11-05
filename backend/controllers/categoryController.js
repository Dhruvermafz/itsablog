const mongoose = require("mongoose");
const Category = require("../models/Category");
const slugify = require("slugify"); // Install: npm install slugify

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId; // From auth middleware

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ error: "Category name or slug already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || "",
      createdBy: userId,
    });

    return res.status(201).json(category);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const categories = await Category.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("name slug description")
      .lean();

    const count = await Category.countDocuments();

    return res.status(200).json({ data: categories, count });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug })
      .select("name slug description")
      .lean();

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = req.params.slug;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    return res.status(200).json(category);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const slug = req.params.slug;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if category is used by any posts
    const postCount = await Post.countDocuments({ category: slug });
    if (postCount > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete category used by posts" });
    }

    await category.deleteOne();

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
