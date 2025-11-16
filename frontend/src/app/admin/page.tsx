'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { AuthGuard } from '@/middleware/auth-guard';
import { useAuth } from '@/hooks';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, Eye } from 'lucide-react';

function AdminContent() {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Products',
      value: '1,234',
      icon: Package,
      color: 'text-gold-600 dark:text-gold-400',
      bgColor: 'bg-gold-100 dark:bg-gold-900/20',
    },
    {
      label: 'Total Orders',
      value: '856',
      icon: ShoppingCart,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      label: 'Revenue',
      value: '$45,230',
      icon: DollarSign,
      color: 'text-bronze-600 dark:text-bronze-400',
      bgColor: 'bg-bronze-100 dark:bg-bronze-900/20',
    },
    {
      label: 'Active Users',
      value: '342',
      icon: Users,
      color: 'text-gold-600 dark:text-gold-400',
      bgColor: 'bg-gold-100 dark:bg-gold-900/20',
    },
  ];

  const recentActivity = [
    { label: 'Orders Today', value: '24', trend: '+12%' },
    { label: 'Products Sold', value: '156', trend: '+8%' },
    { label: 'New Customers', value: '18', trend: '+23%' },
    { label: 'Page Views', value: '3,429', trend: '+15%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-2">
          Dashboard
        </h1>
        <p className="font-sans text-taupe-600 dark:text-taupe-400">
          Welcome back, {user?.name || user?.firstName}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              variant="elevated"
              className="p-6 hover:shadow-luxury-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-sans text-sm text-taupe-600 dark:text-taupe-400">
                  {stat.label}
                </p>
                <p className="text-3xl font-serif font-bold text-charcoal-900 dark:text-cream-100">
                  {stat.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gold-100 dark:bg-gold-900/20">
              <TrendingUp className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            </div>
            <h2 className="text-xl font-serif font-bold text-charcoal-900 dark:text-cream-100">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.label}
                className="flex items-center justify-between p-4 rounded-lg bg-cream-100 dark:bg-charcoal-800 border border-taupe-200 dark:border-taupe-700"
              >
                <div>
                  <p className="font-sans text-sm text-taupe-600 dark:text-taupe-400">
                    {activity.label}
                  </p>
                  <p className="text-2xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mt-1">
                    {activity.value}
                  </p>
                </div>
                <span className="font-sans text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {activity.trend}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-bronze-100 dark:bg-bronze-900/20">
              <Eye className="w-5 h-5 text-bronze-600 dark:text-bronze-400" />
            </div>
            <h2 className="text-xl font-serif font-bold text-charcoal-900 dark:text-cream-100">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="block p-4 rounded-lg border-2 border-taupe-200 dark:border-taupe-700 hover:border-gold-400 hover:bg-gold-50 dark:hover:bg-charcoal-800 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans font-medium text-charcoal-900 dark:text-cream-100">
                  Manage Products
                </span>
                <Package className="w-5 h-5 text-taupe-600 dark:text-taupe-400" />
              </div>
            </a>
            <a
              href="/admin/orders"
              className="block p-4 rounded-lg border-2 border-taupe-200 dark:border-taupe-700 hover:border-gold-400 hover:bg-gold-50 dark:hover:bg-charcoal-800 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans font-medium text-charcoal-900 dark:text-cream-100">
                  Manage Orders
                </span>
                <ShoppingCart className="w-5 h-5 text-taupe-600 dark:text-taupe-400" />
              </div>
            </a>
            <a
              href="/admin/users"
              className="block p-4 rounded-lg border-2 border-taupe-200 dark:border-taupe-700 hover:border-gold-400 hover:bg-gold-50 dark:hover:bg-charcoal-800 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans font-medium text-charcoal-900 dark:text-cream-100">
                  Manage Users
                </span>
                <Users className="w-5 h-5 text-taupe-600 dark:text-taupe-400" />
              </div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard adminOnly>
      <AdminContent />
    </AuthGuard>
  );
}
