import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  total: number;

  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);

          let updatedItems: CartItem[];
          if (existingItem) {
            updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, cartQuantity: item.cartQuantity + quantity }
                : item
            );
          } else {
            updatedItems = [...state.items, { ...product, cartQuantity: quantity }];
          }

          return {
            items: updatedItems,
            total: get().getTotalPrice(),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
          total: get().getTotalPrice(),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, cartQuantity: quantity } : item
          ),
          total: get().getTotalPrice(),
        }));
      },

      clearCart: () => {
        set({ items: [], total: 0 });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.salePrice || item.price;
          return total + price * item.cartQuantity;
        }, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.cartQuantity, 0);
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.localStorage : undefined as any
      ),
    }
  )
);
