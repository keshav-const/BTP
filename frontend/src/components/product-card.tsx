'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Product } from '@/types';
import { formatPrice, truncate } from '@/utils/format';
import { cn } from '@/utils/cn';
import { useWishlist } from '@/hooks';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const discount =
    product.salePrice && product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  return (
    <Card variant="elevated" className="group flex flex-col h-full overflow-hidden p-0">
      <Link href={`/products/${product.id}`} className="relative overflow-hidden">
        <div className="relative w-full aspect-square bg-cream-200 premium-overlay">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/30 via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          {discount && (
            <Badge variant="luxury" size="md" className="absolute top-3 right-3">
              -{discount}%
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-charcoal-900/70 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="error" size="lg" className="shadow-luxury-lg">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 p-5 flex flex-col bg-white dark:bg-charcoal-800">
        <Link href={`/products/${product.id}`} className="flex-1 space-y-2">
          <h3 className="font-serif font-semibold text-lg text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 line-clamp-2 transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-sm text-taupe-600 dark:text-taupe-400 line-clamp-2">
            {truncate(product.description, 60)}
          </p>
        </Link>

        {product.rating > 0 && (
          <div className="mt-3 flex items-center gap-1 text-sm">
            <span className="text-gold-400 text-base">★</span>
            <span className="font-medium text-charcoal-900 dark:text-cream-100">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-taupe-500">
              ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="mt-4 flex items-baseline gap-2">
          {product.salePrice ? (
            <>
              <span className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-400">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-sm text-taupe-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-400">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            variant="luxury"
            size="md"
            className="flex-1 transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            onClick={() => toggleWishlist(product)}
            variant="outline"
            size="md"
            className="px-4"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-all duration-300',
                isWishlisted && 'fill-current text-gold-500'
              )}
            />
          </Button>
        </div>
      </div>
    </Card>
  );
};
