import { Response } from 'express';
import { Types } from 'mongoose';
import { Order, Product, Cart } from '@/models';
import { IAuthRequest, ApiResponse } from '@/types';

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

const generateMockRazorpayId = (prefix: string): string => {
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${random}`;
};

export const checkoutController = {
  async createCheckout(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user!;
      const {
        items,
        shippingAddress,
        billingAddress,
        paymentMethod,
        cardDetails,
      } = req.body;

      // Validate items and check stock
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`,
          });
          return;
        }

        if (!product.isActive) {
          res.status(400).json({
            success: false,
            message: `Product ${product.name} is not available`,
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
        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Calculate tax (10% for demo)
      const tax = subtotal * 0.10;

      // Calculate shipping charges (free for orders above 1000, else 50)
      const shippingCharges = subtotal > 1000 ? 0 : 50;

      // Calculate total
      const totalAmount = subtotal + tax + shippingCharges;

      // Generate order number
      const orderNumber = generateOrderNumber();

      // Create order with pending payment status
      const order = await Order.create({
        user: user._id,
        orderNumber,
        orderDate: new Date(),
        items: orderItems,
        subtotal,
        tax,
        shippingCharges,
        totalAmount,
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentStatus: 'pending',
      });

      // Update product stock
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
      }

      // Clear cart after successful order creation
      await Cart.findOneAndUpdate(
        { user: user._id },
        { $set: { items: [] } },
        { new: true }
      );

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

  async processPayment(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const user = req.user!;
      const { orderId, cardDetails } = req.body;

      if (!Types.ObjectId.isValid(orderId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid order ID',
        });
        return;
      }

      const order = await Order.findById(orderId);
      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Order not found',
        });
        return;
      }

      // Check if user owns this order
      if (order.user.toString() !== user._id.toString()) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }

      // Check if order is already paid
      if (order.paymentStatus === 'completed' || order.isPaid) {
        res.status(400).json({
          success: false,
          message: 'Order is already paid',
        });
        return;
      }

      // Mock payment validation (basic card number check)
      if (!cardDetails?.cardNumber || cardDetails.cardNumber.length < 13) {
        res.status(400).json({
          success: false,
          message: 'Invalid card details',
        });
        return;
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock Razorpay IDs
      const razorpayOrderId = generateMockRazorpayId('order');
      const razorpayPaymentId = generateMockRazorpayId('pay');

      // Update order with payment details
      order.paymentStatus = 'completed';
      order.razorpayOrderId = razorpayOrderId;
      order.razorpayPaymentId = razorpayPaymentId;
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'confirmed';

      await order.save();

      // Populate the order before returning
      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images price');

      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: {
          order: populatedOrder,
          razorpayOrderId,
          razorpayPaymentId,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error processing payment',
        error: (error as Error).message,
      });
    }
  },

  async getOrderConfirmation(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { orderId } = req.params;
      const user = req.user!;

      if (!Types.ObjectId.isValid(orderId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid order ID',
        });
        return;
      }

      const order = await Order.findById(orderId)
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
        message: 'Order confirmation retrieved successfully',
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving order confirmation',
        error: (error as Error).message,
      });
    }
  },
};
