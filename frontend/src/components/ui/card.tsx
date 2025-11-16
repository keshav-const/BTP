import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'luxury';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-600 rounded-2xl shadow-luxury-sm transition-all duration-300',
      elevated:
        'bg-white dark:bg-charcoal-800 border border-taupe-200 dark:border-charcoal-600 rounded-2xl shadow-luxury transition-all duration-300 hover:shadow-luxury-lg hover:scale-[1.01]',
      outlined: 'border-2 border-taupe-300 dark:border-charcoal-600 rounded-2xl bg-white dark:bg-charcoal-900 transition-all duration-300',
      luxury: 'bg-gradient-to-br from-white to-cream-50 dark:from-charcoal-800 dark:to-charcoal-900 border-t-4 border-t-gold-500 border border-taupe-200 dark:border-charcoal-600 rounded-2xl shadow-luxury-lg transition-all duration-300 hover:shadow-luxury-xl',
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
