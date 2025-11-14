import axiosInstance from '@/lib/axios-instance';
import { Product, ApiResponse, PaginatedResponse } from '@/types';

export const productsApi = {
  getAll: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/products', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  search: async (query: string, page = 1, limit = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/products/search', {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  getByCategory: async (category: string, page = 1, limit = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Product>>
    >(`/products/category/${category}`, {
      params: { page, limit },
    });
    return response.data;
  },
};
