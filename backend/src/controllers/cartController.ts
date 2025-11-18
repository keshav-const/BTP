import { Response } from 'express';
import mongoose from 'mongoose';

import { Cart, Product } from '@/models';
import { IAuthRequest, ApiResponse } from '@/types';

const CART_PRODUCT_FIELDS = 'name price images category brand stock description';

type CartItemResponse = {
  id: string;
  productId: string;
  qty: number;
  product: Record<string, any> | null;
};

type CartResponse = {
  items: CartItemResponse[];
  subtotal: number;
  totalQuantity: number;
};

const normalizeProduct = (product: any) => {
  if (!product) {
    return null;
  }

  const plainProduct = typeof product.toObject === 'function' ? product.toObject() : product;

  if (!plainProduct?._id) {
    return null;
  }

  return {
    id: plainProduct._id.toString(),
    name: plainProduct.name,
    price: plainProduct.price,
    images: plainProduct.images ?? [],
    category: plainProduct.category ?? null,
    brand: plainProduct.brand ?? null,
    stock: plainProduct.stock ?? null,
    description: plainProduct.description ?? null,
  };
};

const mapCart = (cart: any): CartResponse => {
  if (!cart) {
    return { items: [], subtotal: 0, totalQuantity: 0 };
  }

  const items: CartItemResponse[] = [];
  let subtotal = 0;
  let totalQuantity = 0;

  for (const item of cart.items ?? []) {
    const product = normalizeProduct(item.product);

    if (!product) {
      continue;
    }

    const quantity = Number(item.quantity) || 0;

    subtotal += (Number(product.price) || 0) * quantity;
    totalQuantity += quantity;

    items.push({
      id: (item._id as mongoose.Types.ObjectId).toString(),
      productId: product.id,
      qty: quantity,
      product,
    });
  }

  return {
    items,
    subtotal,
    totalQuantity,
  };
};

const findOrCreateCart = async (userId: mongoose.Types.ObjectId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const getPopulatedCart = async (cartId: mongoose.Types.ObjectId) =>
  Cart.findById(cartId).populate('items.product', CART_PRODUCT_FIELDS);

export const cartController = {
  async getCart(req: IAuthRequest, res: Response<ApiResponse<CartResponse>>): Promise<void> {
    try {
      const user = req.user!;

      const cart = await findOrCreateCart(user._id);
      const populatedCart = await getPopulatedCart(cart._id as mongoose.Types.ObjectId);

      res.json({
        success: true,
        message: 'Cart retrieved successfully',
        data: mapCart(populatedCart),
      });
    } catch (error) {
      console.error('Error in getCart:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving cart',
        error: (error as Error).message,
      });
    }
  },

  async addToCart(req: IAuthRequest, res: Response<ApiResponse<CartResponse>>): Promise<void> {
    try {
      const user = req.user!;
      const { productId, qty = 1 } = req.body as { productId: string; qty?: number };

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
        });
        return;
      }

      const quantity = Number(qty);
      if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1',
        });
        return;
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      const cart = await findOrCreateCart(user._id);

      const existingItem = cart.items.find((item) => item.product.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: product._id, quantity } as any);
      }

      await cart.save();

      const populatedCart = await getPopulatedCart(cart._id as mongoose.Types.ObjectId);

      res.status(201).json({
        success: true,
        message: 'Product added to cart successfully',
        data: mapCart(populatedCart),
      });
    } catch (error) {
      console.error('Error in addToCart:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding product to cart',
        error: (error as Error).message,
      });
    }
  },

  async updateCartItem(req: IAuthRequest, res: Response<ApiResponse<CartResponse>>): Promise<void> {
    try {
      const user = req.user!;
      const { itemId } = req.params as { itemId: string };
      const { qty } = req.body as { qty: number };

      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid cart item ID format',
        });
        return;
      }

      const quantity = Number(qty);
      if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1',
        });
        return;
      }

      const cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
        return;
      }

      const targetItem = cart.items.find((item) => (item._id as mongoose.Types.ObjectId).toString() === itemId);

      if (!targetItem) {
        res.status(404).json({
          success: false,
          message: 'Cart item not found',
        });
        return;
      }

      targetItem.quantity = quantity;
      await cart.save();

      const populatedCart = await getPopulatedCart(cart._id as mongoose.Types.ObjectId);

      res.json({
        success: true,
        message: 'Cart updated successfully',
        data: mapCart(populatedCart),
      });
    } catch (error) {
      console.error('Error in updateCartItem:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating cart',
        error: (error as Error).message,
      });
    }
  },

  async removeCartItem(req: IAuthRequest, res: Response<ApiResponse<CartResponse>>): Promise<void> {
    try {
      const user = req.user!;
      const { itemId } = req.params as { itemId: string };

      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid cart item ID format',
        });
        return;
      }

      const cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
        return;
      }

      const initialLength = cart.items.length;
      cart.items = cart.items.filter((item) => (item._id as mongoose.Types.ObjectId).toString() !== itemId);

      if (cart.items.length === initialLength) {
        res.status(404).json({
          success: false,
          message: 'Cart item not found',
        });
        return;
      }

      await cart.save();

      const populatedCart = await getPopulatedCart(cart._id as mongoose.Types.ObjectId);

      res.json({
        success: true,
        message: 'Product removed from cart successfully',
        data: mapCart(populatedCart),
      });
    } catch (error) {
      console.error('Error in removeCartItem:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing product from cart',
        error: (error as Error).message,
      });
    }
  },

  async clearCart(req: IAuthRequest, res: Response<ApiResponse<CartResponse>>): Promise<void> {
    try {
      const user = req.user!;

      const cart = await findOrCreateCart(user._id);
      cart.items = [];
      await cart.save();

      res.json({
        success: true,
        message: 'Cart cleared successfully',
        data: { items: [], subtotal: 0, totalQuantity: 0 },
      });
    } catch (error) {
      console.error('Error in clearCart:', error);
      res.status(500).json({
        success: false,
        message: 'Error clearing cart',
        error: (error as Error).message,
      });
    }
  },
};
