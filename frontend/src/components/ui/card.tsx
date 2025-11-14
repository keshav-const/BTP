import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-secondary-900 border border-border rounded-lg',
      elevated:
        'bg-white dark:bg-secondary-900 rounded-lg shadow-lg transition-shadow hover:shadow-xl',
      outlined: 'border-2 border-border rounded-lg',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], 'p-4', className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
