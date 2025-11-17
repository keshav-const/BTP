export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category?: string | null;
  brand?: string | null;
  images: string[];
  stock?: number | null;
  createdAt?: string;
  updatedAt?: string;
}
