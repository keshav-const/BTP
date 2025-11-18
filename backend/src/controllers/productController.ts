import { Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '@/models';
import { IAuthRequest, ApiResponse, PaginationResult } from '@/types';
import { uploadImage, getRecommendations } from '@/utils';
import { cleanupFiles } from '@/middlewares';

const parseStringArray = (value: any): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch (error) {
      // Ignore JSON parse errors and fallback to comma-separated parsing
    }

    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const productController = {
  async getProducts(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const {
        page = '1',
        limit = '10',
        sort = 'createdAt',
        order = 'desc',
        category,
        brand,
        minPrice,
        maxPrice,
        search,
        isActive,
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      // Build filter query
      const filters: any = {};
      
      if (category) filters.category = category;
      if (brand) filters.brand = brand;
      if (typeof isActive === 'boolean') filters.isActive = isActive;
      
      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = parseFloat(minPrice as string);
        if (maxPrice) filters.price.$lte = parseFloat(maxPrice as string);
      }

      if (search) {
        filters.$text = { $search: search as string };
      }

      // Build sort query
      const sortQuery: any = {};
      sortQuery[sort as string] = order === 'asc' ? 1 : -1;

      // Execute query with pagination
      const products = await Product.find(filters)
        .sort(sortQuery)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('category', 'name')
        .populate('brand', 'name');

      const total = await Product.countDocuments(filters);

      const paginationResult: PaginationResult<typeof products[0]> = {
        data: products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      };

      res.json({
        success: true,
        message: 'Products retrieved successfully',
        data: paginationResult,
      });
    } catch (error) {
      console.error('Error in getProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving products',
        error: (error as Error).message,
      });
    }
  },

  async getProductById(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
        });
        return;
      }

      const product = await Product.findById(id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error) {
      console.error('Error in getProductById:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving product',
        error: (error as Error).message,
      });
    }
  },

  async createProduct(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    const files = req.files as Express.Multer.File[] | undefined;

    try {
      const productData: any = { ...req.body };

      if (productData.price !== undefined) {
        productData.price = parseFloat(productData.price);
      }

      if (productData.stock !== undefined) {
        productData.stock = parseInt(productData.stock, 10);
      }

      if (productData.isActive !== undefined) {
        productData.isActive = productData.isActive === 'true' || productData.isActive === true;
      }

      productData.tags = parseStringArray(productData.tags);
      const existingImages = parseStringArray(productData.images);

      let uploadedImages: string[] = [];

      if (files && files.length > 0) {
        const uploadResults = await Promise.all(files.map((file) => uploadImage(file.path)));
        uploadedImages = uploadResults.map((result) => result.secureUrl);
      }

      productData.images = [...existingImages, ...uploadedImages];

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      console.error('Error in createProduct:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: (error as Error).message,
      });
    } finally {
      if (files) {
        cleanupFiles(files);
      }
    }
  },

  async updateProduct(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    const files = req.files as Express.Multer.File[] | undefined;

    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
        });
        return;
      }

      const updateData: any = { ...req.body };

      if (updateData.price !== undefined) {
        updateData.price = parseFloat(updateData.price);
      }

      if (updateData.stock !== undefined) {
        updateData.stock = parseInt(updateData.stock, 10);
      }

      if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
      }

      updateData.tags = parseStringArray(updateData.tags);
      const existingImages = parseStringArray(updateData.images);

      if (files && files.length > 0) {
        const uploadResults = await Promise.all(files.map((file) => uploadImage(file.path)));
        const uploadedImages = uploadResults.map((result) => result.secureUrl);
        updateData.images = [...existingImages, ...uploadedImages];
      } else if (existingImages.length) {
        updateData.images = existingImages;
      }

      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      console.error('Error in updateProduct:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: (error as Error).message,
      });
    } finally {
      if (files) {
        cleanupFiles(files);
      }
    }
  },

  async deleteProduct(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
        });
        return;
      }

      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Product deleted successfully',
        data: product,
      });
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: (error as Error).message,
      });
    }
  },

  async getRecommendations(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID format',
        });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const priceTolerance = parseFloat(req.query.priceTolerance as string) || 0.3;

      const product = await Product.findById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
        });
        return;
      }

      const recommendations = await getRecommendations(id, { limit, priceTolerance });

      res.json({
        success: true,
        message: 'Recommendations retrieved successfully',
        data: recommendations,
      });
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting recommendations',
        error: (error as Error).message,
      });
    }
  },

  async uploadProductImages(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
        return;
      }

      const uploadPromises = files.map((file) => uploadImage(file.path));
      const results = await Promise.all(uploadPromises);

      cleanupFiles(files);

      const imageUrls = results.map((result) => result.secureUrl);

      res.json({
        success: true,
        message: 'Images uploaded successfully',
        data: {
          images: imageUrls,
          count: imageUrls.length,
        },
      });
    } catch (error) {
      const files = req.files as Express.Multer.File[];
      if (files) {
        cleanupFiles(files);
      }

      console.error('Error in uploadProductImages:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading images',
        error: (error as Error).message,
      });
    }
  },
};

export const updateProductStock = async (productId: string, quantity: number) => {
  try {
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating product stock: ${(error as Error).message}`);
  }
};