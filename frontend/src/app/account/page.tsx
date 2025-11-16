'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Tabs } from '@/components/ui/tabs';
import { AuthGuard } from '@/middleware/auth-guard';
import { useAuth, useToast } from '@/hooks';
import { usersApi } from '@/api/users';
import { ordersApi } from '@/api/orders';
import { Address, Order } from '@/types';
import useSWR from 'swr';
import { Pencil, Trash2, MapPin, User as UserIcon, Package, Home } from 'lucide-react';

function AccountContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });

  // Fetch addresses
  const { data: addressesData, mutate: mutateAddresses } = useSWR(
    user?.id ? ['addresses', user.id] : null,
    () => usersApi.getAddresses(user!.id)
  );
  const addresses = addressesData?.data || [];

  // Fetch orders
  const { data: ordersData } = useSWR(
    user?.id ? ['orders', user.id] : null,
    () => ordersApi.getOrders({ limit: 20 })
  );
  const orders = ordersData?.data?.data || [];

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      label: '',
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    });
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label || '',
      fullName: address.fullName,
      phone: address.phone || '',
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      if (!user?.id) return;

      if (editingAddress) {
        await usersApi.updateAddress(user.id, editingAddress.id, addressForm);
        showSuccess('Address updated successfully');
      } else {
        await usersApi.createAddress(user.id, addressForm);
        showSuccess('Address added successfully');
      }

      mutateAddresses();
      setIsAddressModalOpen(false);
    } catch (error) {
      showError('Failed to save address');
      console.error(error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user?.id) return;
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await usersApi.deleteAddress(user.id, addressId);
      showSuccess('Address deleted successfully');
      mutateAddresses();
    } catch (error) {
      showError('Failed to delete address');
      console.error(error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
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

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <div className="max-w-2xl">
          <Card variant="elevated" className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-charcoal-900" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-charcoal-900 dark:text-cream-100">
                  {user?.name || `${user?.firstName} ${user?.lastName}`}
                </h2>
                <p className="font-sans text-taupe-600 dark:text-taupe-400">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block font-sans text-sm text-taupe-600 dark:text-taupe-400 mb-2">
                  Name
                </label>
                <p className="font-sans font-semibold text-charcoal-900 dark:text-cream-100">
                  {user?.name || `${user?.firstName} ${user?.lastName}`}
                </p>
              </div>

              <div>
                <label className="block font-sans text-sm text-taupe-600 dark:text-taupe-400 mb-2">
                  Email
                </label>
                <p className="font-sans font-semibold text-charcoal-900 dark:text-cream-100">
                  {user?.email}
                </p>
              </div>

              <div>
                <label className="block font-sans text-sm text-taupe-600 dark:text-taupe-400 mb-2">
                  Role
                </label>
                <Badge variant="luxury" className="capitalize">
                  {user?.role}
                </Badge>
              </div>

              {user?.phoneNumber && (
                <div>
                  <label className="block font-sans text-sm text-taupe-600 dark:text-taupe-400 mb-2">
                    Phone
                  </label>
                  <p className="font-sans font-semibold text-charcoal-900 dark:text-cream-100">
                    {user.phoneNumber}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-taupe-200 dark:border-taupe-700">
                <Button onClick={handleLogout} variant="danger" size="md" className="w-full">
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      content: (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card variant="elevated" className="p-12 text-center">
              <Package className="w-16 h-16 text-taupe-400 mx-auto mb-4" />
              <p className="font-sans text-taupe-600 dark:text-taupe-400 text-lg">
                No orders yet
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/products')}
                className="mt-6"
              >
                Start Shopping
              </Button>
            </Card>
          ) : (
            orders.map((order: Order) => (
              <Card
                key={order.id}
                variant="elevated"
                className="p-6 border border-taupe-200 dark:border-taupe-700 hover:shadow-luxury-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-lg font-semibold text-charcoal-900 dark:text-cream-100">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="font-sans text-sm text-taupe-600 dark:text-taupe-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="font-sans text-sm text-taupe-700 dark:text-taupe-300">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-sans text-sm text-taupe-600 dark:text-taupe-400 mb-1">
                        Total
                      </p>
                      <p className="font-sans text-2xl font-bold text-gold-600 dark:text-gold-400">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      ),
    },
    {
      id: 'addresses',
      label: 'Addresses',
      content: (
        <div className="space-y-4">
          <div className="flex justify-end mb-6">
            <Button variant="primary" size="md" onClick={handleAddAddress}>
              <MapPin className="w-5 h-5 mr-2" />
              Add New Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <Card variant="elevated" className="p-12 text-center">
              <Home className="w-16 h-16 text-taupe-400 mx-auto mb-4" />
              <p className="font-sans text-taupe-600 dark:text-taupe-400 text-lg">
                No addresses saved
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address: Address) => (
                <Card
                  key={address.id}
                  variant="elevated"
                  className="p-6 border border-taupe-200 dark:border-taupe-700 relative"
                >
                  {address.isDefault && (
                    <Badge variant="luxury" className="absolute top-4 right-4">
                      Default
                    </Badge>
                  )}

                  <div className="space-y-3 mb-6">
                    {address.label && (
                      <h3 className="font-sans font-semibold text-lg text-charcoal-900 dark:text-cream-100">
                        {address.label}
                      </h3>
                    )}
                    <p className="font-sans text-charcoal-900 dark:text-cream-100">
                      {address.fullName}
                    </p>
                    {address.phone && (
                      <p className="font-sans text-taupe-600 dark:text-taupe-400">
                        {address.phone}
                      </p>
                    )}
                    <p className="font-sans text-taupe-700 dark:text-taupe-300">
                      {address.street}
                      <br />
                      {address.city}, {address.state} {address.zipCode}
                      <br />
                      {address.country}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="luxury"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      className="flex-1"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-charcoal-900 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-2">
            My Account
          </h1>
          <p className="font-sans text-taupe-600 dark:text-taupe-400">
            Manage your profile, orders, and addresses
          </p>
        </div>

        <Tabs tabs={tabs} defaultTab="profile" />
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <div className="space-y-4">
          <Input
            label="Label (optional)"
            placeholder="Home, Work, etc."
            value={addressForm.label}
            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
          />
          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            value={addressForm.fullName}
            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
          />
          <Input
            label="Phone (optional)"
            placeholder="+1 234 567 8900"
            value={addressForm.phone}
            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
          />
          <Input
            label="Street Address"
            placeholder="123 Main St"
            required
            value={addressForm.street}
            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="New York"
              required
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
            />
            <Input
              label="State"
              placeholder="NY"
              required
              value={addressForm.state}
              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Zip Code"
              placeholder="10001"
              required
              value={addressForm.zipCode}
              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
            />
            <Input
              label="Country"
              placeholder="USA"
              required
              value={addressForm.country}
              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 font-sans text-sm">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
              className="w-4 h-4 text-gold-600 focus:ring-gold-500 border-taupe-300 rounded"
            />
            Set as default address
          </label>
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsAddressModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSaveAddress} className="flex-1">
              {editingAddress ? 'Update' : 'Add'} Address
            </Button>
          </div>
        </div>
      </Modal>
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
