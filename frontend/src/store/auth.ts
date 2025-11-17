'use client'

import axios from 'axios'
import { create } from 'zustand'

import authApi from '@/api/auth'
import {
  clearAuthSession,
  getAuthToken,
  getRefreshToken,
  getStoredUser,
  setAuthToken,
  setRefreshToken,
  setStoredUser,
} from '@/lib/auth'
import type { AuthPayload, LoginPayload, RegisterPayload } from '@/types/auth'
import type { User } from '@/types/user'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  hydrate: () => void
  login: (payload: LoginPayload) => Promise<AuthPayload>
  register: (payload: RegisterPayload) => Promise<AuthPayload>
  logout: () => void
}

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
}

const parseErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message
    const responseError = error.response?.data?.error

    if (typeof responseMessage === 'string' && responseMessage.length > 0) {
      return responseMessage
    }

    if (typeof responseError === 'string' && responseError.length > 0) {
      return responseError
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  hydrate: () => {
    const token = getAuthToken()
    const refreshToken = getRefreshToken()
    const user = getStoredUser()

    if (token && user) {
      set({
        user,
        accessToken: token,
        refreshToken: refreshToken ?? null,
        isAuthenticated: true,
      })
    }
  },
  login: async (payload) => {
    try {
      const data = await authApi.login(payload)
      setAuthToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setStoredUser(data.user)

      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      })

      return data
    } catch (error) {
      throw new Error(parseErrorMessage(error))
    }
  },
  register: async (payload) => {
    try {
      const data = await authApi.register(payload)
      setAuthToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      setStoredUser(data.user)

      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      })

      return data
    } catch (error) {
      throw new Error(parseErrorMessage(error))
    }
  },
  logout: () => {
    clearAuthSession()
    set({ ...initialState })
  },
}))
