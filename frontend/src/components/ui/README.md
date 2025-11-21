# Premium Glass Primitives

This directory contains reusable premium UI components with glassmorphism effects, advanced animations, and accessibility features.

## Components

### GlassCard

A glassmorphism card component with interactive tilt and magnetic effects.

**Features:**
- Three variants: `default`, `accent`, `bordered`
- Configurable blur intensity: `light`, `medium`, `heavy`
- Optional 3D tilt effect on mouse movement
- Optional magnetic attraction effect
- Respects `prefers-reduced-motion`
- Dark mode support
- Polymorphic (`as` prop for custom HTML elements)

**Usage:**
```tsx
import { GlassCard } from '@/components/ui'

// Basic usage
<GlassCard className="p-6">
  <h3>Content</h3>
</GlassCard>

// With tilt effect
<GlassCard variant="accent" enableTilt>
  <h3>Interactive Card</h3>
</GlassCard>

// With magnetic effect
<GlassCard enableMagnetic blurIntensity="heavy">
  <h3>Magnetic Card</h3>
</GlassCard>

// As a different element
<GlassCard as="article" className="p-8">
  <article content>
</GlassCard>
```

**Props:**
```typescript
interface GlassCardProps {
  variant?: 'default' | 'accent' | 'bordered'
  blurIntensity?: 'light' | 'medium' | 'heavy'
  enableTilt?: boolean
  enableMagnetic?: boolean
  as?: keyof JSX.IntrinsicElements
  className?: string
  children: React.ReactNode
}
```

---

### AnimatedCounter

Animated number counter with spring physics and formatting support.

**Features:**
- Spring-based animation using framer-motion
- Triggers when element enters viewport
- Support for number, currency, and percentage formatting
- Customizable locale and currency
- Configurable decimals
- Delay support
- Respects `prefers-reduced-motion`
- Accessible with `aria-live="polite"`

**Usage:**
```tsx
import { AnimatedCounter } from '@/components/ui'

// Simple number
<AnimatedCounter value={1234} />

// Currency
<AnimatedCounter 
  value={99999} 
  format="currency" 
  currency="INR"
  className="text-4xl font-bold text-emerald-700"
/>

// Percentage
<AnimatedCounter 
  value={95.5} 
  format="percent" 
  decimals={1}
/>

// With delay
<AnimatedCounter 
  value={5000} 
  delay={0.5}
/>
```

**Props:**
```typescript
interface AnimatedCounterProps {
  value: number
  format?: 'number' | 'currency' | 'percent'
  currency?: string      // Default: 'INR'
  locale?: string        // Default: 'en-IN'
  decimals?: number      // Default: 0
  duration?: number      // Reserved for future use
  delay?: number         // Delay in seconds before animation
  className?: string
}
```

---

### FloatingElements

Decorative gradient orbs and lines with GPU-accelerated animations.

**Features:**
- Generates random floating elements with deterministic seeding
- Configurable count, size, speed, and blur
- Three color schemes: `emerald`, `zinc`, `mixed`
- GPU-accelerated transforms
- Pointer-events disabled (purely decorative)
- `aria-hidden` for accessibility

**Usage:**
```tsx
import { FloatingElements } from '@/components/ui'

// Basic usage
<section className="relative">
  <FloatingElements />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</section>

// Custom configuration
<FloatingElements 
  count={8}
  colorScheme="emerald"
  speed="slow"
  size="lg"
  blur="xl"
  opacity={0.4}
/>

// Behind hero section
<div className="relative min-h-screen">
  <FloatingElements 
    count={10}
    colorScheme="mixed"
    zIndex={0}
  />
  <div className="relative z-10">
    {/* Hero content */}
  </div>
</div>
```

**Props:**
```typescript
interface FloatingElementsProps {
  count?: number                          // Default: 5
  colorScheme?: 'emerald' | 'zinc' | 'mixed'  // Default: 'emerald'
  speed?: 'slow' | 'medium' | 'fast'      // Default: 'medium'
  size?: 'sm' | 'md' | 'lg'               // Default: 'md'
  blur?: 'sm' | 'md' | 'lg' | 'xl'        // Default: 'lg'
  zIndex?: number                         // Default: -1
  opacity?: number                        // Default: 0.6
  className?: string
}
```

---

### ParallaxSection

Wrapper component for parallax scroll effects with slots for background and decorative elements.

**Features:**
- Parallax scroll effect using framer-motion's `useScroll` and `useTransform`
- Configurable parallax speed
- Optional gradient overlay
- Slots for background and floating elements
- Respects `prefers-reduced-motion`
- Polymorphic (`as` prop for custom HTML elements)

**Usage:**
```tsx
import { ParallaxSection, FloatingElements } from '@/components/ui'

// Basic parallax
<ParallaxSection speed={0.5}>
  <div className="container py-24">
    <h2>Content with parallax effect</h2>
  </div>
</ParallaxSection>

// With background and floating elements
<ParallaxSection
  speed={0.8}
  overlay
  overlayOpacity={0.3}
  background={
    <div className="w-full h-full bg-gradient-dark" />
  }
  floatingElements={
    <FloatingElements count={6} />
  }
  className="min-h-screen"
>
  <div className="container py-32">
    <h1>Hero Section</h1>
  </div>
</ParallaxSection>

// As a different element
<ParallaxSection as="div" speed={0.3}>
  <div className="p-12">
    {/* Content */}
  </div>
</ParallaxSection>
```

**Props:**
```typescript
interface ParallaxSectionProps {
  speed?: number                    // Default: 0.5 (parallax speed multiplier)
  overlay?: boolean                 // Default: false
  overlayOpacity?: number          // Default: 0.5
  background?: React.ReactNode     // Background layer content
  floatingElements?: React.ReactNode  // Floating elements layer
  as?: keyof JSX.IntrinsicElements  // Default: 'section'
  className?: string
  children?: React.ReactNode
}
```

---

## Composition Examples

### Hero Section with All Primitives

```tsx
<ParallaxSection
  speed={0.6}
  overlay
  background={
    <div className="w-full h-full bg-gradient-dark" />
  }
  floatingElements={
    <FloatingElements 
      count={8}
      colorScheme="emerald"
      speed="slow"
      size="lg"
    />
  }
  className="min-h-screen flex items-center"
>
  <div className="container">
    <GlassCard 
      variant="accent" 
      enableTilt 
      className="max-w-2xl mx-auto p-12"
    >
      <h1 className="text-display-1 mb-6">
        Premium Experience
      </h1>
      <p className="text-xl mb-8">
        Elevated design meets sophisticated technology
      </p>
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
```

### Stats Section

```tsx
<section className="py-24 bg-zinc-50 dark:bg-zinc-900">
  <div className="container">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, i) => (
        <GlassCard key={i} className="p-8 text-center">
          <AnimatedCounter
            value={stat.value}
            format={stat.format}
            delay={i * 0.2}
            className="text-5xl font-bold text-emerald-700 mb-2 block"
          />
          <p className="text-zinc-600 dark:text-zinc-400">
            {stat.label}
          </p>
        </GlassCard>
      ))}
    </div>
  </div>
</section>
```

---

## Accessibility

All components follow accessibility best practices:

- **Reduced Motion**: All animations respect `prefers-reduced-motion` media query
- **ARIA**: Appropriate ARIA attributes where needed (e.g., `aria-live` for counters)
- **Semantic HTML**: Support for custom semantic elements via `as` prop
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Readers**: Decorative elements are hidden with `aria-hidden`

---

## Performance

Components are optimized for performance:

- **GPU Acceleration**: Animations use `transform` and `opacity` for GPU acceleration
- **Memoization**: Expensive calculations are memoized with `useMemo`
- **Stable References**: Callbacks use `useCallback` to prevent unnecessary re-renders
- **Deterministic Randomness**: FloatingElements uses seeded random for consistent renders
- **Will Change**: Strategic use of `will-change` for animated properties

---

## Browser Support

These components work in all modern browsers that support:
- ES6+
- CSS backdrop-filter
- CSS transforms
- Framer Motion (React 18+)

For older browsers, graceful degradation is provided (e.g., static cards instead of animated ones).

---

## Testing

See the test page at `/test-glass-primitives` for live examples of all components and their variants.
