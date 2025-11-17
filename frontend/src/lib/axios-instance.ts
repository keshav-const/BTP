import axios from 'axios'

import { clearAuthSession, getAuthToken } from '@/lib/auth'

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession()
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
