'use client';

import { useWishlistStore } from '@/store';
import { Product } from '@/types';

export const useWishlist = () => {
  const { items, addItem, removeItem, isInWishlist, clearWishlist, getTotalItems } =
    useWishlistStore();

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return {
    items,
    count: getTotalItems(),
    addItem,
    removeItem,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
  };
};
