import axiosInstance from '@/lib/axios-instance'
import type { ApiResponse } from '@/types/api'
import type { Product } from '@/types/product'

interface ProductApi extends Partial<Product> {
  _id: string
  images?: string[]
}

interface ProductsListResponseApi {
  data: ProductApi[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const toProduct = (product: ProductApi): Product => ({
  id: product.id ?? product._id,
  name: product.name ?? 'Untitled product',
  description: product.description ?? null,
  price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
  category: product.category ?? null,
  brand: product.brand ?? null,
  images: Array.isArray(product.images) ? product.images : [],
  stock: typeof product.stock === 'number' ? product.stock : product.stock ?? null,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
})

const handleResponse = <T,>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success || !response.data) {
    throw new Error(response.message || fallbackMessage)
  }

  return response.data
}

export interface ProductsListResult {
  items: Product[]
  pagination?: ProductsListResponseApi['pagination']
}

export const productsApi = {
  async list(params?: Record<string, unknown>): Promise<ProductsListResult> {
    const { data } = await axiosInstance.get<ApiResponse<ProductsListResponseApi>>('products', {
      params,
    })

    const payload = handleResponse(data, 'Unable to retrieve products')

    return {
      items: (payload.data ?? []).map((product) => toProduct(product)),
      pagination: payload.pagination,
    }
  },

  async getById(id: string): Promise<Product> {
    const { data } = await axiosInstance.get<ApiResponse<ProductApi>>(`products/${id}`)
    const payload = handleResponse(data, 'Unable to retrieve product details')

    return toProduct(payload)
  },
}

export default productsApi
