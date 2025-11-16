import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'luxury';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    const variants = {
      default: 'bg-gold-100 text-gold-700 border border-gold-200 dark:bg-charcoal-800 dark:text-gold-400 dark:border-gold-600/30',
      success: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200',
      warning: 'bg-warning/10 text-warning border border-warning/20 dark:bg-warning/20',
      error: 'bg-error/10 text-error border border-error/20 dark:bg-error/20',
      info: 'bg-info/10 text-info border border-info/20 dark:bg-info/20',
      luxury: 'bg-gold-50/50 text-gold-600 border-2 border-gold-400 shadow-luxury-sm dark:bg-transparent dark:text-gold-400',
    };

    const sizes = {
      sm: 'px-2.5 py-1 text-xs font-medium',
      md: 'px-3 py-1 text-sm font-medium',
      lg: 'px-4 py-1.5 text-base font-semibold',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center rounded-full transition-all duration-200', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
