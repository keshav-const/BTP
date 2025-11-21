'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, ShoppingCart, Sparkles } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import { cn, formatPrice, isValidObjectId } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { toastError } from '@/lib/toast'
import { GlassCard } from './GlassCard'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import type { Product } from '@/types/product'

interface ProductCardProps {
  id: string
  name: string
  price: number
  category: string
  image: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  category,
  image,
  rating = 4.5,
  reviewCount = 0,
  isNew = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

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
      className="group h-full"
    >
      <Link href={`/products/${id}`} className="block h-full">
        <GlassCard
          variant="bordered"
          blurIntensity="medium"
          enableTilt={true}
          enableMagnetic={false}
          className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-glass-lg"
        >
          {/* Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={image || '/placeholder.svg'}
              alt={name}
              fill
              className={cn(
                'object-cover transition-all duration-700',
                !prefersReducedMotion && isHovered && 'scale-110'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <AnimatePresence>
                {isNew && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-full shadow-premium-emerald"
                  >
                    <Sparkles size={12} className="flex-shrink-0" />
                    <span>New</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rating Badge */}
              {rating >= 4.0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-1 px-2.5 py-1 glass-heavy rounded-full shadow-glass-sm border border-white/20"
                >
                  <Star size={12} className="fill-emerald-600 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {rating.toFixed(1)}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              type="button"
              onClick={handleToggleWishlist}
              disabled={isUpdatingWishlist}
              aria-pressed={isWishlisted}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              whileHover={!prefersReducedMotion ? { scale: 1.1 } : undefined}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : undefined}
              className={cn(
                'absolute top-4 right-4 z-10 rounded-full glass-heavy border border-white/20 p-2.5 shadow-glass backdrop-blur-glass transition-all duration-300',
                'hover:shadow-glass-lg hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
                isUpdatingWishlist && 'cursor-not-allowed opacity-70'
              )}
            >
              <Heart
                size={18}
                className={cn(
                  'transition-all duration-300',
                  isWishlisted 
                    ? 'fill-red-500 text-red-500 scale-110' 
                    : 'text-zinc-700 dark:text-zinc-300'
                )}
              />
            </motion.button>

            {/* Glass Hover Overlay */}
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered && !prefersReducedMotion ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-emerald-800/10 to-transparent pointer-events-none"
            />
            
            {/* Quick Add Button - Animated CTA */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-x-4 bottom-4 z-10"
                >
                  <motion.button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    whileHover={!prefersReducedMotion ? { scale: 1.02 } : undefined}
                    whileTap={!prefersReducedMotion ? { scale: 0.98 } : undefined}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-3 px-6 rounded-xl font-semibold shadow-premium-emerald backdrop-blur-sm',
                      'transition-all duration-300 hover:bg-emerald-800 hover:shadow-premium-lg',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900',
                      isAddingToCart && 'cursor-not-allowed opacity-75'
                    )}
                  >
                    {isAddingToCart ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <ShoppingCart size={18} />
                        </motion.div>
                        <span>Adding…</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-3 flex-1 flex flex-col">
            {/* Category */}
            <p className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-500 font-sans font-semibold">
              {category}
            </p>

            {/* Product Name */}
            <h3 className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2 flex-1">
              {name}
            </h3>

            {/* Rating Stars */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Star
                      size={14}
                      className={cn(
                        'transition-colors duration-200',
                        i < Math.floor(rating)
                          ? 'fill-emerald-700 text-emerald-700'
                          : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                      )}
                    />
                  </motion.div>
                ))}
              </div>
              {reviewCount > 0 && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
                  ({reviewCount})
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline justify-between pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-500 font-sans">
                {formatPrice(price)}
              </p>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  )
}
