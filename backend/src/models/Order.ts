import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, IOrderItem } from '@/types';

export interface IOrderDocument extends Document {
  user: mongoose.Types.ObjectId;
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
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
}, { _id: false });

const shippingAddressSchema = new Schema({
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

const orderSchema = new Schema<IOrderDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ isPaid: 1 });

export const Order = mongoose.model<IOrderDocument>('Order', orderSchema);