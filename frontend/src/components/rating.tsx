import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onRate?: (rating: number) => void;
  interactive?: boolean;
  showLabel?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  onRate,
  interactive = false,
  showLabel = false,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => {
        const starRating = i + 1;
        const isFilled = starRating <= Math.round(rating);

        return (
          <button
            key={i}
            onClick={() => interactive && onRate?.(starRating)}
            disabled={!interactive}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110'
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-secondary-300'
              )}
            />
          </button>
        );
      })}
      {showLabel && <span className="ml-2 text-sm text-secondary-600">{rating.toFixed(1)}</span>}
    </div>
  );
};
