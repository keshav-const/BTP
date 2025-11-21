# Premium Luxury Design System

This document outlines the complete design system foundation for the Modern Luxury Tech aesthetic.

## 📋 Implementation Status

### ✅ Phase 1 Complete: Design System & Color Variables

All tasks from Phase 1 have been successfully implemented:

1. **globals.css** - Enhanced with comprehensive design system
2. **tailwind.config.ts** - Extended with luxury design tokens
3. **layout.tsx** - Properly configured with fonts and metadata

---

## 🎨 Color Palette

### Primary Colors

#### Charcoal (Deep sophisticated dark)
- **Usage**: Primary text, backgrounds, headers
- **Scale**: 50-950 (lightest to darkest)
- **Base**: `#1a1f36` (900)
- **CSS Variable**: `--charcoal`, `--charcoal-light`

#### Gold (Warm luxury highlight)
- **Usage**: CTAs, accents, focus states
- **Scale**: 50-900
- **Base**: `#d4a574` (400)
- **CSS Variable**: `--gold`, `--gold-dark`

#### Taupe (Elegant neutral)
- **Usage**: Secondary text, borders, subtle backgrounds
- **Scale**: 50-900
- **Base**: `#9b8b7e` (500)
- **CSS Variable**: `--taupe`

#### Cream (Soft warm background)
- **Usage**: Page backgrounds, cards
- **Scale**: 50-900
- **Base**: `#f5f1ed` (300), `#faf8f6` (200)
- **CSS Variable**: `--cream`, `--cream-light`

#### Emerald (Nature accent)
- **Usage**: Success states, nature-themed elements
- **Scale**: 50-900
- **Base**: `#4a6b5e` (500)
- **CSS Variable**: `--emerald`

#### Bronze (Rich accent)
- **Usage**: Secondary highlights, gradients
- **Scale**: 50-900
- **Base**: `#a67c52` (500)
- **CSS Variable**: `--bronze`

### Semantic Color Variables

#### Light Mode
```css
--bg-primary: #faf8f6
--bg-secondary: #f5f1ed
--bg-tertiary: #ffffff
--bg-elevated: #ffffff
--bg-overlay: rgba(26, 31, 54, 0.5)

--text-primary: #1a1f36
--text-secondary: #2c3142
--text-tertiary: #9b8b7e
--text-inverse: #faf8f6

--border-default: #e6e2de
--border-subtle: #f5f1ed
--border-strong: #9b8b7e
--border-accent: #d4a574

--surface-default: #ffffff
--surface-elevated: #ffffff
--surface-overlay: rgba(255, 255, 255, 0.95)

--accent-primary: #d4a574
--accent-secondary: #a67c52
--accent-tertiary: #4a6b5e
```

#### Dark Mode
```css
--bg-primary: #1a1f36
--bg-secondary: #2c3142
--bg-tertiary: #444958
--bg-elevated: #2c3142
--bg-overlay: rgba(26, 31, 54, 0.8)

--text-primary: #faf8f6
--text-secondary: #f5f1ed
--text-tertiary: #9b8b7e
--text-inverse: #1a1f36

--border-default: #2c3142
--border-subtle: #1a1f36
--border-strong: #677084
--border-accent: #d4a574

--surface-default: #2c3142
--surface-elevated: #444958
--surface-overlay: rgba(44, 49, 66, 0.95)

--accent-primary: #d4a574
--accent-secondary: #a67c52
--accent-tertiary: #73a094
```

---

## 🔤 Typography

### Font Families

#### Serif - Playfair Display
- **Usage**: Headings (h1-h6), display text, luxury content
- **Weights**: 400, 500, 600, 700, 800, 900
- **Variable**: `--font-serif`
- **Class**: `font-serif`

#### Sans - Inter
- **Usage**: Body text, UI elements, paragraphs
- **Weights**: 300, 400, 500, 600, 700
- **Variable**: `--font-sans`
- **Class**: `font-sans`

### Display Sizes

```css
text-display-1: 4.5rem / 72px (line-height: 1.1, weight: 700)
text-display-2: 3.75rem / 60px (line-height: 1.1, weight: 700)
text-display-3: 3rem / 48px (line-height: 1.2, weight: 600)
```

---

## 🌟 Shadows

Premium depth system with subtle to dramatic shadows:

```css
shadow-luxury-sm: Subtle elevation for small cards
shadow-luxury: Standard card elevation
shadow-luxury-lg: Prominent elevation for modals
shadow-luxury-xl: Dramatic elevation for floating elements
shadow-luxury-gold: Special gold-tinted glow
shadow-inner-luxury: Inset shadow for depth
```

---

## ✨ Animations

### Keyframe Animations

All animations are defined in both globals.css and tailwind.config.ts:

- **fadeIn**: Simple opacity transition (0.4s)
- **fadeInUp**: Fade + slide up (0.5s)
- **fadeInDown**: Fade + slide down (0.4s)
- **scaleIn**: Scale from 95% to 100% (0.3s)
- **pulse**: Subtle opacity pulse (2s infinite)
- **slideInLeft**: Slide from left (0.4s)
- **slideInRight**: Slide from right (0.4s)
- **shimmer**: Shimmer effect (2s infinite)
- **float**: Floating effect (3s infinite)

### Animation Classes

```html
<!-- Tailwind utility classes -->
<div class="animate-fade-in">Fades in</div>
<div class="animate-fade-in-up">Fades in from below</div>
<div class="animate-fade-in-down">Fades in from above</div>
<div class="animate-scale-in">Scales in</div>
<div class="animate-pulse">Pulses</div>
<div class="animate-pulse-subtle">Subtle pulse</div>
<div class="animate-shimmer">Shimmer effect</div>
<div class="animate-float">Floating effect</div>
<div class="animate-slide-in-left">Slides from left</div>
<div class="animate-slide-in-right">Slides from right</div>
```

---

## 🎨 Gradients

### Tailwind Background Utilities

```html
<!-- Pre-defined gradient backgrounds -->
<div class="bg-gradient-luxury">Charcoal gradient</div>
<div class="bg-gradient-gold">Gold gradient</div>
<div class="bg-gradient-subtle">Cream gradient</div>
<div class="bg-gradient-radial-gold">Radial gold accent</div>
<div class="bg-gradient-radial-emerald">Radial emerald accent</div>
```

### Custom CSS Gradient Classes

```html
<!-- Custom gradient classes from globals.css -->
<div class="gradient-hero">Hero section gradient</div>
<div class="gradient-hero-overlay">Hero overlay gradient</div>
<div class="gradient-gold-radial">Gold radial gradient</div>
<div class="gradient-emerald-radial">Emerald radial gradient</div>
<div class="gradient-card">Card gradient (responsive to dark mode)</div>
```

### Gradient Text

```html
<h1 class="gradient-text">Gold-to-bronze gradient text</h1>
```

---

## ⏱️ Transitions

### Duration Timings

```css
duration-200: 200ms (fast)
duration-300: 300ms (normal)
duration-600: 600ms (slow)
```

### Custom Transition Classes

```html
<div class="transition-smooth">All properties, 300ms, smooth easing</div>
<div class="transition-smooth-fast">All properties, 200ms, smooth easing</div>
<div class="transition-smooth-slow">All properties, 600ms, smooth easing</div>
```

### Timing Function

```css
transition-smooth: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🎭 Special Effects

### Luxury Card Hover

```html
<div class="luxury-card-hover">
  <!-- Hover: translateY(-4px) + enhanced shadow -->
</div>
```

### Shimmer Effect

```html
<div class="luxury-shimmer">
  <!-- Infinite shimmer animation -->
</div>
```

### Premium Image Overlay

```html
<div class="premium-overlay">
  <img src="..." alt="..." />
  <!-- Hover: subtle gradient overlay -->
</div>
```

---

## 🎯 Border Radius

```css
rounded-xl: 0.75rem / 12px
rounded-2xl: 1rem / 16px
rounded-3xl: 1.5rem / 24px
```

---

## 📐 Spacing

Extended spacing scale:

```css
spacing-128: 32rem / 512px
spacing-144: 36rem / 576px
```

---

## 🔧 Usage Examples

### Premium Button

```html
<button class="bg-gradient-gold text-white px-6 py-3 rounded-xl shadow-luxury-lg
  hover:shadow-luxury-xl transition-smooth hover:scale-105 font-sans font-medium">
  Shop Now
</button>
```

### Luxury Card

```html
<div class="bg-surface-elevated rounded-2xl shadow-luxury p-6 luxury-card-hover
  transition-smooth">
  <h3 class="text-2xl font-serif text-text-primary gradient-text mb-4">
    Premium Product
  </h3>
  <p class="text-text-secondary font-sans">
    Description text
  </p>
</div>
```

### Hero Section

```html
<section class="bg-gradient-luxury relative overflow-hidden py-24">
  <div class="absolute inset-0 gradient-gold-radial"></div>
  <div class="relative z-10 animate-fade-in-up">
    <h1 class="text-display-1 font-serif text-text-inverse mb-6">
      Elevated Living
    </h1>
    <p class="text-xl text-text-inverse/90 font-sans">
      Curated with care
    </p>
  </div>
</section>
```

---

## 🌓 Dark Mode Support

All CSS variables automatically adapt to dark mode via:

```css
@media (prefers-color-scheme: dark) {
  /* Variables update here */
}
```

Components using semantic variables will automatically respond to dark mode.

---

## ✅ Acceptance Criteria Status

- ✅ All CSS variables defined in globals.css
- ✅ Dark mode variables configured
- ✅ Tailwind config extended with custom colors
- ✅ Animations defined and working
- ✅ Fonts properly configured
- ✅ No TypeScript errors in design system files

---

## 🧪 Testing

A test page has been created at `/design-system-test` to verify all design system features:

- Color palette display
- Shadow variants
- Animation effects
- Gradient backgrounds
- Typography examples
- Transition timings

---

## 🌈 Glassmorphism System

### Surface Layers

The design system provides three glassmorphism surface variants with emerald-zinc theming:

#### Glass Utility Classes

```html
<!-- Light frosted glass - 70% opacity, 12px blur -->
<div class="glass-light rounded-2xl p-6">
  Subtle glass surface for overlays
</div>

<!-- Medium frosted glass - 50% opacity, 16px blur -->
<div class="glass-medium rounded-2xl p-6">
  Balanced glass surface for cards
</div>

<!-- Heavy frosted glass - 90% opacity, 24px blur -->
<div class="glass-heavy rounded-2xl p-6">
  Prominent glass surface for modals
</div>
```

### Border Effects

```html
<!-- Frosted border with emerald glow -->
<div class="glass-medium frosted-border rounded-xl p-6">
  Glass card with glowing border
</div>

<!-- Emerald border glow -->
<div class="glass-border-glow rounded-xl p-6">
  Stronger emerald glow effect
</div>
```

### Noise Overlay

Add subtle texture to any glass surface:

```html
<div class="glass-medium glass-noise rounded-xl p-6">
  Glass surface with subtle noise texture
</div>
```

### Backdrop Blur Utilities

Extended Tailwind backdrop blur scale:

```css
backdrop-blur-glass-sm: 8px blur
backdrop-blur-glass: 12px blur (default)
backdrop-blur-glass-md: 16px blur
backdrop-blur-glass-heavy: 24px blur
backdrop-blur-glass-xl: 32px blur
```

---

## 🎨 Enhanced Gradient System

### New Gradient Backgrounds

```html
<!-- Emerald spotlight - radial from top -->
<div class="bg-gradient-emerald-spotlight">
  Emerald spotlight effect
</div>

<!-- Zinc dusk - diagonal zinc gradient -->
<div class="bg-gradient-zinc-dusk">
  Subtle zinc background
</div>

<!-- Emerald-Zinc mesh - four-corner radial blend -->
<div class="bg-gradient-emerald-zinc-mesh">
  Complex mesh gradient
</div>

<!-- Shimmer sweep - animated shimmer background -->
<div class="bg-shimmer-sweep bg-shimmer-sweep animate-shimmer-sweep">
  Animated shimmer effect
</div>
```

### CSS Custom Property Gradients

Available as CSS variables for custom implementations:

```css
var(--gradient-emerald-spotlight)
var(--gradient-zinc-dusk)
var(--gradient-emerald-zinc-mesh)
```

Use with utility classes:

```html
<div class="gradient-emerald-spotlight">Uses CSS variable</div>
<div class="gradient-zinc-dusk">Uses CSS variable</div>
<div class="gradient-emerald-zinc-mesh">Uses CSS variable</div>
```

---

## ✨ Enhanced Shadow System

### Glass Shadows

```html
<div class="shadow-glass-sm">Subtle glass shadow</div>
<div class="shadow-glass">Standard glass shadow</div>
<div class="shadow-glass-lg">Prominent glass shadow</div>
```

### Emerald Glow Effects

```html
<div class="shadow-glow-emerald">Emerald glow</div>
<div class="shadow-glow-emerald-lg">Large emerald glow</div>
<div class="shadow-inner-glow">Inner emerald glow</div>
```

---

## 🎯 Magnetic Interactions

### Magnetic Target Zones

Interactive elements with spring-like magnetic feel:

```html
<!-- Magnetic hover effect -->
<button class="magnetic-target rounded-xl px-6 py-3 bg-emerald-700 text-white">
  Magnetic Button
</button>

<!-- Magnetic with emerald glow -->
<div class="magnetic-target magnetic-glow glass-medium rounded-xl p-6">
  Interactive card with glow
</div>
```

**Behavior:**
- Hover: Lifts 2px up and scales to 102%
- Active: Returns to origin and scales to 98%
- Timing: Cubic-bezier bounce (0.34, 1.56, 0.64, 1)

---

## 🚀 GPU-Optimized Transforms

### Performance Classes

```html
<!-- Force GPU acceleration -->
<div class="gpu-accelerated">
  Uses translate3d, will-change, backface-visibility
</div>

<!-- Smooth GPU transitions -->
<div class="gpu-transition">
  Optimized transform transitions
</div>

<!-- GPU hover lift -->
<div class="gpu-hover gpu-transition rounded-xl">
  Lifts 4px on hover with GPU acceleration
</div>
```

**When to Use:**
- Elements with frequent transforms
- Scroll-driven animations
- Interactive cards and buttons
- Parallax effects

**Warning:** Don't overuse `will-change` - apply only to actively animating elements.

---

## 🎬 New Animation System

### Parallax & Orbit Animations

```html
<!-- Slow parallax drift - 20s -->
<div class="animate-parallax-drift">
  Drifts with subtle rotation
</div>

<!-- Float in orbital path - 12s -->
<div class="animate-float-orbit">
  Orbital floating motion
</div>
```

### Shimmer & Pulse Effects

```html
<!-- Shimmer sweep animation - 3s -->
<div class="bg-shimmer-sweep bg-shimmer-sweep animate-shimmer-sweep">
  Sweeping shimmer effect
</div>

<!-- Magnetic pulse - 2s -->
<div class="animate-magnetic-pulse rounded-xl">
  Pulsing emerald glow and scale
</div>
```

### Animation Reference

| Animation | Duration | Timing | Use Case |
|-----------|----------|--------|----------|
| `parallax-drift` | 20s | ease-in-out infinite | Background elements, decorative layers |
| `float-orbit` | 12s | ease-in-out infinite | Hero graphics, feature icons |
| `shimmer-sweep` | 3s | ease-in-out infinite | Loading states, premium highlights |
| `magnetic-pulse` | 2s | cubic-bezier infinite | CTAs, interactive hotspots |

---

## 🎨 Advanced Timing Functions

New easing curves for 60fps micro-interactions:

```html
<!-- Smooth premium easing -->
<div class="transition-all duration-300 ease-premium">
  Premium easing curve
</div>

<!-- Magnetic spring effect -->
<div class="transition-transform duration-150 ease-magnetic">
  Spring-like magnetic feel
</div>

<!-- Bounce-in effect -->
<div class="transition-all duration-400 ease-bounce-in">
  Playful bounce entrance
</div>

<!-- Smooth default -->
<div class="transition-all duration-300 ease-smooth">
  Standard smooth easing
</div>
```

**Timing Function Values:**
- `ease-smooth`: `cubic-bezier(0.4, 0, 0.2, 1)` - Default smooth
- `ease-bounce-in`: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Bounce effect
- `ease-magnetic`: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Spring/magnetic
- `ease-premium`: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` - Premium feel

---

## ♿ Motion-Safe & Accessibility

### Reduced Motion Support

All animations respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations reduced to 0.01ms */
  /* All transforms disabled */
  /* Scroll behavior set to auto */
}
```

### Motion-Safe Classes

```html
<!-- Animation only when motion is allowed -->
<div class="motion-safe-animate animate-float">
  Animates only if user allows motion
</div>

<!-- Transform only when motion is allowed -->
<div class="motion-safe-transform magnetic-target">
  Transforms only if user allows motion
</div>
```

### Best Practices

1. **Always test with reduced motion**: Enable in browser DevTools
2. **Essential UI must work without animation**: Don't hide critical feedback behind motion
3. **Prefer `motion-safe-*` classes**: For decorative animations
4. **Layout must not break**: When animations are disabled

### Animations Disabled in Reduced Motion

- All `animate-*` classes
- `magnetic-target` hover/active transforms
- `gpu-hover` transforms
- `premium-card-hover` transforms
- Shimmer effects
- Float/drift animations

---

## 📐 Additional Utilities

### Scale Utilities

```html
<div class="hover:scale-102">Subtle scale up (1.02)</div>
<div class="active:scale-98">Subtle scale down (0.98)</div>
```

### Background Size

```css
bg-shimmer-sweep: 200% 100% (for shimmer animations)
bg-gradient-animated: 400% 400% (for gradient shifts)
```

---

## 💡 Usage Guidelines

### When to Use Glassmorphism

✅ **Good Use Cases:**
- Hero overlays on images
- Floating navigation bars
- Modal dialogs and popovers
- Notification toasts
- Premium feature cards

❌ **Avoid:**
- Large content areas (readability issues)
- Over solid colors (defeats the purpose)
- Stacking multiple glass layers (performance)

### When to Use Magnetic Interactions

✅ **Good Use Cases:**
- Primary CTAs
- Interactive product cards
- Navigation items
- Tool buttons

❌ **Avoid:**
- Text links in paragraphs
- Small icons (< 32px)
- Dense lists with many items

### Performance Tips

1. **Limit `will-change`**: Only on actively animating elements
2. **Use `translate3d`**: Instead of `translateY` for GPU acceleration
3. **Batch animations**: Start multiple animations together
4. **Debounce scroll listeners**: For parallax effects
5. **Test on low-end devices**: 60fps on desktop ≠ 60fps on mobile

---

## 📚 Next Steps

With the enhanced design system complete, the foundation now supports:

1. **Premium Glassmorphism**: Layered glass surfaces with emerald-zinc theming
2. **Advanced Animations**: Parallax, orbit, shimmer, and magnetic effects
3. **Accessibility**: Full reduced-motion support
4. **Performance**: GPU-optimized transforms
5. **Interaction Design**: Magnetic targets and spring animations

---

**Last Updated**: Enhanced Design System with Glassmorphism & Motion-Safe
**Design System Version**: 2.0.0
