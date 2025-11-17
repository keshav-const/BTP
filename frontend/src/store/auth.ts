'use client'

import axios from 'axios'
import { create } from 'zustand'

import authApi from '@/api/auth'
import axiosInstance from '@/lib/axios-instance'
import {
  AUTH_SESSION_CLEARED_EVENT,
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
  isLoading: boolean
  hydrate: () => Promise<void>
  login: (payload: LoginPayload) => Promise<AuthPayload>
  register: (payload: RegisterPayload) => Promise<AuthPayload>
  logout: () => void
}

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
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
  hydrate: async () => {
    const token = getAuthToken()
    const refreshToken = getRefreshToken()
    const storedUser = getStoredUser()

    if (!token) {
      set({ ...initialState })
      return
    }

    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`

    set({
      accessToken: token,
      refreshToken: refreshToken ?? null,
      user: storedUser,
      isAuthenticated: Boolean(storedUser),
      isLoading: true,
    })

    try {
      const currentUser = await authApi.getCurrentUser()
      setStoredUser(currentUser)

      set({
        user: currentUser,
        isAuthenticated: true,
      })
    } catch (error) {
      clearAuthSession()
      set({ ...initialState })
    } finally {
      set({ isLoading: false })
    }
  },
  login: async (payload) => {
    set({ isLoading: true })

    try {
      const data = await authApi.login(payload)

      setAuthToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`

      let resolvedUser = data.user

      try {
        resolvedUser = await authApi.getCurrentUser()
      } catch (fetchError) {
        if (axios.isAxiosError(fetchError) && fetchError.response?.status === 401) {
          clearAuthSession()
          delete axiosInstance.defaults.headers.common.Authorization
          throw new Error(parseErrorMessage(fetchError))
        }

        console.warn('Failed to refresh user profile after login', fetchError)
      }

      setStoredUser(resolvedUser)

      set({
        user: resolvedUser,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      })

      return data
    } catch (error) {
      throw new Error(parseErrorMessage(error))
    } finally {
      set({ isLoading: false })
    }
  },
  register: async (payload) => {
    set({ isLoading: true })

    try {
      const data = await authApi.register(payload)

      setAuthToken(data.accessToken)
      setRefreshToken(data.refreshToken)
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`

      let resolvedUser = data.user

      try {
        resolvedUser = await authApi.getCurrentUser()
      } catch (fetchError) {
        if (axios.isAxiosError(fetchError) && fetchError.response?.status === 401) {
          clearAuthSession()
          delete axiosInstance.defaults.headers.common.Authorization
          throw new Error(parseErrorMessage(fetchError))
        }

        console.warn('Failed to refresh user profile after registration', fetchError)
      }

      setStoredUser(resolvedUser)

      set({
        user: resolvedUser,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      })

      return data
    } catch (error) {
      throw new Error(parseErrorMessage(error))
    } finally {
      set({ isLoading: false })
    }
  },
  logout: () => {
    clearAuthSession()
    delete axiosInstance.defaults.headers.common.Authorization
    set({ ...initialState })
  },
}))

if (typeof window !== 'undefined') {
  window.addEventListener(AUTH_SESSION_CLEARED_EVENT, () => {
    useAuthStore.setState({ ...initialState })
  })
}
