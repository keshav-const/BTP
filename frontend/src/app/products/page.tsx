'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')

  // Sample products
  const products = [
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
    {
      id: '5',
      name: 'Minimalist Desk Lamp',
      price: 89.99,
      category: 'Home',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
      rating: 4.5,
      reviewCount: 67,
    },
    {
      id: '6',
      name: 'Premium Backpack',
      price: 179.99,
      category: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      rating: 4.7,
      reviewCount: 142,
    },
  ]

  const categories = ['All', 'Audio', 'Accessories', 'Watches', 'Tech', 'Home']
  const priceRanges = ['All', 'Under $100', '$100 - $300', '$300 - $500', 'Over $500']
  const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rating']

  const clearFilters = () => {
    setSelectedCategory('all')
    setPriceRange('all')
    setSortBy('featured')
  }

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Shop
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Browse our curated selection of premium products
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <aside className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="premium-card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="font-serif font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                    Category
                  </h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.toLowerCase()}
                          onChange={() => setSelectedCategory(category.toLowerCase())}
                          className="w-4 h-4 accent-emerald-700"
                        />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors duration-200">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h4 className="font-serif font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label
                        key={range}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === range.toLowerCase()}
                          onChange={() => setPriceRange(range.toLowerCase())}
                          className="w-4 h-4 accent-emerald-700"
                        />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-500 transition-colors duration-200">
                          {range}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Top Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Showing {products.length} products
                </p>

                <div className="flex gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex-1 sm:flex-none"
                  >
                    <SlidersHorizontal size={18} />
                    <span>Filters</span>
                  </Button>

                  {/* Sort Dropdown */}
                  <div className="relative flex-1 sm:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-auto px-4 py-2.5 pr-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm font-medium appearance-none cursor-pointer hover:border-emerald-700 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 transition-all duration-200"
                    >
                      {sortOptions.map((option) => (
                        <option key={option} value={option.toLowerCase()}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="md" disabled>
                  Previous
                </Button>
                <Button variant="primary" size="md">
                  1
                </Button>
                <Button variant="outline" size="md">
                  2
                </Button>
                <Button variant="outline" size="md">
                  3
                </Button>
                <Button variant="outline" size="md">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
