'use client';

import { useCartStore } from '@/store';
import { Product } from '@/types';

export const useCart = () => {
  const {
    items,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  return {
    items,
    total: getTotalPrice(),
    itemCount: getTotalItems(),
    addItem: (product: Product, quantity: number = 1) =>
      addItem(product, quantity),
    removeItem,
    updateQuantity,
    clearCart,
  };
};
