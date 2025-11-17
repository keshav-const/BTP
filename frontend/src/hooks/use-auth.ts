'use client'

import { useAuthStore } from '@/store/auth'
import { useShallow } from 'zustand/react/shallow'

export const useAuth = () =>
useAuthStore(
useShallow((state) => ({
user: state.user,
token: state.accessToken,
isAuthenticated: state.isAuthenticated,
isLoading: state.isLoading,
signOut: state.logout,
}))
)