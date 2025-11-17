'use client'

import { shallow } from 'zustand/shallow'

import { useAuthStore } from '@/store/auth'

export const useAuth = () =>
  useAuthStore(
    (state) => ({
      user: state.user,
      token: state.accessToken,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      signOut: state.logout,
    }),
    shallow
  )
