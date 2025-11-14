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
    <Card variant="elevated" className="flex flex-col h-full overflow-hidden p-0 hover:shadow-xl transition-shadow">
      <Link href={`/products/${product.id}`} className="relative group overflow-hidden">
        <div className="relative w-full aspect-square bg-secondary-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {discount && (
            <Badge variant="error" size="md" className="absolute top-2 right-2">
              -{discount}%
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="error" size="lg">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 p-4 flex flex-col">
        <Link href={`/products/${product.id}`} className="flex-1">
          <h3 className="font-semibold text-foreground hover:text-primary-600 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
            {truncate(product.description, 60)}
          </p>
        </Link>

        <div className="mt-3 flex items-center gap-2">
          {product.rating > 0 && (
            <div className="flex items-center text-sm">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-secondary-600">
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-sm text-secondary-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
            variant="primary"
            size="md"
            className="flex-1"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button
            onClick={() => toggleWishlist(product)}
            variant="outline"
            size="md"
            className="px-3"
          >
            <Heart
              className={cn(
                'w-4 h-4',
                isWishlisted && 'fill-current text-error'
              )}
            />
          </Button>
        </div>
      </div>
    </Card>
  );
};
