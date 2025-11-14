'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard, Pagination, FilterControls, Skeleton } from '@/components';
import { useFetch, useCart, useToast } from '@/hooks';
import { Product, PaginatedResponse } from '@/types';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const PRICE_RANGES = [
  { value: '0-50', label: 'Under $50', min: 0, max: 50 },
  { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
  { value: '100-200', label: '$100 - $200', min: 100, max: 200 },
  { value: '200-500', label: '$200 - $500', min: 200, max: 500 },
  { value: '500', label: 'Over $500', min: 500, max: Infinity },
];

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home', label: 'Home & Garden' },
  { value: 'sports', label: 'Sports' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<string>('popularity');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | string[]>>({});

  const { addItem } = useCart();
  const { success: showSuccess } = useToast();

  useEffect(() => {
    const newFilters: Record<string, string | string[]> = {};
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    if (category) newFilters['Category'] = category;
    if (search) newFilters['Search'] = search;
    if (minPrice || maxPrice) {
      newFilters['Price Range'] = `${minPrice || '0'}-${maxPrice || 'Infinity'}`;
    }

    setSelectedFilters(newFilters);
    setCurrentPage(1);
  }, [searchParams]);

  const buildApiUrl = () => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', '12');

    const category = searchParams.get('category');
    if (category) params.append('category', category);

    const minPrice = searchParams.get('minPrice');
    if (minPrice) params.append('minPrice', minPrice);

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) params.append('maxPrice', maxPrice);

    const search = searchParams.get('search');
    if (search) params.append('search', search);

    if (sort.startsWith('price')) {
      params.append('sort', 'price');
      params.append('order', sort === 'price_asc' ? 'asc' : 'desc');
    } else if (sort !== 'popularity') {
      params.append('sort', sort);
    }

    return `/products?${params.toString()}`;
  };

  const { data, isLoading, error } = useFetch<PaginatedResponse<Product>>(
    buildApiUrl()
  );

  const filters = [
    {
      name: 'Category',
      options: CATEGORIES,
      multiple: false,
    },
    {
      name: 'Price Range',
      options: PRICE_RANGES.map(({ value, label }) => ({ value, label })),
      multiple: false,
    },
  ];

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  const handleFilterChange = (filterName: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filterName === 'Category') {
      if (value) {
        params.set('category', value as string);
      } else {
        params.delete('category');
      }
    } else if (filterName === 'Price Range') {
      if (value && value !== '') {
        const [min, max] = (value as string).split('-');
        params.set('minPrice', min);
        if (max !== 'Infinity') params.set('maxPrice', max);
        else params.delete('maxPrice');
      } else {
        params.delete('minPrice');
        params.delete('maxPrice');
      }
    }

    window.history.replaceState(null, '', `?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setShowSortDropdown(false);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchParams.get('category') ||
    searchParams.get('minPrice') ||
    searchParams.get('maxPrice') ||
    searchParams.get('search');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-4xl font-bold">Products</h1>
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary-500 transition-colors"
            aria-label="Sort products"
            aria-expanded={showSortDropdown}
          >
            {SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort By'}
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform',
              showSortDropdown && 'rotate-180'
            )} />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full mt-1 right-0 bg-white dark:bg-secondary-900 border border-border rounded-lg shadow-lg z-10 min-w-40">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={cn(
                    'w-full text-left px-4 py-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors',
                    sort === option.value && 'bg-primary-50 dark:bg-primary-900 text-primary-600'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <FilterControls
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
          {hasActiveFilters && (
            <button
              onClick={() => {
                window.history.replaceState(null, '', '/products');
                setSelectedFilters({});
              }}
              className="mt-4 text-primary-600 hover:text-primary-700 underline text-sm"
            >
              Clear all filters
            </button>
          )}
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
              <p className="text-secondary-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-secondary-600">
                Showing {data.data.length} of {data.total} products
              </div>
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
