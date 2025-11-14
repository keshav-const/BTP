import axiosInstance from '@/lib/axios-instance';
import { User, ApiResponse } from '@/types';

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>(
      '/auth/login',
      { email, password }
    );
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>(
      '/auth/register',
      { name, email, password }
    );
    return response.data;
  },

  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data;
  },
};
