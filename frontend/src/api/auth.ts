import axiosInstance from '@/lib/axios-instance';
import { ApiResponse, UserRole } from '@/types';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthUserResponse extends AuthTokens {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    phoneNumber?: string | null;
    createdAt?: string;
  };
}

interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string | null;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<AuthUserResponse>>(
      '/auth/login',
      { email, password }
    );
    return response.data;
  },

  register: async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<AuthUserResponse>>(
      '/auth/signup',
      { firstName, lastName, email, password }
    );
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get<ApiResponse<ProfileResponse>>('/auth/profile');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axiosInstance.post<ApiResponse<AuthTokens>>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  logout: async () => Promise.resolve(),
};
