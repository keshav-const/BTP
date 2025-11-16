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
      <div className="text-center py-16 md:py-24">
        <div className="inline-flex p-6 rounded-full bg-cream-100 dark:bg-charcoal-800 mb-6">
          <ShoppingBag className="w-16 h-16 text-gold-500 dark:text-gold-400" />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4 text-charcoal-900 dark:text-cream-100">Your Cart is Empty</h1>
        <p className="text-taupe-600 dark:text-taupe-400 mb-8 text-lg">
          Start shopping and add items to your cart!
        </p>
        <Link href="/products">
          <Button variant="luxury" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-serif font-bold text-charcoal-900 dark:text-cream-100">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 bg-cream-100 dark:bg-charcoal-800 rounded-xl border border-taupe-200 dark:border-charcoal-600">
            <p className="text-sm text-taupe-600 dark:text-taupe-400 font-medium">
              {items.length} item{items.length !== 1 ? 's' : ''} in cart
            </p>
          </div>
          
          <div className="space-y-4">
            {items.map((item) => {
              const itemPrice = item.salePrice || item.price;
              const itemTotal = itemPrice * item.cartQuantity;
              return (
                <Card
                  key={item.id}
                  variant="elevated"
                  className="p-6 bg-white dark:bg-charcoal-800 rounded-xl border border-taupe-200 dark:border-charcoal-600 shadow-luxury-sm hover:shadow-luxury transition-all duration-200"
                >
                  <div className="flex gap-6">
                    <Link href={`/products/${item.id}`} className="flex-shrink-0 group">
                      <div className="w-28 h-28 rounded-xl overflow-hidden bg-cream-100 dark:bg-charcoal-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-serif text-lg font-semibold text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200 mb-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-taupe-600 dark:text-taupe-400 text-sm mb-3">{item.category}</p>
                      <div className="text-base font-semibold">
                        {itemPrice !== item.price ? (
                          <>
                            <span className="text-gold-600 dark:text-gold-400">
                              {formatPrice(itemPrice)}
                            </span>
                            <span className="text-taupe-500 dark:text-taupe-400 line-through ml-2 text-sm">
                              {formatPrice(item.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gold-600 dark:text-gold-400">{formatPrice(itemPrice)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-3">
                      <div className="flex items-center gap-0 border-2 border-gold-400 dark:border-gold-600 rounded-lg overflow-hidden bg-white dark:bg-charcoal-900 shadow-luxury-sm">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.cartQuantity - 1))
                          }
                          className="p-2 hover:bg-gold-50 dark:hover:bg-gold-900/20 text-gold-600 dark:text-gold-400 transition-all duration-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-semibold min-w-[48px] text-center text-charcoal-900 dark:text-cream-100 border-x-2 border-gold-400 dark:border-gold-600">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.cartQuantity + 1)
                          }
                          className="p-2 hover:bg-gold-50 dark:hover:bg-gold-900/20 text-gold-600 dark:text-gold-400 transition-all duration-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-taupe-600 dark:text-taupe-400 mb-1">Subtotal</p>
                        <p className="font-serif text-lg font-bold text-charcoal-900 dark:text-cream-100">{formatPrice(itemTotal)}</p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-error hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card 
            variant="elevated" 
            className="sticky top-20 space-y-6 p-6 bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-taupe-200 dark:border-charcoal-600 shadow-luxury"
          >
            <h2 className="text-2xl font-serif font-semibold text-charcoal-900 dark:text-cream-100 border-b border-taupe-300 dark:border-charcoal-700 pb-4">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-taupe-600 dark:text-taupe-400">Subtotal</span>
                <span className="font-semibold text-charcoal-800 dark:text-cream-200">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-taupe-600 dark:text-taupe-400">Shipping</span>
                {shippingCost === 0 ? (
                  <Badge variant="success" size="sm">Free</Badge>
                ) : (
                  <span className="font-semibold text-charcoal-800 dark:text-cream-200">{formatPrice(shippingCost)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-taupe-600 dark:text-taupe-400">Tax (8%)</span>
                <span className="font-semibold text-charcoal-800 dark:text-cream-200">{formatPrice(tax)}</span>
              </div>
              {shippingCost > 0 && (
                <div className="p-3 bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-xl text-xs text-gold-800 dark:text-gold-200">
                  Free shipping on orders over $50!
                </div>
              )}
            </div>

            <div className="border-t border-taupe-300 dark:border-charcoal-700 pt-4">
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-serif font-semibold text-charcoal-900 dark:text-cream-100">Total</span>
                <span className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-400">{formatPrice(finalTotal)}</span>
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
              <Button variant="outline" size="lg" className="w-full border-taupe-300 dark:border-charcoal-600 hover:border-gold-500 dark:hover:border-gold-500">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
