import bookService from "./book.service.js";
class BookController {
  async createBook(req, res, next) {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json({ success: true, data: book });
    } catch (err) {
      next(err);
    }
  }

  async getBooks(req, res, next) {
    try {
      const result = await bookService.getBooks(req.query);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async getBook(req, res, next) {
    try {
      const book = await bookService.getBookById(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json({ success: true, data: book });
    } catch (err) {
      next(err);
    }
  }

  async updateBook(req, res, next) {
    try {
      const book = await bookService.updateBook(req.params.id, req.body);
      res.json({ success: true, data: book });
    } catch (err) {
      next(err);
    }
  }

  async deleteBook(req, res, next) {
    try {
      await bookService.deleteBook(req.params.id);
      res.json({ success: true, message: "Book deleted" });
    } catch (err) {
      next(err);
    }
  }

  // Categories
  async addCategories(req, res, next) {
    try {
      const { categoryIds } = req.body;
      const result = await bookService.addCategoriesToBook(
        req.params.id,
        categoryIds,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getBooksByCategory(req, res, next) {
    try {
      const result = await bookService.getBooksByCategory(
        req.params.slug,
        req.query,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // Reviews
  async createReview(req, res, next) {
    try {
      const review = await bookService.createReview(req.user.id, {
        book: req.params.bookId,
        ...req.body,
      });
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }

  async getBookReviews(req, res, next) {
    try {
      const reviews = await bookService.getBookReviews(
        req.params.bookId,
        req.query,
      );
      res.json({ success: true, data: reviews });
    } catch (err) {
      next(err);
    }
  }

  // Bookmark
  async toggleBookmark(req, res, next) {
    try {
      const result = await bookService.toggleBookmark(
        req.user.id,
        req.params.id,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
  async createReview(req, res, next) {
    try {
      const review = await bookService.createReview(req.user.id, {
        book: req.params.bookId,
        ...req.body,
      });
      res.status(201).json({ success: true, data: review });
    } catch (err) {
      next(err);
    }
  }

  async getBookReviews(req, res, next) {
    try {
      const reviews = await bookService.getBookReviews(
        req.params.bookId,
        req.query,
      );
      res.json({ success: true, data: reviews });
    } catch (err) {
      next(err);
    }
  }

  async toggleReviewLike(req, res, next) {
    try {
      const result = await bookService.toggleReviewLike(
        req.params.reviewId,
        req.user.id,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async addReviewComment(req, res, next) {
    try {
      const comment = await bookService.addReviewComment(
        req.params.reviewId,
        req.user.id,
        req.body.content,
        req.body.parent,
      );
      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  }
}

export default new BookController();
