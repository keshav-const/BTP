import axiosInstance from '@/lib/axios-instance';
import { Product, ApiResponse, PaginatedResponse } from '@/types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'popularity' | 'newest' | 'price' | 'rating';
  order?: 'asc' | 'desc';
}

export interface AiSearchResponse {
  query: string;
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export const productsApi = {
  getAll: async (filters: ProductFilters = {}) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/products', {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  getRecommendations: async (id: string, limit = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<Product[]>
    >(`/products/${id}/recommendations`, {
      params: { limit },
    });
    return response.data;
  },

  search: async (query: string, page = 1, limit = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/products', {
      params: { search: query, page, limit },
    });
    return response.data;
  },

  getByCategory: async (category: string, page = 1, limit = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Product>>
    >('/products', {
      params: { category, page, limit },
    });
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await axiosInstance.post<ApiResponse<Product>>('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await axiosInstance.put<ApiResponse<Product>>(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<{ id: string }>>(`/products/${id}`);
    return response.data;
  },

  uploadImages: async (formData: FormData) => {
    const response = await axiosInstance.post<ApiResponse<{ images: string[]; count: number }>>(
      '/products/upload-images',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },
};
