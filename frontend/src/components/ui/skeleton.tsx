import React from 'react';
import { cn } from '@/utils/cn';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-shimmer rounded-xl bg-gradient-to-r from-taupe-100 via-taupe-200 to-taupe-100 bg-[length:200%_100%]',
        'dark:from-charcoal-800 dark:via-charcoal-700 dark:to-charcoal-800',
        className
      )}
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
