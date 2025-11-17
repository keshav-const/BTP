'use client'

import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Minus, Plus } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import productsApi from '@/api/products'
import type { Product } from '@/types/product'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useShallow } from 'zustand/react/shallow'

const parseErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message
    const responseError = error.response?.data?.error

    if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
      return responseMessage
    }

    if (typeof responseError === 'string' && responseError.trim().length > 0) {
      return responseError
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while loading this product. Please try again.'
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const fetchedProduct = await productsApi.getById(params.id)

        if (!isMounted) {
          return
        }

        setProduct(fetchedProduct)

        try {
          const { items } = await productsApi.list({ limit: 6 })

          if (!isMounted) {
            return
          }

          const suggestions = items
            .filter((item) => item.id !== fetchedProduct.id)
            .slice(0, 4)

          setRelatedProducts(suggestions)
        } catch (relatedError) {
          console.warn('Failed to fetch related products', relatedError)
          if (isMounted) {
            setRelatedProducts([])
          }
        }
      } catch (fetchError) {
        if (!isMounted) {
          return
        }

        setError(parseErrorMessage(fetchError))
        setProduct(null)
        setRelatedProducts([])
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProduct()

    return () => {
      isMounted = false
    }
  }, [params.id])

  useEffect(() => {
    setSelectedImage(0)
  }, [product?.id])

  const wishlistItem = useMemo(
    () => (product ? wishlistItems.find((item) => item.productId === product.id) : undefined),
    [wishlistItems, product?.id]
  )

  const isWishlisted = Boolean(wishlistItem)
  const maxQuantity = product?.stock && product.stock > 0 ? product.stock : 10
  const isOutOfStock = product?.stock !== undefined && product.stock <= 0

  useEffect(() => {
    setQuantity((previous) => {
      if (maxQuantity <= 0) {
        return 1
      }

      return Math.min(previous, maxQuantity)
    })
  }, [maxQuantity])

  const displayedImage = product?.images?.[selectedImage] ?? product?.images?.[0] ?? '/placeholder.jpg'
  const thumbnails = product?.images && product.images.length > 0 ? product.images : [displayedImage]

  const rating = 4.8
  const reviewCount = 124

  const incrementQuantity = () => {
    if (isOutOfStock) {
      return
    }

    setQuantity((prev) => Math.min(prev + 1, maxQuantity))
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleAddToCart = async () => {
    if (!product || isOutOfStock || isAddingToCart) {
      return
    }

    setIsAddingToCart(true)

    try {
      await addToCart(product.id, quantity, { product })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async () => {
    if (!product || isUpdatingWishlist) {
      return
    }

    setIsUpdatingWishlist(true)

    try {
      if (isWishlisted && wishlistItem) {
        await removeFromWishlist(wishlistItem.id)
      } else {
        await addToWishlist(product.id, { product })
      }
    } finally {
      setIsUpdatingWishlist(false)
    }
  }

  const stockLabel = product?.stock !== undefined ? (
    product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'
  ) : 'Available'

  if (isLoading) {
    return (
      <div className="w-full bg-zinc-50 dark:bg-zinc-950">
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="aspect-square rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 w-24 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-10 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="h-12 w-48 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="flex gap-3 pt-4">
                  <div className="h-14 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-14 w-14 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-zinc-50 dark:bg-zinc-950">
        <section className="section">
          <div className="container max-w-3xl text-center space-y-6">
            <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Unable to load product
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {error}
            </p>
            <Link
              href="/products"
              className={buttonVariants({ size: 'lg' })}
            >
              Browse products
            </Link>
          </div>
        </section>
      </div>
    )
  }

  if (!product) {
    return null
  }

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
                    src={displayedImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-3 gap-4">
                  {thumbnails.map((imageUrl, index) => (
                    <button
                      key={`${imageUrl}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200',
                        selectedImage === index
                          ? 'border-emerald-700'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      )}
                    >
                      <Image src={imageUrl} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
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
                  {product.category ?? 'Premium Selection'}
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
                          i < Math.floor(rating)
                            ? 'fill-emerald-700 text-emerald-700'
                            : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {rating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <p className="text-4xl font-bold text-emerald-700 mb-6">{formatPrice(product.price)}</p>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {product.description ?? 'Discover elevated craftsmanship and exceptional performance with this premium selection.'}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="font-serif text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'Crafted with premium materials for lasting quality',
                      'Thoughtfully designed for daily comfort and performance',
                      'Backed by our satisfaction guarantee',
                      'Expertly curated by the Premium team',
                      'Seamless integration with your lifestyle',
                      'Fast, free shipping on all orders',
                    ].map((feature, index) => (
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
                        type="button"
                        onClick={decrementQuantity}
                        disabled={quantity === 1 || isOutOfStock}
                        className={cn(
                          'px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200',
                          (quantity === 1 || isOutOfStock) && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-6 py-3 font-medium">{quantity}</span>
                      <button
                        type="button"
                        onClick={incrementQuantity}
                        disabled={isOutOfStock || quantity >= maxQuantity}
                        className={cn(
                          'px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200',
                          (isOutOfStock || quantity >= maxQuantity) && 'cursor-not-allowed opacity-60'
                        )}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {stockLabel}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    <span>{isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding…' : 'Add to Cart'}</span>
                  </Button>
                  <Button
                    variant={isWishlisted ? 'secondary' : 'outline'}
                    size="lg"
                    type="button"
                    onClick={handleToggleWishlist}
                    disabled={isUpdatingWishlist}
                    aria-pressed={isWishlisted}
                    className={cn(
                      'flex items-center justify-center gap-2',
                      isWishlisted && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                    )}
                  >
                    <Heart
                      size={20}
                      className={cn(
                        'transition-colors',
                        isWishlisted ? 'fill-current text-emerald-700 dark:text-emerald-300' : 'text-emerald-700'
                      )}
                    />
                    <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
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
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-serif text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    category={relatedProduct.category ?? 'Premium'}
                    image={relatedProduct.images?.[0] ?? '/placeholder.jpg'}
                    rating={4.6}
                    reviewCount={0}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
