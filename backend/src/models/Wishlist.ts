import mongoose, { Schema, Document } from 'mongoose';
import { IWishlist } from '@/types';

export interface IWishlistDocument extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlistDocument>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, {
  timestamps: true,
});

// Indexes for better query performance
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ products: 1 });

export const Wishlist = mongoose.model<IWishlistDocument>('Wishlist', wishlistSchema);