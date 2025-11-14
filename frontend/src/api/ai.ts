import axiosInstance from '@/lib/axios-instance';
import { ApiResponse } from '@/types';

export interface AiSearchResponse {
  query: string;
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export interface AiDescriptionResponse {
  shortDescription: string;
  longDescription: string;
  seoKeywords: string[];
  highlights: string[];
}

export const aiApi = {
  search: async (query: string) => {
    const response = await axiosInstance.post<ApiResponse<AiSearchResponse>>(
      '/ai/search',
      { query }
    );
    return response.data;
  },

  generateDescription: async (productName: string, productInfo?: Record<string, unknown>) => {
    const response = await axiosInstance.post<ApiResponse<AiDescriptionResponse>>(
      '/ai/generate-description',
      {
        productName,
        productInfo,
      }
    );
    return response.data;
  },
};
