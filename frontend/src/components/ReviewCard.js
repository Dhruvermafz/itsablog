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
        p-7 md:p-8
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        hover:shadow-[0_14px_45px_rgba(0,0,0,0.08)]
        transition-all duration-500
        hover:-translate-y-1
      "
      data-testid={`review-card-${review.id}`}
    >
      {/* subtle paper grain */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[size:20px_20px]" />

      {/* top accent line */}
      <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-primary/70 via-accent/70 to-primary/70" />

      <div className="relative z-10 flex items-start gap-5">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="
              w-14 h-14 rounded-full object-cover
              ring-2 ring-primary/20
              shadow-md
            "
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h4
                className="
                  text-xl md:text-2xl
                  font-bold tracking-tight
                  text-foreground
                "
                style={{
                  fontFamily: '"Libre Baskerville", serif',
                }}
              >
                {review.userName}
              </h4>

              <p
                className="
                  text-xs uppercase tracking-[0.18em]
                  text-muted-foreground mt-1
                "
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {new Date(review.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="bg-secondary/60 px-3 py-2 rounded-full border border-border/60">
              <RatingStars rating={review.rating} size={18} />
            </div>
          </div>

          {/* Book link */}
          {review.bookTitle && review.bookId && (
            <Link
              href={`/book/${review.bookId}`}
              className="
                inline-flex items-center gap-2
                mb-5
                text-sm md:text-base
                font-semibold
                text-primary
                hover:text-accent
                transition-colors
                group/link
              "
              style={{
                fontFamily: '"Libre Baskerville", serif',
              }}
            >
              <span className="h-px w-5 bg-primary/60 transition-all duration-300 group-hover/link:w-8" />
              {review.bookTitle}
            </Link>
          )}

          {/* Review content */}
          <blockquote
            className="
              relative
              text-[15px] md:text-[17px]
              leading-8
              text-foreground/90
              border-l-2 border-primary/30
              pl-5
              italic
            "
            style={{
              fontFamily: '"Source Serif 4", serif',
            }}
          >
            <span className="absolute -left-[11px] top-0 text-4xl text-primary/20 leading-none">
              “
            </span>

            {review.content}
          </blockquote>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
            <button
              onClick={handleLike}
              className="
                inline-flex items-center gap-2
                text-sm
                text-muted-foreground
                hover:text-accent
                transition-all duration-300
                group/like
              "
              data-testid={`like-button-${review.id}`}
            >
              <Heart
                size={17}
                className={`
                  transition-all duration-300
                  ${
                    liked
                      ? "fill-accent text-accent scale-110"
                      : "group-hover/like:scale-110"
                  }
                `}
              />

              <span
                className="tracking-wide"
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {likeCount} likes
              </span>
            </button>

            <span
              className="
                text-xs uppercase tracking-[0.2em]
                text-muted-foreground/70
              "
              style={{
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              Reader Review
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
