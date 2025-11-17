'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  LogOut,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/Button'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import type { User as UserType } from '@/types/user'

const AccountSkeleton = () => (
  <div className="premium-card p-8 md:p-10">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="h-20 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      <div className="h-6 w-2/3 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      <div className="h-4 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
    </div>
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-28 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse"
        />
      ))}
    </div>
  </div>
)

interface DetailItem {
  icon: LucideIcon
  label: string
  value: React.ReactNode
}

const AccountDetailCard = ({ icon: Icon, label, value }: DetailItem) => (
  <div className="flex items-start gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{value}</div>
    </div>
  </div>
)

interface AccountDetailsProps {
  user: UserType
  onSignOut: () => void
}

const AccountDetails = ({ user, onSignOut }: AccountDetailsProps) => {
  const fullName = `${user.firstName} ${user.lastName}`.trim()
  const joinedDate = React.useMemo(() => {
    if (!user.createdAt) {
      return null
    }

    try {
      return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(user.createdAt))
    } catch (error) {
      console.warn('Failed to format user.createdAt', error)
      return null
    }
  }, [user.createdAt])

  const detailItems: DetailItem[] = [
    {
      icon: User,
      label: 'Full name',
      value: fullName,
    },
    {
      icon: Mail,
      label: 'Email address',
      value: user.email,
    },
    {
      icon: ShieldCheck,
      label: 'Account role',
      value: user.role === 'admin' ? 'Administrator' : 'Customer',
    },
  ]

  if (joinedDate) {
    detailItems.push({
      icon: Calendar,
      label: 'Member since',
      value: joinedDate,
    })
  }

  if (typeof user.isActive === 'boolean') {
    detailItems.push({
      icon: user.isActive ? CheckCircle2 : AlertCircle,
      label: 'Account status',
      value: (
        <span className={user.isActive ? 'text-emerald-700' : 'text-rose-600'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    })
  }

  return (
    <div className="premium-card p-8 md:p-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-emerald-subtle flex items-center justify-center">
          <User size={42} className="text-emerald-700" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Manage your personal details and explore your order history from one place.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {detailItems.map((item) => (
          <AccountDetailCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Need to update your profile? Reach out to our support and we'll be happy to help.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/orders"
            className={buttonVariants({ variant: 'outline', size: 'md', className: 'w-full sm:w-auto' })}
          >
            View orders
          </Link>
          <Button
            variant="secondary"
            size="md"
            type="button"
            onClick={onSignOut}
            className="flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}

const SignInCallout = () => (
  <div className="premium-card p-8 md:p-10 text-center">
    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-emerald-subtle flex items-center justify-center">
      <User size={40} className="text-emerald-700" />
    </div>
    <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
      Account
    </h1>
    <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
      Sign in to view your account details and order history.
    </p>
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Link href="/login" className={buttonVariants({ size: 'lg' })}>
        Sign in
      </Link>
      <Link href="/register" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
        Create account
      </Link>
    </div>
  </div>
)

export default function AccountPage() {
  const { user, token, isLoading, signOut } = useAuth()
  const { success } = useToast()

  const handleSignOut = React.useCallback(() => {
    signOut()
    success('You have been signed out.')
  }, [signOut, success])

  const shouldShowSignIn = !token && !isLoading
  const shouldShowSkeleton = !shouldShowSignIn && (isLoading || (token && !user))

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950">
      <section className="section">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {shouldShowSignIn && <SignInCallout />}
            {shouldShowSkeleton && <AccountSkeleton />}
            {!shouldShowSignIn && !shouldShowSkeleton && user && (
              <AccountDetails user={user} onSignOut={handleSignOut} />
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
