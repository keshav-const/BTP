import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/api/auth';
import {
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  setRefreshToken as persistRefreshToken,
  removeRefreshToken,
  getRefreshToken,
} from '@/lib/auth';

const normalizeUser = (payload: any): User => {
  if (!payload) {
    throw new Error('Invalid user payload');
  }

  const firstName = payload.firstName ?? payload.name?.split(' ')?.[0] ?? '';
  const lastName = payload.lastName ?? payload.name?.split(' ')?.slice(1).join(' ') ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || payload.name || payload.email;

  return {
    id: payload.id,
    email: payload.email,
    name: fullName,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    role: payload.role,
    createdAt: payload.createdAt ?? new Date().toISOString(),
    phoneNumber: payload.phoneNumber ?? null,
    addresses: payload.addresses ?? [],
  };
};

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
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
      refreshToken: null,
      isLoading: false,
      error: null,
      isHydrated: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.login(email, password);
          if (!result.success || !result.data) {
            throw new Error(result.message || 'Login failed');
          }

          const { user, accessToken, refreshToken } = result.data;
          const normalizedUser = normalizeUser(user);

          setAuthToken(accessToken);
          if (refreshToken) {
            persistRefreshToken(refreshToken);
          }

          set({
            user: normalizedUser,
            token: accessToken,
            refreshToken: refreshToken ?? null,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      register: async (firstName, lastName, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authApi.register(firstName, lastName, email, password);
          if (!result.success || !result.data) {
            throw new Error(result.message || 'Registration failed');
          }

          const { user, accessToken, refreshToken } = result.data;
          const normalizedUser = normalizeUser(user);

          setAuthToken(accessToken);
          if (refreshToken) {
            persistRefreshToken(refreshToken);
          }

          set({
            user: normalizedUser,
            token: accessToken,
            refreshToken: refreshToken ?? null,
            isLoading: false,
          });
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
        } finally {
          removeAuthToken();
          removeRefreshToken();
          set({ user: null, token: null, refreshToken: null, isLoading: false });
        }
      },

      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const result = await authApi.getProfile();
          if (result.success && result.data) {
            const normalizedUser = normalizeUser(result.data);
            set({ user: normalizedUser, isLoading: false });
            return;
          }

          set({ isLoading: false });
        } catch (error) {
          removeAuthToken();
          removeRefreshToken();
          set({ user: null, token: null, refreshToken: null, isLoading: false });
        }
      },

      hydrate: () => {
        const token = getAuthToken();
        const refreshToken = getRefreshToken();
        if (token) {
          set({ token, refreshToken: refreshToken ?? null, isHydrated: true });
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
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
