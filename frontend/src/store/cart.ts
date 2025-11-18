'use client'

import axios from 'axios'
import { create } from 'zustand'

import cartApi from '@/api/cart'
import { getAuthToken } from '@/lib/auth'
import { isValidObjectId } from '@/lib/utils'
import { toastError, toastInfo, toastSuccess } from '@/lib/toast'
import type { CartItem, CartSummary } from '@/types/cart'
import type { Product } from '@/types/product'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  hasHydrated: boolean
  load: (force?: boolean) => Promise<void>
  add: (productId: string, qty?: number, options?: { product?: Product; silent?: boolean }) => Promise<void>
  update: (itemId: string, qty: number) => Promise<void>
  remove: (itemId: string) => Promise<void>
  clear: (options?: { skipServer?: boolean }) => Promise<void>
  getTotalQuantity: () => number
  getSubtotal: () => number
}

const baseState = {
  items: [] as CartItem[],
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

const syncState = (set: (fn: (state: CartState) => Partial<CartState>) => void, payload: CartSummary) => {
  set(() => ({
    items: payload.items,
    error: null,
    hasHydrated: true,
  }))
}

export const useCartStore = create<CartState>((set, get) => ({
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
      const cart = await cartApi.getCart()
      syncState(set, cart)
    } catch (error) {
      const { message, isUnauthorized } = parseError(error)

      set(() => ({
        items: [],
        error: message,
        hasHydrated: true,
      }))

      if (isUnauthorized) {
        toastInfo('Please sign in to view your cart.')
      } else {
        toastError(message)
      }
    } finally {
      set(() => ({ isLoading: false }))
    }
  },
  add: async (productId, qty = 1, options) => {
    const previousItems = get().items
    let optimisticItems = previousItems
    let createdTemporaryItemId: string | null = null

    if (!isValidObjectId(productId)) {
      toastError('Invalid product ID format.')
      return
    }

    if (qty < 1) {
      toastInfo('Quantity must be at least 1.')
      return
    }

    const existingItem = previousItems.find((item) => item.productId === productId)

    if (existingItem) {
      optimisticItems = previousItems.map((item) =>
        item.productId === productId
          ? { ...item, qty: item.qty + qty }
          : item
      )
    } else if (options?.product) {
      createdTemporaryItemId = `temp-${Date.now()}`
      optimisticItems = [
        ...previousItems,
        {
          id: createdTemporaryItemId,
          productId,
          qty,
          product: options.product,
        },
      ]
    }

    if (optimisticItems !== previousItems) {
      set(() => ({ items: optimisticItems, error: null }))
    }

    try {
      const cart = await cartApi.addItem(productId, qty)
      syncState(set, cart)
      if (!options?.silent) {
        toastSuccess('Added to cart.')
      }
    } catch (error) {
      set(() => ({ items: previousItems }))
      const { message, isUnauthorized } = parseError(error)

      if (isUnauthorized) {
        toastInfo('Please sign in to add items to your cart.')
      } else {
        toastError(message)
      }
    } finally {
      if (createdTemporaryItemId) {
        const refreshedItems = get().items
        if (refreshedItems.some((item) => item.id === createdTemporaryItemId)) {
          set(() => ({ items: previousItems }))
        }
      }
    }
  },
  update: async (itemId, qty) => {
    if (qty < 1) {
      toastInfo('Quantity must be at least 1.')
      return
    }

    const previousItems = get().items
    const targetItem = previousItems.find((item) => item.id === itemId)

    if (!targetItem) {
      toastInfo('Unable to locate cart item.')
      return
    }

    const optimisticItems = previousItems.map((item) =>
      item.id === itemId
        ? { ...item, qty }
        : item
    )

    set(() => ({ items: optimisticItems, error: null }))

    try {
      const cart = await cartApi.updateItem(itemId, qty)
      syncState(set, cart)
      toastSuccess('Updated cart item.')
    } catch (error) {
      set(() => ({ items: previousItems }))
      const { message, isUnauthorized } = parseError(error)

      if (isUnauthorized) {
        toastInfo('Please sign in to update your cart.')
      } else {
        toastError(message)
      }
    }
  },
  remove: async (itemId) => {
    const previousItems = get().items
    const targetItem = previousItems.find((item) => item.id === itemId)

    if (!targetItem) {
      toastInfo('Unable to locate cart item.')
      return
    }

    const optimisticItems = previousItems.filter((item) => item.id !== itemId)
    set(() => ({ items: optimisticItems, error: null }))

    try {
      const cart = await cartApi.removeItem(itemId)
      syncState(set, cart)
      toastSuccess('Removed item from cart.')
    } catch (error) {
      set(() => ({ items: previousItems }))
      const { message, isUnauthorized } = parseError(error)

      if (isUnauthorized) {
        toastInfo('Please sign in to update your cart.')
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
      const cart = await cartApi.clear()
      syncState(set, cart)
      toastSuccess('Cart cleared.')
    } catch (error) {
      set(() => ({ items: previousItems }))
      const { message, isUnauthorized } = parseError(error)

      if (isUnauthorized) {
        toastInfo('Please sign in to manage your cart.')
      } else {
        toastError(message)
      }
    }
  },
  getTotalQuantity: () => get().items.reduce((total, item) => total + item.qty, 0),
  getSubtotal: () => get().items.reduce((total, item) => total + item.qty * item.product.price, 0),
}))
