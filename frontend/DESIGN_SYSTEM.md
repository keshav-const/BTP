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

## 📚 Next Steps

With Phase 1 complete, the foundation is ready for:

1. **Component Library**: Build reusable UI components
2. **Page Templates**: Create consistent page layouts
3. **Interactive Elements**: Buttons, forms, modals
4. **Documentation**: Expand with component examples

---

**Last Updated**: Phase 1 Implementation Complete
**Design System Version**: 1.0.0
