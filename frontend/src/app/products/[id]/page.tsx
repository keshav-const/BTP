'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/rating';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumbs, ProductCard } from '@/components';
import { useFetch, useCart, useWishlist, useToast } from '@/hooks';
import { Product } from '@/types';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const { data: product, isLoading, error } = useFetch<Product>(
    `/products/${params.id}`
  );
  const { data: recommendationsData } = useFetch<Product[]>(
    `/products/${params.id}/recommendations?limit=6`
  );
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success: showSuccess } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      showSuccess(`${product.name} added to cart!`);
    }
  };

  const handleAddRecommendationToCart = (product: Product) => {
    addItem(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error text-lg mb-6">Product not found</p>
        <Button onClick={() => router.back()} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount =
    product.salePrice && product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  const allImages = [product.image, ...(product.images || [])];
  const currentImage = allImages[selectedImageIndex] || product.image;

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.category, href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative w-full aspect-[4/3] bg-cream-100 dark:bg-charcoal-800 rounded-2xl overflow-hidden group shadow-luxury">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {discount && (
              <Badge variant="error" size="lg" className="absolute top-4 right-4">
                -{discount}%
              </Badge>
            )}
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-charcoal-900/90 hover:bg-white dark:hover:bg-charcoal-800 text-gold-600 dark:text-gold-400 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-luxury hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-charcoal-900/90 hover:bg-white dark:hover:bg-charcoal-800 text-gold-600 dark:text-gold-400 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-luxury hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={cn(
                    'flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200',
                    selectedImageIndex === idx
                      ? 'border-gold-500 shadow-luxury-sm scale-105'
                      : 'border-taupe-200 dark:border-charcoal-600 hover:border-gold-400 dark:hover:border-gold-400 hover:scale-105'
                  )}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={image} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h1 className="text-4xl font-serif font-bold text-charcoal-900 dark:text-cream-100 leading-tight">{product.name}</h1>
                {product.brand && (
                  <p className="text-taupe-600 dark:text-taupe-400 text-sm mt-2 font-sans">Brand: {product.brand}</p>
                )}
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 hover:bg-cream-100 dark:hover:bg-charcoal-800 rounded-xl transition-all duration-200 flex-shrink-0 group"
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={cn(
                    'w-6 h-6 transition-all duration-200',
                    isInWishlist(product.id)
                      ? 'fill-error text-error'
                      : 'text-taupe-400 group-hover:text-gold-500'
                  )}
                />
              </button>
            </div>
            <p className="text-taupe-600 dark:text-taupe-400 font-medium">{product.category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <Rating rating={product.rating} showLabel />
            <span className="text-taupe-600 dark:text-taupe-400 text-sm">({product.reviewCount} reviews)</span>
          </div>

          {/* Description */}
          <p className="text-charcoal-700 dark:text-cream-200 leading-relaxed">{product.description}</p>

          {/* AI Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-3 p-5 bg-cream-100 dark:bg-charcoal-800 rounded-xl border border-bronze-200 dark:border-bronze-800">
              <h3 className="font-serif font-semibold text-charcoal-900 dark:text-cream-100">Key Highlights</h3>
              <ul className="space-y-2">
                {product.highlights.slice(0, 3).map((highlight, idx) => (
                  <li key={idx} className="text-charcoal-700 dark:text-cream-200 text-sm flex items-start gap-3">
                    <span className="text-bronze-600 dark:text-bronze-400 font-bold text-lg leading-none mt-0.5">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing */}
          <div className="space-y-3 border-t border-taupe-200 dark:border-charcoal-700 pt-6">
            <div className="flex items-baseline gap-4">
              {product.salePrice ? (
                <>
                  <span className="text-4xl font-serif font-bold text-gold-600 dark:text-gold-400">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-xl text-taupe-500 dark:text-taupe-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-serif font-bold text-gold-600 dark:text-gold-400">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.inStock ? (
              <Badge variant="success">In Stock</Badge>
            ) : (
              <Badge variant="error">Out of Stock</Badge>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          {product.inStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-charcoal-700 dark:text-cream-200 font-medium">Quantity:</span>
                <div className="flex items-center gap-0 border-2 border-gold-400 dark:border-gold-600 rounded-xl overflow-hidden bg-white dark:bg-charcoal-800 shadow-luxury-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-2.5 hover:bg-gold-50 dark:hover:bg-gold-900/20 text-gold-600 dark:text-gold-400 transition-all duration-200 font-bold text-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-6 py-2.5 font-semibold min-w-[60px] text-center text-charcoal-900 dark:text-cream-100 border-x-2 border-gold-400 dark:border-gold-600">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-2.5 hover:bg-gold-50 dark:hover:bg-gold-900/20 text-gold-600 dark:text-gold-400 transition-all duration-200 font-bold text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddToCart} variant="primary" size="lg" className="flex-1">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="luxury"
                  size="lg"
                  className="px-6"
                  onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <Card variant="outlined" className="space-y-3 p-5 bg-cream-50 dark:bg-charcoal-800 border-taupe-200 dark:border-charcoal-600 rounded-xl">
            <h3 className="font-serif font-semibold text-charcoal-900 dark:text-cream-100">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-taupe-600 dark:text-taupe-400">SKU</span>
                <span className="font-medium text-charcoal-800 dark:text-cream-200">{product.id.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe-600 dark:text-taupe-400">Category</span>
                <span className="font-medium text-charcoal-800 dark:text-cream-200">{product.category}</span>
              </div>
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-taupe-600 dark:text-taupe-400">Brand</span>
                  <span className="font-medium text-charcoal-800 dark:text-cream-200">{product.brand}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      {recommendationsData && recommendationsData.length > 0 && (
        <section className="space-y-8 border-t border-taupe-200 dark:border-charcoal-700 pt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif font-bold text-charcoal-900 dark:text-cream-100">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendationsData.slice(0, 4).map((rec) => (
              <ProductCard
                key={rec.id}
                product={rec}
                onAddToCart={handleAddRecommendationToCart}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
