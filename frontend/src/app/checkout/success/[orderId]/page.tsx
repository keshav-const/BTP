'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { CheckCircle, Package, MapPin, CreditCard, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import checkoutApi from '@/api/checkout'
import type { Order } from '@/types/checkout'
import { toastError } from '@/lib/toast'

export default function OrderSuccessPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await checkoutApi.getOrderConfirmation(orderId)
        setOrder(orderData)
      } catch (error: any) {
        toastError(error.response?.data?.message || 'Failed to fetch order')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      void fetchOrder()
    }
  }, [orderId, router])

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={48} />
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="w-full">
      <section className="section">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-emerald-subtle flex items-center justify-center"
              >
                <CheckCircle size={48} className="text-emerald-700" />
              </motion.div>
              <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Order Placed Successfully!
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
                Thank you for your order
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                Order #{order.orderNumber}
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="premium-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="text-emerald-700" size={24} />
                  <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Order Summary
                  </h2>
                </div>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-700 last:border-0 last:pb-0">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                        <Image
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-700">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 space-y-2">
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
                    <div className="flex justify-between text-xl font-bold text-zinc-900 dark:text-zinc-50 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                      <span>Total</span>
                      <span className="text-emerald-700">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
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
                <div className="text-zinc-700 dark:text-zinc-300">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">
                    <span className="text-zinc-500 dark:text-zinc-400">Email:</span> {order.shippingAddress.email}
                  </p>
                  <p>
                    <span className="text-zinc-500 dark:text-zinc-400">Phone:</span> {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="premium-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-emerald-700" size={24} />
                  <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Payment Information
                  </h2>
                </div>
                <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Payment Status</span>
                    <span className="font-semibold text-emerald-700 capitalize">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Payment Method</span>
                    <span className="font-semibold capitalize">{order.paymentMethod}</span>
                  </div>
                  {order.razorpayOrderId && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Razorpay Order ID</span>
                      <span className="font-mono text-sm">{order.razorpayOrderId}</span>
                    </div>
                  )}
                  {order.razorpayPaymentId && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Payment ID</span>
                      <span className="font-mono text-sm">{order.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div className="premium-card p-6 bg-gradient-emerald-subtle border-emerald-200 dark:border-emerald-800">
                <div className="text-center">
                  <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                    Order Status: <span className="capitalize">{order.status}</span>
                  </p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    We'll send you an email confirmation and tracking details shortly.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/account"
                  className={buttonVariants({ size: 'lg' })}
                >
                  View Order History
                </Link>
                <Link
                  href="/products"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
