'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { ChatBot } from '@/components/ChatBot'
import { FloatingElements } from '@/components/ui/FloatingElements'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true
    return document.documentElement.classList.contains('dark')
  })
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

    const savedTheme = localStorage.getItem('theme')
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)

    setMounted(true)

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
    <div className="relative flex flex-col min-h-screen transition-colors duration-300">
      <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 gradient-emerald-zinc-mesh" />
        <FloatingElements 
          count={6} 
          size="lg" 
          speed="slow" 
          blur="xl" 
          opacity={0.15} 
          colorScheme="mixed"
          zIndex={-1}
        />
      </div>

      <Header isDark={isDark} setIsDark={setIsDark} />
      <ToastProvider />
      <ChatBot />
      <AnimatePresence mode="wait">
        <main className="flex-1 relative z-0 px-0 py-0">
          {children}
        </main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
