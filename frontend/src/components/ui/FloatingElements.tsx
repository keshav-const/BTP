'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ElementType = 'orb' | 'line'
type ColorScheme = 'emerald' | 'zinc' | 'mixed'

interface FloatingElement {
  id: string
  type: ElementType
  size: number
  x: number
  y: number
  duration: number
  delay: number
  blur: number
}

interface FloatingElementsProps {
  count?: number
  colorScheme?: ColorScheme
  speed?: 'slow' | 'medium' | 'fast'
  size?: 'sm' | 'md' | 'lg'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  zIndex?: number
  opacity?: number
  className?: string
}

const speedDurations = {
  slow: { min: 15, max: 25 },
  medium: { min: 8, max: 15 },
  fast: { min: 5, max: 10 },
}

const sizeMappings = {
  sm: { min: 50, max: 150 },
  md: { min: 150, max: 300 },
  lg: { min: 300, max: 500 },
}

const blurMappings = {
  sm: { min: 20, max: 40 },
  md: { min: 40, max: 80 },
  lg: { min: 80, max: 120 },
  xl: { min: 120, max: 200 },
}

const colorClasses = {
  emerald: [
    'bg-gradient-to-br from-emerald-400/30 to-emerald-600/30',
    'bg-gradient-to-br from-emerald-500/25 to-emerald-700/25',
    'bg-gradient-to-br from-emerald-300/20 to-emerald-500/20',
  ],
  zinc: [
    'bg-gradient-to-br from-zinc-400/20 to-zinc-600/20',
    'bg-gradient-to-br from-zinc-300/15 to-zinc-500/15',
    'bg-gradient-to-br from-zinc-500/25 to-zinc-700/25',
  ],
  mixed: [
    'bg-gradient-to-br from-emerald-400/30 to-emerald-600/30',
    'bg-gradient-to-br from-zinc-400/20 to-zinc-600/20',
    'bg-gradient-to-br from-emerald-300/20 to-zinc-500/20',
  ],
}

// Stable random number generator for consistent element generation
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const generateElements = (
  count: number,
  speedConfig: { min: number; max: number },
  sizeConfig: { min: number; max: number },
  blurConfig: { min: number; max: number },
  colors: string[]
): Array<FloatingElement & { color: string }> => {
  return Array.from({ length: count }, (_, i) => {
    // Use deterministic seeded random based on index
    const seed = i + 1
    const random1 = seededRandom(seed * 1.1)
    const random2 = seededRandom(seed * 2.2)
    const random3 = seededRandom(seed * 3.3)
    const random4 = seededRandom(seed * 4.4)
    const random5 = seededRandom(seed * 5.5)
    const random6 = seededRandom(seed * 6.6)
    const random7 = seededRandom(seed * 7.7)

    const elementSize = sizeConfig.min + random1 * (sizeConfig.max - sizeConfig.min)
    const elementBlur = blurConfig.min + random2 * (blurConfig.max - blurConfig.min)

    return {
      id: `floating-element-${i}`,
      type: random3 > 0.8 ? ('line' as const) : ('orb' as const),
      size: elementSize,
      x: random4 * 100,
      y: random5 * 100,
      duration: speedConfig.min + random6 * (speedConfig.max - speedConfig.min),
      delay: random7 * 2,
      blur: elementBlur,
      color: colors[Math.floor(random1 * colors.length)],
    }
  })
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  count = 5,
  colorScheme = 'emerald',
  speed = 'medium',
  size = 'md',
  blur = 'lg',
  zIndex = -1,
  opacity = 0.6,
  className,
}) => {
  const elements = useMemo(() => {
    const speedConfig = speedDurations[speed]
    const sizeConfig = sizeMappings[size]
    const blurConfig = blurMappings[blur]
    const colors = colorClasses[colorScheme]

    return generateElements(count, speedConfig, sizeConfig, blurConfig, colors)
  }, [count, speed, size, blur, colorScheme])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{ zIndex }}
      aria-hidden="true"
    >
      {elements.map((element) => {
        const isLine = element.type === 'line'

        return (
          <motion.div
            key={element.id}
            className={cn(
              'absolute',
              element.color,
              isLine ? 'rounded-full' : 'rounded-full'
            )}
            style={{
              width: isLine ? element.size * 1.5 : element.size,
              height: isLine ? element.size * 0.2 : element.size,
              left: `${element.x}%`,
              top: `${element.y}%`,
              filter: `blur(${element.blur}px)`,
              opacity,
              willChange: 'transform',
            }}
            animate={{
              x: [0, 30, -20, 20, 0],
              y: [0, -40, -60, -30, 0],
              rotate: isLine ? [0, 90, 180, 270, 360] : [0, 10, -10, 5, 0],
              scale: [1, 1.1, 0.9, 1.05, 1],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </div>
  )
}

FloatingElements.displayName = 'FloatingElements'
