import axiosInstance from '@/lib/axios-instance'
import type { ApiResponse } from '@/types/api'
import type { Product } from '@/types/product'
import type { WishlistSummary } from '@/types/wishlist'

interface WishlistItemApi {
  id: string
  productId: string
  product?: Partial<Product> & { _id?: string }
}

interface WishlistResponseApi {
  items?: WishlistItemApi[]
}

const toProduct = (product: WishlistItemApi['product']): Product | null => {
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

const transformWishlistResponse = (payload?: WishlistResponseApi): WishlistSummary => {
  const items = (payload?.items ?? [])
    .map((item) => {
      const product = toProduct(item.product)

      if (!product) {
        return null
      }

      return {
        id: item.id,
        productId: product.id,
        product,
      }
    })
    .filter((item): item is WishlistSummary['items'][number] => Boolean(item))

  return {
    items,
  }
}

const handleResponse = <T,>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success || !response.data) {
    throw new Error(response.message || fallbackMessage)
  }

  return response.data
}

export const wishlistApi = {
  async getWishlist(): Promise<WishlistSummary> {
    const { data } = await axiosInstance.get<ApiResponse<WishlistResponseApi>>('wishlist')
    return transformWishlistResponse(handleResponse(data, 'Unable to retrieve wishlist'))
  },

  async addItem(productId: string): Promise<WishlistSummary> {
    const { data } = await axiosInstance.post<ApiResponse<WishlistResponseApi>>('wishlist', { productId })
    return transformWishlistResponse(handleResponse(data, 'Unable to add product to wishlist'))
  },

  async removeItem(itemId: string): Promise<WishlistSummary> {
    const { data } = await axiosInstance.delete<ApiResponse<WishlistResponseApi>>(`wishlist/${itemId}`)
    return transformWishlistResponse(handleResponse(data, 'Unable to remove product from wishlist'))
  },

  async clear(): Promise<WishlistSummary> {
    const { data } = await axiosInstance.delete<ApiResponse<WishlistResponseApi>>('wishlist')
    return transformWishlistResponse(handleResponse(data, 'Unable to clear wishlist'))
  },
}

export default wishlistApi
