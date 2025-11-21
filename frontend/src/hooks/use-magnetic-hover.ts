'use client'

import { useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from './use-prefers-reduced-motion'

interface MagneticHoverOptions {
  strength?: number
  stiffness?: number
  damping?: number
}

export function useMagneticHover({
  strength = 0.15,
  stiffness = 300,
  damping = 20,
}: MagneticHoverOptions = {}) {
  const elementRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const magneticX = useSpring(useMotionValue(0), {
    stiffness,
    damping,
  })
  const magneticY = useSpring(useMotionValue(0), {
    stiffness,
    damping,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || !elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseXPos = e.clientX - centerX
    const mouseYPos = e.clientY - centerY

    const distance = Math.sqrt(mouseXPos ** 2 + mouseYPos ** 2)
    const maxDistance = Math.sqrt(rect.width ** 2 + rect.height ** 2) / 2

    if (distance < maxDistance) {
      magneticX.set(mouseXPos * strength)
      magneticY.set(mouseYPos * strength)
    }
  }

  const handleMouseLeave = () => {
    if (prefersReducedMotion) return

    magneticX.set(0)
    magneticY.set(0)
  }

  return {
    elementRef,
    magneticX,
    magneticY,
    handleMouseMove,
    handleMouseLeave,
    prefersReducedMotion,
  }
}
