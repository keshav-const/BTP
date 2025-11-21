'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useSpring, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

type FormatType = 'number' | 'currency' | 'percent'

interface AnimatedCounterProps {
  value: number
  format?: FormatType
  currency?: string
  locale?: string
  decimals?: number
  duration?: number
  delay?: number
  className?: string
  id?: string
  'aria-label'?: string
  'aria-describedby'?: string
}

export const AnimatedCounter = React.forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  (
    {
      value,
      format = 'number',
      currency = 'INR',
      locale = 'en-IN',
      decimals = 0,
      duration: _duration = 2,
      delay = 0,
      className,
      id,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
    },
    ref
  ) => {
    const countRef = useRef<HTMLSpanElement>(null)
    const isInView = useInView(countRef, { once: true, margin: '-50px' })
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      }
      return false
    })

    const springValue = useSpring(0, {
      stiffness: 50,
      damping: 30,
      restDelta: 0.001,
    })

    const [displayValue, setDisplayValue] = useState<string>('0')

    const formatValue = useCallback(
      (num: number): string => {
        switch (format) {
          case 'currency':
            return new Intl.NumberFormat(locale, {
              style: 'currency',
              currency,
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }).format(num)

          case 'percent':
            return new Intl.NumberFormat(locale, {
              style: 'percent',
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }).format(num / 100)

          case 'number':
          default:
            return new Intl.NumberFormat(locale, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }).format(num)
        }
      },
      [format, locale, currency, decimals]
    )

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    useEffect(() => {
      if (!isInView) return

      if (prefersReducedMotion) {
        // Use queueMicrotask to avoid synchronous setState in effect
        queueMicrotask(() => {
          setDisplayValue(formatValue(value))
        })
        return
      }

      const timeout = setTimeout(() => {
        springValue.set(value)
      }, delay * 1000)

      return () => clearTimeout(timeout)
    }, [isInView, value, delay, springValue, prefersReducedMotion, formatValue])

    useEffect(() => {
      if (prefersReducedMotion) return

      const unsubscribe = springValue.on('change', (latest) => {
        setDisplayValue(formatValue(latest))
      })

      return () => unsubscribe()
    }, [springValue, prefersReducedMotion, formatValue])

    if (prefersReducedMotion) {
      return (
        <span
          ref={ref}
          id={id}
          className={cn('tabular-nums', className)}
          aria-live="polite"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
        >
          {displayValue}
        </span>
      )
    }

    return (
      <motion.span
        ref={(node: HTMLSpanElement) => {
          countRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        id={id}
        className={cn('tabular-nums', className)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.8 }
        }
        transition={{
          duration: 0.5,
          delay: delay,
        }}
        aria-live="polite"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
      >
        {displayValue}
      </motion.span>
    )
  }
)

AnimatedCounter.displayName = 'AnimatedCounter'
