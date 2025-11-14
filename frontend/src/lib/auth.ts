import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'auth_refresh_token';
export const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY || 'auth_token';
const COOKIE_MAX_AGE_SECONDS = Number(process.env.NEXT_PUBLIC_AUTH_COOKIE_MAX_AGE ?? 60 * 60 * 24);

const isBrowser = () => typeof window !== 'undefined';

const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  if (!isBrowser()) return;
  const encodedValue = encodeURIComponent(value);
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodedValue}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
};

const clearCookie = (name: string) => {
  if (!isBrowser()) return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const getAuthToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, token);
  setCookie(AUTH_COOKIE_NAME, token, COOKIE_MAX_AGE_SECONDS);
};

export const removeAuthToken = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  clearCookie(AUTH_COOKIE_NAME);
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const removeRefreshToken = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
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
