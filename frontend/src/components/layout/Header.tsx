'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Moon, Sun, ShoppingCart, User, Heart, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export function Header({ isDark, setIsDark }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    const newMode = !isDark
    setIsDark(newMode)
    document.documentElement.classList.toggle('dark', newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold gradient-text">
              Premium
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-500 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun size={20} className="text-zinc-600 dark:text-zinc-300" />
              ) : (
                <Moon size={20} className="text-zinc-600 dark:text-zinc-300" />
              )}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 relative"
            >
              <Heart size={20} className="text-zinc-600 dark:text-zinc-300" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 relative"
            >
              <ShoppingCart size={20} className="text-zinc-600 dark:text-zinc-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-700 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Menu */}
            <Link href="/account" className="hidden md:block">
              <Button variant="ghost" size="sm">
                <User size={18} />
                <span>Account</span>
              </Button>
            </Link>

            {/* Sign In Button */}
            <Link href="/login" className="hidden md:block">
              <Button size="sm">Sign In</Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-zinc-600 dark:text-zinc-300" />
              ) : (
                <Menu size={24} className="text-zinc-600 dark:text-zinc-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-6 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-zinc-600 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-500 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/account" className="block">
                <Button variant="ghost" size="md" className="w-full justify-start">
                  <User size={18} />
                  <span>Account</span>
                </Button>
              </Link>
              <Link href="/login" className="block">
                <Button size="md" className="w-full">Sign In</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}
