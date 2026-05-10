// services/search.service.js
import book from "../../models/book.js";
import author from "../../models/author.js";
import club from "../../models/club.js";
import list from "../../models/lists.js";
import user from "../../models/user.js";

const searchAll = async (query, options = {}) => {
  const { limit = 10, page = 1, type } = options;
  const skip = (page - 1) * limit;
  const searchRegex = new RegExp(query, "i");

  const results = {
    books: [],
    authors: [],
    clubs: [],
    lists: [],
    users: [],
    total: 0,
  };

  try {
    // If specific type is requested
    if (type) {
      return await searchByType(type, query, limit, skip);
    }

    // Search across all collections in parallel
    const [books, authors, clubs, lists, users] = await Promise.all([
      // Books
      book
        .find({
          $or: [
            { title: searchRegex },
            { synopsis: searchRegex },
            { isbn: searchRegex },
          ],
        })
        .populate("author", "name avatar")
        .select("title author coverUrl avgRating ratingsCount year genres")
        .limit(limit)
        .skip(skip)
        .lean(),

      // Authors
      author
        .find({
          $or: [{ name: searchRegex }, { bio: searchRegex }],
        })
        .select("name avatar bio nationality booksCount")
        .limit(limit)
        .skip(skip)
        .lean(),

      // Clubs
      club
        .find({
          $or: [{ name: searchRegex }, { description: searchRegex }],
        })
        .select("name description coverImage memberCount category")
        .limit(limit)
        .skip(skip)
        .lean(),

      // Lists
      list
        .find({
          $or: [{ title: searchRegex }, { description: searchRegex }],
          isPublic: true,
        })
        .populate("user", "username avatar")
        .select("title description user likesCount itemsCount")
        .limit(limit)
        .skip(skip)
        .lean(),

      // Users
      user
        .find({
          $or: [{ username: searchRegex }, { bio: searchRegex }],
        })
        .select("username avatar bio followersCount reviewsCount")
        .limit(limit)
        .skip(skip)
        .lean(),
    ]);

    results.books = books;
    results.authors = authors;
    results.clubs = clubs;
    results.lists = lists;
    results.users = users;

    results.total =
      books.length +
      authors.length +
      clubs.length +
      lists.length +
      users.length;

    return results;
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Search failed");
  }
};

// Helper for type-specific search
const searchByType = async (type, query, limit, skip) => {
  const searchRegex = new RegExp(query, "i");

  switch (type.toLowerCase()) {
    case "book":
    case "books":
      return book
        .find({
          $or: [{ title: searchRegex }, { synopsis: searchRegex }],
        })
        .populate("author", "name")
        .select("title author coverUrl avgRating")
        .limit(limit)
        .skip(skip)
        .lean();

    case "author":
    case "authors":
      return author
        .find({ name: searchRegex })
        .select("name avatar bio")
        .lean();

    case "club":
    case "clubs":
      return club
        .find({ name: searchRegex })
        .select("name description memberCount")
        .lean();

    case "list":
    case "lists":
      return list
        .find({ title: searchRegex, isPublic: true })
        .populate("user", "username")
        .select("title user likesCount")
        .lean();

    case "user":
    case "users":
      return user
        .find({ username: searchRegex })
        .select("username avatar bio")
        .lean();

    default:
      return [];
  }
};

export default { searchAll };
