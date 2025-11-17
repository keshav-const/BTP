'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { ArrowRight, Sparkles, Shield, Truck, Star } from 'lucide-react'

export default function HomePage() {
  // Sample featured products
  const featuredProducts = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      rating: 4.8,
      reviewCount: 124,
    },
    {
      id: '2',
      name: 'Luxury Leather Wallet',
      price: 149.99,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
      rating: 4.9,
      reviewCount: 89,
    },
    {
      id: '3',
      name: 'Designer Watch Collection',
      price: 599.99,
      category: 'Watches',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      rating: 4.7,
      reviewCount: 156,
    },
    {
      id: '4',
      name: 'Premium Smart Speaker',
      price: 199.99,
      category: 'Tech',
      image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80',
      rating: 4.6,
      reviewCount: 203,
    },
  ]

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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700/10 border border-emerald-700/20 mb-8"
            >
              <Sparkles size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Handcrafted Excellence</span>
            </motion.div>

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
              <Link href="/products">
                <Button size="lg" className="group">
                  <span>Shop Now</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-zinc-300 border-zinc-700 hover:border-emerald-700">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section bg-zinc-50 dark:bg-zinc-950">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
                initial={{ opacity: 0, y: 20 }}
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
            initial={{ opacity: 0, y: 20 }}
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
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Link href="/products">
              <Button variant="outline" size="lg" className="group">
                <span>View All Products</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section bg-gradient-dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
