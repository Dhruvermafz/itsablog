// controllers/search.controller.js
import searchService from "./search.service.js";

export const globalSearch = async (req, res) => {
  try {
    const { q, limit = 10, page = 1, type } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const results = await searchService.searchAll(q.trim(), {
      limit: parseInt(limit),
      page: parseInt(page),
      type,
    });

    res.json({
      success: true,
      query: q,
      ...results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error during search",
    });
  }
};
