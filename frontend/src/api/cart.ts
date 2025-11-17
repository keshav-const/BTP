import axiosInstance from '@/lib/axios-instance'
import type { ApiResponse } from '@/types/api'
import type { CartSummary } from '@/types/cart'
import type { Product } from '@/types/product'

interface CartItemApi {
  id: string
  productId: string
  qty: number
  product?: Partial<Product> & { _id?: string }
}

interface CartResponseApi {
  items?: CartItemApi[]
  subtotal?: number
  totalQuantity?: number
}

const toProduct = (product: CartItemApi['product']): Product | null => {
  if (!product) {
    return null
  }

  const id = typeof product.id === 'string' ? product.id : product._id

  if (!id) {
    return null
  }

  return {
    id,
    name: product.name ?? 'Untitled product',
    description: product.description ?? null,
    price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
    category: product.category ?? null,
    brand: product.brand ?? null,
    images: Array.isArray(product.images) ? product.images : [],
    stock: typeof product.stock === 'number' ? product.stock : product.stock ?? null,
  }
}

const transformCartResponse = (payload?: CartResponseApi): CartSummary => {
  const items = (payload?.items ?? [])
    .map((item) => {
      const product = toProduct(item.product)

      if (!product) {
        return null
      }

      return {
        id: item.id,
        productId: product.id,
        qty: item.qty ?? 0,
        product,
      }
    })
    .filter((item): item is CartSummary['items'][number] => Boolean(item))

  const subtotal = typeof payload?.subtotal === 'number' ? (payload?.subtotal as number) : 0
  const totalQuantity = typeof payload?.totalQuantity === 'number'
    ? (payload?.totalQuantity as number)
    : items.reduce((total, item) => total + item.qty, 0)

  return {
    items,
    subtotal,
    totalQuantity,
  }
}

const handleResponse = <T,>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success || !response.data) {
    throw new Error(response.message || fallbackMessage)
  }

  return response.data
}

export const cartApi = {
  async getCart(): Promise<CartSummary> {
    const { data } = await axiosInstance.get<ApiResponse<CartResponseApi>>('cart')
    return transformCartResponse(handleResponse(data, 'Unable to retrieve cart'))
  },

  async addItem(productId: string, qty = 1): Promise<CartSummary> {
    const { data } = await axiosInstance.post<ApiResponse<CartResponseApi>>('cart', { productId, qty })
    return transformCartResponse(handleResponse(data, 'Unable to add product to cart'))
  },

  async updateItem(itemId: string, qty: number): Promise<CartSummary> {
    const { data } = await axiosInstance.patch<ApiResponse<CartResponseApi>>(`cart/${itemId}`, { qty })
    return transformCartResponse(handleResponse(data, 'Unable to update cart item'))
  },

  async removeItem(itemId: string): Promise<CartSummary> {
    const { data } = await axiosInstance.delete<ApiResponse<CartResponseApi>>(`cart/${itemId}`)
    return transformCartResponse(handleResponse(data, 'Unable to remove item from cart'))
  },

  async clear(): Promise<CartSummary> {
    const { data } = await axiosInstance.delete<ApiResponse<CartResponseApi>>('cart')
    return transformCartResponse(handleResponse(data, 'Unable to clear cart'))
  },
}

export default cartApi
