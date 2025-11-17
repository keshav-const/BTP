'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Moon, Sun, ShoppingCart, User, Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/use-auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

interface HeaderProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

export function Header({ isDark, setIsDark }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, signOut } = useAuth()
  const cartQuantity = useCartStore((state) => state.items.reduce((total, item) => total + item.qty, 0))
  const wishlistCount = useWishlistStore((state) => state.items.length)

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

  const initials = useMemo(() => {
    if (!user) return ''
    if (user.firstName) return user.firstName.charAt(0).toUpperCase()
    if (user.lastName) return user.lastName.charAt(0).toUpperCase()
    if (user.email) return user.email.charAt(0).toUpperCase()
    return ''
  }, [user])

  const displayName = useMemo(() => {
    if (!user) return ''
    if (user.firstName) return user.firstName
    if (user.email) return user.email.split('@')[0]
    return ''
  }, [user])

  const handleAccountClick = () => {
    setMobileMenuOpen(false)
    router.push('/account')
  }

  const handleSignInClick = () => {
    setMobileMenuOpen(false)
    router.push('/login')
  }

  const handleSignOut = () => {
    signOut()
    setMobileMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold gradient-text">Premium</h1>
          </Link>

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

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
              type="button"
            >
              {isDark ? (
                <Sun size={20} className="text-zinc-600 dark:text-zinc-300" />
              ) : (
                <Moon size={20} className="text-zinc-600 dark:text-zinc-300" />
              )}
            </button>

            <Link
              href="/wishlist"
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 relative"
            >
              <Heart size={20} className="text-zinc-600 dark:text-zinc-300" />
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-emerald-700 text-white text-xs rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            </Link>

            <Link
              href="/cart"
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 relative"
            >
              <ShoppingCart size={20} className="text-zinc-600 dark:text-zinc-300" />
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-emerald-700 text-white text-xs rounded-full flex items-center justify-center">
                {cartQuantity}
              </span>
            </Link>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={handleAccountClick}
                  className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {initials ? (
                      <span className="text-sm font-semibold uppercase">{initials}</span>
                    ) : (
                      <User size={18} />
                    )}
                  </span>
                  <span className="hidden md:inline text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {displayName || 'Account'}
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={handleSignOut}
                  className="hidden md:inline-flex"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                type="button"
                onClick={handleSignInClick}
                className="hidden md:inline-flex"
              >
                Sign In
              </Button>
            )}

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
              type="button"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-zinc-600 dark:text-zinc-300" />
              ) : (
                <Menu size={24} className="text-zinc-600 dark:text-zinc-300" />
              )}
            </button>
          </div>
        </div>

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
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-colors duration-200 hover:border-emerald-700 dark:hover:border-emerald-600"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Cart
                </span>
                <span className="inline-flex min-w-[1.75rem] justify-center rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-semibold text-white">
                  {cartQuantity}
                </span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-colors duration-200 hover:border-emerald-700 dark:hover:border-emerald-600"
              >
                <span className="flex items-center gap-2">
                  <Heart size={18} />
                  Wishlist
                </span>
                <span className="inline-flex min-w-[1.75rem] justify-center rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-semibold text-white">
                  {wishlistCount}
                </span>
              </Link>
            </div>
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="md"
                    type="button"
                    className="w-full !flex justify-start gap-3"
                    onClick={handleAccountClick}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {initials ? (
                        <span className="text-sm font-semibold uppercase">{initials}</span>
                      ) : (
                        <User size={18} />
                      )}
                    </span>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      Profile
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    type="button"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  size="md"
                  type="button"
                  className="w-full !flex justify-center"
                  onClick={handleSignInClick}
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  )
}
