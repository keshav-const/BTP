import { Response } from 'express';
import { Product } from '@/models';
import { IAuthRequest, ApiResponse, PaginationResult } from '@/types';
import { buildQuery, paginate } from '@/utils/queryBuilder';

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
      res.status(500).json({
        success: false,
        message: 'Error retrieving product',
        error: (error as Error).message,
      });
    }
  },

  async createProduct(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const productData = req.body;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: (error as Error).message,
      });
    }
  },

  async updateProduct(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

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
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: (error as Error).message,
      });
    }
  },

  async deleteProduct(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;

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
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
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