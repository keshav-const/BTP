'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { TOAST_EVENT } from '@/hooks/use-toast'
import type { ToastLevel, ToastMessage } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const variantStyles: Record<ToastLevel, string> = {
  success: 'bg-emerald-600/95 text-white shadow-premium-emerald',
  error: 'bg-rose-600/95 text-white shadow-premium-lg',
  info: 'bg-zinc-900/90 text-zinc-50 shadow-premium',
  warning: 'bg-amber-500/95 text-zinc-900 shadow-premium-lg',
}

const labelMap: Record<ToastLevel, string> = {
  success: 'Success',
  error: 'Error',
  info: 'Info',
  warning: 'Warning',
}

export function ToastProvider() {
  const [mounted, setMounted] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const timers = useRef<Record<string, number>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) {
      return
    }

    const handleToast = (event: Event) => {
      const { detail } = event as CustomEvent<ToastMessage>

      if (!detail) {
        return
      }

      setToasts((previous) => [...previous, detail])

      if (timers.current[detail.id]) {
        window.clearTimeout(timers.current[detail.id])
      }

      const duration = detail.duration ?? 5000

      timers.current[detail.id] = window.setTimeout(() => {
        setToasts((previous) => previous.filter((toast) => toast.id !== detail.id))
        delete timers.current[detail.id]
      }, duration)
    }

    window.addEventListener(TOAST_EVENT, handleToast as EventListener)

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast as EventListener)
      Object.values(timers.current).forEach((timer) => window.clearTimeout(timer))
      timers.current = {}
    }
  }, [mounted])

  const dismissToast = (id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))

    if (timers.current[id]) {
      window.clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }

  if (!mounted) {
    return null
  }

  return createPortal(
    <div className="pointer-events-none fixed top-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const label = labelMap[toast.level]
          const isWarning = toast.level === 'warning'
          const isInfo = toast.level === 'info'
          const labelColor = isWarning ? 'text-zinc-800/80' : isInfo ? 'text-zinc-400' : 'text-white/70'
          const badgeStyles = isWarning ? 'bg-white/70 text-zinc-900' : 'bg-white/15 text-white'
          const bodyColor = isWarning ? 'text-zinc-900' : 'text-white'

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'pointer-events-auto overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md',
                variantStyles[toast.level]
              )}
            >
              <div className="flex items-start gap-3 p-4">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-sm font-semibold uppercase tracking-wide',
                    badgeStyles
                  )}
                >
                  {label.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className={cn('text-xs font-semibold tracking-[0.2em]', labelColor)}>{label}</p>
                  <p className={cn('mt-1 text-sm font-medium leading-relaxed', bodyColor)}>{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className={cn(
                    'rounded-full p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                    isWarning ? 'text-zinc-800/70 hover:text-zinc-900' : 'text-white/70 hover:text-white'
                  )}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body
  )
}
