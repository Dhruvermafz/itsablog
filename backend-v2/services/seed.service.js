import axios from "axios";
import { normalizeAndInsert } from "./normalise.service.js";
const QUERY_GROUPS = [
  {
    name: "INDIAN_MODERN",
    weight: 5, // 🔥 highest priority
    queries: [
      "contemporary Indian novels",
      "modern Indian fiction",
      "Indian English literature books",
      "recent Indian authors novels",
      "Indian bestselling books",
    ],
  },
  {
    name: "INDIAN_LANGUAGES",
    weight: 4,
    queries: [
      "Hindi novels",
      "Tamil novels books",
      "Bengali literature books",
      "Marathi novels",
      "Malayalam novels",
      "Telugu literature books",
    ],
  },
  {
    name: "INDIAN_AUTHORS",
    weight: 4,
    queries: [
      "books by Chetan Bhagat",
      "books by Arundhati Roy",
      "books by Amish Tripathi",
      "books by Ruskin Bond",
      "books by R.K. Narayan",
      "books by Jhumpa Lahiri",
      "books by Vikram Seth",
    ],
  },
  {
    name: "INDIAN_CLASSICS",
    weight: 2,
    queries: [
      "Indian classic literature",
      "Premchand novels",
      "Rabindranath Tagore books",
      "ancient Indian literature",
    ],
  },
  {
    name: "INDIAN_AWARDS",
    weight: 3,
    queries: [
      "Sahitya Akademi award winning books",
      "Indian Booker Prize winners",
      "Indian award winning novels",
    ],
  },
];

const MAX_INSERTS = 500;

// 🔥 Shuffle helper (avoids bias)
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// 📅 Recency scoring
function isRecent(info) {
  const year = parseInt(info.publishedDate?.slice(0, 4));
  return year && year >= 2000;
}

export async function runDailySeed() {
  let inserted = 0;

  // 🔥 Expand queries based on weight
  let expandedQueries = [];

  for (const group of QUERY_GROUPS) {
    for (let i = 0; i < group.weight; i++) {
      expandedQueries.push(...group.queries);
    }
  }

  expandedQueries = shuffle(expandedQueries);

  for (const query of expandedQueries) {
    if (inserted >= MAX_INSERTS) break;

    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query,
        )}&maxResults=40`,
      );

      let items = res.data.items || [];

      // 🔥 Sort: recent books first
      items = items.sort((a, b) => {
        const aRecent = isRecent(a.volumeInfo) ? 1 : 0;
        const bRecent = isRecent(b.volumeInfo) ? 1 : 0;
        return bRecent - aRecent;
      });

      for (const item of items) {
        if (inserted >= MAX_INSERTS) break;

        const info = item.volumeInfo;

        try {
          const result = await normalizeAndInsert(info);

          if (result) {
            inserted++;
            console.log(
              `📦 Inserted (${isRecent(info) ? "RECENT" : "OLD"}): ${info.title}`,
            );
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
