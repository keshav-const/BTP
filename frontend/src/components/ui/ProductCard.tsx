'use client'

import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { cn, formatPrice, isValidObjectId } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { toastError } from '@/lib/toast'
import type { Product } from '@/types/product'

interface ProductCardProps {
  id: string
  name: string
  price: number
  category: string
  image: string
  rating?: number
  reviewCount?: number
}

export function ProductCard({
  id,
  name,
  price,
  category,
  image,
  rating = 4.5,
  reviewCount = 0,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false)

  const addToCart = useCartStore((state) => state.add)
  const { items: wishlistItems, add: addToWishlist, remove: removeFromWishlist } = useWishlistStore(
    useShallow((state) => ({
      items: state.items,
      add: state.add,
      remove: state.remove,
    }))
  )

  const productSummary = useMemo<Product>(() => ({
    id,
    name,
    price,
    category,
    images: image ? [image] : [],
    description: null,
    brand: null,
    stock: null,
  }), [id, name, price, category, image])

  const wishlistItem = useMemo(() => wishlistItems.find((item) => item.productId === id), [wishlistItems, id])
  const isWishlisted = Boolean(wishlistItem)

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isAddingToCart) {
      return
    }

    if (!isValidObjectId(id)) {
      toastError('Invalid product ID')
      return
    }

    setIsAddingToCart(true)

    try {
      await addToCart(id, 1, { product: productSummary })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isUpdatingWishlist) {
      return
    }

    setIsUpdatingWishlist(true)

    try {
      if (isWishlisted && wishlistItem) {
        await removeFromWishlist(wishlistItem.id)
      } else {
        await addToWishlist(id, { product: productSummary })
      }
    } finally {
      setIsUpdatingWishlist(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link href={`/products/${id}`}>
        <div className="premium-card-hover overflow-hidden">
          {/* Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={image || '/placeholder.jpg'}
              alt={name}
              fill
              className={cn(
                'object-cover transition-transform duration-500',
                isHovered && 'scale-105'
              )}
            />
            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={isUpdatingWishlist}
              aria-pressed={isWishlisted}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(
                'absolute top-4 right-4 rounded-full border border-white/40 bg-white/80 px-3 py-2 text-zinc-700 shadow-sm backdrop-blur transition-all duration-200',
                'hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60',
                isWishlisted && 'border-emerald-600 bg-emerald-600 text-white',
                isUpdatingWishlist && 'cursor-not-allowed opacity-70'
              )}
            >
              <Heart
                size={16}
                className={cn(
                  'transition-colors',
                  isWishlisted ? 'fill-white text-white' : 'text-zinc-600 dark:text-zinc-300'
                )}
              />
            </button>
            {/* Overlay on hover */}
            <div
              className={cn(
                'absolute inset-0 bg-emerald-700/0 transition-all duration-300',
                isHovered && 'bg-emerald-700/10'
              )}
            />
            
            {/* Quick Add Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-4 bottom-4"
            >
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={cn(
                  'w-full bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 shadow-premium',
                  'hover:bg-emerald-800',
                  isAddingToCart && 'cursor-not-allowed opacity-75'
                )}
              >
                {isAddingToCart ? 'Adding…' : 'Add to Cart'}
              </button>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-3">
            {/* Category */}
            <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-sans">
              {category}
            </p>

            {/* Product Name */}
            <h3 className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2">
              {name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < Math.floor(rating)
                        ? 'fill-emerald-700 text-emerald-700'
                        : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
                {reviewCount > 0 ? `(${reviewCount})` : ''}
              </span>
            </div>

            {/* Price */}
            <p className="text-xl font-bold text-emerald-700 font-sans">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
