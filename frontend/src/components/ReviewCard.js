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
    <article
      className="
        group relative overflow-hidden
        rounded-2xl border border-border/70
        bg-card/95 backdrop-blur-sm

        p-4 sm:p-6 md:p-8

        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        hover:shadow-[0_14px_45px_rgba(0,0,0,0.08)]
        transition-all duration-500
        hover:-translate-y-1
      "
      data-testid={`review-card-${review.id}`}
    >
      {/* grain */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[size:20px_20px]" />

      {/* top accent */}
      <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-primary/70 via-accent/70 to-primary/70" />

      <div className="relative z-10 flex items-start gap-3 sm:gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="
              w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
              rounded-full object-cover
              ring-2 ring-primary/20
              shadow-md
            "
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div>
              <h4
                className="
                  text-lg sm:text-xl md:text-2xl
                  font-bold tracking-tight
                  text-foreground
                "
                style={{ fontFamily: '"Libre Baskerville", serif' }}
              >
                {review.userName}
              </h4>

              <p
                className="
                  text-[10px] sm:text-xs
                  uppercase tracking-[0.16em]
                  text-muted-foreground mt-1
                "
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {new Date(review.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div
              className="
              bg-secondary/60 px-2 sm:px-3 py-1 sm:py-2
              rounded-full border border-border/60
              scale-90 sm:scale-100 origin-left
            "
            >
              <RatingStars rating={review.rating} size={16} />
            </div>
          </div>

          {/* Book link */}
          {review.bookTitle && review.bookId && (
            <Link
              href={`/book/${review.bookId}`}
              className="
                inline-flex items-center gap-2
                mb-4 sm:mb-5
                text-xs sm:text-sm md:text-base
                font-semibold text-primary
                hover:text-accent transition-colors
                group/link
              "
              style={{ fontFamily: '"Libre Baskerville", serif' }}
            >
              <span className="h-px w-4 sm:w-5 bg-primary/60 transition-all duration-300 group-hover/link:w-7 sm:group-hover/link:w-8" />
              {review.bookTitle}
            </Link>
          )}

          {/* Content */}
          <blockquote
            className="
              relative
              text-sm sm:text-[15px] md:text-[17px]
              leading-7 sm:leading-8
              text-foreground/90
              border-l-2 border-primary/30
              pl-3 sm:pl-5
              italic
            "
            style={{ fontFamily: '"Source Serif 4", serif' }}
          >
            <span className="absolute -left-[8px] sm:-left-[11px] top-0 text-3xl sm:text-4xl text-primary/20 leading-none">
              “
            </span>

            {review.content}
          </blockquote>

          {/* Footer */}
          <div
            className="
            mt-5 sm:mt-6 pt-4 sm:pt-5
            border-t border-border/50
            flex items-center justify-between
          "
          >
            <button
              onClick={handleLike}
              className="
                inline-flex items-center gap-2
                text-xs sm:text-sm
                text-muted-foreground
                hover:text-accent
                transition-all duration-300
                group/like
              "
              data-testid={`like-button-${review.id}`}
            >
              <Heart
                size={16}
                className={`
                  transition-all duration-300
                  ${
                    liked
                      ? "fill-accent text-accent scale-110"
                      : "group-hover/like:scale-110"
                  }
                `}
              />

              <span style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {likeCount} likes
              </span>
            </button>

            <span
              className="
                text-[10px] sm:text-xs
                uppercase tracking-[0.2em]
                text-muted-foreground/70
              "
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              Reader Review
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
