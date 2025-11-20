'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/auth'

export default function LoginPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      error('Please enter your email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email: email.trim(), password })
      success('Welcome back!')
      router.push('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in. Please try again.'
      error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full  min-h-[calc(100vh-80px)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="premium-card p-8 md:p-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
            Sign in to your account
          </p>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all duration-200"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 outline-none transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-700"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-emerald-700 hover:text-emerald-800">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-emerald-700 hover:text-emerald-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
