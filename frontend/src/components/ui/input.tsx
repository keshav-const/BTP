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
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border-2 rounded-lg',
            'bg-input text-foreground placeholder-secondary-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            error && 'border-error focus:ring-error',
            !error && 'border-border',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
        {helpText && !error && (
          <p className="mt-1 text-sm text-secondary-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
