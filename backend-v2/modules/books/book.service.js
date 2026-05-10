import Book from "../../models/book.js";
import BookCategory from "../../models/bookCategory.js";
import BookCategoryMap from "../../models/bookCategoryMap.js";
import Bookmark from "../../models/bookmark.js";
import Author from "../../models/author.js"; // also works
// Review Models
import BookReview from "../../models/review.js";
import ReviewLike from "../../models/reviewLike.js";
import ReviewComment from "../../models/reviewComment.js";

class BookService {
  // ====================== Book CRUD ======================

  async createBook(bookData) {
    return await Book.create(bookData);
  }

  async getBooks({
    page = 1,
    limit = 20,
    genre,
    year,
    search,
    sort = "-createdAt",
  }) {
    const query = {};

    if (genre) query.genres = genre;
    if (year) query.year = year;

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .populate("author", "name avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Book.countDocuments(query);

    return {
      books,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async getBookById(id) {
    return await Book.findById(id).populate("author", "name bio avatar").lean();
  }

  async updateBook(id, updateData) {
    return await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteBook(id) {
    await Promise.all([
      BookReview.deleteMany({ book: id }),
      BookCategoryMap.deleteMany({ book: id }),
      Bookmark.deleteMany({ entityId: id, entityType: "book" }),
    ]);

    return await Book.findByIdAndDelete(id);
  }

  // ====================== Categories ======================

  async addCategoriesToBook(bookId, categoryIds) {
    const maps = categoryIds.map((catId) => ({
      book: bookId,
      category: catId,
    }));

    await BookCategoryMap.insertMany(maps, { ordered: false }); // 🔥 avoids crash on duplicates

    return { message: "Categories added successfully" };
  }

  async getBooksByCategory(slug, { page = 1, limit = 20 }) {
    const category = await BookCategory.findOne({ slug });

    if (!category) throw new Error("Category not found");

    const skip = (page - 1) * limit;

    const maps = await BookCategoryMap.find({
      category: category._id,
    })
      .populate({
        path: "book",
        populate: { path: "author", select: "name avatar" },
      })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      category,
      books: maps.map((m) => m.book),
      pagination: { page, limit },
    };
  }

  // ====================== Bookmarks ======================

  async toggleBookmark(userId, entityId, entityType = "book") {
    const existing = await Bookmark.findOne({
      user: userId,
      entityId,
      entityType,
    });

    if (existing) {
      await existing.deleteOne();
      return { bookmarked: false };
    }

    await Bookmark.create({ user: userId, entityId, entityType });
    return { bookmarked: true };
  }

  // ====================== REVIEWS ======================

  async createReview(userId, reviewData) {
    const newReview = await BookReview.create({
      user: userId,
      ...reviewData,
    });

    await this.updateBookRatings(reviewData.book);

    return await newReview.populate("user", "username avatar");
  }

  async updateBookRatings(bookId) {
    const stats = await BookReview.aggregate([
      { $match: { book: bookId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          ratingsCount: { $sum: 1 },
        },
      },
    ]);

    await Book.findByIdAndUpdate(bookId, {
      avgRating: stats[0]?.avgRating
        ? Number(stats[0].avgRating.toFixed(2))
        : 0,
      ratingsCount: stats[0]?.ratingsCount || 0,
      reviewsCount: await BookReview.countDocuments({ book: bookId }),
    });
  }

  async getBookReviews(bookId, { page = 1, limit = 10, sort = "-createdAt" }) {
    const skip = (page - 1) * limit;

    return await BookReview.find({ book: bookId })
      .populate("user", "username avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async toggleReviewLike(reviewId, userId) {
    const existing = await ReviewLike.findOne({
      review: reviewId,
      user: userId,
    });

    if (existing) {
      await existing.deleteOne();
      await BookReview.findByIdAndUpdate(reviewId, {
        $inc: { likesCount: -1 },
      });
      return { liked: false };
    }

    await ReviewLike.create({ review: reviewId, user: userId });

    await BookReview.findByIdAndUpdate(reviewId, {
      $inc: { likesCount: 1 },
    });

    return { liked: true };
  }
  async getBooksByAuthor(authorId, { page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const query = {
      author: authorId,
    };

    const [books, total] = await Promise.all([
      Book.find(query)
        .populate("author", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Book.countDocuments(query),
    ]);

    return {
      books,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }
  async addReviewComment(reviewId, userId, content, parentId = null) {
    const comment = await ReviewComment.create({
      review: reviewId,
      user: userId,
      content,
      parent: parentId,
    });

    await BookReview.findByIdAndUpdate(reviewId, {
      $inc: { commentsCount: 1 },
    });

    return await comment.populate("user", "username avatar");
  }
}

export default new BookService();
