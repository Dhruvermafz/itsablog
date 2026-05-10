// scripts/cleanupAuthors.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

import Author from "../models/author.js";
import Book from "../models/book.js";

dotenv.config();

// ========================================
// APIs
// ========================================

// OpenLibrary Author Search
const OPENLIBRARY_SEARCH = "https://openlibrary.org/search/authors.json";

const OPENLIBRARY_AUTHOR = "https://openlibrary.org";

// Wikipedia API
const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary/";

// ========================================
// HELPERS
// ========================================

function cleanText(text) {
  if (!text) return "";

  return text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function validImage(url) {
  if (!url) return false;

  return (
    url.startsWith("http") &&
    !url.includes("placeholder") &&
    !url.includes("default")
  );
}

// ========================================
// FETCH AUTHOR DATA
// ========================================

async function fetchAuthorMetadata(authorName) {
  try {
    // ========================================
    // OPENLIBRARY
    // ========================================

    const { data } = await axios.get(OPENLIBRARY_SEARCH, {
      params: {
        q: authorName,
      },
      timeout: 10000,
    });

    if (!data.docs || !data.docs.length) {
      return null;
    }

    const author = data.docs[0];

    let avatar = null;

    if (author.top_work || author.key) {
      avatar = `https://covers.openlibrary.org/a/olid/${author.key.replace(
        "/authors/",
        "",
      )}-L.jpg`;
    }

    // ========================================
    // WIKIPEDIA ENRICHMENT
    // ========================================

    let wikiBio = "";
    let wikiImage = "";

    try {
      const wikiRes = await axios.get(
        `${WIKI_API}${encodeURIComponent(author.name)}`,
        {
          timeout: 5000,
        },
      );

      wikiBio = wikiRes.data.extract || "";
      wikiImage = wikiRes.data.thumbnail?.source || "";
    } catch (err) {
      // ignore wiki failure
    }

    return {
      name: author.name,

      bio:
        cleanText(wikiBio) ||
        `Author known for ${author.top_work || "literary works"}.`,

      birthYear: author.birth_date ? parseInt(author.birth_date) : null,

      nationality: null,

      avatar: validImage(wikiImage) ? wikiImage : avatar,
    };
  } catch (err) {
    console.error(`❌ Failed fetching author metadata for ${authorName}`);

    return null;
  }
}

// ========================================
// MAIN
// ========================================

async function cleanupAuthors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const authors = await Author.find({});

    console.log(`👤 Found ${authors.length} authors`);

    const seen = new Set();

    for (const author of authors) {
      try {
        console.log(`\n🔎 Processing ${author.name}`);

        const normalized = author.name.trim().toLowerCase();

        // ========================================
        // DELETE DUPLICATES
        // ========================================

        if (seen.has(normalized)) {
          console.log("🗑 Duplicate author → deleting");

          await Author.findByIdAndDelete(author._id);

          continue;
        }

        seen.add(normalized);

        // ========================================
        // FETCH REAL METADATA
        // ========================================

        const metadata = await fetchAuthorMetadata(author.name);

        if (!metadata) {
          console.log("⚠ No metadata found, keeping minimal author");

          continue;
        }

        // ========================================
        // COUNT BOOKS
        // ========================================

        const booksCount = await Book.countDocuments({
          author: author._id,
        });

        // ========================================
        // UPDATE AUTHOR
        // ========================================

        await Author.findByIdAndUpdate(author._id, {
          name: metadata.name || author.name,

          bio: metadata.bio || author.bio,

          avatar: metadata.avatar || author.avatar,

          birthYear: metadata.birthYear || author.birthYear,

          nationality: metadata.nationality || author.nationality,

          booksCount,
        });

        console.log(`✅ Updated ${author.name}`);
      } catch (err) {
        console.error(`❌ Failed processing ${author.name}`);
      }
    }

    console.log("\n🎉 Author cleanup complete");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

cleanupAuthors();
