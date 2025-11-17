'use client'

import { TOAST_EVENT, type ToastLevel, type ToastMessage } from '@/hooks/use-toast'

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

const emitToast = (level: ToastLevel, message: string, duration = 5000) => {
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

export const toastSuccess = (message: string, duration?: number) => emitToast('success', message, duration)
export const toastError = (message: string, duration?: number) => emitToast('error', message, duration)
export const toastInfo = (message: string, duration?: number) => emitToast('info', message, duration)
export const toastWarning = (message: string, duration?: number) => emitToast('warning', message, duration)
