import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'luxury';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-700 rounded-xl shadow-luxury-sm',
      elevated:
        'bg-white dark:bg-charcoal-800 rounded-xl shadow-luxury transition-all duration-300 hover:shadow-luxury-lg hover:-translate-y-1',
      outlined: 'border-2 border-taupe-300 dark:border-charcoal-600 rounded-xl bg-white dark:bg-charcoal-900',
      luxury: 'bg-gradient-subtle dark:bg-gradient-luxury rounded-2xl shadow-luxury-lg border border-gold-200 dark:border-gold-600/30 backdrop-blur-sm',
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
