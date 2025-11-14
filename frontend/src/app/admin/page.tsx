'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { AuthGuard } from '@/middleware/auth-guard';
import { useAuth } from '@/hooks';

function AdminContent() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-secondary-600">Welcome, {user?.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated">
          <div className="text-3xl font-bold text-primary-600">1,234</div>
          <p className="text-secondary-600 mt-2">Total Products</p>
        </Card>

        <Card variant="elevated">
          <div className="text-3xl font-bold text-success">856</div>
          <p className="text-secondary-600 mt-2">Total Orders</p>
        </Card>

        <Card variant="elevated">
          <div className="text-3xl font-bold text-warning">$45,230</div>
          <p className="text-secondary-600 mt-2">Total Revenue</p>
        </Card>

        <Card variant="elevated">
          <div className="text-3xl font-bold text-info">342</div>
          <p className="text-secondary-600 mt-2">Active Users</p>
        </Card>
      </div>

      <Card variant="outlined" className="p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Features</h2>
        <ul className="space-y-2 text-secondary-600">
          <li>• Manage Products</li>
          <li>• Manage Orders</li>
          <li>• Manage Users</li>
          <li>• View Analytics</li>
        </ul>
      </Card>
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
