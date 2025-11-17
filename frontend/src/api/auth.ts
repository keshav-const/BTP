import axiosInstance from '@/lib/axios-instance'
import type { ApiResponse } from '@/types/api'
import type { AuthPayload, LoginPayload, RegisterPayload } from '@/types/auth'

const handleResponse = (response: ApiResponse<AuthPayload>, fallbackMessage: string): AuthPayload => {
  if (!response.success || !response.data) {
    throw new Error(response.message || fallbackMessage)
  }

  return response.data
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthPayload> {
    const { data } = await axiosInstance.post<ApiResponse<AuthPayload>>('/auth/login', payload)
    return handleResponse(data, 'Unable to complete login request')
  },

  async register(payload: RegisterPayload): Promise<AuthPayload> {
    const { data } = await axiosInstance.post<ApiResponse<AuthPayload>>('/auth/register', payload)
    return handleResponse(data, 'Unable to complete registration request')
  },
}

export default authApi
