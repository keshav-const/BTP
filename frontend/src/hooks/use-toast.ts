'use client'

import { useCallback } from 'react'

export type ToastLevel = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  level: ToastLevel
  message: string
  duration: number
}

export const TOAST_EVENT = 'app-toast'

const createToastId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

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

const dispatchToast = (payload: ToastMessage) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent<ToastMessage>(TOAST_EVENT, { detail: payload }))
}

const displayToast = (level: ToastLevel, message: string, duration = 5000) => {
  if (!message) {
    return
  }

  logToConsole(level, message)

  const payload: ToastMessage = {
    id: createToastId(),
    level,
    message,
    duration,
  }

  dispatchToast(payload)
}

export const useToast = () => {
  const success = useCallback((message: string) => displayToast('success', message), [])
  const error = useCallback((message: string) => displayToast('error', message), [])
  const info = useCallback((message: string) => displayToast('info', message), [])
  const warning = useCallback((message: string) => displayToast('warning', message), [])

  return { success, error, info, warning }
}
