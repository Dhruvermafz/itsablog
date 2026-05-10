// scripts/seedClubs.js

import mongoose from "mongoose";
import dotenv from "dotenv";

import Club from "../models/club.js";
import User from "../models/user.js";

dotenv.config();

const clubs = [
  {
    name: "A Song of Ice and Fire",
    description:
      "For fans of George R.R. Martin's epic fantasy universe. Discuss books, lore, theories, dragons, politics, and hidden details from Westeros.",
    category: "Fantasy",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176",
    termsAndConditions:
      "Respect spoilers. Use spoiler tags for major reveals from books or shows.",
  },

  {
    name: "Fantasy Realm Readers",
    description:
      "A club for lovers of fantasy novels including LOTR, Mistborn, Stormlight Archive, First Law, Wheel of Time, and more.",
    category: "Fantasy",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    termsAndConditions: "Healthy discussions only. No hate speech or piracy.",
  },

  {
    name: "Dark Academia Society",
    description:
      "Books filled with mystery, philosophy, gothic vibes, elite schools, obsession, and tragic brilliance.",
    category: "Dark Academia",
    coverImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
    termsAndConditions: "Keep discussions respectful and meaningful.",
  },

  {
    name: "Horror & Thriller Addicts",
    description:
      "Psychological thrillers, horror classics, disturbing fiction, crime mysteries, and sleepless nights.",
    category: "Horror",
    coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    termsAndConditions: "No graphic NSFW content or illegal material.",
  },

  {
    name: "Manga & Light Novel Hub",
    description:
      "Discuss manga, anime adaptations, Japanese light novels, power systems, and legendary arcs.",
    category: "Manga",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
    termsAndConditions: "Use spoiler warnings for recent chapters.",
  },

  {
    name: "Sci-Fi Explorers",
    description:
      "Cyberpunk, dystopian futures, AI fiction, space operas, and mind-bending science fiction.",
    category: "Sci-Fi",
    coverImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
    termsAndConditions: "No spam or low-effort posting.",
  },

  {
    name: "BookTok Favorites",
    description:
      "Trending and viral books from BookTok and online reading communities.",
    category: "Trending",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    termsAndConditions: "Respect everyone's reading preferences.",
  },

  {
    name: "Classic Literature Circle",
    description:
      "Discuss timeless classics from Dostoevsky, Kafka, Orwell, Austen, Tolstoy, Camus, and more.",
    category: "Classics",
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    termsAndConditions: "Thoughtful discussions encouraged.",
  },

  {
    name: "Indian Literature Club",
    description:
      "Explore Indian fiction, Hindi literature, Urdu poetry, regional classics, and modern Indian authors.",
    category: "Indian Literature",
    coverImage: "https://images.unsplash.com/photo-1526243741027-444d633d7365",
    termsAndConditions: "Respect all languages and cultures.",
  },

  {
    name: "Poetry & Philosophy",
    description:
      "For readers who love poetry, existentialism, philosophy, and emotionally intense writing.",
    category: "Poetry",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
    termsAndConditions: "Keep conversations civil and intellectual.",
  },
];

async function seedClubs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // creator user
    const user = await User.findOne({
      username: "dhruvermafz",
    });

    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }

    // optional: clear old clubs
    await Club.deleteMany({});

    console.log("🗑 Old clubs deleted");

    const clubsToInsert = clubs.map((club) => ({
      ...club,
      createdBy: user._id,
    }));

    await Club.insertMany(clubsToInsert);

    console.log(`✅ ${clubs.length} clubs seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
}

seedClubs();
