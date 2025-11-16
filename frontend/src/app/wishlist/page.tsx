'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components';
import { useWishlist, useCart, useToast } from '@/hooks';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { success: showSuccess } = useToast();

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="inline-flex p-6 rounded-full bg-cream-100 dark:bg-charcoal-800 mb-6">
          <Heart className="w-16 h-16 text-gold-500 dark:text-gold-400" />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4 text-charcoal-900 dark:text-cream-100">Your Wishlist is Empty</h1>
        <p className="text-taupe-600 dark:text-taupe-400 mb-8 text-lg">
          Start adding items to your wishlist to save them for later!
        </p>
        <Link href="/products">
          <Button variant="luxury" size="lg">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-charcoal-900 dark:text-cream-100">My Wishlist</h1>
          <p className="text-taupe-600 dark:text-taupe-400 mt-2">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
        </div>
        <Button
          onClick={handleClearAll}
          variant="outline"
          size="md"
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
            />
            <button
              onClick={() => handleRemoveItem(product.id)}
              className="absolute top-4 right-4 p-2.5 bg-white dark:bg-charcoal-800 rounded-full shadow-luxury hover:shadow-luxury-lg transition-all duration-200 hover:scale-110 z-10 border border-taupe-200 dark:border-charcoal-600"
              aria-label="Remove from wishlist"
              title="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4 text-error" />
            </button>
          </div>
        ))}
      </div>

      <Card variant="elevated" className="p-8 text-center">
        <p className="text-taupe-600 dark:text-taupe-400 mb-6 text-lg">
          Didn't find what you were looking for?
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </Card>
    </div>
  );
}
