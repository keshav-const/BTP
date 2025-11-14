import { Response } from 'express';
import { Order, Product } from '@/models';
import { IAuthRequest, ApiResponse, PaginationResult } from '@/types';

export const orderController = {
  async getOrders(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user!;
      const {
        page = '1',
        limit = '10',
        sort = 'createdAt',
        order = 'desc',
        status,
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      // Build filter query
      const filters: any = {};
      
      // Non-admin users can only see their own orders
      if (user.role !== 'admin') {
        filters.user = user._id;
      }
      
      if (status) filters.status = status;

      // Build sort query
      const sortQuery: any = {};
      sortQuery[sort as string] = order === 'asc' ? 1 : -1;

      // Execute query with pagination
      const orders = await Order.find(filters)
        .sort(sortQuery)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images price');

      const total = await Order.countDocuments(filters);

      const paginationResult: PaginationResult<typeof orders[0]> = {
        data: orders,
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
        message: 'Orders retrieved successfully',
        data: paginationResult,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving orders',
        error: (error as Error).message,
      });
    }
  },

  async getOrderById(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const order = await Order.findById(id)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images price');

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      // Check if user has permission to view this order
      if (user.role !== 'admin' && order.user._id.toString() !== user._id.toString()) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving order',
        error: (error as Error).message,
      });
    }
  },

  async createOrder(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user!;
      const { items, shippingAddress, paymentMethod } = req.body;

      // Validate items and check stock
      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          res.status(400).json({
            success: false,
            message: `Product with ID ${item.product} not found`,
          });
          return;
        }

        if (product.stock < item.quantity) {
          res.status(400).json({
            success: false,
            message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          });
          return;
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create order
      const order = await Order.create({
        user: user._id,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentMethod,
      });

      // Update product stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }

      // Populate the order before returning
      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images price');

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: populatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating order',
        error: (error as Error).message,
      });
    }
  },

  async updateOrderStatus(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      )
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images price');

      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating order status',
        error: (error as Error).message,
      });
    }
  },

  async cancelOrder(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const order = await Order.findById(id);
      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      // Check if user can cancel this order
      if (user.role !== 'admin' && order.user.toString() !== user._id.toString()) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      // Check if order can be cancelled
      if (order.status === 'shipped' || order.status === 'delivered') {
        res.status(400).json({
          success: false,
          message: 'Cannot cancel order that has been shipped or delivered',
        });
        return;
      }

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
      }

      // Update order status
      order.status = 'cancelled';
      await order.save();

      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images price');

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: populatedOrder,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error cancelling order',
        error: (error as Error).message,
      });
    }
  },
};