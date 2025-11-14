export type UserRole = 'user' | 'admin';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  id: string;
  label?: string | null;
  fullName: string;
  phone?: string | null;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  phoneNumber?: string | null;
  addresses?: Address[];
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
  brand?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  quantity?: number;
  stock?: number;
  tags?: string[];
  highlights?: string[];
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

export interface OrderItemProductSummary {
  id: string;
  name: string;
  images?: string[];
  price: number;
}

export interface OrderItem {
  product: OrderItemProductSummary | string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  updatedAt?: string;
}
