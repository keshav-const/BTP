'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { ParallaxSection } from '@/components/ui/ParallaxSection'
import { FloatingElements } from '@/components/ui/FloatingElements'
import { ProductCard } from '@/components/ui/ProductCard'
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Truck, 
  Star, 
  Heart,
  Zap,
  Award,
  Mail
} from 'lucide-react'
import productsApi from '@/api/products'
import type { Product } from '@/types/product'

const features = [
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
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. Easy returns and hassle-free exchanges.',
  },
  {
    icon: Zap,
    title: 'Instant Updates',
    description: 'Real-time notifications for order status, promotions, and new arrivals.',
  },
  {
    icon: Award,
    title: 'Best in Class',
    description: 'Award-winning products from trusted brands around the world.',
  },
]

const stats = [
  { label: 'Happy Customers', value: 50000, suffix: '+' },
  { label: 'Products', value: 10000, suffix: '+' },
  { label: 'Countries', value: 50, suffix: '+' },
  { label: 'Customer Rating', value: 4.9, decimals: 1, suffix: '/5' },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Tech Enthusiast',
    content: 'The quality and attention to detail is incredible. Every product I&apos;ve purchased has exceeded my expectations.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Design Professional',
    content: 'Fast shipping, excellent customer service, and premium products. This is my go-to store for all tech needs.',
    rating: 5,
  },
  {
    name: 'Emma Williams',
    role: 'Early Adopter',
    content: 'I love the curated selection and the seamless shopping experience. Highly recommend to everyone!',
    rating: 5,
  },
]

export default function HomePage() {
  const [mounted, setMounted] = React.useState(false)
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([])
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0)

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

  React.useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [mounted])

  return (
    <div className="w-full">
      <ParallaxSection
        speed={0.5}
        overlay
        overlayOpacity={0.3}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-emerald-50/30 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950"
        background={
          <div className="absolute inset-0 bg-gradient-mesh-emerald opacity-40 dark:opacity-30" />
        }
        floatingElements={
          <FloatingElements
            count={8}
            colorScheme="emerald"
            speed="slow"
            size="lg"
            blur="xl"
            opacity={0.5}
          />
        }
        aria-label="Hero section"
      >
        <div className="container relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700/10 dark:bg-emerald-600/20 border border-emerald-700/20 dark:border-emerald-500/30 mb-8 backdrop-blur-sm"
            >
              <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                Handcrafted Excellence
              </span>
            </motion.div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-950 dark:text-zinc-50 mb-6 leading-tight">
              Welcome to{' '}
              <span className="relative inline-block">
                <span className="gradient-text bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 dark:from-emerald-400 dark:via-emerald-500 dark:to-emerald-600 bg-clip-text text-transparent">
                  Premium
                </span>
                <span className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-emerald-700/20 dark:from-emerald-500/40 dark:to-emerald-600/40 blur-lg -z-10" />
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Curating exceptional products for elevated living. Experience the perfect blend of luxury and functionality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button
                  size="lg"
                  magnetic
                  rightIcon={<ArrowRight size={20} />}
                  className="group shadow-premium-emerald hover:shadow-emerald-lg transition-all duration-300 hover:scale-105"
                >
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-emerald-600/50 dark:border-emerald-500/50 flex items-start justify-center p-2 backdrop-blur-sm bg-white/10 dark:bg-black/10">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-600 dark:bg-emerald-500 rounded-full shadow-emerald-sm"
            />
          </div>
        </motion.div>
      </ParallaxSection>

      <section className="section bg-white dark:bg-zinc-950">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard
                  variant="accent"
                  enableTilt
                  className="p-8 text-center h-full hover:shadow-premium-emerald transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 flex items-center justify-center">
                    <feature.icon size={32} className="text-emerald-700 dark:text-emerald-500" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gradient-to-br from-emerald-50/50 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
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
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                category={product.category ?? 'Uncategorized'}
                image={product.images?.[0] ?? '/placeholder.svg'}
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
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                magnetic
                rightIcon={<ArrowRight size={20} />}
                className="group"
              >
                View All Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-zinc-950">
        <div className="container">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              By the Numbers
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Join thousands of satisfied customers worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard
                  variant="bordered"
                  className="p-8 text-center hover:shadow-premium-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <AnimatedCounter
                      value={stat.value}
                      decimals={stat.decimals ?? 0}
                      className="text-4xl md:text-5xl font-bold text-emerald-700 dark:text-emerald-500"
                    />
                    {stat.suffix && (
                      <span className="text-4xl md:text-5xl font-bold text-emerald-700 dark:text-emerald-500">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-gradient-to-br from-zinc-50 to-emerald-50/30 dark:from-zinc-900 dark:to-zinc-950">
        <div className="container">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Real experiences from real people who trust us.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <GlassCard variant="accent" className="p-12 relative overflow-hidden">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className="text-emerald-600 dark:text-emerald-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-xl md:text-2xl text-zinc-800 dark:text-zinc-200 mb-8 leading-relaxed italic">
                  "{testimonials[currentTestimonial].content}"
                </p>
                <div>
                  <p className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </motion.div>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-emerald-700 dark:bg-emerald-500 w-8'
                        : 'bg-zinc-300 dark:bg-zinc-700'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="section bg-white dark:bg-zinc-950">
        <div className="container">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <GlassCard variant="accent" className="p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 flex items-center justify-center">
                  <Mail size={32} className="text-emerald-700 dark:text-emerald-500" />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-semibold text-zinc-950 dark:text-zinc-50 mb-4">
                  Stay Connected
                </h2>
                <p className="text-lg text-zinc-700 dark:text-zinc-300">
                  Subscribe to our newsletter for exclusive offers, new arrivals, and curated inspiration.
                </p>
              </div>

              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all duration-200"
                  aria-label="Email address"
                />
                <Button size="lg" type="submit" magnetic>
                  Subscribe
                </Button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
