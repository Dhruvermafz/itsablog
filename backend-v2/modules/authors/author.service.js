import author from "../../models/author.js";

class AuthorService {
  // Create
  async createAuthor(data) {
    return await author.create(data);
  }

  // Get all (with search + pagination)
  async getAuthors({ search, page = 1, limit = 10 }) {
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [authors, total] = await Promise.all([
      author.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      author.countDocuments(query),
    ]);

    return {
      authors,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  // Get single
  async getAuthorById(id) {
    return await author.findById(id);
  }

  // Update
  async updateAuthor(id, data) {
    return await author.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // Delete
  async deleteAuthor(id) {
    return await author.findByIdAndDelete(id);
  }

  // Follow
  async followAuthor(id) {
    return await author.findByIdAndUpdate(
      id,
      { $inc: { followersCount: 1 } },
      { new: true },
    );
  }

  // Unfollow
  async unfollowAuthor(id) {
    return await author.findByIdAndUpdate(
      id,
      { $inc: { followersCount: -1 } },
      { new: true },
    );
  }
}

export default new AuthorService();
