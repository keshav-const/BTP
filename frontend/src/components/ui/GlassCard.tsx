'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

type GlassVariant = 'default' | 'accent' | 'bordered'
type BlurIntensity = 'light' | 'medium' | 'heavy'

interface GlassCardProps {
  variant?: GlassVariant
  blurIntensity?: BlurIntensity
  enableTilt?: boolean
  enableMagnetic?: boolean
  children: React.ReactNode
  as?: React.ElementType
  className?: string
  id?: string
  'aria-label'?: string
  'aria-describedby'?: string
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const variantClasses: Record<GlassVariant, string> = {
  default: 'glass-medium shadow-glass',
  accent: 'glass-medium shadow-glass-lg frosted-border',
  bordered: 'glass-heavy shadow-glass border-2 border-zinc-200/50 dark:border-zinc-700/50',
}

const blurClasses: Record<BlurIntensity, string> = {
  light: 'backdrop-blur-glass-sm',
  medium: 'backdrop-blur-glass-md',
  heavy: 'backdrop-blur-glass-heavy',
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      blurIntensity = 'medium',
      enableTilt = false,
      enableMagnetic = false,
      children,
      className,
      as: Component = 'div',
      id,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      onClick,
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
      }
      return false
    })

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useSpring(useMotionValue(0), {
      stiffness: 400,
      damping: 30,
    })
    const rotateY = useSpring(useMotionValue(0), {
      stiffness: 400,
      damping: 30,
    })

    const magneticX = useSpring(useMotionValue(0), {
      stiffness: 300,
      damping: 20,
    })
    const magneticY = useSpring(useMotionValue(0), {
      stiffness: 300,
      damping: 20,
    })

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseXPos = e.clientX - centerX
      const mouseYPos = e.clientY - centerY

      if (enableTilt) {
        const tiltX = (mouseYPos / rect.height) * -10
        const tiltY = (mouseXPos / rect.width) * 10

        rotateX.set(tiltX)
        rotateY.set(tiltY)
      }

      if (enableMagnetic) {
        const distance = Math.sqrt(mouseXPos ** 2 + mouseYPos ** 2)
        const maxDistance = Math.sqrt(rect.width ** 2 + rect.height ** 2) / 2

        if (distance < maxDistance) {
          const strength = 0.15
          magneticX.set(mouseXPos * strength)
          magneticY.set(mouseYPos * strength)
        }
      }

      mouseX.set(mouseXPos)
      mouseY.set(mouseYPos)
    }

    const handleMouseLeave = () => {
      if (prefersReducedMotion) return

      if (enableTilt) {
        rotateX.set(0)
        rotateY.set(0)
      }

      if (enableMagnetic) {
        magneticX.set(0)
        magneticY.set(0)
      }
    }

    const MotionComponent = motion[Component as keyof typeof motion] as typeof motion.div

    if (prefersReducedMotion || (!enableTilt && !enableMagnetic)) {
      return (
        <Component
          ref={ref}
          id={id}
          className={cn(
            'rounded-xl transition-all duration-300',
            variantClasses[variant],
            blurClasses[blurIntensity],
            className
          )}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          onClick={onClick}
        >
          {children}
        </Component>
      )
    }

    return (
      <MotionComponent
        ref={(node: HTMLDivElement) => {
          cardRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        id={id}
        className={cn(
          'rounded-xl transition-all duration-300',
          variantClasses[variant],
          blurClasses[blurIntensity],
          className
        )}
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          x: enableMagnetic ? magneticX : 0,
          y: enableMagnetic ? magneticY : 0,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        onClick={onClick}
      >
        {children}
      </MotionComponent>
    )
  }
)

GlassCard.displayName = 'GlassCard'
