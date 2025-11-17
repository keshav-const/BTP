import type { Product } from './product'

export interface WishlistItem {
  id: string
  productId: string
  product: Product
}

export interface WishlistSummary {
  items: WishlistItem[]
}
