'use client';

import React, { useState } from 'react';
import { ProductCard, Pagination, FilterControls, Skeleton } from '@/components';
import { useFetch, useCart, useToast } from '@/hooks';
import { Product, PaginatedResponse } from '@/types';

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>({});
  const { data, isLoading, error } = useFetch<PaginatedResponse<Product>>(
    `/products?page=${currentPage}&limit=12`
  );
  const { addItem } = useCart();
  const { success: showSuccess } = useToast();

  const filters = [
    {
      name: 'Category',
      options: [
        { value: 'electronics', label: 'Electronics', count: 245 },
        { value: 'fashion', label: 'Fashion', count: 432 },
        { value: 'home', label: 'Home & Garden', count: 318 },
        { value: 'sports', label: 'Sports', count: 156 },
      ],
    },
    {
      name: 'Price Range',
      options: [
        { value: '0-50', label: 'Under $50', count: 234 },
        { value: '50-100', label: '$50 - $100', count: 456 },
        { value: '100-200', label: '$100 - $200', count: 345 },
        { value: '200+', label: 'Over $200', count: 123 },
      ],
    },
    {
      name: 'Rating',
      options: [
        { value: '5', label: '★★★★★ (5 stars)', count: 234 },
        { value: '4', label: '★★★★☆ (4+ stars)', count: 567 },
        { value: '3', label: '★★★☆☆ (3+ stars)', count: 456 },
      ],
    },
  ];

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  const handleFilterChange = (filterName: string, value: string | string[]) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <FilterControls
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {error && (
            <div className="text-center py-12">
              <p className="text-error text-lg">Failed to load products. Please try again.</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary-600 text-lg">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.data.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {data.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
