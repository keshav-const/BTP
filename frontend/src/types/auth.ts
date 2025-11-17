import type { User } from '@/types/user'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthPayload extends AuthTokens {
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}
