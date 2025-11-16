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
            'w-full px-4 py-3 border-2 rounded-xl font-medium',
            'bg-white text-charcoal-900 placeholder-taupe-500',
            'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500',
            'hover:border-gold-400',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-taupe-100',
            'transition-all duration-300 shadow-luxury-sm',
            'dark:bg-charcoal-800 dark:text-cream-100 dark:border-charcoal-600 dark:placeholder-taupe-400',
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
