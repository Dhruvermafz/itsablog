import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating, maxRating = 5, size = 16, interactive = false, onRate }) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (value) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = (interactive ? (hoverRating || rating) : rating) >= starValue;
        const isHalf = !isFilled && (interactive ? (hoverRating || rating) : rating) >= starValue - 0.5;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            data-testid={`star-${starValue}`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : isHalf
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'fill-none text-slate-300 dark:text-slate-600'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};
