import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-charcoal-700 dark:text-cream-100 mb-2 font-sans">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg',
            'bg-cream-100 text-charcoal-900 placeholder-taupe-400',
            'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400',
            'hover:border-taupe-400',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-taupe-100',
            'transition-all duration-200 shadow-luxury-sm',
            'dark:bg-charcoal-900 dark:text-cream-100 dark:border-charcoal-600',
            error && 'border-error focus:ring-error focus:border-error',
            !error && 'border-taupe-300 dark:border-charcoal-600',
            className
          )}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-error font-medium">{error}</p>}
        {helpText && !error && (
          <p className="mt-2 text-sm text-taupe-500 dark:text-taupe-400">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
