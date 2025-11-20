'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import {
    Package,
    Calendar,
    CreditCard,
    MapPin,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Clock,
    Truck,
    XCircle,
} from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import ordersApi from '@/api/orders'
import type { Order } from '@/types/checkout'
import { formatPrice } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/Button'
import { toastError, toastSuccess } from '@/lib/toast'

const getStatusIcon = (status: Order['status']) => {
    switch (status) {
        case 'pending':
            return <Clock className="text-amber-700" size={24} />
        case 'confirmed':
            return <CheckCircle2 className="text-blue-700" size={24} />
        case 'shipped':
            return <Truck className="text-purple-700" size={24} />
        case 'delivered':
            return <CheckCircle2 className="text-emerald-700" size={24} />
        case 'cancelled':
            return <XCircle className="text-rose-700" size={24} />
        default:
            return <Package className="text-zinc-700" size={24} />
    }
}

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

const OrderDetailSkeleton = () => (
    <div className="space-y-6">
        <div className="premium-card p-6 animate-pulse">
            <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
            <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="premium-card p-6 animate-pulse">
            <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                ))}
            </div>
        </div>
    </div>
)

export default function OrderDetailPage() {
    const router = useRouter()
    const params = useParams()
    const orderId = params.id as string
    const { token, isLoading: authLoading } = useAuth()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [cancelling, setCancelling] = useState(false)

    useEffect(() => {
        if (!authLoading && !token) {
            router.push('/login?redirect=/orders')
        }
    }, [authLoading, token, router])

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token || !orderId) return

            try {
                setLoading(true)
                const orderData = await ordersApi.getOrderById(orderId)
                setOrder(orderData)
            } catch (error: any) {
                toastError(error.response?.data?.message || 'Failed to fetch order details')
                router.push('/orders')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [token, orderId, router])

    const handleCancelOrder = async () => {
        if (!order) return

        if (!confirm('Are you sure you want to cancel this order?')) return

        try {
            setCancelling(true)
            const updatedOrder = await ordersApi.cancelOrder(order._id)
            setOrder(updatedOrder)
            toastSuccess('Order cancelled successfully')
        } catch (error: any) {
            toastError(error.response?.data?.message || 'Failed to cancel order')
        } finally {
            setCancelling(false)
        }
    }

    if (authLoading || (!token && !authLoading)) {
        return null
    }

    if (loading) {
        return (
            <div className="w-full">
                <section className="section">
                    <div className="container max-w-6xl">
                        <OrderDetailSkeleton />
                    </div>
                </section>
            </div>
        )
    }

    if (!order) {
        return null
    }

    const orderDate = new Date(order.orderDate || order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

    const canCancel = order.status === 'pending' || order.status === 'confirmed'

    return (
        <div className="w-full">
            <section className="section">
                <div className="container max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Back Button */}
                        <Link
                            href="/orders"
                            className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'mb-6' })}
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Back to Orders
                        </Link>

                        {/* Order Header */}
                        <div className="premium-card p-6 md:p-8 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                                        Order #{order.orderNumber}
                                    </h1>
                                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                        <Calendar size={16} />
                                        <span>{orderDate}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(order.status)}
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusColor(order.status)}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {canCancel && (
                                <Button
                                    variant="secondary"
                                    size="md"
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    className="mt-4"
                                >
                                    {cancelling ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            Cancelling...
                                        </>
                                    ) : (
                                        'Cancel Order'
                                    )}
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Order Items */}
                                <div className="premium-card p-6">
                                    <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                                        Order Items
                                    </h2>
                                    <div className="space-y-4">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-700 last:border-0 last:pb-0"
                                            >
                                                <div className="relative w-20 h-20 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={item.product?.images?.[0] || '/placeholder.svg'}
                                                        alt={item.product?.name || 'Product'}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                                                        {item.product?.name || 'Product (Unavailable)'}
                                                    </h3>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        Price: {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-emerald-700">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="premium-card p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="text-emerald-700" size={24} />
                                        <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                            Shipping Address
                                        </h2>
                                    </div>
                                    <div className="text-zinc-700 dark:text-zinc-300 space-y-1">
                                        <p className="font-semibold">{order.shippingAddress.fullName}</p>
                                        <p>{order.shippingAddress.street}</p>
                                        <p>
                                            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                            {order.shippingAddress.zipCode}
                                        </p>
                                        <p>{order.shippingAddress.country}</p>
                                        <p className="pt-2">
                                            <span className="text-zinc-500 dark:text-zinc-400">Email: </span>
                                            {order.shippingAddress.email}
                                        </p>
                                        <p>
                                            <span className="text-zinc-500 dark:text-zinc-400">Phone: </span>
                                            {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className="premium-card p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CreditCard className="text-emerald-700" size={24} />
                                        <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                            Billing Address
                                        </h2>
                                    </div>
                                    <div className="text-zinc-700 dark:text-zinc-300 space-y-1">
                                        <p className="font-semibold">{order.billingAddress.fullName}</p>
                                        <p>{order.billingAddress.street}</p>
                                        <p>
                                            {order.billingAddress.city}, {order.billingAddress.state}{' '}
                                            {order.billingAddress.zipCode}
                                        </p>
                                        <p>{order.billingAddress.country}</p>
                                        <p className="pt-2">
                                            <span className="text-zinc-500 dark:text-zinc-400">Email: </span>
                                            {order.billingAddress.email}
                                        </p>
                                        <p>
                                            <span className="text-zinc-500 dark:text-zinc-400">Phone: </span>
                                            {order.billingAddress.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Order Summary */}
                                <div className="premium-card p-6 sticky top-24">
                                    <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">{formatPrice(order.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                            <span>Tax</span>
                                            <span className="font-semibold">{formatPrice(order.tax)}</span>
                                        </div>
                                        <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                            <span>Shipping</span>
                                            <span className="font-semibold">
                                                {order.shippingCharges === 0 ? 'FREE' : formatPrice(order.shippingCharges)}
                                            </span>
                                        </div>
                                        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                                            <div className="flex justify-between text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                                <span>Total</span>
                                                <span className="text-emerald-700">{formatPrice(order.totalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                                            Payment Information
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Method</span>
                                                <span className="font-medium text-zinc-900 dark:text-zinc-50 capitalize">
                                                    {order.paymentMethod}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Status</span>
                                                <span
                                                    className={`font-medium capitalize ${order.paymentStatus === 'completed'
                                                        ? 'text-emerald-700'
                                                        : order.paymentStatus === 'pending'
                                                            ? 'text-amber-700'
                                                            : 'text-rose-700'
                                                        }`}
                                                >
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                            {order.isPaid && order.paidAt && (
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-600 dark:text-zinc-400">Paid on</span>
                                                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                                        {new Date(order.paidAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
