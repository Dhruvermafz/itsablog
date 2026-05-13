import author from "../models/author.js";
import book from "../models/book.js";
import bookCategory from "../models/bookCategory.js";
import bookCategoryMap from "../models/bookCategoryMap.js";
import slugify from "slugify";

import {
  cleanText,
  cleanTitle,
  parseYear,
  normalizeGenres,
  detectNationality,
} from "../utils/helpers.js";

export async function normalizeAndInsert(info) {
  if (!info.title?.trim()) return null;
  if (!info.authors?.length) return null;

  const description =
    info.description || `${info.title} by ${info.authors[0]}.`;

  // ========================
  // AUTHOR
  // ========================
  const rawAuthorName = cleanText(info.authors[0]);

  let existingAuthor = await author.findOne({
    name: new RegExp(`^${rawAuthorName}$`, "i"),
  });

  if (!existingAuthor) {
    existingAuthor = await author.create({
      name: rawAuthorName,
      bio: description.slice(0, 500),
      nationality: detectNationality(rawAuthorName),
    });
  }

  // ========================
  // DUPLICATE CHECK (Improved)
  // ========================
  const existingBook = await book.findOne({
    title: new RegExp(`^${cleanTitle(info.title)}$`, "i"),
    author: existingAuthor._id,
  });

  if (existingBook) return null;

  // ========================
  // CREATE BOOK
  // ========================
  const bookData = {
    title: cleanTitle(info.title),
    author: existingAuthor._id,
    synopsis: cleanText(description),
    coverUrl: info.image,
    year: parseYear(info.publishedDate),
    pages: info.pageCount,
    genres: normalizeGenres(info.categories || []),
  };

  // Only add isbn if it actually exists
  if (info.isbn) {
    bookData.isbn = info.isbn;
  }

  const createdBook = await book.create(bookData);

  // Update author stats
  await author.findByIdAndUpdate(existingAuthor._id, {
    $inc: { booksCount: 1 },
  });

  // ========================
  // CATEGORIES
  // ========================
  if (info.categories?.length) {
    for (const cat of info.categories) {
      const name = cat.trim();
      if (!name) continue;

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

  console.log(`✅ Inserted: ${info.title}`);
  return createdBook;
}
