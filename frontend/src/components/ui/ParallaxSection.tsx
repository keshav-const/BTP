'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ParallaxSectionProps {
  speed?: number
  overlay?: boolean
  overlayOpacity?: number
  children?: React.ReactNode
  background?: React.ReactNode
  floatingElements?: React.ReactNode
  as?: React.ElementType
  className?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

export const ParallaxSection = React.forwardRef<HTMLElement, ParallaxSectionProps>(
  (
    {
      speed = 0.5,
      overlay = false,
      overlayOpacity = 0.5,
      children,
      background,
      floatingElements,
      as: Component = 'section',
      className,
      id,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
    },
    ref
  ) => {
    const sectionRef = useRef<HTMLElement>(null)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      }
      return false
    })

    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ['start end', 'end start'],
    })

    const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])
    const backgroundY = useTransform(
      scrollYProgress,
      [0, 1],
      ['0%', `${speed * -50}%`]
    )
    const floatingY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const MotionComponent = motion[Component as keyof typeof motion] as typeof motion.section

    if (prefersReducedMotion) {
      return (
        <Component
          ref={ref}
          id={id}
          className={cn('relative overflow-hidden', className)}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
        >
          {background && (
            <div className="absolute inset-0">{background}</div>
          )}

          {floatingElements && (
            <div className="absolute inset-0">{floatingElements}</div>
          )}

          {overlay && (
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 dark:from-transparent dark:via-white/5 dark:to-white/10"
              style={{ opacity: overlayOpacity }}
              aria-hidden="true"
            />
          )}

          <div className="relative z-10">{children}</div>
        </Component>
      )
    }

    return (
      <MotionComponent
        ref={(node: HTMLElement) => {
          sectionRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        id={id}
        className={cn('relative overflow-hidden', className)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        {background && (
          <motion.div
            className="absolute inset-0"
            style={{
              y: backgroundY,
              willChange: 'transform',
            }}
          >
            {background}
          </motion.div>
        )}

        {floatingElements && (
          <motion.div
            className="absolute inset-0"
            style={{
              y: floatingY,
              willChange: 'transform',
            }}
          >
            {floatingElements}
          </motion.div>
        )}

        {overlay && (
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 dark:from-transparent dark:via-white/5 dark:to-white/10"
            style={{ opacity: overlayOpacity }}
            aria-hidden="true"
          />
        )}

        <motion.div
          className="relative z-10"
          style={{
            y,
            willChange: 'transform',
          }}
        >
          {children}
        </motion.div>
      </MotionComponent>
    )
  }
)

ParallaxSection.displayName = 'ParallaxSection'
