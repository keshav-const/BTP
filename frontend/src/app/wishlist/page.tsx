'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components';
import { useWishlist, useCart, useToast } from '@/hooks';

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { success: showSuccess } = useToast();

  const handleAddToCart = (product: typeof items[0]) => {
    addItem(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-secondary-600 mb-6">
          Start adding items to your wishlist!
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wishlist ({items.length})</h1>
        <Button
          onClick={clearWishlist}
          variant="outline"
          size="md"
        >
          Clear Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
