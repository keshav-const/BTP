import { create } from 'zustand';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UiStore {
  // Toast notifications
  toasts: ToastNotification[];
  addToast: (notification: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // UI modals and overlays
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;

  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  toasts: [],

  addToast: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...notification, id }],
    }));

    if (notification.duration) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, notification.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  isMenuOpen: false,
  setMenuOpen: (open) => set({ isMenuOpen: open }),

  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
