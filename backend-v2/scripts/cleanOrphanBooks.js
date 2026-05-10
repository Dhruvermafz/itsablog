import mongoose from "mongoose";
import dotenv from "dotenv";

import Book from "../models/book.js";

dotenv.config();

async function deleteOrphanBooks() {
  try {
    // Connect DB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const orphanBooks = await Book.aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $match: {
          authorData: { $size: 0 },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
        },
      },
    ]);

    console.log(`Found ${orphanBooks.length} orphan books`);

    if (orphanBooks.length > 0) {
      console.log(orphanBooks.map((b) => `- ${b.title} (${b._id})`).join("\n"));

      const ids = orphanBooks.map((b) => b._id);

      const result = await Book.deleteMany({
        _id: { $in: ids },
      });

      console.log(`✅ Deleted ${result.deletedCount} orphan books`);
    } else {
      console.log("✅ No orphan books found");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

deleteOrphanBooks();
