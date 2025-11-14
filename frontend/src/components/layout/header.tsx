'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X, Heart, ShoppingCart, LogOut, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useCart, useWishlist } from '@/hooks';
import { useUiStore } from '@/store';

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isMobileMenuOpen, setMobileMenuOpen } = useUiStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-secondary-900 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 font-bold text-xl text-primary-600">
            E-Store
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-secondary-700 hover:text-primary-600 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-secondary-700 hover:text-primary-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-secondary-700 hover:text-primary-600 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Icons and Auth */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-error rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/account" className="p-2 text-secondary-700 hover:text-primary-600 transition-colors">
                    <User className="w-5 h-5" />
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" size="sm">
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-1" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/products"
              className="block px-4 py-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block px-4 py-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-secondary-700 hover:text-primary-600 transition-colors"
            >
              About
            </Link>
            <div className="px-4 py-2 space-y-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link href="/account" className="block py-2 text-secondary-700">
                    My Account
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
