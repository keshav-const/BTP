import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '@/types';

export interface IProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  tags: string[];
  isActive: boolean;
}

const productSchema = new Schema<IProductDocument>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required'],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  images: [{
    type: String,
    trim: true,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model<IProductDocument>('Product', productSchema);