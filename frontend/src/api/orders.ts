import axiosInstance from '@/lib/axios-instance';
import { ApiResponse, Order, OrderStatus, PaginatedResponse } from '@/types';

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CreateOrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface ShippingAddressPayload {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: CreateOrderItem[];
  shippingAddress: ShippingAddressPayload;
  paymentMethod: string;
}

export const ordersApi = {
  getOrders: async (params: OrderListParams = {}) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Order>>>(
      '/orders',
      { params }
    );
    return response.data;
  },

  getOrdersByUser: async (userId: string, params: OrderListParams = {}) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Order>>>(
      `/orders/user/${userId}`,
      { params }
    );
    return response.data;
  },

  getAdminOrders: async (params: OrderListParams = {}) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Order>>>(
      '/admin/orders',
      { params }
    );
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderRequest) => {
    const response = await axiosInstance.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  cancelOrder: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: OrderStatus) => {
    const response = await axiosInstance.put<ApiResponse<Order>>(
      `/admin/orders/${id}`,
      { status }
    );
    return response.data;
  },
};
