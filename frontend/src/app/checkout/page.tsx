'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, MapPin, CreditCard, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart, useAuth, useToast } from '@/hooks';
import { ordersApi, CreateOrderRequest, OrderItem } from '@/api/orders';
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
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.id,
        quantity: item.cartQuantity,
        price: item.salePrice || item.price,
      }));

      const orderData: CreateOrderRequest = {
        items: orderItems,
        shippingAddress: formData,
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
          className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-4 md:gap-8">
        {['address', 'review', 'payment'].map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                  currentStep === step
                    ? 'bg-primary-600 text-white'
                    : idx < ['address', 'review', 'payment'].indexOf(currentStep)
                      ? 'bg-success text-white'
                      : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-600'
                }`}
              >
                {idx + 1}
              </div>
              <p className="text-xs md:text-sm text-secondary-600 capitalize">{step}</p>
            </div>
            {idx < 2 && <div className="flex-1 h-1 bg-secondary-200 dark:bg-secondary-700 mt-5" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 'address' && (
            <Card variant="outlined" className="space-y-6 p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>

              <div className="space-y-4">
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
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-2 border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full"
              >
                Continue to Review
              </Button>
            </Card>
          )}

          {currentStep === 'review' && (
            <Card variant="outlined" className="space-y-6 p-6">
              <h2 className="text-xl font-bold">Order Review</h2>

              <div className="space-y-4">
                {items.map(item => {
                  const itemPrice = item.salePrice || item.price;
                  return (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-secondary-600 text-sm">Qty: {item.cartQuantity}</p>
                        <p className="text-primary-600 font-bold mt-1">
                          {formatPrice(itemPrice * item.cartQuantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Card variant="elevated" className="space-y-2 p-4">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <p className="text-sm text-secondary-600">
                  {formData.street}, {formData.city}, {formData.state} {formData.postalCode}
                </p>
                <p className="text-sm text-secondary-600">{formData.country}</p>
                <Button
                  onClick={() => setCurrentStep('address')}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Edit Address
                </Button>
              </Card>

              <div className="flex gap-4">
                <Button
                  onClick={() => setCurrentStep('address')}
                  variant="outline"
                  size="lg"
                  className="flex-1"
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
            <Card variant="outlined" className="space-y-6 p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors"
                  style={{
                    borderColor: paymentMethod === 'cod' ? '#0ea5e9' : 'var(--color-border)',
                    backgroundColor: paymentMethod === 'cod' ? 'rgba(14, 165, 233, 0.05)' : 'transparent'
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'card')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">Cash on Delivery (COD)</p>
                    <p className="text-sm text-secondary-600">Pay when you receive your order</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors opacity-50 pointer-events-none"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'card')}
                    className="w-4 h-4 cursor-pointer"
                    disabled
                  />
                  <div className="ml-4">
                    <p className="font-semibold">Credit/Debit Card</p>
                    <p className="text-sm text-secondary-600">Coming soon</p>
                  </div>
                </label>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg border border-primary-200 dark:border-primary-700">
                <p className="text-sm text-primary-900 dark:text-primary-100">
                  <span className="font-semibold">Note:</span> Currently, we only support Cash on Delivery.
                  Please arrange to pay upon delivery of your order.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setCurrentStep('review')}
                  variant="outline"
                  size="lg"
                  className="flex-1"
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
                    'Place Order'
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card variant="elevated" className="sticky top-20 p-6 space-y-4">
            <h3 className="font-bold text-lg border-b border-border pb-3">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Tax (8%)</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="bg-secondary-50 dark:bg-secondary-800 p-3 rounded text-xs text-secondary-600 dark:text-secondary-300">
              <p className="font-semibold mb-1">Items in order: {items.length}</p>
              {items.map(item => (
                <p key={item.id}>{item.name} x {item.cartQuantity}</p>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
