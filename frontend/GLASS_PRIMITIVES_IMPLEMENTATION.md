# Glass Primitives Implementation

## Overview

This document describes the implementation of reusable premium glass primitives components that power the new premium experience.

## Components Implemented

### 1. GlassCard (`src/components/ui/GlassCard.tsx`)

A glassmorphism card component with advanced interactive features.

**Features:**
- Three visual variants: `default`, `accent`, `bordered`
- Configurable blur intensity: `light`, `medium`, `heavy`
- Optional 3D tilt effect using framer-motion springs
- Optional magnetic attraction effect
- Respects `prefers-reduced-motion` for accessibility
- Dark mode aware borders and styling
- Polymorphic component (custom element via `as` prop)

**Technical Highlights:**
- Uses `useMotionValue` and `useSpring` for smooth animations
- Implements mouse tracking for interactive effects
- Falls back to static rendering when reduced motion is preferred
- GPU-accelerated transforms with `transformStyle: 'preserve-3d'`

### 2. AnimatedCounter (`src/components/ui/AnimatedCounter.tsx`)

Spring-animated number counter with formatting support.

**Features:**
- Counts up when element enters viewport
- Spring-based physics animation
- Support for number, currency, and percent formatting
- Customizable locale (default: `en-IN`)
- Customizable currency (default: `INR`)
- Configurable decimal places
- Animation delay support
- Respects `prefers-reduced-motion`
- Accessible with `aria-live="polite"`

**Technical Highlights:**
- Uses `useInView` to trigger animation on scroll
- `useSpring` for smooth, natural counting animation
- `useCallback` for memoized formatting function
- `Intl.NumberFormat` for proper internationalization
- `queueMicrotask` to avoid synchronous setState in effects

### 3. FloatingElements (`src/components/ui/FloatingElements.tsx`)

Decorative gradient orbs and lines with GPU-accelerated animations.

**Features:**
- Generates configurable number of floating elements
- Three color schemes: `emerald`, `zinc`, `mixed`
- Configurable speed presets: `slow`, `medium`, `fast`
- Configurable size presets: `sm`, `md`, `lg`
- Configurable blur intensity: `sm`, `md`, `lg`, `xl`
- Customizable z-index and opacity
- Purely decorative (`pointer-events-none`, `aria-hidden`)

**Technical Highlights:**
- Deterministic seeded random generation for consistent renders
- Avoids calling `Math.random()` during render (React 19 purity requirement)
- GPU-accelerated with `translate3d` and `willChange: 'transform'`
- Uses `useMemo` for element generation
- Complex motion animations with multiple waypoints

### 4. ParallaxSection (`src/components/ui/ParallaxSection.tsx`)

Wrapper component for parallax scroll effects.

**Features:**
- Parallax scroll effect with configurable speed
- Slots for background layer
- Slots for floating elements layer
- Optional gradient overlay with customizable opacity
- Respects `prefers-reduced-motion`
- Polymorphic component

**Technical Highlights:**
- Uses `useScroll` with viewport offset tracking
- `useTransform` for smooth parallax calculations
- Multiple layers with different parallax speeds
- Proper hook ordering (no conditional hook calls)
- Falls back to static rendering for reduced motion

## Architecture Decisions

### Accessibility

All components follow accessibility best practices:
- Respect `prefers-reduced-motion` media query
- Proper ARIA attributes (`aria-live`, `aria-label`, `aria-describedby`)
- Decorative elements hidden with `aria-hidden`
- Keyboard accessible
- Screen reader friendly

### Performance

Components are optimized for performance:
- GPU-accelerated animations (transform, opacity)
- Strategic use of `willChange` CSS property
- Memoization with `useMemo` and `useCallback`
- Deterministic random generation (no re-renders)
- Minimal re-renders with stable references

### Type Safety

All components are fully typed:
- Explicit TypeScript interfaces
- React.forwardRef with proper generic types
- Polymorphic component support with `as` prop
- No `any` types used

### React 19 Compatibility

Components follow React 19 strict rules:
- No impure functions in render (Math.random moved to helper)
- No synchronous setState in effects (using queueMicrotask)
- Proper hook dependencies
- Idempotent component behavior

## Exports

All components are exported through the barrel file:

```typescript
// src/components/ui/index.ts
export { Button, buttonVariants } from './Button'
export { GlassCard } from './GlassCard'
export { AnimatedCounter } from './AnimatedCounter'
export { FloatingElements } from './FloatingElements'
export { ParallaxSection } from './ParallaxSection'
export { ProductCard } from './ProductCard'
export { ToastProvider } from './ToastProvider'
```

## Documentation

### Visual Design Guide

Updated `VISUAL_DESIGN_GUIDE.md` with:
- Component usage examples
- Props documentation
- Composition patterns
- Accessibility notes

### Component README

Created `src/components/ui/README.md` with:
- Detailed component documentation
- Full prop interfaces
- Usage examples
- Composition examples
- Accessibility guidelines
- Performance notes
- Browser support

## Test Page

Created comprehensive test page at `/test-glass-primitives` demonstrating:
- All component variants
- Interactive effects (tilt, magnetic)
- Animated counters with different formats
- Floating elements with different configurations
- Complete composition examples
- Parallax sections with all features

## Linting & Type Checking

All components pass:
- ✅ ESLint (only 1 intentional warning: unused `_duration` parameter)
- ✅ TypeScript type checking
- ✅ Next.js build
- ✅ React 19 strict mode rules

## Dependencies

Uses existing dependencies:
- `framer-motion` - Animation library
- `class-variance-authority` (via clsx) - Class name management
- React 19 - UI framework
- TypeScript - Type safety

No new dependencies added.

## Browser Support

Components work in all modern browsers supporting:
- ES6+
- CSS backdrop-filter
- CSS transforms
- Framer Motion

Graceful degradation for older browsers (static fallbacks).

## Usage Example

```tsx
import { 
  GlassCard, 
  AnimatedCounter, 
  FloatingElements, 
  ParallaxSection 
} from '@/components/ui'

export default function HeroSection() {
  return (
    <ParallaxSection
      speed={0.6}
      overlay
      background={<div className="w-full h-full bg-gradient-dark" />}
      floatingElements={<FloatingElements count={8} size="lg" />}
      className="min-h-screen flex items-center"
    >
      <div className="container">
        <GlassCard variant="accent" enableTilt className="max-w-2xl mx-auto p-12">
          <h1 className="text-display-1 mb-6">Premium Experience</h1>
          <div className="flex gap-4">
            <AnimatedCounter 
              value={10000} 
              format="currency"
              className="text-3xl font-bold text-emerald-700"
            />
            <AnimatedCounter 
              value={99.9} 
              format="percent"
              decimals={1}
              className="text-3xl font-bold text-emerald-700"
            />
          </div>
        </GlassCard>
      </div>
    </ParallaxSection>
  )
}
```

## Next Steps

These primitives are ready to be used throughout the application to create:
- Hero sections
- Feature showcases
- Stats sections
- Testimonials
- Call-to-action sections
- Product highlights

All components follow the established design system and can be composed together for rich, premium user experiences.
