'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { AuthGuard } from '@/middleware/auth-guard';
import { useToast } from '@/hooks';
import { productsApi } from '@/api/products';
import { Product } from '@/types';
import useSWR from 'swr';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import Image from 'next/image';

function ProductsContent() {
  const { success: showSuccess, error: showError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: productsData, mutate: mutateProducts } = useSWR(
    'admin-products',
    () => productsApi.getAll({ limit: 100 })
  );
  const products = productsData?.data?.data || [];

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsApi.delete(id);
      showSuccess('Product deleted successfully');
      mutateProducts();
    } catch (error) {
      showError('Failed to delete product');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-2">
            Products
          </h1>
          <p className="font-sans text-taupe-600 dark:text-taupe-400">
            Manage your product inventory
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <Card variant="elevated" className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-taupe-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 font-sans rounded-lg bg-cream-100 dark:bg-charcoal-800 border border-taupe-200 dark:border-taupe-700 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 outline-none transition-all"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-200 dark:bg-charcoal-800 border-b border-taupe-200 dark:border-taupe-700">
              <tr>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left font-sans text-xs font-semibold text-taupe-700 dark:text-taupe-300 uppercase tracking-wider">
                  Stock
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
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="font-sans text-taupe-600 dark:text-taupe-400">
                      No products found
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: Product, index: number) => (
                  <tr
                    key={product.id}
                    className={
                      index % 2 === 0
                        ? 'bg-white dark:bg-charcoal-900'
                        : 'bg-cream-50 dark:bg-charcoal-800/50'
                    }
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-200 dark:bg-charcoal-700 flex-shrink-0">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-sans font-semibold text-charcoal-900 dark:text-cream-100">
                            {product.name}
                          </p>
                          {product.brand && (
                            <p className="font-sans text-sm text-taupe-600 dark:text-taupe-400">
                              {product.brand}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans text-sm text-taupe-700 dark:text-taupe-300 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans font-semibold text-charcoal-900 dark:text-cream-100">
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans text-sm text-taupe-700 dark:text-taupe-300">
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.inStock ? 'success' : 'error'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/products/${product.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="luxury"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Product Modal (Placeholder for now) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <div className="space-y-4">
          <p className="font-sans text-taupe-600 dark:text-taupe-400">
            Product form coming soon...
          </p>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setIsModalOpen(false)}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AuthGuard adminOnly>
      <ProductsContent />
    </AuthGuard>
  );
}
