import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUserAddress {
  _id: Types.ObjectId;
  label?: string;
  fullName: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  phoneNumber?: string;
  addresses?: IUserAddress[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  user: Types.ObjectId | IUser;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  isPaid: boolean;
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
  price: number;
}

export interface IWishlist {
  user: Types.ObjectId | IUser;
  products: Types.ObjectId[] | IProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}