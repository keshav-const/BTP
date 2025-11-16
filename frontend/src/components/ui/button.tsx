import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'luxury';
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
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold-400 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-gold-500 text-charcoal-900 hover:scale-[1.02] active:scale-[0.98] hover:bg-gold-600 shadow-luxury disabled:hover:scale-100 dark:text-charcoal-900',
      secondary:
        'bg-charcoal-800 text-cream-100 hover:bg-charcoal-700 hover:shadow-luxury disabled:hover:bg-charcoal-800 dark:bg-charcoal-700 dark:hover:bg-charcoal-600',
      outline:
        'border-2 border-gold-400 text-charcoal-900 hover:bg-gold-50 hover:border-gold-500 hover:shadow-luxury-sm disabled:hover:bg-transparent dark:text-cream-100 dark:hover:bg-charcoal-800',
      ghost:
        'border border-taupe-300 bg-transparent text-charcoal-900 hover:bg-cream-200 hover:border-taupe-400 disabled:hover:bg-transparent dark:text-cream-100 dark:hover:bg-charcoal-800 dark:border-taupe-700',
      danger:
        'bg-error text-white hover:bg-red-600 hover:shadow-luxury disabled:bg-red-200',
      luxury:
        'border-2 border-gold-400 bg-transparent text-gold-600 hover:bg-gold-50 hover:border-gold-500 hover:shadow-luxury-gold font-semibold disabled:hover:bg-transparent dark:text-gold-400 dark:hover:bg-charcoal-800',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
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
