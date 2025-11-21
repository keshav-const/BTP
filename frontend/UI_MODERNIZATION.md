# UI Modernization - Core Components

This document describes the modernization of core UI components completed as part of the premium design system upgrade.

## Overview

High-traffic UI components have been upgraded to match the premium glass/emerald design system while maintaining backward compatibility and ensuring no regression in cart/wishlist behavior.

## Components Modernized

### 1. Button Component (`src/components/ui/Button.tsx`)

#### New Features

**Premium Variants:**
- `solid` - Primary emerald button with shadow and hover lift (replaces `primary`)
- `outline` - Bordered emerald button with hover fill
- `glass` - Glassmorphism button with backdrop blur
- `link` - Text-only button with underline hover
- `icon` - Icon-only button for compact UIs
- `ghost` - Transparent button with emerald hover
- `primary`, `secondary` - Maintained for backward compatibility

**Icon Support:**
- `leftIcon` prop - Icon displayed before text
- `rightIcon` prop - Icon displayed after text
- Automatic icon-only mode when no children provided

**Loading State:**
- `loading` prop - Shows animated spinner and disables interaction
- Spinner size adapts to button size

**Magnetic Hover:**
- `magnetic` prop - Enables magnetic attraction effect on hover
- Respects `prefers-reduced-motion`
- Powered by `useMagneticHover` hook

**Accessibility:**
- WCAG AA focus outlines (2px emerald ring with offset)
- Works in both light and dark themes
- Proper disabled and loading states
- Full keyboard support

#### Usage Examples

```tsx
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Download } from 'lucide-react'

// Basic variants
<Button variant="solid">Shop Now</Button>
<Button variant="outline">Learn More</Button>
<Button variant="glass">See Details</Button>
<Button variant="link">View All</Button>

// With icons
<Button leftIcon={<ShoppingCart size={18} />}>
  Add to Cart
</Button>

<Button rightIcon={<Download size={18} />}>
  Download
</Button>

// Icon only
<Button variant="icon" leftIcon={<Settings size={20} />} />

// Loading state
<Button loading>Processing...</Button>

// Magnetic hover (premium effect)
<Button magnetic>Hover Me</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

#### Backward Compatibility

Old variant names continue to work:
- `primary` → maps to `solid`
- `secondary` → unchanged
- `ghost` → unchanged
- `outline` → unchanged

### 2. ProductCard Component (`src/components/ui/ProductCard.tsx`)

#### New Features

**GlassCard Foundation:**
- Built on top of `GlassCard` component
- GPU-accelerated tilt effect on hover
- Respects `prefers-reduced-motion`
- Bordered glass variant for premium look

**Enhanced Badges:**
- **"New" Badge** - Emerald badge with sparkle icon
- **Rating Badge** - Glass badge showing star rating (≥4.0 only)
- Animated entry with stagger

**Glass Hover Overlay:**
- Gradient overlay on image hover
- Smooth opacity transition
- Emerald tint for brand consistency

**Animated Controls:**
- **Wishlist Button** - Glass button with scale animations
- **Add to Cart Button** - Slides up on hover with icon and text
- Animated loading spinner when adding to cart
- Both respect reduced motion preferences

**Visual Enhancements:**
- Category text in emerald brand color
- Animated star rating reveal
- Price with separator border
- Image zoom on hover (GPU accelerated)
- Improved spacing and typography

#### Cart/Wishlist Logic

**✅ Unchanged - No Regressions:**
- All existing `addToCart` logic preserved
- Wishlist add/remove logic unchanged
- Loading states maintained
- Error handling preserved
- Product data structure compatible

#### Usage Example

```tsx
import { ProductCard } from '@/components/ui/ProductCard'

<ProductCard
  id="product-id"
  name="Premium Wireless Headphones"
  price={12999}
  category="Electronics"
  image="/images/headphones.jpg"
  rating={4.8}
  reviewCount={156}
  isNew={true}  // Optional: shows "New" badge
/>
```

## Shared Hooks

### `usePrefersReducedMotion`
Location: `src/hooks/use-prefers-reduced-motion.ts`

Detects user's motion preferences and provides a boolean flag.

```tsx
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'

const prefersReducedMotion = usePrefersReducedMotion()

if (!prefersReducedMotion) {
  // Apply animations
}
```

### `useMagneticHover`
Location: `src/hooks/use-magnetic-hover.ts`

Provides magnetic hover effect with spring physics.

```tsx
import { useMagneticHover } from '@/hooks/use-magnetic-hover'

const {
  elementRef,
  magneticX,
  magneticY,
  handleMouseMove,
  handleMouseLeave,
} = useMagneticHover({
  strength: 0.15,
  stiffness: 300,
  damping: 20,
})
```

## Performance Optimizations

### 60fps Animations
- All animations use `transform` and `opacity` only
- GPU-accelerated transforms: `translateY`, `scale`, `rotate`
- No layout thrashing or repaints

### Motion Safety
- `prefers-reduced-motion` respected everywhere
- Graceful fallbacks to static states
- No jarring motions on reduced motion devices

### Mobile Optimization
- Tap targets meet 44x44px minimum
- Touch-friendly spacing
- Optimized image loading with `sizes` attribute
- Reduced animation complexity on mobile

## Accessibility

### WCAG AA Compliance
- ✅ Focus indicators: 2px emerald ring with 2px offset
- ✅ Color contrast ratios meet AA standards
- ✅ Keyboard navigation fully supported
- ✅ Screen reader compatible ARIA labels
- ✅ Semantic HTML structure

### Interactive Elements
- All buttons have proper roles and labels
- Loading states communicated via disabled attribute
- Pressed states for wishlist toggle
- Focus visible on all interactive elements

## Testing

A comprehensive test page is available at `/test-ui-components` to verify:
- All button variants and states
- Icon positioning and loading states
- Magnetic hover effects
- Product card interactions
- Backward compatibility
- Accessibility features

## Migration Guide

### Updating Existing Buttons

**Old:**
```tsx
<Button variant="primary">Click Me</Button>
```

**New (same result, no changes needed):**
```tsx
<Button variant="primary">Click Me</Button>
// or use the new name:
<Button variant="solid">Click Me</Button>
```

**Add icons:**
```tsx
<Button 
  variant="solid" 
  leftIcon={<Icon />}
>
  Click Me
</Button>
```

**Add magnetic hover:**
```tsx
<Button variant="solid" magnetic>
  Premium Button
</Button>
```

### Updating ProductCard Usage

No changes required! The component interface is unchanged:

```tsx
<ProductCard
  id={product.id}
  name={product.name}
  price={product.price}
  category={product.category}
  image={product.images[0]}
  rating={4.5}
  reviewCount={123}
/>
```

Optionally add the new `isNew` prop:
```tsx
<ProductCard
  {...existingProps}
  isNew={true}  // Shows "New" badge
/>
```

## Files Modified

### New Files
- `src/hooks/use-prefers-reduced-motion.ts` - Motion preference detection
- `src/hooks/use-magnetic-hover.ts` - Magnetic hover effect
- `src/hooks/index.ts` - Hooks barrel export
- `src/app/test-ui-components/page.tsx` - Component test page

### Updated Files
- `src/components/ui/Button.tsx` - Complete rewrite with new variants
- `src/components/ui/ProductCard.tsx` - Rebuilt on GlassCard with enhancements
- `src/components/ui/GlassCard.tsx` - Now uses shared `usePrefersReducedMotion` hook

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Backdrop blur with fallbacks
- ✅ CSS Grid and Flexbox
- ✅ CSS Custom Properties

## Future Enhancements

Potential improvements for future iterations:
- Haptic feedback on mobile interactions
- More magnetic hover options (strength, radius)
- Additional button variants (danger, warning, info)
- Product card layouts (compact, wide, minimal)
- Animation presets (bounce, slide, fade)
