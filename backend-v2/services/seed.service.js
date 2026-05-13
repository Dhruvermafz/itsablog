import axios from "axios";
import { normalizeAndInsert } from "./normalise.service.js";

// ======================================================
// CONFIG
// ======================================================

const MAX_INSERTS = 500;
const OPENLIBRARY_LIMIT = 40;
const seenBooks = new Set();

// ======================================================
// QUERY GROUPS
// ======================================================

// QUERY GROUPS
// ======================================================

const QUERY_GROUPS = [
  {
    name: "HINDU_SCRIPTURES_AND_DHARMA",
    weight: 3,
    queries: [
      // Core Scriptures
      "Bhagavad Gita",
      "Mahabharata",
      "Ramayana",
      "Valmiki Ramayana",
      "Ramcharitmanas",
      "Vedas",
      "Rigveda",
      "Samaveda",
      "Yajurveda",
      "Atharvaveda",
      "Upanishads",
      "Puranas",
      "Shiva Purana",
      "Vishnu Purana",
      "Bhagavata Purana",
      "Markandeya Purana",
      "Devi Bhagavatam",

      // Philosophy & Darshan
      "Vedanta philosophy",
      "Advaita Vedanta",
      "Dvaita philosophy",
      "Kashmir Shaivism",
      "Samkhya philosophy",
      "Yoga Sutras of Patanjali",
      "Nyaya philosophy",
      "Mimamsa philosophy",
      "Chanakya Arthashastra",
      "Manusmriti",

      // Saints & Spiritual Thinkers
      "Swami Vivekananda",
      "Adi Shankaracharya",
      "Ramakrishna Paramahamsa",
      "Sri Aurobindo",
      "Ramana Maharshi",
      "Paramahansa Yogananda",
      "Jiddu Krishnamurti",
      "Sadhguru books",
      "A. C. Bhaktivedanta Swami",
      "Dayananda Saraswati",

      // Bhakti & Devotional
      "Hanuman Chalisa",
      "Shiv Tandav Stotram",
      "Bhaja Govindam",
      "Vishnu Sahasranamam",
      "Durga Saptashati",
      "Ashtavakra Gita",
      "Avadhuta Gita",
      "Narada Bhakti Sutra",

      // Hindu History & Civilization
      "Sita Ram Goel",
      "Ram Swarup",
      "Koenraad Elst",
      "Sanjeev Sanyal",
      "Meenakshi Jain",
      "Hindu civilization books",
      "history of Hindu temples",
      "Indic civilization",
      "ancient Bharat history",
      "decolonized Indian history",

      // Mythology & Retellings
      "Amish Tripathi Shiva Trilogy",
      "Devdutt Pattanaik mythology",
      "Anand Neelakantan",
      "Ashok K. Banker",
      "Mahabharata retellings",
      "Ramayana retellings",

      // Tantra / Esoteric
      "Tantra books",
      "Aghora books",
      "Kularnava Tantra",
      "Vijnana Bhairava Tantra",
      "Shakta philosophy",
      "Sri Vidya",

      // Discovery Queries
      "best Hindu philosophy books",
      "books on Sanatan Dharma",
      "Hindu spiritual classics",
      "Indian metaphysics",
      "books about moksha",
      "books on karma and dharma",
      "Hindu cosmology",
      "ancient Indian wisdom",
      "Vedantic literature",
      "books banned on Hindu history",
      "Hindu warrior history",
      "Hindu scriptures explained",
    ],
  },
];
// ======================================================
// HELPERS
// ======================================================

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasPreferredLanguage(info) {
  const langs = info.language || [];
  if (!langs.length) return true;
  return langs.some((lang) => {
    const l = String(lang).toLowerCase().trim();
    return ["eng", "en", "hin", "hi", "english", "hindi"].includes(l);
  });
}

function isValidBook(info) {
  if (!info.title?.trim()) return false;

  const text =
    `${info.title} ${info.subtitle || ""} ${(info.categories || []).join(" ")}`.toLowerCase();

  const bannedKeywords = [
    "study guide",
    "summary",
    "analysis",
    "thesis",
    "question bank",
    "ugc net",
    "mcq",
    "exam preparation",
    "solution manual",
    "textbook",
    "sparknotes",
    "cliffsnotes",
  ];

  return !bannedKeywords.some((word) => text.includes(word));
}

function isDuplicate(info) {
  if (!info.title) return true;
  const key = `${info.title}|${(info.authors || []).join(",")}`
    .toLowerCase()
    .trim();
  if (seenBooks.has(key)) return true;
  seenBooks.add(key);
  return false;
}

// ======================================================
// TRANSFORM
// ======================================================

function transformOpenLibraryBook(book) {
  return {
    title: book.title || null,
    subtitle: book.subtitle || null,
    authors: book.author_name || [],
    publishedDate: book.first_publish_year
      ? String(book.first_publish_year)
      : null,
    description: null,
    categories: book.subject ? book.subject.slice(0, 10) : [],
    image: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : null,
    language: book.language || [],
    pageCount: book.number_of_pages_median || null,
  };
}

// ======================================================
// FETCH
// ======================================================

async function fetchOpenLibraryBooks(query) {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${OPENLIBRARY_LIMIT}`;
    const res = await axios.get(url, { timeout: 15000 });
    return res.data.docs || [];
  } catch (err) {
    console.log(`❌ OpenLibrary failed: ${query}`);
    return [];
  }
}

// ======================================================
// INSERT BATCH (Improved with error visibility)
// ======================================================

async function insertBatch(batch) {
  if (batch.length === 0) return 0;

  let success = 0;

  for (const book of batch) {
    try {
      const result = await normalizeAndInsert(book);
      if (result) success++;
    } catch (err) {
      console.error(`❌ Failed to insert "${book.title}":`, err.message);
    }
  }

  console.log(`📚 Batch inserted: ${success}/${batch.length}`);
  return success;
}

// ======================================================
// MAIN
// ======================================================

export async function runDailySeed() {
  let inserted = 0;
  const queries = shuffle(QUERY_GROUPS.flatMap((g) => g.queries));

  console.log(`🚀 Starting Seeder with ${queries.length} queries\n`);

  for (const query of queries) {
    if (inserted >= MAX_INSERTS) break;

    console.log(`🔍 Searching: ${query}`);
    await sleep(800);

    const rawBooks = await fetchOpenLibraryBooks(query);
    const batch = [];

    for (const rawBook of rawBooks) {
      if (inserted >= MAX_INSERTS) break;

      const info = transformOpenLibraryBook(rawBook);

      if (
        !isValidBook(info) ||
        !hasPreferredLanguage(info) ||
        isDuplicate(info)
      ) {
        continue;
      }

      batch.push(info);

      if (batch.length >= 20) {
        const count = await insertBatch(batch);
        inserted += count;
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      const count = await insertBatch(batch);
      inserted += count;
    }
  }

  console.log(`\n🎯 Seeding complete. Total inserted: ${inserted}`);
}
