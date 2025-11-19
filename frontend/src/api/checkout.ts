import axios from 'axios'
import type { CheckoutData, Order } from '@/types/checkout'
import { getAuthToken } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const getHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const checkoutApi = {
  async createCheckout(data: CheckoutData): Promise<Order> {
    const response = await axios.post(
      `${API_BASE_URL}/checkout`,
      data,
      { headers: getHeaders() }
    )
    return response.data.data
  },

  async processPayment(orderId: string, cardDetails: CheckoutData['cardDetails']): Promise<{
    order: Order
    razorpayOrderId: string
    razorpayPaymentId: string
  }> {
    const response = await axios.post(
      `${API_BASE_URL}/payment/razorpay`,
      { orderId, cardDetails },
      { headers: getHeaders() }
    )
    return response.data.data
  },

  async getOrderConfirmation(orderId: string): Promise<Order> {
    const response = await axios.get(
      `${API_BASE_URL}/checkout/${orderId}`,
      { headers: getHeaders() }
    )
    return response.data.data
  },
}

export default checkoutApi
