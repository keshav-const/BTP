# Premium Tech E-Commerce - Visual Design Guide

## 🎨 Design Philosophy

**"Premium Tech"** - A fusion of flagship technology design (Apple, Linear) and high-fashion e-commerce (Aēsop, Byredo). Minimalist but not empty, cinematic, and highly interactive.

## Color System

### Primary Palette
```
Emerald-700: #047857    → Primary accent (CTAs, links, active states)
Emerald-600: #059669    → Hover states
Emerald-500: #10b981    → Light accents
```

### Neutrals
```
Zinc-50:  #fafafa      → Light background
Zinc-100: #f4f4f5      → Light secondary background
Zinc-200: #e4e4e7      → Light borders
Zinc-900: #18181b      → Dark text on light
Zinc-950: #09090b      → Dark background
```

### Usage Rules
✅ Use emerald ONLY for:
- Primary action buttons
- Active navigation links
- Focus states
- Price displays
- Icons in feature sections

❌ Never use emerald for:
- Large background areas
- Body text
- Decorative elements (use zinc)

## Typography

### Font Families
```css
Headings: 'Playfair Display', serif
Body:     'Geist', sans-serif
```

### Type Scale
```
H1: 40-64px   | font-bold    | line-height: 1.2  | Playfair Display
H2: 32-48px   | font-semibold| line-height: 1.3  | Playfair Display  
H3: 24-36px   | font-semibold| line-height: 1.4  | Playfair Display
H4: 20-30px   | font-semibold| line-height: 1.4  | Playfair Display
Body: 16px    | font-normal  | line-height: 1.75 | Geist
Small: 14px   | font-normal  | line-height: 1.5  | Geist
```

### Typography Rules
✅ ALWAYS use serif for:
- All headings (h1-h6)
- Hero titles
- Section headings
- Product names in cards

✅ ALWAYS use sans-serif for:
- Body text
- Buttons
- Form labels
- Navigation
- Captions

## Spacing System

### Vertical Rhythm
```
Section padding:  64-128px (responsive)
Card padding:     24-40px
Button padding:   12-16px vertical
Grid gaps:        24-32px
```

### Container Widths
```
Max container:    80rem (1280px)
Content max:      64rem (1024px)
Card max:         28rem (448px)
```

## Shadows

### Shadow Scale
```css
premium-sm:  Subtle card shadow
premium:     Standard elevation
premium-md:  Medium elevation
premium-lg:  High elevation (hover)
premium-xl:  Maximum elevation (modals)
premium-emerald: Emerald-tinted for special elements
```

### Usage
- Cards at rest: `shadow-premium`
- Cards on hover: `shadow-premium-lg`
- Buttons: `shadow-premium` or `shadow-premium-md`
- Modals/overlays: `shadow-premium-xl`

## Border Radius

```
Buttons:  8px  (rounded-lg)
Cards:    12px (rounded-xl)
Images:   12-16px (rounded-xl or rounded-2xl)
Inputs:   8px  (rounded-lg)
Badges:   9999px (rounded-full)
```

**Rule**: Prefer `rounded-xl` (12px) for most components. Use `rounded-2xl` (16px) for large hero sections or feature cards.

## Animations

### Timing Functions
```
Entrance:     ease-out
Exit:         ease-in
Interactive:  ease-in-out
```

### Durations
```
Quick:   200ms  → Hover states, button interactions
Medium:  300ms  → Element entrances, color transitions
Slow:    500ms  → Page transitions, scroll reveals
Float:   3000ms → Decorative floating animations
```

### Animation Types

**Fade In**
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
```

**Slide Up**
```tsx
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

**Scale In**
```tsx
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.3 }}
```

**Scroll Reveal**
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5 }}
```

## Component Patterns

### Hero Section
```
- Full viewport height (min-h-screen)
- Gradient dark background
- Centered content
- Large serif heading (48-64px)
- Emerald accent on key words
- CTA buttons with icons
- Floating background elements
```

### Product Card
```
- 4:3 aspect ratio image
- Rounded corners (12px)
- Hover: image zoom (scale 1.05)
- Hover: emerald overlay (10% opacity)
- Hover: "Add to Cart" button fade-in
- Category badge (uppercase, small, muted)
- Product name (serif, 18px, bold)
- Price (emerald, 20px, bold)
- Rating stars
- Shadow elevation on hover
```

### Button
```
Primary:
  - Emerald background (#047857)
  - White text
  - Shadow on rest
  - Darker emerald on hover
  - Subtle lift effect (-2px translate)

Secondary:
  - Zinc background
  - Dark text (light) / Light text (dark)
  - No shadow
  - Darker on hover

Outline:
  - Transparent background
  - 2px emerald border
  - Emerald text
  - Light emerald fill on hover
```

### Form Input
```
- White/zinc-900 background
- 1px zinc border
- 12px padding
- 8px border radius
- Emerald border on focus
- 2px emerald ring on focus (20% opacity)
- Placeholder: zinc-500/zinc-400
```

## Dark Mode

### Color Mapping
```
Light Mode              → Dark Mode
----------------------------------
bg-zinc-50             → bg-zinc-950
text-zinc-900          → text-zinc-50
border-zinc-200        → border-zinc-800
bg-white               → bg-zinc-900
bg-zinc-100            → bg-zinc-800
text-zinc-600          → text-zinc-400
```

### Contrast Requirements
- **WCAG AA minimum** for all text
- Body text: 7:1 contrast ratio
- Large text: 4.5:1 contrast ratio
- Interactive elements: Clearly visible in both modes

### Dark Mode Implementation
```tsx
// Toggle in Header
const toggleDarkMode = () => {
  const newMode = !isDark
  setIsDark(newMode)
  document.documentElement.classList.toggle('dark', newMode)
  localStorage.setItem('theme', newMode ? 'dark' : 'light')
}
```

## Responsive Breakpoints

```
sm:  640px   → Mobile landscape
md:  768px   → Tablet portrait
lg:  1024px  → Tablet landscape / Small desktop
xl:  1280px  → Desktop
2xl: 1536px  → Large desktop
```

### Layout Shifts
```
Mobile (< 768px):
  - 1 column grids
  - Drawer navigation
  - Stacked buttons
  - Full-width cards

Tablet (768px - 1024px):
  - 2 column grids
  - Sidebar visible
  - Compact header
  - Reduced padding

Desktop (> 1024px):
  - 3-4 column grids
  - Full navigation
  - Maximum padding
  - Hover effects active
```

## Iconography

### Icon Library
**Lucide React** - Consistent, modern, crisp

### Icon Sizes
```
Small:   16px → Inline with text
Medium:  20px → Buttons, navigation
Large:   24px → Section headers
XLarge:  32-40px → Feature icons
```

### Icon Colors
- Default: Inherit text color
- Accent: Emerald-700 for active/important
- Muted: zinc-500/zinc-400 for secondary

### Usage
```tsx
import { ShoppingCart, Heart, User } from 'lucide-react'

<ShoppingCart size={20} className="text-zinc-600 dark:text-zinc-300" />
```

## Accessibility

### Contrast
- All text: WCAG AA minimum (4.5:1)
- Large text: 3:1 minimum
- Interactive elements: Clearly distinguishable

### Focus States
```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px emerald-700;
}
```

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<nav>` for navigation
- Use `<main>` for main content
- Use `<button>` for buttons (not divs)
- Use `<a>` for links
- Use proper ARIA labels where needed

### Keyboard Navigation
- All interactive elements reachable via Tab
- Clear focus indicators
- Logical tab order
- Enter/Space to activate buttons

## Performance

### Image Optimization
- Use Next.js `<Image>` component
- Lazy load below-fold images
- Provide proper width/height
- Use WebP format when possible

### Animation Performance
- Use transform and opacity (GPU-accelerated)
- Avoid animating layout properties
- Use `will-change` sparingly
- Prefer framer-motion for complex animations

### Code Splitting
- Pages auto-split by Next.js
- Lazy load heavy components
- Dynamic imports for modals/drawers

## Quality Checklist

Before marking any page complete:

✅ Dark mode works perfectly
✅ Responsive on all breakpoints
✅ All animations smooth (300ms+)
✅ Proper contrast (WCAG AA)
✅ Generous whitespace
✅ Soft, subtle shadows
✅ Serif headings, sans body
✅ Emerald used sparingly
✅ Hover states on all interactive elements
✅ Focus states visible
✅ No console errors
✅ Proper semantic HTML
✅ Images optimized
✅ Loading states handled
✅ Feels premium, handcrafted
✅ NOT generic AI template

---

**Remember**: Every detail matters. Premium design is about restraint, intention, and meticulous attention to the smallest details.
