'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, ChevronLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/rating';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useFetch, useCart, useWishlist, useToast } from '@/hooks';
import { Product } from '@/types';
import { formatPrice } from '@/utils/format';

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
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success: showSuccess } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      showSuccess(`${product.name} added to cart!`);
    }
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

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.category, href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <div className="relative w-full aspect-square bg-secondary-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount && (
              <Badge variant="error" size="lg" className="absolute top-4 right-4">
                -{discount}%
              </Badge>
            )}
          </div>

          {product.images && product.images.length > 0 && (
            <div className="flex gap-4 mt-4 overflow-x-auto">
              {product.images.slice(0, 5).map((image, idx) => (
                <button
                  key={idx}
                  className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-border hover:border-primary-500 transition-colors overflow-hidden"
                >
                  <img src={image} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isInWishlist(product.id)
                      ? 'fill-error text-error'
                      : 'text-secondary-400'
                  }`}
                />
              </button>
            </div>
            <p className="text-secondary-600">{product.category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <Rating rating={product.rating} showLabel />
            <span className="text-secondary-600">({product.reviewCount} reviews)</span>
          </div>

          {/* Description */}
          <p className="text-secondary-600 leading-relaxed">{product.description}</p>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-lg text-secondary-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-foreground">
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
                <span className="text-secondary-600">Quantity:</span>
                <div className="flex items-center gap-2 border-2 border-border rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-secondary-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-secondary-100 transition-colors"
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
                <Button variant="outline" size="lg" className="px-6">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <Card variant="outlined" className="space-y-3">
            <h3 className="font-semibold">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">SKU</span>
                <span className="font-medium">{product.id.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
