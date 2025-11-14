import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token && !isTokenExpired(token);
};
