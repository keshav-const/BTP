export interface CheckoutAddress {
  fullName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface CheckoutItem {
  productId: string
  quantity: number
}

export interface CardDetails {
  cardholderName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

export interface CheckoutData {
  items: CheckoutItem[]
  shippingAddress: CheckoutAddress
  billingAddress: CheckoutAddress
  paymentMethod: string
  cardDetails?: CardDetails
}

export interface Order {
  _id: string
  orderNumber: string
  orderDate: string
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  items: Array<{
    product: {
      _id: string
      name: string
      price: number
      images: string[]
    }
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  shippingCharges: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed'
  shippingAddress: CheckoutAddress
  billingAddress: CheckoutAddress
  paymentMethod: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  isPaid: boolean
  paidAt?: string
  createdAt: string
  updatedAt: string
}
