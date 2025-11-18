'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/Button'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function CartPage() {
  const { items, load, update, remove, getSubtotal } = useCartStore()

  useEffect(() => {
    void load()
  }, [load])

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
                <ShoppingCart size={40} className="text-emerald-700" />
              </div>
              <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                Start shopping to add items to your cart
              </p>
              <Link
                href="/products"
                className={buttonVariants({ size: 'lg' })}
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    )
  }

  const subtotal = getSubtotal()

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950">
      <section className="section">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
              Shopping Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="premium-card p-4 flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-50 hover:text-emerald-700 dark:hover:text-emerald-500 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      {item.product.category && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                          {item.product.category}
                        </p>
                      )}
                      <p className="text-lg font-bold text-emerald-700 mt-2">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => update(item.id, Math.max(1, item.qty - 1))}
                          disabled={item.qty <= 1}
                          className={cn(
                            'w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors',
                            item.qty <= 1 && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-semibold text-zinc-900 dark:text-zinc-50">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => update(item.id, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Subtotal for this item */}
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        {formatPrice(item.product.price * item.qty)}
                      </p>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors flex items-center gap-1 text-sm"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="premium-card p-6 sticky top-24">
                  <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Shipping</span>
                      <span className="font-semibold">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                      <div className="flex justify-between text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        <span>Total</span>
                        <span className="text-emerald-700">{formatPrice(subtotal)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={buttonVariants({ size: 'lg', className: 'w-full mb-4' })}
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    href="/products"
                    className={buttonVariants({ variant: 'outline', size: 'md', className: 'w-full' })}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
