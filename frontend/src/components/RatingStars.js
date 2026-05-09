import React from "react";
import { Star } from "lucide-react";

export const RatingStars = ({
  rating,
  maxRating = 5,
  size = 18,
  interactive = false,
  onRate,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const currentRating = interactive ? hoverRating || rating : rating;

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;

        const isFilled = currentRating >= starValue;
        const isHalf = !isFilled && currentRating >= starValue - 0.5;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`
              relative rounded-sm
              transition-all duration-200
              ${
                interactive
                  ? "cursor-pointer hover:scale-110 active:scale-95"
                  : "cursor-default"
              }
            `}
            data-testid={`star-${starValue}`}
          >
            <Star
              size={size}
              strokeWidth={1.7}
              className={`
                transition-all duration-300
                ${
                  isFilled
                    ? `
                      fill-accent
                      text-accent
                      drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                    `
                    : isHalf
                      ? `
                      fill-accent/40
                      text-accent
                    `
                      : `
                      fill-transparent
                      text-muted-foreground/40
                    `
                }
              `}
            />

            {/* subtle ink glow */}
            {isFilled && (
              <span
                className="
                  absolute inset-0 rounded-full
                  bg-accent/10 blur-md
                  -z-10
                "
              />
            )}
          </button>
        );
      })}

      {/* Optional rating text */}
      <span
        className="
          ml-2 text-sm
          text-muted-foreground
          font-serif tracking-wide
        "
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
};
