import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'luxury';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    const variants = {
      default: 'bg-taupe-100 text-taupe-800 border border-taupe-200 dark:bg-taupe-800 dark:text-taupe-100',
      success: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900 dark:text-emerald-200',
      warning: 'bg-warning/10 text-warning border border-warning/20 dark:bg-warning/20',
      error: 'bg-error/10 text-error border border-error/20 dark:bg-error/20',
      info: 'bg-info/10 text-info border border-info/20 dark:bg-info/20',
      luxury: 'bg-gradient-gold text-white shadow-luxury-gold border border-gold-400',
    };

    const sizes = {
      sm: 'px-2.5 py-1 text-xs font-medium',
      md: 'px-3 py-1.5 text-sm font-medium',
      lg: 'px-4 py-2 text-base font-semibold',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center rounded-full transition-all duration-300', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
