'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart, useAuth } from '@/hooks';
import { formatPrice } from '@/utils/format';

export default function CartPage() {
  const router = useRouter();
  const { items, total, removeItem, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  const taxRate = 0.08;
  const shippingCost = total > 50 ? 0 : 10;
  const tax = total * taxRate;
  const finalTotal = total + tax + shippingCost;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 md:py-20">
        <ShoppingBag className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-secondary-600 mb-6">
          Start shopping and add items to your cart!
        </p>
        <Link href="/products">
          <Button variant="primary" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card variant="outlined" className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <p className="text-sm text-secondary-600">
                {items.length} item{items.length !== 1 ? 's' : ''} in cart
              </p>
            </div>
            <div className="space-y-4 p-4">
              {items.map((item) => {
                const itemPrice = item.salePrice || item.price;
                const itemTotal = itemPrice * item.cartQuantity;
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
                  >
                    <Link href={`/products/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary-600 truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-secondary-600 text-sm">{item.category}</p>
                      <p className="text-sm font-medium mt-2">
                        {itemPrice !== item.price && (
                          <>
                            <span className="text-error font-bold">
                              {formatPrice(itemPrice)}
                            </span>
                            <span className="text-secondary-500 line-through ml-2">
                              {formatPrice(item.price)}
                            </span>
                          </>
                        ) || formatPrice(itemPrice)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2">
                      <div className="flex items-center gap-2 border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.cartQuantity - 1))
                          }
                          className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-8 text-center">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.cartQuantity + 1)
                          }
                          className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-secondary-600">Subtotal</p>
                        <p className="font-bold">{formatPrice(itemTotal)}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-error hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card variant="elevated" className="sticky top-20 space-y-4">
            <h2 className="text-xl font-semibold border-b border-border pb-4">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Shipping</span>
                {shippingCost === 0 ? (
                  <Badge variant="success" size="sm">Free</Badge>
                ) : (
                  <span className="font-medium">{formatPrice(shippingCost)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Tax (8%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              {shippingCost > 0 && (
                <div className="p-2 bg-primary-50 dark:bg-primary-900 rounded text-xs text-primary-700 dark:text-primary-300">
                  Free shipping on orders over $50!
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Proceed to Checkout
            </Button>

            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
