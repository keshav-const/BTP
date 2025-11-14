import React from 'react';
import { cn } from '@/utils/cn';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-pulse rounded-lg bg-secondary-200 dark:bg-secondary-800',
        className
      )}
      {...props}
    />
  )
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
