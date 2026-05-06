"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RatingStars } from "./RatingStars";
import { Heart } from "lucide-react";

export const ReviewCard = ({ review }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
      data-testid={`review-card-${review.id}`}
    >
      <div className="flex items-start gap-4">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-12 h-12 rounded-full ring-2 ring-primary/20"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-lg">{review.userName}</h4>
              <p className="text-sm text-muted-foreground font-mono">
                {new Date(review.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <RatingStars rating={review.rating} size={18} />
          </div>

          {review.bookTitle && review.bookId && (
            <Link
              href={`/book/${review.bookId}`}
              className="inline-block font-serif text-primary hover:underline mb-3"
            >
              {review.bookTitle}
            </Link>
          )}

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {review.content}
          </p>

          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            data-testid={`like-button-${review.id}`}
          >
            <Heart
              size={16}
              className={`${liked ? "fill-red-500 text-red-500" : ""} transition-colors`}
            />
            <span>{likeCount} likes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
