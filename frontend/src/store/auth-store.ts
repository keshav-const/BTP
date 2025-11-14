import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/api/auth';
import { setAuthToken, removeAuthToken, getAuthToken } from '@/lib/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;

  hydrate: () => void;
  isHydrated: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.login(email, password);
          if (result.data?.token && result.data?.user) {
            setAuthToken(result.data.token);
            set({
              user: result.data.user,
              token: result.data.token,
              isLoading: false,
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.register(name, email, password);
          if (result.data?.token && result.data?.user) {
            setAuthToken(result.data.token);
            set({
              user: result.data.user,
              token: result.data.token,
              isLoading: false,
            });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
          removeAuthToken();
          set({ user: null, token: null, isLoading: false });
        } catch (logoutError) {
          const message = logoutError instanceof Error ? logoutError.message : 'Logout failed';
          set({ isLoading: false, error: message });
          throw logoutError;
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const result = await authApi.getCurrentUser();
          if (result.data) {
            set({ user: result.data, isLoading: false });
          }
        } catch (error) {
          removeAuthToken();
          set({ user: null, token: null, isLoading: false });
        }
      },

      hydrate: () => {
        const token = getAuthToken();
        if (token) {
          set({ token, isHydrated: true });
        } else {
          set({ isHydrated: true });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
