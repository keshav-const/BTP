'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ProductCard, Skeleton } from '@/components';
import { ArrowRight, Zap, Shield, Truck, Sparkles, Search } from 'lucide-react';
import { useFetch, useCart, useToast } from '@/hooks';
import { productsApi } from '@/api/products';
import { aiApi } from '@/api/ai';
import { Product, PaginatedResponse } from '@/types';

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', icon: '📱' },
  { name: 'Fashion', slug: 'fashion', icon: '👗' },
  { name: 'Home & Garden', slug: 'home', icon: '🏠' },
  { name: 'Sports', slug: 'sports', icon: '⚽' },
];

export default function Home() {
  const router = useRouter();
  const { addItem } = useCart();
  const { success: showSuccess, error: showError } = useToast();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: featuredData, isLoading: isFeaturedLoading } = useFetch<
    PaginatedResponse<Product>
  >('/products?limit=6');

  const features = [
    {
      icon: Zap,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: Shield,
      title: 'Secure Checkout',
      description: 'SSL-encrypted transactions for your safety',
    },
    {
      icon: Truck,
      title: 'Easy Returns',
      description: '30-day money-back guarantee',
    },
  ];

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    showSuccess(`${product.name} added to cart!`);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/products?category=${slug}`);
  };

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) {
      showError('Please enter a search query');
      return;
    }

    setAiLoading(true);
    try {
      const response = await aiApi.search(aiQuery);
      if (response.success && response.data) {
        const filters = response.data.filters;
        const queryParams = new URLSearchParams();

        if (filters.category) queryParams.append('category', filters.category);
        if (filters.brand) queryParams.append('brand', filters.brand);
        if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
        queryParams.append('search', aiQuery);

        setIsAiModalOpen(false);
        setAiQuery('');
        router.push(`/products?${queryParams.toString()}`);
      }
    } catch (err) {
      showError('Failed to process AI search. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAiSearch();
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-lg">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Welcome to E-Store
          </h1>
          <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop from thousands of
            quality items with fast shipping and easy returns.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="primary" size="lg">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              onClick={() => setIsAiModalOpen(true)}
              variant="outline"
              size="lg"
              className="flex items-center justify-center"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Ask AI
            </Button>
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className="group p-4 bg-secondary-50 dark:bg-secondary-800 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg transition-colors text-center"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-foreground group-hover:text-primary-600">
                {category.name}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-foreground mb-12">Featured Products</h2>
        {isFeaturedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : featuredData?.data && featuredData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredData.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Why Shop With Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} variant="elevated" className="text-center">
                <Icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary-600 rounded-lg text-white">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Shopping?</h2>
          <p className="text-lg opacity-90">
            Browse our extensive collection of products and find what you need.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg" className="bg-white text-primary-600 hover:bg-secondary-100">
              Browse All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600">10K+</div>
            <p className="text-secondary-600 mt-2">Products</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600">50K+</div>
            <p className="text-secondary-600 mt-2">Happy Customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600">24/7</div>
            <p className="text-secondary-600 mt-2">Customer Support</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600">100%</div>
            <p className="text-secondary-600 mt-2">Satisfaction</p>
          </div>
        </div>
      </section>

      {/* AI Search Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="Ask AI - Intelligent Product Search"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-secondary-600">
            Describe what you're looking for and our AI will help you find the perfect product.
          </p>
          <div className="flex gap-2">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="e.g., 'I need a blue wireless headphone under $100'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={aiLoading}
              aria-label="AI search query"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => setIsAiModalOpen(false)}
              variant="outline"
              disabled={aiLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAiSearch}
              variant="primary"
              disabled={aiLoading}
            >
              {aiLoading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
