import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'luxury';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 rounded-xl shadow-luxury-sm transition-all duration-200',
      elevated:
        'bg-cream-50 dark:bg-charcoal-800 border border-taupe-300 dark:border-charcoal-700 rounded-xl shadow-md transition-all duration-200 hover:shadow-luxury-lg hover:scale-[1.01]',
      outlined: 'border-2 border-taupe-300 dark:border-charcoal-600 rounded-xl bg-white dark:bg-charcoal-900 transition-all duration-200',
      luxury: 'bg-cream-50 dark:bg-charcoal-800 border-t-4 border-t-gold-400 border border-taupe-300 dark:border-charcoal-700 rounded-xl shadow-luxury-lg transition-all duration-200 hover:shadow-luxury-xl',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], 'p-6', className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
