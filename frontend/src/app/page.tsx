'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ProductCard, Skeleton } from '@/components';
import { ArrowRight, Shield, Truck, Sparkles, Search, Star, Award } from 'lucide-react';
import { useFetch, useCart, useToast } from '@/hooks';
import { aiApi } from '@/api/ai';
import { Product, PaginatedResponse } from '@/types';

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', icon: '📱', gradient: 'from-blue-500/10 to-indigo-500/10' },
  { name: 'Fashion', slug: 'fashion', icon: '👗', gradient: 'from-pink-500/10 to-rose-500/10' },
  { name: 'Home & Garden', slug: 'home', icon: '🏠', gradient: 'from-green-500/10 to-emerald-500/10' },
  { name: 'Sports', slug: 'sports', icon: '⚽', gradient: 'from-orange-500/10 to-yellow-500/10' },
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
      icon: Truck,
      title: 'Complimentary Delivery',
      description: 'Free express shipping on all orders over $50',
      color: 'emerald',
    },
    {
      icon: Shield,
      title: 'Secured Transactions',
      description: 'Premium SSL-encrypted checkout for peace of mind',
      color: 'gold',
    },
    {
      icon: Award,
      title: 'Satisfaction Guaranteed',
      description: '30-day return policy on all premium items',
      color: 'bronze',
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
    <div className="space-y-20 animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 to-charcoal-800 opacity-95" />
        <div className="absolute inset-0 bg-gradient-radial-gold" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-bronze-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-[48px] md:text-6xl font-serif font-bold text-cream-100 leading-tight">
            Elevated Living,
            <span className="block mt-2 bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
              Curated With Care
            </span>
          </h1>
          <p className="text-lg md:text-xl font-sans text-taupe-200 max-w-2xl mx-auto leading-relaxed">
            Discover a handpicked collection of premium products designed for those who appreciate the finer things in life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/products">
              <Button variant="luxury" size="lg" className="min-w-[200px] bg-gradient-gold hover:shadow-luxury-gold transition-all duration-200">
                Explore Collection
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              onClick={() => setIsAiModalOpen(true)}
              variant="outline"
              size="lg"
              className="min-w-[200px] bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              AI Discovery
            </Button>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-4">
            Explore Our Collections
          </h2>
          <p className="text-lg text-taupe-600 dark:text-taupe-400 max-w-2xl mx-auto">
            Thoughtfully curated categories for every aspect of modern living
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <Card
              key={category.slug}
              variant="elevated"
              className={`group cursor-pointer p-8 transition-all duration-200 hover:scale-[1.01] hover:shadow-luxury-lg bg-gradient-to-br ${category.gradient} border border-taupe-200 dark:border-charcoal-700 hover:border-gold-400`}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <h3 className="font-serif font-semibold text-lg text-charcoal-900 dark:text-cream-100 group-hover:text-gold-600 transition-colors duration-200">
                {category.name}
              </h3>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 dark:bg-gold-900/20 rounded-full mb-6">
            <Star className="w-4 h-4 text-gold-600" />
            <span className="text-sm font-medium text-gold-800 dark:text-gold-400">Handpicked Selection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-taupe-600 dark:text-taupe-400 max-w-2xl mx-auto">
            Discover our most sought-after items, carefully selected for exceptional quality
          </p>
        </div>
        {isFeaturedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : featuredData?.data && featuredData.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredData.data.slice(0, 4).map((product) => (
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
      <section className="py-16 bg-gradient-subtle dark:bg-charcoal-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-4">
              The Elevated Experience
            </h2>
            <p className="text-lg text-taupe-600 dark:text-taupe-400 max-w-2xl mx-auto">
              We believe in providing more than just products—we deliver an experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} variant="elevated" className="text-center group hover:scale-[1.01] transition-all duration-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-gold mb-6 shadow-luxury-gold">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-charcoal-900 dark:text-cream-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-taupe-600 dark:text-taupe-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ask AI Section */}
      <section className="relative py-20 rounded-3xl overflow-hidden bg-gradient-to-br from-gold-500 to-bronze-500 shadow-luxury-xl">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-30" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-charcoal-900/20 rounded-full blur-3xl" />
        
        <div className="relative text-center space-y-8 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
            Discover with AI Intelligence
          </h2>
          <p className="text-xl text-cream-100 leading-relaxed">
            Let our intelligent assistant help you find exactly what you're looking for. Simply describe your needs in natural language.
          </p>
          <Button
            onClick={() => setIsAiModalOpen(true)}
            variant="luxury"
            size="lg"
            className="min-w-[240px] bg-white text-gold-700 hover:bg-cream-100 hover:shadow-luxury-xl transition-all duration-200"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            Try AI Search
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 rounded-3xl overflow-hidden bg-gradient-luxury shadow-luxury-xl">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bronze-400/20 rounded-full blur-3xl" />
        
        <div className="relative text-center space-y-8 max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
            Ready to Elevate Your Lifestyle?
          </h2>
          <p className="text-xl text-cream-100 leading-relaxed">
            Browse our extensive collection and discover products that resonate with your refined taste.
          </p>
          <Link href="/products">
            <Button variant="luxury" size="lg" className="min-w-[240px] shadow-luxury-gold">
              Browse All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-3 p-6 rounded-2xl hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-all duration-200">
            <div className="text-5xl font-serif font-bold bg-gradient-gold bg-clip-text text-transparent">
              10K+
            </div>
            <p className="text-sm font-medium text-taupe-600 dark:text-taupe-400 uppercase tracking-wider">
              Premium Products
            </p>
          </div>
          <div className="text-center space-y-3 p-6 rounded-2xl hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-all duration-200">
            <div className="text-5xl font-serif font-bold bg-gradient-gold bg-clip-text text-transparent">
              50K+
            </div>
            <p className="text-sm font-medium text-taupe-600 dark:text-taupe-400 uppercase tracking-wider">
              Satisfied Clients
            </p>
          </div>
          <div className="text-center space-y-3 p-6 rounded-2xl hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-all duration-200">
            <div className="text-5xl font-serif font-bold bg-gradient-gold bg-clip-text text-transparent">
              24/7
            </div>
            <p className="text-sm font-medium text-taupe-600 dark:text-taupe-400 uppercase tracking-wider">
              Concierge Support
            </p>
          </div>
          <div className="text-center space-y-3 p-6 rounded-2xl hover:bg-cream-100 dark:hover:bg-charcoal-800 transition-all duration-200">
            <div className="text-5xl font-serif font-bold bg-gradient-gold bg-clip-text text-transparent">
              100%
            </div>
            <p className="text-sm font-medium text-taupe-600 dark:text-taupe-400 uppercase tracking-wider">
              Quality Assured
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <Card variant="elevated" className="max-w-3xl mx-auto p-12 text-center border border-taupe-200 dark:border-charcoal-700">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal-900 dark:text-cream-100 mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-taupe-600 dark:text-taupe-400 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive offers, new arrivals, and insider access to premium collections.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const emailInput = form.elements.namedItem('email') as HTMLInputElement;
              showSuccess('Thank you for subscribing!');
              emailInput.value = '';
            }}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <Input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="flex-1 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200"
              aria-label="Email address"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="whitespace-nowrap transition-all duration-200"
            >
              Subscribe
            </Button>
          </form>
        </Card>
      </section>

      {/* AI Search Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="AI-Powered Discovery"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-taupe-600 dark:text-taupe-400 leading-relaxed">
            Describe what you're looking for, and our intelligent assistant will help you find the perfect product tailored to your preferences.
          </p>
          <div className="space-y-4">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="e.g., 'I need elegant wireless headphones under $100'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={aiLoading}
              aria-label="AI search query"
              className="text-base"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => setIsAiModalOpen(false)}
              variant="ghost"
              disabled={aiLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAiSearch}
              variant="luxury"
              disabled={aiLoading}
              className="min-w-[140px]"
            >
              {aiLoading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Discover
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
