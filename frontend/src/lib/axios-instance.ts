import axios from 'axios'
import { clearAuthSession, getAuthToken } from '@/lib/auth'

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api'

// Normalize baseURL to always end with a single slash
const rawBase = (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).trim()
const baseURL = rawBase.replace(/\/+$/, '') + '/'

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

// Only attach token at request time (avoids SSR pitfalls)
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken?.()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', {
      url: (error?.config?.baseURL || '') + (error?.config?.url || ''),
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data,
    })

    if (error.response?.status === 401) {
      clearAuthSession?.()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance