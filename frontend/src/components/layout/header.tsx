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
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-lg border-b border-taupe-200 dark:border-charcoal-700 shadow-luxury-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 font-serif font-bold text-2xl bg-gradient-gold bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            E-Store
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-colors font-medium"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Icons and Auth */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-all hover:scale-110 rounded-xl hover:bg-cream-200 dark:hover:bg-charcoal-800"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-gradient-gold rounded-full shadow-luxury-gold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-all hover:scale-110 rounded-xl hover:bg-cream-200 dark:hover:bg-charcoal-800"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white bg-gradient-luxury rounded-full shadow-luxury">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/account" 
                    className="p-2.5 text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-all hover:scale-110 rounded-xl hover:bg-cream-200 dark:hover:bg-charcoal-800"
                  >
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
                    <Button variant="luxury" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 transition-all hover:scale-110 rounded-xl hover:bg-cream-200 dark:hover:bg-charcoal-800"
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
          <nav className="md:hidden pb-4 space-y-2 animate-fade-in-down">
            <Link
              href="/products"
              className="block px-4 py-3 text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-cream-100 dark:hover:bg-charcoal-800 rounded-xl transition-all font-medium"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block px-4 py-3 text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-cream-100 dark:hover:bg-charcoal-800 rounded-xl transition-all font-medium"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-charcoal-900 dark:text-cream-100 hover:text-gold-600 dark:hover:text-gold-400 hover:bg-cream-100 dark:hover:bg-charcoal-800 rounded-xl transition-all font-medium"
            >
              About
            </Link>
            <div className="px-4 py-3 space-y-3 border-t border-taupe-200 dark:border-charcoal-700 pt-4 mt-2">
              {isAuthenticated ? (
                <>
                  <Link href="/account" className="block py-2 text-charcoal-900 dark:text-cream-100 font-medium">
                    My Account
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" size="sm" className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button variant="luxury" size="sm" className="w-full">
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
