'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/Button'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function WishlistPage() {
  const { items, load, remove } = useWishlistStore()
  const addToCart = useCartStore((state) => state.add)
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({})

  useEffect(() => {
    void load()
  }, [load])

  const handleAddToCart = async (productId: string, product: any) => {
    setAddingToCart((prev) => ({ ...prev, [productId]: true }))
    try {
      await addToCart(productId, 1, { product })
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  if (items.length === 0) {
    return (
      <div className="w-full bg-zinc-50 dark:bg-zinc-950">
        <section className="section">
          <div className="container max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-emerald-subtle flex items-center justify-center">
                <Heart size={40} className="text-emerald-700" />
              </div>
              <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Your Wishlist is Empty
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                Save your favorite items for later
              </p>
              <Link
                href="/products"
                className={buttonVariants({ size: 'lg' })}
              >
                Browse Products
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950">
      <section className="section">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                My Wishlist
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="premium-card overflow-hidden group"
                >
                  {/* Product Image */}
                  <Link href={`/products/${item.productId}`}>
                    <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <Image
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          remove(item.id)
                        }}
                        className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-zinc-900/90 p-2 text-rose-600 hover:bg-white dark:hover:bg-zinc-900 transition-colors shadow-sm"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="p-4 space-y-3">
                    {item.product.category && (
                      <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-sans">
                        {item.product.category}
                      </p>
                    )}

                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-50 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>

                    <p className="text-xl font-bold text-emerald-700">
                      {formatPrice(item.product.price)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item.productId, item.product)}
                      disabled={addingToCart[item.productId]}
                      className={cn(
                        'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors',
                        'bg-emerald-700 text-white hover:bg-emerald-800 shadow-premium',
                        addingToCart[item.productId] && 'cursor-not-allowed opacity-75'
                      )}
                    >
                      <ShoppingCart size={18} />
                      {addingToCart[item.productId] ? 'Adding…' : 'Add to Cart'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/products"
                className={buttonVariants({ variant: 'outline', size: 'lg' })}
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
