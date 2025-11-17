'use client'

import axios from 'axios'
import { create } from 'zustand'

import wishlistApi from '@/api/wishlist'
import { getAuthToken } from '@/lib/auth'
import { toastError, toastInfo, toastSuccess } from '@/lib/toast'
import type { WishlistItem } from '@/types/wishlist'
import type { Product } from '@/types/product'

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  error: string | null
  hasHydrated: boolean
  load: (force?: boolean) => Promise<void>
  add: (productId: string, options?: { product?: Product }) => Promise<void>
  remove: (itemId: string) => Promise<void>
  clear: (options?: { skipServer?: boolean }) => Promise<void>
}

const baseState = {
  items: [] as WishlistItem[],
  isLoading: false,
  error: null as string | null,
  hasHydrated: false,
}

const parseError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const responseMessage = error.response?.data?.message
    const responseError = error.response?.data?.error

    return {
      message:
        (typeof responseMessage === 'string' && responseMessage.length > 0)
          ? responseMessage
          : (typeof responseError === 'string' && responseError.length > 0)
            ? responseError
            : 'An unexpected error occurred. Please try again.',
      isUnauthorized: status === 401,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      isUnauthorized: false,
    }
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    isUnauthorized: false,
  }
}

const syncState = (set: (fn: (state: WishlistState) => Partial<WishlistState>) => void, items: WishlistItem[]) => {
  set(() => ({
    items,
    error: null,
    hasHydrated: true,
  }))
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ...baseState,
  load: async (force = false) => {
    const { hasHydrated } = get()

    if (!force && hasHydrated) {
      return
    }

    if (!getAuthToken()) {
      set(() => ({ ...baseState, hasHydrated: true }))
      return
    }

    set(() => ({ isLoading: true, error: null }))

    try {
      const wishlist = await wishlistApi.getWishlist()
      syncState(set, wishlist.items)
    } catch (error) {
      const { message, isUnauthorized } = parseError(error)

      set(() => ({
        items: [],
        error: message,
        hasHydrated: true,
      }))

      if (isUnauthorized) {
        toastInfo('Please sign in to view your wishlist.')
      } else {
        toastError(message)
      }
    } finally {
      set(() => ({ isLoading: false }))
    }
  },
  add: async (productId, options) => {
    const previousItems = get().items
    const existingItem = previousItems.find((item) => item.productId === productId)

    if (existingItem) {
      toastInfo('This product is already in your wishlist.')
      return
    }

    let optimisticItems = previousItems
    let temporaryId: string | null = null

    if (options?.product) {
      temporaryId = `temp-${Date.now()}`
      optimisticItems = [
        ...previousItems,
        {
          id: temporaryId,
          productId,
          product: options.product,
        },
      ]
      set(() => ({ items: optimisticItems, error: null }))
    }

    try {
      const wishlist = await wishlistApi.addItem(productId)
      syncState(set, wishlist.items)
      toastSuccess('Saved to your wishlist.')
    } catch (error) {
      if (optimisticItems !== previousItems) {
        set(() => ({ items: previousItems }))
      }

      const { message, isUnauthorized } = parseError(error)

      if (isUnauthorized) {
        toastInfo('Please sign in to manage your wishlist.')
      } else {
        toastError(message)
      }
    } finally {
      if (temporaryId) {
        const refreshedItems = get().items
        if (refreshedItems.some((item) => item.id === temporaryId)) {
          set(() => ({ items: previousItems }))
        }
      }
    }
  },
  remove: async (itemId) => {
    const previousItems = get().items
    const targetItem = previousItems.find((item) => item.id === itemId)

    if (!targetItem) {
      toastInfo('Unable to locate wishlist item.')
      return
    }

    const optimisticItems = previousItems.filter((item) => item.id !== itemId)
    set(() => ({ items: optimisticItems, error: null }))

    try {
      const wishlist = await wishlistApi.removeItem(itemId)
      syncState(set, wishlist.items)
      toastSuccess('Removed from your wishlist.')
    } catch (error) {
      set(() => ({ items: previousItems }))
      const { message, isUnauthorized } = parseError(error)

      if (isUnauthorized) {
        toastInfo('Please sign in to manage your wishlist.')
      } else {
        toastError(message)
      }
    }
  },
  clear: async (options) => {
    if (options?.skipServer) {
      set(() => ({ ...baseState, hasHydrated: false }))
      return
    }

    const previousItems = get().items
    set(() => ({ items: [], error: null }))

    try {
      const wishlist = await wishlistApi.clear()
      syncState(set, wishlist.items)
      toastSuccess('Wishlist cleared.')
    } catch (error) {
      set(() => ({ items: previousItems }))
      const { message, isUnauthorized } = parseError(error)

      if (isUnauthorized) {
        toastInfo('Please sign in to manage your wishlist.')
      } else {
        toastError(message)
      }
    }
  },
}))
