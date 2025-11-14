'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/middleware/auth-guard';
import { useAuth, useToast } from '@/hooks';

function AccountContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { success: showSuccess } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card variant="elevated" className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-secondary-600">Name</p>
              <p className="font-semibold text-foreground">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600">Email</p>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600">Role</p>
              <p className="font-semibold text-foreground capitalize">{user?.role}</p>
            </div>
            <Button onClick={handleLogout} variant="danger" size="md" className="w-full">
              Logout
            </Button>
          </div>
        </Card>

        {/* Account Options */}
        <div className="md:col-span-2 space-y-4">
          <Card variant="outlined" className="p-6">
            <h3 className="text-lg font-semibold mb-2">Orders</h3>
            <p className="text-secondary-600 mb-4">
              View and manage your orders
            </p>
            <Button variant="outline" size="md">
              View Orders
            </Button>
          </Card>

          <Card variant="outlined" className="p-6">
            <h3 className="text-lg font-semibold mb-2">Addresses</h3>
            <p className="text-secondary-600 mb-4">
              Manage your saved addresses
            </p>
            <Button variant="outline" size="md">
              Manage Addresses
            </Button>
          </Card>

          <Card variant="outlined" className="p-6">
            <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
            <p className="text-secondary-600 mb-4">
              Manage your payment methods
            </p>
            <Button variant="outline" size="md">
              Manage Payment Methods
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}
