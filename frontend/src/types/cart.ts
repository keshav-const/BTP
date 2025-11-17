import type { Product } from './product'

export interface CartItem {
  id: string
  productId: string
  qty: number
  product: Product
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
  totalQuantity: number
}
