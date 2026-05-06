// ========================
// 🧹 TEXT CLEANING
// ========================

export function cleanText(text = "") {
  return text
    .replace(/<[^>]+>/g, "") // remove HTML tags
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

export function cleanTitle(title = "") {
  return cleanText(title)
    .replace(/[:\-–|].*$/, "") // remove subtitles (optional)
    .trim();
}

// ========================
// 📅 DATE / YEAR
// ========================

export function parseYear(date) {
  if (!date) return null;
  const year = parseInt(date.toString().slice(0, 4));
  return isNaN(year) ? null : year;
}

export function isRecent(year) {
  return year && year >= 2000;
}

// ========================
// 🏷 GENRES & CATEGORIES
// ========================

export function normalizeGenres(categories = []) {
  return categories.map((c) =>
    c
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-"),
  );
}

export function normalizeCategoryName(name = "") {
  return cleanText(name)
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}

// ========================
// ⭐ METADATA QUALITY SCORE
// ========================

export function getQualityScore(info) {
  let score = 0;

  if (info.title) score += 2;
  if (info.authors?.length) score += 2;
  if (info.description) score += 3;
  if (info.categories?.length) score += 1;
  if (info.imageLinks?.thumbnail) score += 1;
  if (info.pageCount) score += 1;

  return score; // max ~10
}

// ========================
// 🌍 LANGUAGE
// ========================

export function isSupportedLanguage(lang) {
  return ["en", "hi", "ru"].includes(lang);
}

// ========================
// 🌐 NATIONALITY DETECTION
// ========================

export function detectNationality(name = "") {
  const n = name.toLowerCase();

  if (
    /tagore|premchand|narayan|chetan bhagat|arundhati roy|amitav ghosh/.test(n)
  ) {
    return "Indian";
  }

  if (/tolstoy|dostoevsky|pushkin|gogol/.test(n)) {
    return "Russian";
  }

  if (/shakespeare|austen|dickens|orwell|rowling/.test(n)) {
    return "English";
  }

  return "Unknown";
}

// ========================
// 🔥 PRIORITY SYSTEM
// ========================

export function isPriorityAuthor(name = "") {
  const n = name.toLowerCase();

  return /tagore|premchand|narayan|tolstoy|dostoevsky|shakespeare|austen/.test(
    n,
  );
}

export function isIndianContent(info) {
  const title = info.title?.toLowerCase() || "";
  const author = info.authors?.[0]?.toLowerCase() || "";

  return (
    /india|hindi|bharat/.test(title) || /tagore|premchand|narayan/.test(author)
  );
}

// ========================
// 📊 SCORING (SMART INSERT)
// ========================

export function calculateScore(info) {
  let score = 0;

  const year = parseYear(info.publishedDate);

  // Metadata quality
  score += getQualityScore(info);

  // Recency boost
  if (isRecent(year)) score += 3;

  // Indian priority
  if (isIndianContent(info)) score += 3;

  // Known authors
  if (isPriorityAuthor(info.authors?.[0])) score += 2;

  return score;
}

// ========================
// 🎲 UTILS
// ========================

export function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ========================
// 🔑 ISBN HELPERS
// ========================

export function extractISBN(info) {
  const ids = info.industryIdentifiers || [];

  const isbn13 = ids.find((id) => id.type === "ISBN_13");
  const isbn10 = ids.find((id) => id.type === "ISBN_10");

  return isbn13?.identifier || isbn10?.identifier || null;
}
