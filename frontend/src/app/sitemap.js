const BASE_URL = "https://itsablog.in";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://itsablog-api.onrender.com/api" ||
  "http://localhost:5000/api";

async function getBooks() {
  try {
    const res = await fetch(`${API_URL}/books`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

async function getUsers() {
  try {
    const res = await fetch(`${API_URL}/users`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

async function getReviews() {
  try {
    const res = await fetch(`${API_URL}/reviews`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

async function getClubs() {
  try {
    const res = await fetch(`${API_URL}/clubs`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const [books, users, reviews, clubs] = await Promise.all([
    getBooks(),
    getUsers(),
    getReviews(),
    getClubs(),
  ]);

  // Static pages
  const staticRoutes = [
    "",
    "/explore",
    "/lists",
    "/clubs",
    "/login",
    "/register",
    "/settings",
  ];

  const staticPages = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  // User profiles
  const userPages = users.map((user) => ({
    url: `${BASE_URL}/u/${user.username}`,
    lastModified: new Date(user.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Reading manager
  const readingManagerPages = users.map((user) => ({
    url: `${BASE_URL}/u/${user.username}/reading-manager`,
    lastModified: new Date(user.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  // Books
  const bookPages = books.map((book) => ({
    url: `${BASE_URL}/books/${book.slug || book._id}`,
    lastModified: new Date(book.updatedAt || Date.now()),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Reviews
  const reviewPages = reviews.map((review) => ({
    url: `${BASE_URL}/reviews/${review._id}`,
    lastModified: new Date(review.updatedAt || Date.now()),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Clubs
  const clubPages = clubs.map((club) => ({
    url: `${BASE_URL}/clubs/${club.slug || club._id}`,
    lastModified: new Date(club.updatedAt || Date.now()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...userPages,
    ...readingManagerPages,
    ...bookPages,
    ...reviewPages,
    ...clubPages,
  ];
}
