"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RatingStars } from "./RatingStars";
import { Heart } from "lucide-react";

export const ReviewCard = ({ review }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likesCount || 0);

  const user = review.user;
  const book = review.book;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <article
      className="
        group flex gap-4
        p-4 sm:p-5
        rounded-2xl border border-border/60
        bg-card/90 backdrop-blur-sm
        hover:shadow-md transition-all
      "
      data-testid={`review-card-${review._id}`}
    >
      {/* LEFT: BOOK COVER */}
      <Link href={`/book/${book?._id}`} className="shrink-0">
        <img
          src={book?.coverUrl || "/placeholder.jpg"}
          alt={book?.title}
          className="
            w-20 h-28 sm:w-24 sm:h-32
            object-cover rounded-lg
            shadow-sm border border-border/40
            hover:scale-[1.03] transition
          "
        />
      </Link>

      {/* RIGHT: CONTENT */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* TOP: title + rating */}
        <div>
          <Link href={`/book/${book?._id}`}>
            <h3
              className="
                text-sm sm:text-base md:text-lg
                font-semibold text-foreground
                line-clamp-1 hover:text-primary
              "
            >
              {book?.title}
            </h3>
          </Link>

          <div className="mt-1 flex items-center gap-2">
            <RatingStars rating={review.rating || 0} size={14} />
          </div>
        </div>

        {/* REVIEW TEXT */}
        <p
          className="
            mt-2 text-xs sm:text-sm
            text-muted-foreground
            line-clamp-3
            leading-relaxed
          "
        >
          {review.content}
        </p>

        {/* FOOTER */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleLike}
            className="
              flex items-center gap-1
              text-xs text-muted-foreground
              hover:text-accent transition
            "
          >
            <Heart
              size={14}
              className={liked ? "fill-accent text-accent scale-110" : ""}
            />
            {likeCount}
          </button>

          <span className="text-[10px] text-muted-foreground/70 uppercase tracking-widest">
            {user?.username}
          </span>
        </div>
      </div>
    </article>
  );
};
