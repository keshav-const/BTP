'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ShoppingBag, CreditCard, MapPin, Package, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import checkoutApi from '@/api/checkout'
import type { CheckoutAddress, CardDetails } from '@/types/checkout'
import { toastError, toastSuccess } from '@/lib/toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [sameAsShipping, setSameAsShipping] = useState(true)

  const subtotal = getSubtotal()
  const tax = subtotal * 0.10
  const shippingCharges = subtotal > 1000 ? 0 : 50
  const total = subtotal + tax + shippingCharges

  const [shippingAddress, setShippingAddress] = useState<CheckoutAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  })

  const [billingAddress, setBillingAddress] = useState<CheckoutAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  })

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handleShippingChange = (field: keyof CheckoutAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }))
    if (sameAsShipping) {
      setBillingAddress(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleBillingChange = (field: keyof CheckoutAddress, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }))
  }

  const handleCardChange = (field: keyof CardDetails, value: string) => {
    let formattedValue = value

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      if (formattedValue.length > 19) return
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4)
      }
      if (formattedValue.length > 5) return
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length > 4) return
    }

    setCardDetails(prev => ({ ...prev, [field]: formattedValue }))
  }

  const toggleSameAsShipping = () => {
    setSameAsShipping(!sameAsShipping)
    if (!sameAsShipping) {
      setBillingAddress(shippingAddress)
    }
  }

  const validateForm = () => {
    const requiredShippingFields: (keyof CheckoutAddress)[] = [
      'fullName', 'email', 'phone', 'street', 'city', 'state', 'zipCode', 'country'
    ]
    
    for (const field of requiredShippingFields) {
      if (!shippingAddress[field]) {
        toastError(`Please fill in shipping ${field}`)
        return false
      }
    }

    if (!sameAsShipping) {
      for (const field of requiredShippingFields) {
        if (!billingAddress[field]) {
          toastError(`Please fill in billing ${field}`)
          return false
        }
      }
    }

    const requiredCardFields: (keyof CardDetails)[] = [
      'cardholderName', 'cardNumber', 'expiryDate', 'cvv'
    ]
    
    for (const field of requiredCardFields) {
      if (!cardDetails[field]) {
        toastError(`Please fill in ${field}`)
        return false
      }
    }

    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '')
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      toastError('Invalid card number')
      return false
    }

    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      toastError('Invalid expiry date (MM/YY)')
      return false
    }

    if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
      toastError('Invalid CVV')
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setLoading(true)
    setProcessingPayment(true)

    try {
      const checkoutData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.qty,
        })),
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod: 'razorpay',
        cardDetails,
      }

      const order = await checkoutApi.createCheckout(checkoutData)
      
      const paymentResult = await checkoutApi.processPayment(order._id, cardDetails)
      
      toastSuccess('Order placed successfully!')
      router.push(`/checkout/success/${paymentResult.order._id}`)
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
      setProcessingPayment(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <section className="section">
        <div className="container max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
              Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Items Summary */}
                <div className="premium-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="text-emerald-700" size={24} />
                    <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      Order Items
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-700 last:border-0 last:pb-0">
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
                            Qty: {item.qty} × {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-700">
                            {formatPrice(item.product.price * item.qty)}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleShippingChange('fullName', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => handleShippingChange('street', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        onChange={(e) => handleShippingChange('country', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="premium-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="text-emerald-700" size={24} />
                      <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        Billing Address
                      </h2>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={toggleSameAsShipping}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        Same as shipping
                      </span>
                    </label>
                  </div>
                  {!sameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.fullName}
                          onChange={(e) => handleBillingChange('fullName', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={billingAddress.email}
                          onChange={(e) => handleBillingChange('email', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={billingAddress.phone}
                          onChange={(e) => handleBillingChange('phone', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.street}
                          onChange={(e) => handleBillingChange('street', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.city}
                          onChange={(e) => handleBillingChange('city', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.state}
                          onChange={(e) => handleBillingChange('state', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.zipCode}
                          onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.country}
                          onChange={(e) => handleBillingChange('country', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Details */}
                <div className="premium-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="text-emerald-700" size={24} />
                    <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      Payment Details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cardholderName}
                        onChange={(e) => handleCardChange('cardholderName', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardChange('cvv', e.target.value)}
                        placeholder="123"
                        className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <strong>Demo Mode:</strong> This is a mock payment. Use any card details for testing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="premium-card p-6 sticky top-24">
                  <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Tax (10%)</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {shippingCharges === 0 ? 'FREE' : formatPrice(shippingCharges)}
                      </span>
                    </div>
                    {subtotal > 1000 && (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                          🎉 Free shipping on orders above ₹1000
                        </p>
                      </div>
                    )}
                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                      <div className="flex justify-between text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        <span>Total</span>
                        <span className="text-emerald-700">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className={cn(
                      buttonVariants({ size: 'lg', className: 'w-full' }),
                      loading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        {processingPayment ? 'Processing Payment...' : 'Placing Order...'}
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>

                  <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    By placing your order, you agree to our terms and conditions
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
