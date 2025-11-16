'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, MapPin, CreditCard, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart, useAuth, useToast } from '@/hooks';
import { ordersApi, CreateOrderRequest, CreateOrderItem } from '@/api/orders';
import { formatPrice } from '@/utils/format';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'address' | 'review' | 'payment'>('address');
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-error text-lg mb-6">Please log in to proceed with checkout</p>
        <Button onClick={() => router.push('/login')} variant="primary">
          Go to Login
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-secondary-300 mb-4" />
        <p className="text-error text-lg mb-6">Your cart is empty</p>
        <Button onClick={() => router.push('/products')} variant="primary">
          Continue Shopping
        </Button>
      </div>
    );
  }

  const taxRate = 0.08;
  const shippingCost = total > 50 ? 0 : 10;
  const tax = total * taxRate;
  const finalTotal = total + tax + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAddress = () => {
    if (
      !formData.street.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.postalCode.trim() ||
      !formData.country.trim()
    ) {
      showError('Please fill in all address fields');
      return false;
    }
    return true;
  };

  const handleContinueToReview = () => {
    if (validateAddress()) {
      setCurrentStep('review');
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const orderItems: CreateOrderItem[] = items.map(item => ({
        product: item.id,
        quantity: item.cartQuantity,
        price: item.salePrice || item.price,
      }));

      const orderData: CreateOrderRequest = {
        items: orderItems,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
      };

      const response = await ordersApi.createOrder(orderData);

      if (response.success && response.data) {
        showSuccess('Order placed successfully!');
        clearCart();
        setTimeout(() => {
          router.push(`/account?tab=orders`);
        }, 1500);
      } else {
        showError(response.message || 'Failed to place order');
      }
    } catch (err) {
      showError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/cart')}
          className="p-2.5 hover:bg-cream-100 dark:hover:bg-charcoal-800 rounded-xl transition-all duration-200 text-gold-600 dark:text-gold-400"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-4xl font-serif font-bold text-charcoal-900 dark:text-cream-100">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-4 md:gap-8">
        {['address', 'review', 'payment'].map((step, idx) => {
          const currentIndex = ['address', 'review', 'payment'].indexOf(currentStep);
          const isCompleted = idx < currentIndex;
          const isCurrent = currentStep === step;
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 transition-all duration-300 shadow-luxury-sm ${
                    isCurrent
                      ? 'bg-gradient-gold text-white scale-110'
                      : isCompleted
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                        : 'bg-cream-200 dark:bg-charcoal-700 text-taupe-500 dark:text-taupe-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <p className={`text-xs md:text-sm capitalize font-medium transition-colors duration-200 ${
                  isCurrent 
                    ? 'text-gold-600 dark:text-gold-400' 
                    : isCompleted 
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-taupe-500 dark:text-taupe-400'
                }`}>
                  {step}
                </p>
              </div>
              {idx < 2 && (
                <div className="flex-1 mt-6">
                  <div className={`h-1 rounded-full transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                      : 'bg-cream-200 dark:bg-charcoal-700'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 'address' && (
            <Card variant="elevated" className="space-y-6 p-8 bg-white dark:bg-charcoal-800 rounded-2xl border border-taupe-200 dark:border-charcoal-600 shadow-luxury">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gold-100 dark:bg-gold-900/20 rounded-xl">
                  <MapPin className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-charcoal-900 dark:text-cream-100">Shipping Address</h2>
              </div>

              <div className="space-y-5">
                <Input
                  label="Street Address"
                  name="street"
                  placeholder="123 Main St"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  aria-label="Street address"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    aria-label="City"
                  />
                  <Input
                    label="State"
                    name="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    aria-label="State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    placeholder="10001"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    aria-label="Postal code"
                  />
                  <div>
                    <label className="block text-sm font-medium text-charcoal-800 dark:text-cream-200 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border-2 border-taupe-300 dark:border-charcoal-600 rounded-xl bg-white dark:bg-charcoal-900 text-charcoal-800 dark:text-cream-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-200"
                      aria-label="Country"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexico</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleContinueToReview}
                variant="primary"
                size="lg"
                className="w-full mt-4"
              >
                Continue to Review
              </Button>
            </Card>
          )}

          {currentStep === 'review' && (
            <Card variant="elevated" className="space-y-6 p-8 bg-white dark:bg-charcoal-800 rounded-2xl border border-taupe-200 dark:border-charcoal-600 shadow-luxury">
              <h2 className="text-2xl font-serif font-bold text-charcoal-900 dark:text-cream-100">Order Review</h2>

              <div className="space-y-4">
                {items.map(item => {
                  const itemPrice = item.salePrice || item.price;
                  return (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-taupe-200 dark:border-charcoal-700 last:border-b-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-100 dark:bg-charcoal-700 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-charcoal-900 dark:text-cream-100">{item.name}</h3>
                        <p className="text-taupe-600 dark:text-taupe-400 text-sm">Qty: {item.cartQuantity}</p>
                        <p className="text-gold-600 dark:text-gold-400 font-bold mt-1">
                          {formatPrice(itemPrice * item.cartQuantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Card variant="outlined" className="space-y-3 p-5 bg-cream-50 dark:bg-charcoal-900 border-taupe-200 dark:border-charcoal-600 rounded-xl">
                <h3 className="font-serif font-semibold text-charcoal-900 dark:text-cream-100 mb-3">Shipping Address</h3>
                <p className="text-sm text-charcoal-700 dark:text-cream-200">
                  {formData.street}, {formData.city}, {formData.state} {formData.postalCode}
                </p>
                <p className="text-sm text-charcoal-700 dark:text-cream-200">{formData.country}</p>
                <Button
                  onClick={() => setCurrentStep('address')}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-gold-400 dark:border-gold-600 text-gold-600 dark:text-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20"
                >
                  Edit Address
                </Button>
              </Card>

              <div className="flex gap-4 pt-2">
                <Button
                  onClick={() => setCurrentStep('address')}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-taupe-300 dark:border-charcoal-600"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('payment')}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  Continue to Payment
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 'payment' && (
            <Card variant="elevated" className="space-y-6 p-8 bg-white dark:bg-charcoal-800 rounded-2xl border border-taupe-200 dark:border-charcoal-600 shadow-luxury">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gold-100 dark:bg-gold-900/20 rounded-xl">
                  <CreditCard className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-charcoal-900 dark:text-cream-100">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <label 
                  className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'cod' 
                      ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/20 shadow-luxury-sm' 
                      : 'border-taupe-200 dark:border-charcoal-600 hover:border-gold-300 dark:hover:border-gold-700'
                  }`}
                >
                  <div className="relative mt-1">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'card')}
                      className="peer w-5 h-5 cursor-pointer appearance-none border-2 border-gold-400 dark:border-gold-600 rounded-full checked:border-gold-500 checked:bg-gold-500 transition-all duration-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`w-2.5 h-2.5 rounded-full bg-white transition-opacity duration-200 ${
                        paymentMethod === 'cod' ? 'opacity-100' : 'opacity-0'
                      }`} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="font-serif font-semibold text-charcoal-900 dark:text-cream-100">Cash on Delivery (COD)</p>
                    <p className="text-sm text-taupe-600 dark:text-taupe-400 mt-1">Pay when you receive your order</p>
                  </div>
                </label>

                <label className="flex items-start p-5 border-2 border-taupe-200 dark:border-charcoal-600 rounded-xl opacity-50 pointer-events-none">
                  <div className="relative mt-1">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'card')}
                      className="w-5 h-5 cursor-not-allowed appearance-none border-2 border-taupe-300 dark:border-taupe-600 rounded-full"
                      disabled
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-serif font-semibold text-charcoal-900 dark:text-cream-100">Credit/Debit Card</p>
                    <p className="text-sm text-taupe-600 dark:text-taupe-400 mt-1">Coming soon</p>
                  </div>
                </label>
              </div>

              <div className="bg-gold-50 dark:bg-gold-900/20 p-5 rounded-xl border border-gold-200 dark:border-gold-800">
                <p className="text-sm text-gold-900 dark:text-gold-100">
                  <span className="font-semibold">Note:</span> Currently, we only support Cash on Delivery.
                  Please arrange to pay upon delivery of your order.
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  onClick={() => setCurrentStep('review')}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-taupe-300 dark:border-charcoal-600"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Complete Order'
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card variant="elevated" className="sticky top-20 p-6 space-y-5 bg-cream-100 dark:bg-charcoal-800 rounded-2xl border border-taupe-200 dark:border-charcoal-600 shadow-luxury">
            <h3 className="font-serif font-bold text-xl text-charcoal-900 dark:text-cream-100 border-b border-taupe-300 dark:border-charcoal-700 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-taupe-600 dark:text-taupe-400">Subtotal</span>
                <span className="font-semibold text-charcoal-800 dark:text-cream-200">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe-600 dark:text-taupe-400">Shipping</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                  ) : (
                    <span className="text-charcoal-800 dark:text-cream-200">{formatPrice(shippingCost)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe-600 dark:text-taupe-400">Tax (8%)</span>
                <span className="font-semibold text-charcoal-800 dark:text-cream-200">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="border-t border-taupe-300 dark:border-charcoal-700 pt-3">
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-serif font-semibold text-charcoal-900 dark:text-cream-100">Total</span>
                <span className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-400">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="bg-cream-200 dark:bg-charcoal-900 p-4 rounded-xl text-xs border border-taupe-200 dark:border-charcoal-700">
              <p className="font-semibold mb-2 text-charcoal-900 dark:text-cream-100">Items in order: {items.length}</p>
              <div className="space-y-1">
                {items.map(item => (
                  <p key={item.id} className="text-taupe-700 dark:text-taupe-300">
                    {item.name} x {item.cartQuantity}
                  </p>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
