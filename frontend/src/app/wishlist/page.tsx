'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/Button'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export default function WishlistPage() {
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
