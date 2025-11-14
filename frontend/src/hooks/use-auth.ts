'use client';

import { useAuthStore } from '@/store';

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
  } = useAuthStore();

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    getCurrentUser,
  };
};
