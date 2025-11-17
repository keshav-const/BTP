'use client'

import { useCallback } from 'react'

type ToastLevel = 'success' | 'error' | 'info' | 'warning'

const logToConsole = (level: ToastLevel, message: string) => {
  const prefix = level.toUpperCase()

  if (level === 'error') {
    console.error(`[${prefix}] ${message}`)
    return
  }

  if (level === 'warning') {
    console.warn(`[${prefix}] ${message}`)
    return
  }

  console.log(`[${prefix}] ${message}`)
}

const displayToast = (level: ToastLevel, message: string) => {
  if (!message) {
    return
  }

  logToConsole(level, message)

  if (typeof window !== 'undefined') {
    window.alert(`${level === 'success' ? 'Success' : level === 'error' ? 'Error' : level === 'warning' ? 'Warning' : 'Info'}: ${message}`)
  }
}

export const useToast = () => {
  const success = useCallback((message: string) => displayToast('success', message), [])
  const error = useCallback((message: string) => displayToast('error', message), [])
  const info = useCallback((message: string) => displayToast('info', message), [])
  const warning = useCallback((message: string) => displayToast('warning', message), [])

  return { success, error, info, warning }
}
