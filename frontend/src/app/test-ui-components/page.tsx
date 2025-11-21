'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { ShoppingCart, Heart, Download, Settings, Sparkles } from 'lucide-react'

export default function UIComponentsTest() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <div>
          <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Modernized UI Components Test
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Testing premium Button variants and enhanced ProductCard
          </p>
        </div>

        {/* Button Variants */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Button Variants
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              All variants with WCAG AA focus states and optional magnetic hover
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Solid Variant</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="solid" size="sm">Small Button</Button>
                <Button variant="solid" size="md">Medium Button</Button>
                <Button variant="solid" size="lg">Large Button</Button>
                <Button variant="solid" size="md" magnetic>Magnetic Hover</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Outline Variant</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="outline" size="sm">Small Outline</Button>
                <Button variant="outline" size="md">Medium Outline</Button>
                <Button variant="outline" size="lg">Large Outline</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Glass Variant</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="glass" size="sm">Small Glass</Button>
                <Button variant="glass" size="md">Medium Glass</Button>
                <Button variant="glass" size="lg">Large Glass</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Link & Ghost Variants</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="link">Link Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Icon Button</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="icon" size="sm" leftIcon={<Settings size={16} />} />
                <Button variant="icon" size="md" leftIcon={<Settings size={20} />} />
                <Button variant="icon" size="lg" leftIcon={<Settings size={24} />} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">With Icons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="solid" leftIcon={<ShoppingCart size={18} />}>
                  Add to Cart
                </Button>
                <Button variant="outline" rightIcon={<Download size={18} />}>
                  Download
                </Button>
                <Button variant="glass" leftIcon={<Sparkles size={18} />} rightIcon={<Heart size={18} />}>
                  Favorite
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Loading & Disabled States</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="solid" loading>Loading...</Button>
                <Button variant="outline" loading>Processing</Button>
                <Button variant="solid" disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">Backward Compatibility</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                Old variant names still work (primary, secondary, ghost)
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Cards */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Enhanced Product Cards
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Built with GlassCard, GPU tilt, glass overlays, and animated controls
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              id="674ebf9d36bf7cf4fbc5a1b6"
              name="Premium Wireless Headphones"
              price={12999}
              category="Electronics"
              image="/placeholder.svg"
              rating={4.8}
              reviewCount={156}
              isNew={true}
            />
            <ProductCard
              id="674ebf9d36bf7cf4fbc5a1b7"
              name="Designer Leather Wallet"
              price={4999}
              category="Accessories"
              image="/placeholder.svg"
              rating={4.5}
              reviewCount={89}
              isNew={false}
            />
            <ProductCard
              id="674ebf9d36bf7cf4fbc5a1b8"
              name="Luxury Smartwatch"
              price={24999}
              category="Watches"
              image="/placeholder.svg"
              rating={4.9}
              reviewCount={234}
              isNew={true}
            />
          </div>
        </section>

        {/* Performance Notes */}
        <section className="glass-medium rounded-2xl p-6">
          <h2 className="text-xl font-serif font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Performance & Accessibility
          </h2>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-500 mt-0.5">✓</span>
              <span>All animations use <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs">transform</code> and <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs">opacity</code> for 60fps</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-500 mt-0.5">✓</span>
              <span>Motion effects respect <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs">prefers-reduced-motion</code></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-500 mt-0.5">✓</span>
              <span>Focus outlines meet WCAG AA standards (2px emerald ring with offset)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-500 mt-0.5">✓</span>
              <span>Magnetic hover and tilt effects fallback gracefully</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-500 mt-0.5">✓</span>
              <span>All interactive elements have proper ARIA labels and keyboard support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-500 mt-0.5">✓</span>
              <span>Minimum tap target size of 44x44px on mobile</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
