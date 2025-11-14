import axiosInstance from '@/lib/axios-instance';
import { ApiResponse, PaginatedResponse } from '@/types';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
}

export const ordersApi = {
  getOrders: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Order>>
    >('/orders', {
      params: { page, limit },
    });
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderRequest) => {
    const response = await axiosInstance.post<ApiResponse<Order>>(
      '/orders',
      data
    );
    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<Order>>(
      `/orders/${id}/cancel`
    );
    return response.data;
  },
};
