import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    const variants = {
      default: 'bg-secondary-200 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-100',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-warning/10 text-warning dark:bg-warning/20',
      error: 'bg-error/10 text-error dark:bg-error/20',
      info: 'bg-info/10 text-info dark:bg-info/20',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs font-medium',
      md: 'px-3 py-1 text-sm font-medium',
      lg: 'px-4 py-2 text-base font-medium',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center rounded-full', variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
