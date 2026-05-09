import React from "react";
import Link from "next/link";

export const BookPoster = ({ book, className = "" }) => {
  // Support both old mock data and new API structure
  const authorName =
    typeof book.author === "string"
      ? book.author
      : book.author?.name || "Unknown Author";

  const bookId = book._id || book.id;

  return (
    <Link
      href={`/book/${bookId}`}
      className={`group block relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${className}`}
      style={{ aspectRatio: "2/3" }}
    >
      <img
        src={book.coverUrl}
        alt={book.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-serif font-semibold text-sm mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs opacity-90">{authorName}</p>
        </div>
      </div>
    </Link>
  );
};
