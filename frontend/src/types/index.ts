export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  quantity?: number;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface WishlistItem extends Product {
  addedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
