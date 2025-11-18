import axiosInstance from '@/lib/axios-instance'
import type { ApiResponse } from '@/types/api'
import type { Product } from '@/types/product'

interface ProductApi extends Partial<Product> {
  _id: string | { toString: () => string }
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

const resolveProductId = (product: ProductApi): string => {
  if (typeof product.id === 'string' && product.id.trim().length > 0) {
    return product.id
  }

  if (typeof product._id === 'string' && product._id.trim().length > 0) {
    return product._id
  }

  if (product._id && typeof product._id === 'object' && 'toString' in product._id) {
    const toString = product._id.toString as (() => string) | undefined

    if (typeof toString === 'function') {
      const value = toString.call(product._id)
      if (typeof value === 'string' && value.trim().length > 0) {
        return value
      }
    }
  }

  throw new Error('Product identifier is missing')
}

const toProduct = (product: ProductApi): Product => {
  const id = resolveProductId(product)
  const resolvedPrice = typeof product.price === 'number' ? product.price : Number(product.price) || 0
  const rawStock =
    typeof product.stock === 'number'
      ? product.stock
      : product.stock != null
        ? Number(product.stock)
        : null
  const stock = typeof rawStock === 'number' && Number.isFinite(rawStock) ? rawStock : null

  return {
    id,
    name: product.name ?? 'Untitled product',
    description: product.description ?? null,
    price: resolvedPrice,
    category: product.category ?? null,
    brand: product.brand ?? null,
    images: Array.isArray(product.images) ? product.images : [],
    stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

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
      items: (payload.data ?? [])
        .map((product) => {
          try {
            return toProduct(product)
          } catch (error) {
            console.warn('Skipping product with invalid identifier', error)
            return null
          }
        })
        .filter((product): product is Product => Boolean(product)),
      pagination: payload.pagination,
    }
  },

  async getById(id: string): Promise<Product> {
    const trimmedId = id.trim()

    if (!trimmedId) {
      throw new Error('Product identifier is required')
    }

    const { data } = await axiosInstance.get<ApiResponse<ProductApi>>(`products/${encodeURIComponent(trimmedId)}`)
    const payload = handleResponse(data, 'Unable to retrieve product details')

    return toProduct(payload)
  },
}

export default productsApi
