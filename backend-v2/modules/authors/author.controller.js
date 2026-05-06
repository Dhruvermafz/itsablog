import authorService from "./author.service.js";

class AuthorController {
  async createAuthor(req, res) {
    try {
      const author = await authorService.createAuthor(req.body);
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAuthors(req, res) {
    try {
      const { search, page, limit } = req.query;

      const result = await authorService.getAuthors({
        search,
        page: Number(page),
        limit: Number(limit),
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getAuthor(req, res) {
    try {
      const author = await authorService.getAuthorById(req.params.id);

      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }

      res.json(author);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateAuthor(req, res) {
    try {
      const author = await authorService.updateAuthor(req.params.id, req.body);

      res.json(author);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async deleteAuthor(req, res) {
    try {
      await authorService.deleteAuthor(req.params.id);
      res.json({ message: "Author deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async followAuthor(req, res) {
    try {
      const author = await authorService.followAuthor(req.params.id);
      res.json(author);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async unfollowAuthor(req, res) {
    try {
      const author = await authorService.unfollowAuthor(req.params.id);
      res.json(author);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new AuthorController();
