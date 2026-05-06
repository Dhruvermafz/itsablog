import author from "../models/author.js";
import book from "../models/book.js";
import bookCategory from "../models/bookCategory.js";
import bookCategoryMap from "../models/bookCategoryMap.js";
import slugify from "slugify";

// 🔧 helpers (ensure these exist)
import {
  cleanText,
  cleanTitle,
  parseYear,
  normalizeGenres,
  getQualityScore,
  detectNationality,
} from "../utils/helpers.js";

export async function normalizeAndInsert(info) {
  // ❌ Reject bad data
  if (!info.title || !info.authors || !info.description) return null;

  // 🌍 Language filter
  if (!["en", "hi", "ru"].includes(info.language)) return null;

  // ⭐ Quality filter
  if (getQualityScore(info) < 6) return null;

  // ========================
  // 👤 AUTHOR (lowercase safe)
  // ========================
  const rawAuthorName = cleanText(info.authors[0]);
  const normalizedAuthorName = rawAuthorName.toLowerCase();

  let existingAuthor = await author.findOne({
    name: new RegExp(`^${normalizedAuthorName}$`, "i"),
  });

  if (!existingAuthor) {
    existingAuthor = await author.create({
      name: rawAuthorName, // keep original casing for UI
      bio: cleanText(info.description).slice(0, 500),
      nationality: detectNationality(rawAuthorName),
    });
  }

  // ========================
  // 📚 BOOK DUPLICATE CHECK
  // ========================
  const isbn = info.industryIdentifiers?.[0]?.identifier || null;

  let existingBook = null;

  if (isbn) {
    existingBook = await book.findOne({ isbn });
  } else {
    existingBook = await book.findOne({
      title: new RegExp(`^${cleanTitle(info.title)}$`, "i"),
      author: existingAuthor._id,
    });
  }

  if (existingBook) return null;

  // ========================
  // 📖 CREATE BOOK
  // ========================
  const createdBook = await book.create({
    title: cleanTitle(info.title),
    author: existingAuthor._id,
    synopsis: cleanText(info.description),
    coverUrl: info.imageLinks?.thumbnail,
    year: parseYear(info.publishedDate),
    pages: info.pageCount,
    isbn,
    genres: normalizeGenres(info.categories),
  });

  // ========================
  // 📊 UPDATE AUTHOR
  // ========================
  await author.findByIdAndUpdate(existingAuthor._id, {
    $inc: { booksCount: 1 },
  });

  // ========================
  // 🏷 CATEGORY MAPPING
  // ========================
  if (info.categories?.length) {
    for (const cat of info.categories) {
      const name = cat.trim();
      const slug = slugify(name.toLowerCase(), { lower: true });

      let category = await bookCategory.findOne({ slug });

      if (!category) {
        category = await bookCategory.create({
          name,
          slug,
          description: name,
          icon: "📚",
          color: "from-indigo-500 to-purple-500",
        });
      }

      await bookCategoryMap.updateOne(
        { book: createdBook._id, category: category._id },
        {},
        { upsert: true },
      );
    }
  }

  return createdBook;
}
