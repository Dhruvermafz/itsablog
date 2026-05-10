import axios from "axios";
import { normalizeAndInsert } from "./normalise.service.js";

const QUERY_GROUPS = [
  // 🔥 Trending Fiction
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

  // 🔥 Modern Nonfiction
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

  // 🔥 Trending Authors
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

  // 🔥 Genres
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

  // 🔥 BookTok
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

  // 🔥 Recent Releases
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

  // 🇮🇳 Legendary Hindi Writers
  {
    name: "LEGENDARY_HINDI_WRITERS",
    weight: 10,
    queries: [
      "Munshi Premchand",
      "Harivansh Rai Bachchan",
      "Ramdhari Singh Dinkar",
      "Mahadevi Verma",
      "Suryakant Tripathi Nirala",
      "Jaishankar Prasad",
      "Maithili Sharan Gupt",
      "Phanishwar Nath Renu",
      "Bhisham Sahni",
      "Nirmal Verma",
      "Krishna Sobti",
      "Mannu Bhandari",
      "Agyeya",
      "Amrita Pritam",
      "Dharamvir Bharati",
      "Shivani",
      "Bharatendu Harishchandra",
      "Subhadra Kumari Chauhan",
      "Hazari Prasad Dwivedi",
      "Rahi Masoom Raza",
      "Sarveshwar Dayal Saxena",
      "Harishankar Parsai",
      "Sharad Joshi",
      "Kaka Hathrasi",
      "Gajanan Madhav Muktibodh",
      "Nagarjun",
      "Bhavani Prasad Mishra",
      "Raghuvir Sahay",
      "Kamleshwar",
      "Mohan Rakesh",
      "Yashpal",
      "Uday Prakash",
      "Nasira Sharma",
      "Mridula Garg",
      "Kashinath Singh",
      "Vishnu Prabhakar",
      "Acharya Chatursen",
      "Devaki Nandan Khatri",
      "Rahul Sankrityayan",
      "Ismat Chughtai",
      "Saadat Hasan Manto",
      "Qurratulain Hyder",
      "Gulzar",
      "Javed Akhtar",

      "Hindi classic novels",
      "Hindi sahitya",
      "Hindi literary fiction",
      "Hindi poetry collection",
      "Hindi novels",
      "Hindi short stories",
      "Hindi historical fiction",
      "Hindi award winning books",
      "Sahitya Akademi winners Hindi",
      "Jnanpith award winners",
    ],
  },

  // 🇮🇳 Indian Literature
  {
    name: "INDIAN_LITERATURE",
    weight: 8,
    queries: [
      "Indian mythology retellings",
      "modern Indian novels",
      "Indian literary fiction",
      "Urdu literature",
      "Bengali classics",
      "Tamil literary fiction",
      "Marathi literature",
      "Malayalam novels",
      "Kannada literature",
      "Indian poetry books",
      "Indian regional literature",
    ],
  },
];

const MAX_INSERTS = 500;

// 🔥 Better Shuffle
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// 📅 Recent Priority
function isRecent(info) {
  const year = parseInt(info.publishedDate?.slice(0, 4));

  return year && year >= 2020;
}

// 📚 Hindi classics allowed
function isValidBook(info) {
  const text = `
    ${info.title || ""}
    ${info.subtitle || ""}
    ${(info.categories || []).join(" ")}
    ${info.description || ""}
  `.toLowerCase();

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
    "encyclopedia",
  ];

  const hasBanned = bannedKeywords.some((word) =>
    text.includes(word.toLowerCase()),
  );

  return !hasBanned;
}

// 🔥 Transform OpenLibrary → Your DB format
function transformOpenLibraryBook(book) {
  return {
    title: book.title || null,

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

// 🔥 Fetch from OpenLibrary
async function fetchOpenLibraryBooks(query) {
  try {
    const res = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        query,
      )}&limit=50`,
    );

    return res.data.docs || [];
  } catch (err) {
    console.log("❌ OpenLibrary failed:", query);

    return [];
  }
}

// 🔥 Fetch from Google Books
async function fetchGoogleBooks(query) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query,
      )}&orderBy=relevance&maxResults=40`,
    );

    return res.data.items || [];
  } catch (err) {
    console.log("❌ Google API failed:", query);

    return [];
  }
}

// 🚀 Main Seeder
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

    console.log(`🔍 Searching: ${query}`);

    // =========================================
    // 🔥 OPEN LIBRARY
    // =========================================

    const openLibraryBooks = await fetchOpenLibraryBooks(query);

    for (const rawBook of openLibraryBooks) {
      if (inserted >= MAX_INSERTS) break;

      const info = transformOpenLibraryBook(rawBook);

      if (!isValidBook(info)) {
        continue;
      }

      try {
        const result = await normalizeAndInsert(info);

        if (result) {
          inserted++;

          console.log(`📚 OpenLibrary Inserted: ${info.title}`);
        }
      } catch (err) {
        console.log("⚠️ OpenLibrary skipped:", err.message);
      }
    }

    // =========================================
    // 🔥 GOOGLE BOOKS
    // =========================================

    const googleBooks = await fetchGoogleBooks(query);

    let items = googleBooks.sort((a, b) => {
      const aRecent = isRecent(a.volumeInfo) ? 1 : 0;
      const bRecent = isRecent(b.volumeInfo) ? 1 : 0;

      return bRecent - aRecent;
    });

    for (const item of items) {
      if (inserted >= MAX_INSERTS) break;

      const info = item.volumeInfo;

      if (!isValidBook(info)) {
        continue;
      }

      try {
        const result = await normalizeAndInsert(info);

        if (result) {
          inserted++;

          console.log(
            `📦 Google Inserted (${info.publishedDate}): ${info.title}`,
          );
        }
      } catch (err) {
        console.log("⚠️ Google skipped:", err.message);
      }
    }
  }

  console.log(`🎯 Total inserted today: ${inserted}`);
}
