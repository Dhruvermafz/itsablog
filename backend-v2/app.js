import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./modules/users/user.routes.js";
import bookRoutes from "./modules/books/book.routes.js";
import clubRoutes from "./modules/clubs/club.routes.js";
import listRoutes from "./modules/lists/list.routes.js";
import authorRoutes from "./modules/authors/author.routes.js";
import searchRoutes from "./modules/search/search.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://itsablog.in",
      "https://www.itsablog.in",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/search", searchRoutes);
// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Error handler
app.use(errorHandler);

// DB Connection + Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Connection Error ❌", err);
  });
