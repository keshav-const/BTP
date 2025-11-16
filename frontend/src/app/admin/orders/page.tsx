'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/middleware/auth-guard';
import { useToast } from '@/hooks';
import { ordersApi } from '@/api/orders';
import { Order, OrderStatus } from '@/types';
import useSWR from 'swr';
import { Eye, Filter } from 'lucide-react';

function OrdersContent() {
  const { success: showSuccess, error: showError } = useToast();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const { data: ordersData, mutate: mutateOrders } = useSWR(
    ['admin-orders', statusFilter],
    () => ordersApi.getAdminOrders({ 
      limit: 100,
      ...(statusFilter !== 'all' && { status: statusFilter })
    })
  );
  const orders = ordersData?.data?.data || [];

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'pending':
        return 'default';
      case 'confirmed':
      case 'shipped':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
      showSuccess('Order status updated successfully');
      mutateOrders();
    } catch (error) {
      showError('Failed to update order status');
      console.error(error);
    }
  };

  const statusOptions: Array<{ value: OrderStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-2">
            Orders
          </h1>
          <p className="font-sans text-taupe-600 dark:text-taupe-400">
            Manage customer orders and fulfillment
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card variant="elevated" className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-taupe-600 dark:text-taupe-400" />
            <span className="font-sans text-sm font-medium text-taupe-700 dark:text-taupe-300">
              Status:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 ${
                  statusFilter === option.value
                    ? 'bg-gold-100 text-gold-700 border-2 border-gold-400 dark:bg-gold-900/20 dark:text-gold-400'
                    : 'bg-cream-100 text-taupe-700 border border-taupe-200 hover:bg-cream-200 dark:bg-charcoal-800 dark:text-taupe-300 dark:border-taupe-700 dark:hover:bg-charcoal-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-200 dark:bg-charcoal-800 border-b border-taupe-200 dark:border-taupe-700">
              <tr>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe-200 dark:divide-taupe-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="font-sans text-taupe-600 dark:text-taupe-400">
                      No orders found
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order: Order, index: number) => (
                  <tr
                    key={order.id}
                    className={
                      index % 2 === 0
                        ? 'bg-white dark:bg-charcoal-900'
                        : 'bg-cream-50 dark:bg-charcoal-800/50'
                    }
                  >
                    <td className="px-6 py-4">
                      <span className="font-sans font-semibold text-charcoal-900 dark:text-cream-100">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans text-sm text-taupe-700 dark:text-taupe-300">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans text-sm text-taupe-700 dark:text-taupe-300">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans font-semibold text-gold-600 dark:text-gold-400">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className="px-3 py-1.5 rounded-lg border border-taupe-200 dark:border-taupe-700 bg-white dark:bg-charcoal-800 font-sans text-sm text-charcoal-900 dark:text-cream-100 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                        <Button
                          variant="luxury"
                          size="sm"
                          onClick={() => window.open(`/orders/${order.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AuthGuard adminOnly>
      <OrdersContent />
    </AuthGuard>
  );
}
