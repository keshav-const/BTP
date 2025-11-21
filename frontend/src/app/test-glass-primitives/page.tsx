'use client'

import React from 'react'
import {
  GlassCard,
  AnimatedCounter,
  FloatingElements,
  ParallaxSection,
} from '@/components/ui'

export default function GlassPrimitivesTestPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <ParallaxSection
        speed={0.6}
        overlay
        overlayOpacity={0.3}
        background={
          <div className="w-full h-full bg-gradient-dark" />
        }
        floatingElements={
          <FloatingElements
            count={8}
            colorScheme="emerald"
            speed="slow"
            size="lg"
            blur="xl"
          />
        }
        className="min-h-screen flex items-center"
      >
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-display-1 text-white mb-6">
              Glass Primitives
            </h1>
            <p className="text-xl text-zinc-300">
              Premium components with glassmorphism and advanced animations
            </p>
          </div>

          <GlassCard
            variant="accent"
            enableTilt
            className="max-w-2xl mx-auto p-12"
          >
            <h2 className="text-3xl font-serif mb-4">Interactive Glass Card</h2>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6">
              Move your mouse over this card to see the tilt effect. This card
              respects prefers-reduced-motion settings.
            </p>
            <div className="flex gap-6 justify-center">
              <div className="text-center">
                <AnimatedCounter
                  value={10000}
                  format="currency"
                  currency="INR"
                  className="text-4xl font-bold text-emerald-700 block mb-2"
                />
                <p className="text-sm text-zinc-500">Products</p>
              </div>
              <div className="text-center">
                <AnimatedCounter
                  value={99.9}
                  format="percent"
                  decimals={1}
                  delay={0.3}
                  className="text-4xl font-bold text-emerald-700 block mb-2"
                />
                <p className="text-sm text-zinc-500">Satisfaction</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </ParallaxSection>

      {/* Glass Card Variants */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="container">
          <h2 className="text-display-2 text-center mb-16">
            Glass Card Variants
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <GlassCard variant="default" className="p-8">
              <h3 className="text-2xl font-serif mb-4">Default</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Standard glass card with medium blur and subtle shadow
              </p>
            </GlassCard>

            <GlassCard variant="accent" className="p-8">
              <h3 className="text-2xl font-serif mb-4">Accent</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Enhanced glass with frosted border and prominent shadow
              </p>
            </GlassCard>

            <GlassCard variant="bordered" className="p-8">
              <h3 className="text-2xl font-serif mb-4">Bordered</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Heavy glass with visible border for emphasis
              </p>
            </GlassCard>
          </div>

          <h3 className="text-2xl font-serif text-center mb-8">
            Interactive Effects
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard
              variant="accent"
              enableTilt
              blurIntensity="heavy"
              className="p-8 min-h-[250px] flex items-center justify-center"
            >
              <div className="text-center">
                <h3 className="text-2xl font-serif mb-4">Tilt Effect</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  3D tilt on mouse movement
                </p>
              </div>
            </GlassCard>

            <GlassCard
              variant="bordered"
              enableMagnetic
              blurIntensity="medium"
              className="p-8 min-h-[250px] flex items-center justify-center"
            >
              <div className="text-center">
                <h3 className="text-2xl font-serif mb-4">Magnetic</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Magnetic attraction to cursor
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Animated Counters */}
      <section className="py-24 bg-white dark:bg-zinc-950">
        <div className="container">
          <h2 className="text-display-2 text-center mb-16">
            Animated Counters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <GlassCard className="p-8 text-center">
              <AnimatedCounter
                value={1234}
                format="number"
                className="text-5xl font-bold text-emerald-700 mb-2 block"
              />
              <p className="text-zinc-600 dark:text-zinc-400">Basic Number</p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <AnimatedCounter
                value={99999}
                format="currency"
                currency="INR"
                delay={0.2}
                className="text-4xl font-bold text-emerald-700 mb-2 block"
              />
              <p className="text-zinc-600 dark:text-zinc-400">Currency</p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <AnimatedCounter
                value={95.5}
                format="percent"
                decimals={1}
                delay={0.4}
                className="text-5xl font-bold text-emerald-700 mb-2 block"
              />
              <p className="text-zinc-600 dark:text-zinc-400">Percentage</p>
            </GlassCard>

            <GlassCard className="p-8 text-center">
              <AnimatedCounter
                value={1234567.89}
                format="number"
                decimals={2}
                delay={0.6}
                className="text-4xl font-bold text-emerald-700 mb-2 block"
              />
              <p className="text-zinc-600 dark:text-zinc-400">With Decimals</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Floating Elements Demo */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden">
        <FloatingElements
          count={10}
          colorScheme="mixed"
          speed="medium"
          size="md"
          blur="lg"
          zIndex={0}
        />

        <div className="container relative z-10">
          <h2 className="text-display-2 text-center mb-8">
            Floating Elements
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-16">
            Decorative gradient orbs and lines with GPU-accelerated animations.
            These elements are purely decorative and respect accessibility
            guidelines.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative min-h-[300px] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden">
              <FloatingElements
                count={5}
                colorScheme="emerald"
                speed="slow"
                size="sm"
                blur="md"
              />
              <div className="relative z-10 p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-xl font-serif mb-2">Emerald Slow</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Small size, medium blur
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[300px] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden">
              <FloatingElements
                count={6}
                colorScheme="zinc"
                speed="medium"
                size="md"
                blur="lg"
              />
              <div className="relative z-10 p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-xl font-serif mb-2">Zinc Medium</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Medium size, large blur
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[300px] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden">
              <FloatingElements
                count={8}
                colorScheme="mixed"
                speed="fast"
                size="lg"
                blur="xl"
              />
              <div className="relative z-10 p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-xl font-serif mb-2">Mixed Fast</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Large size, extra large blur
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complex Composition */}
      <ParallaxSection
        speed={0.4}
        overlay
        background={
          <div className="w-full h-full bg-gradient-emerald-zinc-mesh" />
        }
        floatingElements={
          <FloatingElements
            count={6}
            colorScheme="emerald"
            speed="slow"
            size="lg"
          />
        }
        className="py-32"
      >
        <div className="container">
          <GlassCard
            variant="accent"
            enableTilt
            enableMagnetic
            className="max-w-3xl mx-auto p-12"
          >
            <h2 className="text-display-2 mb-6 text-center">
              Complete Composition
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-300 text-center mb-8">
              This section combines all primitives: ParallaxSection, FloatingElements,
              and interactive GlassCard with both tilt and magnetic effects.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <AnimatedCounter
                  value={50000}
                  format="number"
                  className="text-3xl font-bold text-emerald-700 block mb-2"
                />
                <p className="text-sm text-zinc-500">Users</p>
              </div>
              <div className="text-center">
                <AnimatedCounter
                  value={250000}
                  format="currency"
                  delay={0.2}
                  className="text-3xl font-bold text-emerald-700 block mb-2"
                />
                <p className="text-sm text-zinc-500">Revenue</p>
              </div>
              <div className="text-center">
                <AnimatedCounter
                  value={98.5}
                  format="percent"
                  decimals={1}
                  delay={0.4}
                  className="text-3xl font-bold text-emerald-700 block mb-2"
                />
                <p className="text-sm text-zinc-500">Uptime</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </ParallaxSection>

      {/* Accessibility Note */}
      <section className="py-16 bg-emerald-700 text-white">
        <div className="container text-center">
          <h3 className="text-2xl font-serif mb-4">Accessibility First</h3>
          <p className="max-w-2xl mx-auto">
            All components respect <code className="px-2 py-1 bg-white/10 rounded">prefers-reduced-motion</code>.
            Users who prefer reduced motion will see static fallbacks instead of animations,
            ensuring the site is accessible to everyone.
          </p>
        </div>
      </section>
    </div>
  )
}
