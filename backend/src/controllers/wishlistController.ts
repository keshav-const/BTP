import { Response } from 'express';
import { Wishlist, Product } from '@/models';
import { IAuthRequest, ApiResponse } from '@/types';

export const wishlistController = {
  async getWishlist(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user!;

      let wishlist = await Wishlist.findOne({ user: user._id })
        .populate('products', 'name price images category brand');

      if (!wishlist) {
        // Create empty wishlist if it doesn't exist
        wishlist = await Wishlist.create({ user: user._id, products: [] });
        wishlist = await Wishlist.findById(wishlist._id)
          .populate('products', 'name price images category brand');
      }

      res.json({
        success: true,
        message: 'Wishlist retrieved successfully',
        data: wishlist,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving wishlist',
        error: (error as Error).message,
      });
    }
  },

  async addToWishlist(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user!;
      const { productId } = req.body;

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      // Find or create wishlist
      let wishlist = await Wishlist.findOne({ user: user._id });
      
      if (!wishlist) {
        wishlist = await Wishlist.create({ user: user._id, products: [productId] });
      } else {
        // Check if product already in wishlist
        if (wishlist.products.includes(productId as any)) {
          res.status(400).json({
            success: false,
            message: 'Product already in wishlist',
          });
          return;
        }
        
        wishlist.products.push(productId);
        await wishlist.save();
      }

      // Populate and return
      const populatedWishlist = await Wishlist.findById(wishlist._id)
        .populate('products', 'name price images category brand');

      res.json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: populatedWishlist,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding product to wishlist',
        error: (error as Error).message,
      });
    }
  },

  async removeFromWishlist(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user!;
      const { productId } = req.params;

      const wishlist = await Wishlist.findOne({ user: user._id });
      
      if (!wishlist) {
        res.status(404).json({
          success: false,
          message: 'Wishlist not found',
        });
        return;
      }

      // Remove product from wishlist
      wishlist.products = wishlist.products.filter(
        (product: any) => product.toString() !== productId
      );
      
      await wishlist.save();

      // Populate and return
      const populatedWishlist = await Wishlist.findById(wishlist._id)
        .populate('products', 'name price images category brand');

      res.json({
        success: true,
        message: 'Product removed from wishlist successfully',
        data: populatedWishlist,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error removing product from wishlist',
        error: (error as Error).message,
      });
    }
  },

  async clearWishlist(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user!;

      const wishlist = await Wishlist.findOne({ user: user._id });
      
      if (!wishlist) {
        res.status(404).json({
          success: false,
          message: 'Wishlist not found',
        });
        return;
      }

      wishlist.products = [];
      await wishlist.save();

      res.json({
        success: true,
        message: 'Wishlist cleared successfully',
        data: wishlist,
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