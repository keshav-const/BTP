'use client'

import React from 'react'
import { motion, type MotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMagneticHover } from '@/hooks/use-magnetic-hover'

type ButtonVariant = 'solid' | 'outline' | 'glass' | 'link' | 'icon' | 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  magnetic?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

const baseStyles = 'premium-button font-sans inline-flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900'

const variantClasses: Record<ButtonVariant, string> = {
  solid:
    'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-premium hover:shadow-premium-md hover:-translate-y-0.5',
  primary:
    'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-premium hover:shadow-premium-md hover:-translate-y-0.5',
  secondary:
    'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-700 shadow-premium-sm hover:shadow-premium',
  outline:
    'border-2 border-emerald-700 text-emerald-700 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-800 dark:hover:border-emerald-600',
  glass:
    'glass-medium shadow-glass backdrop-blur-glass-md border border-emerald-700/20 text-emerald-900 dark:text-emerald-50 hover:shadow-glass-lg hover:border-emerald-700/40',
  link:
    'bg-transparent text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 underline-offset-4 hover:underline',
  ghost:
    'bg-transparent text-emerald-700 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20',
  icon:
    'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-700 dark:hover:text-emerald-500',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
}

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'p-2 rounded-lg',
  md: 'p-3 rounded-xl',
  lg: 'p-4 rounded-xl',
}

interface ButtonVariantOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  isIconOnly?: boolean
  className?: string
}

export const buttonVariants = ({
  variant = 'solid',
  size = 'md',
  isIconOnly = false,
  className,
}: ButtonVariantOptions = {}): string => {
  const mappedVariant = variant === 'primary' ? 'solid' : variant
  return cn(
    baseStyles,
    variantClasses[mappedVariant],
    isIconOnly ? iconSizeClasses[size] : sizeClasses[size],
    className
  )
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'solid',
      size = 'md',
      loading = false,
      magnetic = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const {
      elementRef,
      magneticX,
      magneticY,
      handleMouseMove,
      handleMouseLeave,
      prefersReducedMotion,
    } = useMagneticHover()

    const isIconOnly = !children && Boolean(leftIcon || rightIcon)
    const isDisabled = disabled || loading

    const content = (
      <>
        {loading && (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </>
    )

    const combinedClassName = buttonVariants({ variant, size, isIconOnly, className })

    if (magnetic && !prefersReducedMotion && !isDisabled) {
      return (
        <motion.button
          ref={(node: HTMLButtonElement | null) => {
            if (node) {
              elementRef.current = node
            }
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          className={combinedClassName}
          style={{
            x: magneticX,
            y: magneticY,
          } as MotionProps['style']}
          onMouseMove={handleMouseMove as React.MouseEventHandler<HTMLButtonElement>}
          onMouseLeave={handleMouseLeave as React.MouseEventHandler<HTMLButtonElement>}
          disabled={isDisabled}
          type={props.type}
          onClick={props.onClick}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onKeyDown={props.onKeyDown}
          onKeyUp={props.onKeyUp}
          id={props.id}
          name={props.name}
          value={props.value}
          form={props.form}
          formAction={props.formAction}
          formEncType={props.formEncType}
          formMethod={props.formMethod}
          formNoValidate={props.formNoValidate}
          formTarget={props.formTarget}
          aria-label={props['aria-label']}
          aria-pressed={props['aria-pressed']}
          aria-disabled={props['aria-disabled']}
          aria-describedby={props['aria-describedby']}
        >
          {content}
        </motion.button>
      )
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={isDisabled}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
