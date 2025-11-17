'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const hydrateStores = async () => {
      await useAuthStore.getState().hydrate()
      const { isAuthenticated } = useAuthStore.getState()

      if (isAuthenticated) {
        void useCartStore.getState().load(true)
        void useWishlistStore.getState().load(true)
      } else {
        useCartStore.setState({ items: [], isLoading: false, error: null, hasHydrated: false })
        useWishlistStore.setState({ items: [], isLoading: false, error: null, hasHydrated: false })
      }
    }

    void hydrateStores()

    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    const unsubscribe = useAuthStore.subscribe((state, previousState) => {
      const wasAuthenticated = previousState?.isAuthenticated ?? false
      const isAuthenticated = state.isAuthenticated

      if (!wasAuthenticated && isAuthenticated) {
        void useCartStore.getState().load(true)
        void useWishlistStore.getState().load(true)
      } else if (wasAuthenticated && !isAuthenticated) {
        useCartStore.setState({ items: [], isLoading: false, error: null, hasHydrated: false })
        useWishlistStore.setState({ items: [], isLoading: false, error: null, hasHydrated: false })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">{children}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      <Header isDark={isDark} setIsDark={setIsDark} />
      <ToastProvider />
      <AnimatePresence mode="wait">
        <main className="flex-1">{children}</main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
