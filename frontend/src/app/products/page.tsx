'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import productsApi from '@/api/products'
import type { Product } from '@/types/product'

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const PRODUCTS_PER_PAGE = 9

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const result = await productsApi.list({ limit: 50 })
        setProducts(result.items)
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProducts()
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, priceRange, sortBy])

  const categories = ['All', 'Fashion', 'Accessories', 'Watches', 'Jewelry', 'Home', 'Electronics', 'Beauty']
  const priceRanges = ['All', 'Under ₹3,000', '₹3,000 - ₹6,000', '₹6,000 - ₹10,000', 'Over ₹10,000']
  const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Rating']

  const clearFilters = () => {
    setSelectedCategory('all')
    setPriceRange('all')
    setSortBy('featured')
  }

  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = [...products]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => {
        const productCategory = product.category?.toLowerCase() || ''
        return productCategory === selectedCategory
      })
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter((product) => {
        const price = product.price
        if (priceRange === 'under ₹3,000') {
          return price < 3000
        } else if (priceRange === '₹3,000 - ₹6,000') {
          return price >= 3000 && price <= 6000
        } else if (priceRange === '₹6,000 - ₹10,000') {
          return price >= 6000 && price <= 10000
        } else if (priceRange === 'over ₹10,000') {
          return price > 10000
        }
        return true
      })
    }

    if (sortBy === 'price: low to high') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price: high to low') {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [products, selectedCategory, priceRange, sortBy])

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

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
                  Showing {filteredAndSortedProducts.length} products
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
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="premium-card overflow-hidden">
                      <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                      <div className="p-6 space-y-3">
                        <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                        <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                        <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                        <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">No products found.</p>
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {paginatedProducts.map((product) => (
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
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 pb-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-emerald-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-800 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded transition-colors duration-200 ${
                          currentPage === page
                            ? 'bg-emerald-700 text-white'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-emerald-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-800 transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
