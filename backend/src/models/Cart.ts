import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItemDocument extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItemDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItemDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const cartSchema = new Schema<ICartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

cartSchema.index({ user: 1 }, { unique: true });
cartSchema.index({ 'items.product': 1 });

export const Cart = mongoose.model<ICartDocument>('Cart', cartSchema);
