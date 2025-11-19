'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    Package,
    Calendar,
    CreditCard,
    ShoppingBag,
    ChevronRight,
    Loader2,
} from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import ordersApi from '@/api/orders'
import type { Order } from '@/types/checkout'
import { formatPrice } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/Button'
import { toastError } from '@/lib/toast'

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'pending':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
        case 'confirmed':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        case 'shipped':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
        case 'delivered':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
        case 'cancelled':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
        default:
            return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
    }
}

const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
        case 'completed':
            return 'text-emerald-700 dark:text-emerald-400'
        case 'pending':
            return 'text-amber-700 dark:text-amber-400'
        case 'failed':
            return 'text-rose-700 dark:text-rose-400'
        default:
            return 'text-zinc-700 dark:text-zinc-400'
    }
}

const OrderCard = ({ order }: { order: Order }) => {
    const orderDate = new Date(order.orderDate || order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    // Filter out items with null products
    const validItems = order.items.filter(item => item.product && item.product !== null)

    return (
        <Link href={`/orders/${order._id}`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Order #{order.orderNumber}
                            </h3>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(order.status)}`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{orderDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ShoppingBag size={16} />
                                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CreditCard size={16} />
                                <span className={getPaymentStatusColor(order.paymentStatus)}>
                                    {order.paymentStatus === 'completed' ? 'Paid' : order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
                            <p className="text-2xl font-bold text-emerald-700">
                                {formatPrice(order.totalAmount)}
                            </p>
                        </div>
                        <ChevronRight
                            className="text-zinc-400 group-hover:text-emerald-700 transition-colors"
                            size={24}
                        />
                    </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {validItems.slice(0, 4).map((item, index) => (
                        <div
                            key={index}
                            className="relative w-16 h-16 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden"
                        >
                            <Image
                                src={item.product?.images?.[0] || '/placeholder.svg'}
                                alt={item.product?.name || 'Product'}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                    {validItems.length > 4 && (
                        <div className="w-16 h-16 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                                +{validItems.length - 4}
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>
        </Link>
    )
}

const OrdersPageSkeleton = () => (
    <div className="space-y-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="premium-card p-6 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex-1 space-y-3">
                        <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                    <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                    ))}
                </div>
            </div>
        ))}
    </div>
)

const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-12 text-center"
    >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-emerald-subtle flex items-center justify-center">
            <Package size={40} className="text-emerald-700" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            No orders yet
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping to see your order history here.
        </p>
        <Link href="/products" className={buttonVariants({ size: 'lg' })}>
            Start Shopping
        </Link>
    </motion.div>
)

export default function OrdersPage() {
    const router = useRouter()
    const { user, token, isLoading: authLoading } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        if (!authLoading && !token) {
            router.push('/login?redirect=/orders')
        }
    }, [authLoading, token, router])

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return

            try {
                setLoading(true)
                const response = await ordersApi.getOrders(page, 10)
                setOrders(response.data)
                setTotalPages(response.pagination.pages)
            } catch (error: any) {
                toastError(error.response?.data?.message || 'Failed to fetch orders')
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [token, page])

    if (authLoading || (!token && !authLoading)) {
        return null
    }

    return (
        <div className="w-full bg-zinc-50 dark:bg-zinc-950">
            <section className="section">
                <div className="container max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-8">
                            <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                                Order History
                            </h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400">
                                View and manage all your orders in one place
                            </p>
                        </div>

                        {loading ? (
                            <OrdersPageSkeleton />
                        ) : orders.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <OrderCard key={order._id} order={order} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center gap-2">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className={buttonVariants({
                                                variant: 'outline',
                                                size: 'md',
                                                className: page === 1 ? 'opacity-50 cursor-not-allowed' : '',
                                            })}
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center px-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            Page {page} of {totalPages}
                                        </div>
                                        <button
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className={buttonVariants({
                                                variant: 'outline',
                                                size: 'md',
                                                className: page === totalPages ? 'opacity-50 cursor-not-allowed' : '',
                                            })}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
