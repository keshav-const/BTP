import { Response } from 'express';
import { Order, Product } from '@/models';
import { ApiResponse, IAuthRequest } from '@/types';

export const adminController = {
  async getDashboardSummary(req: IAuthRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [
        totalProducts,
        lowStockProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalSalesAgg,
        monthlySalesAgg,
        inventoryValueAgg,
        recentOrders,
      ] = await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ stock: { $lt: 10 } }),
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: 'confirmed' }),
        Order.countDocuments({ status: 'shipped' }),
        Order.countDocuments({ status: 'delivered' }),
        Order.countDocuments({ status: 'cancelled' }),
        Order.aggregate([
          {
            $match: {
              status: { $in: ['confirmed', 'shipped', 'delivered'] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$totalAmount' },
            },
          },
        ]),
        Order.aggregate([
          {
            $match: {
              status: 'delivered',
              createdAt: { $gte: thirtyDaysAgo },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$totalAmount' },
            },
          },
        ]),
        Product.aggregate([
          {
            $group: {
              _id: null,
              value: {
                $sum: {
                  $multiply: ['$price', '$stock'],
                },
              },
            },
          },
        ]),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('user', 'firstName lastName email')
          .lean(),
      ]);

      const totalSales = totalSalesAgg[0]?.total ?? 0;
      const revenueLast30Days = monthlySalesAgg[0]?.total ?? 0;
      const inventoryValue = inventoryValueAgg[0]?.value ?? 0;
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      res.json({
        success: true,
        message: 'Admin analytics summary retrieved successfully',
        data: {
          totals: {
            products: totalProducts,
            orders: totalOrders,
            revenue: totalSales,
            revenueLast30Days,
            inventoryValue,
          },
          stock: {
            lowStock: lowStockProducts,
          },
          orders: {
            pending: pendingOrders,
            confirmed: confirmedOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders,
            cancelled: cancelledOrders,
            averageOrderValue,
          },
          recentOrders: recentOrders.map((order) => ({
            id: order._id,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            user: order.user,
          })),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin analytics summary',
        error: (error as Error).message,
      });
    }
  },
};
