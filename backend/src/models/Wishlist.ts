import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItemDocument extends Document {
  product: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWishlistDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: IWishlistItemDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema = new Schema<IWishlistItemDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const wishlistSchema = new Schema<IWishlistDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ user: 1 }, { unique: true });
wishlistSchema.index({ 'items.product': 1 });

export const Wishlist = mongoose.model<IWishlistDocument>('Wishlist', wishlistSchema);
