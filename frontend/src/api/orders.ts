import axios from 'axios'
import type { Order } from '@/types/checkout'
import { getAuthToken } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const getHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export interface OrdersResponse {
  data: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const ordersApi = {
  async getOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/orders?page=${page}&limit=${limit}&sort=createdAt&order=desc`,
      { headers: getHeaders() }
    )
    return response.data.data
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await axios.get(
      `${API_BASE_URL}/orders/${id}`,
      { headers: getHeaders() }
    )
    return response.data.data
  },

  async cancelOrder(id: string): Promise<Order> {
    const response = await axios.delete(
      `${API_BASE_URL}/orders/${id}/cancel`,
      { headers: getHeaders() }
    )
    return response.data.data
  },
}

export default ordersApi
