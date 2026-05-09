import axios from "axios";
import { normalizeAndInsert } from "./normalise.service.js";

const QUERY_GROUPS = [
  {
    name: "TRENDING_FICTION",
    weight: 6,
    queries: [
      "2025 bestselling fiction books",
      "new fiction releases 2025",
      "popular contemporary novels",
      "viral fiction books",
      "award winning fiction 2025",
      "top selling novels this year",
    ],
  },

  {
    name: "MODERN_NONFICTION",
    weight: 5,
    queries: [
      "best nonfiction books 2025",
      "popular self help books",
      "modern psychology books",
      "startup business books",
      "productivity books",
      "memoirs and biographies",
      "technology books 2025",
    ],
  },

  {
    name: "TRENDING_AUTHORS",
    weight: 6,
    queries: [
      "books by Colleen Hoover",
      "books by Taylor Jenkins Reid",
      "books by Rebecca Yarros",
      "books by Ali Hazelwood",
      "books by Emily Henry",
      "books by Matt Haig",
      "books by James Clear",
      "books by Morgan Housel",
      "books by Yuval Noah Harari",
      "books by Bonnie Garmus",
      "books by Freida McFadden",
      "books by R.F. Kuang",
    ],
  },

  {
    name: "GENRE_BASED",
    weight: 5,
    queries: [
      "popular fantasy novels",
      "science fiction bestsellers",
      "romance books trending",
      "thriller mystery novels",
      "dark academia books",
      "young adult fiction",
      "historical fiction books",
    ],
  },

  {
    name: "BOOKTOK_BOOKSTAGRAM",
    weight: 5,
    queries: [
      "booktok trending books",
      "bookstagram famous books",
      "viral tiktok novels",
      "popular goodreads books",
      "most reviewed books 2025",
    ],
  },

  {
    name: "RECENT_RELEASES",
    weight: 7,
    queries: [
      "new books released 2025",
      "upcoming novels 2025",
      "latest fiction releases",
      "new hardcover books",
      "new literary fiction",
      "new sci fi releases",
      "new romance releases",
    ],
  },
];

const MAX_INSERTS = 500;

// 🔥 Better shuffle
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// 📅 Recent books priority
function isRecent(info) {
  const year = parseInt(info.publishedDate?.slice(0, 4));

  return year && year >= 2020;
}

// ❌ Filter unwanted old/research/literature/history books
function isValidBook(info) {
  const text = `
    ${info.title || ""}
    ${info.subtitle || ""}
    ${(info.categories || []).join(" ")}
    ${info.description || ""}
  `.toLowerCase();

  const bannedKeywords = [
    "research",
    "literature",
    "literary criticism",
    "history",
    "ancient",
    "mythology analysis",
    "thesis",
    "academic",
    "study guide",
    "textbook",
    "encyclopedia",
    "philosophy history",
    "critical essays",
    "poetry analysis",
  ];

  const hasBanned = bannedKeywords.some((word) =>
    text.includes(word.toLowerCase()),
  );

  return !hasBanned;
}

export async function runDailySeed() {
  let inserted = 0;

  let expandedQueries = [];

  // 🔥 Add weights
  for (const group of QUERY_GROUPS) {
    for (let i = 0; i < group.weight; i++) {
      expandedQueries.push(...group.queries);
    }
  }

  expandedQueries = shuffle(expandedQueries);

  for (const query of expandedQueries) {
    if (inserted >= MAX_INSERTS) break;

    try {
      console.log(`🔍 Searching: ${query}`);

      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query,
        )}&orderBy=relevance&maxResults=40`,
      );

      let items = res.data.items || [];

      // 🔥 Prefer recent books
      items = items.sort((a, b) => {
        const aRecent = isRecent(a.volumeInfo) ? 1 : 0;
        const bRecent = isRecent(b.volumeInfo) ? 1 : 0;

        return bRecent - aRecent;
      });

      for (const item of items) {
        if (inserted >= MAX_INSERTS) break;

        const info = item.volumeInfo;

        // ❌ Skip unwanted books
        if (!isValidBook(info)) {
          continue;
        }

        // ❌ Skip old books
        if (!isRecent(info)) {
          continue;
        }

        try {
          const result = await normalizeAndInsert(info);

          if (result) {
            inserted++;

            console.log(`📦 Inserted (${info.publishedDate}): ${info.title}`);
          }
        } catch (err) {
          console.log("⚠️ Skipped:", err.message);
        }
      }
    } catch (err) {
      console.log("❌ API failed for query:", query);
    }
  }

  console.log(`🎯 Total inserted today: ${inserted}`);
}
