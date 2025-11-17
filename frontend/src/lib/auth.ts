import type { User } from '@/types/user'

const DEFAULT_TOKEN_KEY = 'auth_token'

const isBrowser = typeof window !== 'undefined'

const resolveTokenKey = (): string => {
  const envKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY?.trim()
  return envKey && envKey.length > 0 ? envKey : DEFAULT_TOKEN_KEY
}

const resolveRefreshTokenKey = (): string => `${resolveTokenKey()}_refresh`

const resolveUserKey = (): string => `${resolveTokenKey()}_user`

export const getAuthToken = (): string | null => {
  if (!isBrowser) {
    return null
  }

  return window.localStorage.getItem(resolveTokenKey())
}

export const setAuthToken = (token: string): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(resolveTokenKey(), token)
}

export const removeAuthToken = (): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.removeItem(resolveTokenKey())
}

export const getRefreshToken = (): string | null => {
  if (!isBrowser) {
    return null
  }

  return window.localStorage.getItem(resolveRefreshTokenKey())
}

export const setRefreshToken = (token: string): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(resolveRefreshTokenKey(), token)
}

export const removeRefreshToken = (): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.removeItem(resolveRefreshTokenKey())
}

export const getStoredUser = (): User | null => {
  if (!isBrowser) {
    return null
  }

  const raw = window.localStorage.getItem(resolveUserKey())

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as User
  } catch (error) {
    console.warn('Failed to parse stored user data', error)
    window.localStorage.removeItem(resolveUserKey())
    return null
  }
}

export const setStoredUser = (user: User): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(resolveUserKey(), JSON.stringify(user))
}

export const removeStoredUser = (): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.removeItem(resolveUserKey())
}

export const clearAuthSession = (): void => {
  removeAuthToken()
  removeRefreshToken()
  removeStoredUser()
}

export const isAuthenticated = (): boolean => {
  return Boolean(getAuthToken())
}
