'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { ArrowRight, Sparkles, Shield, Truck, Star } from 'lucide-react'
import productsApi from '@/api/products'
import type { Product } from '@/types/product'

export default function HomePage() {
  const [mounted, setMounted] = React.useState(false)
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([])

  React.useEffect(() => {
    setMounted(true)
    
    const fetchProducts = async () => {
      try {
        const result = await productsApi.list({ limit: 4 })
        setFeaturedProducts(result.items)
      } catch (err) {
        console.error('Failed to fetch featured products:', err)
      }
    }

    void fetchProducts()
  }, [])

  const HeroContainer: React.ElementType = mounted ? motion.div : 'div'
  const HeroBadge: React.ElementType = mounted ? motion.div : 'div'
  const ScrollIndicator: React.ElementType = mounted ? motion.div : 'div'
  const ScrollDot: React.ElementType = mounted ? motion.div : 'div'

  const heroMotionProps = mounted
    ? {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: 'easeOut' },
      }
    : {}

  const badgeMotionProps = mounted
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, delay: 0.2 },
      }
    : {}

  const scrollContainerMotionProps = mounted
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 1.5 },
      }
    : {}

  const scrollDotMotionProps = mounted
    ? {
        animate: { y: [0, 12, 0] },
        transition: { duration: 1.5, repeat: Infinity },
      }
    : {}

  return (
    <div className="w-full">
      {/* Hero Section - Cinematic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 text-center px-6">
          <HeroContainer {...heroMotionProps}>
            <HeroBadge
              {...badgeMotionProps}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700/10 border border-emerald-700/20 mb-8"
            >
              <Sparkles size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Handcrafted Excellence</span>
            </HeroBadge>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-50 mb-6 leading-tight">
              Welcome to{' '}
              <span className="gradient-text bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Premium
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Curating exceptional products for elevated living. Experience the perfect blend of luxury and functionality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className={buttonVariants({ size: 'lg', className: 'group' })}
              >
                <span>Shop Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/about"
                className={buttonVariants({ variant: 'outline', size: 'lg', className: 'text-zinc-300 border-zinc-700 hover:border-emerald-700' })}
              >
                Learn More
              </Link>
            </div>
          </HeroContainer>
        </div>

        {/* Scroll Indicator */}
        <ScrollIndicator
          {...scrollContainerMotionProps}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2">
            <ScrollDot
              {...scrollDotMotionProps}
              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
            />
          </div>
        </ScrollIndicator>
      </section>

      {/* Features Section */}
      <section className="section bg-zinc-50 dark:bg-zinc-950">
        <div className="container">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              The Elevated Experience
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Every detail matters when it comes to exceptional service and quality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Quality Guaranteed',
                description: 'Every product is carefully curated and verified for authenticity and excellence.',
              },
              {
                icon: Truck,
                title: 'Fast Shipping',
                description: 'Express delivery to your doorstep. Track your order every step of the way.',
              },
              {
                icon: Star,
                title: 'Premium Support',
                description: 'Dedicated customer service team ready to assist you 24/7.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="premium-card-hover p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-emerald-subtle flex items-center justify-center">
                  <feature.icon size={32} className="text-emerald-700" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section bg-white dark:bg-zinc-900">
        <div className="container">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 mb-6">
              <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium uppercase tracking-wider">
                Curated Collections
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Handpicked Selection
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products, selected for their exceptional quality and design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                price={product.price}
                category={product.category ?? 'Uncategorized'}
                image={product.images?.[0] ?? '/placeholder.jpg'}
                rating={4.5}
                reviewCount={0}
              />
            ))}
          </div>

          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Link
              href="/products"
              className={buttonVariants({ variant: 'outline', size: 'lg', className: 'group' })}
            >
              <span>View All Products</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section bg-gradient-dark">
        <div className="container">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-zinc-50 mb-6">
              Stay Connected
            </h2>
            <p className="text-lg text-zinc-300 mb-8">
              Subscribe to our newsletter for exclusive offers, new arrivals, and curated inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all duration-200"
              />
              <Button size="lg" type="submit">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
