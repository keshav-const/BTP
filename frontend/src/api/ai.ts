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

export const aiApi = {
  search: async (query: string) => {
    const response = await axiosInstance.post<ApiResponse<AiSearchResponse>>(
      '/ai/search',
      { query }
    );
    return response.data;
  },
};
