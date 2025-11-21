'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, ShoppingCart, User, Heart, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FloatingElements } from '@/components/ui/FloatingElements'
import { useAuth } from '@/hooks/use-auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useMagneticHover } from '@/hooks/use-magnetic-hover'
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion'
import { cn } from '@/lib/utils'

interface HeaderProps {
  isDark: boolean
  setIsDark: (dark: boolean) => void
}

function MagneticNavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const { elementRef, magneticX, magneticY, handleMouseMove, handleMouseLeave, prefersReducedMotion } = useMagneticHover({
    strength: 0.2,
  })

  if (prefersReducedMotion) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="text-sm font-medium text-zinc-600 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-500 transition-colors duration-200"
      >
        {label}
      </Link>
    )
  }

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      style={{ x: magneticX, y: magneticY }}
      onMouseMove={handleMouseMove as React.MouseEventHandler<HTMLDivElement>}
      onMouseLeave={handleMouseLeave as React.MouseEventHandler<HTMLDivElement>}
    >
      <Link
        href={href}
        onClick={onClick}
        className="text-sm font-medium text-zinc-600 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-500 transition-colors duration-200"
      >
        {label}
      </Link>
    </motion.div>
  )
}

export function Header({ isDark, setIsDark }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
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

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.3 }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { duration: prefersReducedMotion ? 0 : 0.2 }
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <FloatingElements count={3} size="sm" speed="slow" blur="xl" opacity={0.3} />
        </div>
        
        <div className="glass-medium backdrop-blur-glass-md frosted-border shadow-glass">
          <nav className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold gradient-text">Premium</h1>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <MagneticNavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900"
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
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900"
                  aria-label={`Wishlist (${wishlistCount} items)`}
                >
                  <Heart size={20} className="text-zinc-600 dark:text-zinc-300" />
                  <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-emerald-700 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                </Link>

                <Link
                  href="/cart"
                  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900"
                  aria-label={`Shopping cart (${cartQuantity} items)`}
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
                      className="hidden sm:flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900"
                      aria-label="Account menu"
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
                    magnetic
                  >
                    Sign In
                  </Button>
                )}

                <button
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-zinc-900"
                  type="button"
                  aria-label="Toggle navigation"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <X size={24} className="text-zinc-600 dark:text-zinc-300" />
                  ) : (
                    <Menu size={24} className="text-zinc-600 dark:text-zinc-300" />
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div 
              className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            <motion.div 
              className="absolute inset-x-0 top-[73px] bottom-0 glass-heavy backdrop-blur-glass-heavy overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            >
              <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
                <nav className="space-y-1" role="navigation" aria-label="Mobile navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block py-3 px-4 text-base font-medium text-zinc-700 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between glass-light rounded-xl px-4 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:glass-medium hover:shadow-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
                    className="flex items-center justify-between glass-light rounded-xl px-4 py-4 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:glass-medium hover:shadow-glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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

                <div className="pt-4 space-y-3 border-t border-zinc-200 dark:border-zinc-800">
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="glass"
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
                        <span className="text-sm font-medium">
                          {displayName || 'Profile'}
                        </span>
                      </Button>
                      <Button
                        variant="outline"
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
                      variant="solid"
                      size="md"
                      type="button"
                      className="w-full !flex justify-center"
                      onClick={handleSignInClick}
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
