'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/hooks';
import { formatPrice } from '@/utils/format';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
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
          <Card variant="outlined" className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-secondary-600 text-sm">{item.category}</p>
                  <p className="text-lg font-bold mt-2">
                    {formatPrice(item.salePrice || item.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 border border-border rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.cartQuantity - 1))
                      }
                      className="p-1 hover:bg-secondary-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">
                      {item.cartQuantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.cartQuantity + 1)
                      }
                      className="p-1 hover:bg-secondary-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card variant="elevated" className="sticky top-20 space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex justify-between">
                <span className="text-secondary-600">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Tax</span>
                <span>{formatPrice(total * 0.08)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(total * 1.08)}</span>
            </div>

            <Button variant="primary" size="lg" className="w-full">
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
