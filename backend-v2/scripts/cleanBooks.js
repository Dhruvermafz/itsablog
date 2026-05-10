// scripts/cleanupBooks.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

import Book from "../models/book.js";
import Author from "../models/author.js";

dotenv.config();

// ==============================
// CONFIG
// ==============================

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// Optional:
// Add OPENLIBRARY fallback for covers
const OPENLIBRARY_COVER = (isbn) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

// ==============================
// HELPERS
// ==============================

function normalizeISBN(isbn) {
  return isbn?.replace(/[^0-9X]/gi, "").trim();
}

function isValidImage(url) {
  if (!url) return false;

  return (
    url.startsWith("http") &&
    !url.includes("placeholder") &&
    !url.includes("nophoto")
  );
}

async function fetchBookMetadata(isbn) {
  try {
    const { data } = await axios.get(`${GOOGLE_BOOKS_API}?q=isbn:${isbn}`, {
      timeout: 10000,
    });

    if (!data.items || !data.items.length) {
      return null;
    }

    const volume = data.items[0].volumeInfo;

    return {
      title: volume.title,
      synopsis: volume.description,
      pages: volume.pageCount,
      year: volume.publishedDate
        ? parseInt(volume.publishedDate.slice(0, 4))
        : undefined,

      genres: volume.categories || [],

      coverUrl:
        volume.imageLinks?.extraLarge ||
        volume.imageLinks?.large ||
        volume.imageLinks?.medium ||
        volume.imageLinks?.thumbnail ||
        OPENLIBRARY_COVER(isbn),

      authorName: volume.authors?.[0] || null,
    };
  } catch (err) {
    console.error(`❌ Metadata fetch failed for ISBN ${isbn}`);
    return null;
  }
}

async function getOrCreateAuthor(authorName) {
  if (!authorName) return null;

  let author = await Author.findOne({
    name: new RegExp(`^${authorName}$`, "i"),
  });

  if (!author) {
    author = await Author.create({
      name: authorName,
    });

    console.log(`👤 Created author: ${authorName}`);
  }

  return author._id;
}

// ==============================
// MAIN CLEANUP
// ==============================

async function cleanupBooks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const books = await Book.find({});

    console.log(`📚 Found ${books.length} books`);

    const seenISBNs = new Set();

    for (const book of books) {
      try {
        console.log(`\n🔎 Processing: ${book.title}`);

        // ==============================
        // DELETE IF NO ISBN
        // ==============================

        if (!book.isbn) {
          console.log("🗑 No ISBN → deleting");

          await Book.findByIdAndDelete(book._id);

          continue;
        }

        const isbn = normalizeISBN(book.isbn);

        // ==============================
        // DELETE DUPLICATES
        // ==============================

        if (seenISBNs.has(isbn)) {
          console.log("🗑 Duplicate ISBN → deleting");

          await Book.findByIdAndDelete(book._id);

          continue;
        }

        seenISBNs.add(isbn);

        // ==============================
        // FETCH REAL METADATA
        // ==============================

        const metadata = await fetchBookMetadata(isbn);

        if (!metadata) {
          console.log("🗑 Metadata not found → deleting");

          await Book.findByIdAndDelete(book._id);

          continue;
        }

        // ==============================
        // AUTHOR
        // ==============================

        let authorId = book.author;

        if (metadata.authorName) {
          const createdAuthor = await getOrCreateAuthor(metadata.authorName);

          if (createdAuthor) {
            authorId = createdAuthor;
          }
        }

        // ==============================
        // CLEAN IMAGE
        // ==============================

        let finalCover = metadata.coverUrl;

        if (!isValidImage(finalCover)) {
          finalCover = OPENLIBRARY_COVER(isbn);
        }

        // ==============================
        // UPDATE BOOK
        // ==============================

        await Book.findByIdAndUpdate(book._id, {
          title: metadata.title || book.title,
          synopsis: metadata.synopsis || "",
          pages: metadata.pages || 0,
          year: metadata.year || null,
          genres: metadata.genres || [],
          coverUrl: finalCover,
          author: authorId,
          isbn,
        });

        console.log(`✅ Updated: ${metadata.title}`);
      } catch (err) {
        console.error(`❌ Failed processing ${book.title}`);
      }
    }

    console.log("\n🎉 Cleanup complete");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanupBooks();
