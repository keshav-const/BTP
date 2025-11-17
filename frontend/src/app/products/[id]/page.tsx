'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Minus, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Sample product data
  const product = {
    id: params.id,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    category: 'Audio',
    brand: 'Premium Audio',
    rating: 4.8,
    reviewCount: 124,
    description:
      'Experience audio excellence with our premium wireless headphones. Featuring advanced noise cancellation, crystal-clear sound quality, and luxurious comfort for all-day wear. Crafted with premium materials and engineered for perfection.',
    features: [
      'Active Noise Cancellation',
      '40-hour battery life',
      'Premium leather ear cups',
      'Bluetooth 5.0 connectivity',
      'Lightweight aluminum construction',
      'Foldable design with carrying case',
    ],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80',
    ],
    stock: 24,
  }

  // Related products
  const relatedProducts = [
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

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, product.stock))
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950">
      {/* Breadcrumb */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-500">
              Home
            </Link>
            <span className="text-zinc-400">/</span>
            <Link href="/products" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-500">
              Products
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-900 dark:text-zinc-50">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? 'border-emerald-700'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <p className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  {product.category}
                </p>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(product.rating)
                            ? 'fill-emerald-700 text-emerald-700'
                            : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <p className="text-4xl font-bold text-emerald-700 mb-6">{formatPrice(product.price)}</p>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">{product.description}</p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                        <span className="text-emerald-700 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                      <button
                        onClick={decrementQuantity}
                        className="px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-6 py-3 font-medium">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        className="px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {product.stock} in stock
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" className="flex-1">
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart size={20} />
                  </Button>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                {[
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: Shield, text: '2 Year Warranty' },
                  { icon: RefreshCw, text: '30 Day Returns' },
                ].map((benefit, index) => (
                  <div key={index} className="flex flex-col items-center text-center gap-2">
                    <benefit.icon size={24} className="text-emerald-700" />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="font-serif text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
