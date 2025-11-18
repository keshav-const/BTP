import axiosInstance from '@/lib/axios-instance'
import type { ApiResponse } from '@/types/api'
import type { AuthPayload, LoginPayload, RegisterPayload } from '@/types/auth'
import type { User } from '@/types/user'

const handleResponse = <T,>(response: ApiResponse<T>, fallbackMessage: string): T => {
  if (!response.success || !response.data) {
    throw new Error(response.message || fallbackMessage)
  }

  return response.data
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthPayload> {
    const { data } = await axiosInstance.post<ApiResponse<AuthPayload>>('auth/login', payload)
    return handleResponse(data, 'Unable to complete login request')
  },

  async register(payload: RegisterPayload): Promise<AuthPayload> {
    const { data } = await axiosInstance.post<ApiResponse<AuthPayload>>('auth/register', payload)
    return handleResponse(data, 'Unable to complete registration request')
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await axiosInstance.get<ApiResponse<User>>('auth/me')
    return handleResponse(data, 'Unable to retrieve account details')
  },
}

export default authApi
