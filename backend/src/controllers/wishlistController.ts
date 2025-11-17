import { Response } from 'express';
import mongoose from 'mongoose';

import { Wishlist, Product } from '@/models';
import { IAuthRequest, ApiResponse } from '@/types';

const WISHLIST_PRODUCT_FIELDS = 'name price images category brand stock description';

type WishlistItemResponse = {
  id: string;
  productId: string;
  product: Record<string, any> | null;
};

type WishlistResponse = {
  items: WishlistItemResponse[];
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

const mapWishlistItems = (wishlist: any): WishlistResponse => {
  if (!wishlist) {
    return { items: [] };
  }

  const items: WishlistItemResponse[] = (wishlist.items ?? [])
    .map((item: any) => {
      const product = normalizeProduct(item.product);

      if (!product) {
        return null;
      }

      return {
        id: item._id.toString(),
        productId: product.id,
        product,
      };
    })
    .filter((item: WishlistItemResponse | null): item is WishlistItemResponse => Boolean(item));

  return { items };
};

const findOrCreateWishlist = async (userId: mongoose.Types.ObjectId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }

  return wishlist;
};

const getPopulatedWishlist = async (wishlistId: mongoose.Types.ObjectId) =>
  Wishlist.findById(wishlistId).populate('items.product', WISHLIST_PRODUCT_FIELDS);

export const wishlistController = {
  async getWishlist(req: IAuthRequest, res: Response<ApiResponse<WishlistResponse>>): Promise<void> {
    try {
      const user = req.user!;

      const wishlist = await findOrCreateWishlist(user._id);
      const populatedWishlist = await getPopulatedWishlist(wishlist._id);

      res.json({
        success: true,
        message: 'Wishlist retrieved successfully',
        data: mapWishlistItems(populatedWishlist),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving wishlist',
        error: (error as Error).message,
      });
    }
  },

  async addToWishlist(req: IAuthRequest, res: Response<ApiResponse<WishlistResponse>>): Promise<void> {
    try {
      const user = req.user!;
      const { productId } = req.body as { productId: string };

      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      const wishlist = await findOrCreateWishlist(user._id);

      const alreadyExists = wishlist.items.some((item) => item.product.toString() === productId);
      if (alreadyExists) {
        res.status(400).json({
          success: false,
          message: 'Product already in wishlist',
        });
        return;
      }

      wishlist.items.push({ product: product._id } as any);
      await wishlist.save();

      const populatedWishlist = await getPopulatedWishlist(wishlist._id);

      res.status(201).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: mapWishlistItems(populatedWishlist),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding product to wishlist',
        error: (error as Error).message,
      });
    }
  },

  async removeFromWishlist(req: IAuthRequest, res: Response<ApiResponse<WishlistResponse>>): Promise<void> {
    try {
      const user = req.user!;
      const { itemId } = req.params as { itemId: string };

      const wishlist = await Wishlist.findOne({ user: user._id });

      if (!wishlist) {
        res.status(404).json({
          success: false,
          message: 'Wishlist not found',
        });
        return;
      }

      const initialLength = wishlist.items.length;
      wishlist.items = wishlist.items.filter((item) => item._id.toString() !== itemId);

      if (wishlist.items.length === initialLength) {
        res.status(404).json({
          success: false,
          message: 'Wishlist item not found',
        });
        return;
      }

      await wishlist.save();

      const populatedWishlist = await getPopulatedWishlist(wishlist._id);

      res.json({
        success: true,
        message: 'Product removed from wishlist successfully',
        data: mapWishlistItems(populatedWishlist),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error removing product from wishlist',
        error: (error as Error).message,
      });
    }
  },

  async clearWishlist(req: IAuthRequest, res: Response<ApiResponse<WishlistResponse>>): Promise<void> {
    try {
      const user = req.user!;

      const wishlist = await findOrCreateWishlist(user._id);
      wishlist.items = [];
      await wishlist.save();

      res.json({
        success: true,
        message: 'Wishlist cleared successfully',
        data: { items: [] },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error clearing wishlist',
        error: (error as Error).message,
      });
    }
  },
};
