import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

export default function Home() {
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

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Welcome to E-Store
          </h1>
          <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
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
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
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
    </div>
  );
}
