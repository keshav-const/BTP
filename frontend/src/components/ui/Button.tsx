import React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const baseStyles = 'premium-button font-sans'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-premium hover:shadow-premium-md hover:-translate-y-0.5',
  secondary:
    'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-700',
  ghost: 'bg-transparent text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20',
  outline: 'border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

interface ButtonVariantOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export const buttonVariants = ({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonVariantOptions = {}): string => {
  return cn(baseStyles, variantClasses[variant], sizeClasses[size], className)
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
