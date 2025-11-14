import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300 focus-visible:ring-primary-500',
      secondary:
        'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 disabled:bg-secondary-100 focus-visible:ring-secondary-500 dark:bg-secondary-700 dark:text-secondary-100 dark:hover:bg-secondary-600',
      outline:
        'border-2 border-secondary-300 text-secondary-900 hover:bg-secondary-50 disabled:opacity-50 focus-visible:ring-secondary-500 dark:border-secondary-600 dark:text-secondary-100 dark:hover:bg-secondary-900',
      ghost:
        'text-secondary-900 hover:bg-secondary-100 disabled:opacity-50 focus-visible:ring-secondary-500 dark:text-secondary-100 dark:hover:bg-secondary-800',
      danger:
        'bg-error text-white hover:bg-red-600 disabled:bg-red-200 focus-visible:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
