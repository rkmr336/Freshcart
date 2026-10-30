export type CategoryId =
  | "fruits"
  | "vegetables"
  | "dairy-eggs"
  | "atta-rice-dal"
  | "snacks"
  | "beverages"
  | "bakery"
  | "household";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // matches Category.name or Category.slug
  categorySlug: string;
  emoji: string;
  price: number; // current selling price in INR
  mrp: number; // original price in INR (mrp >= price)
  unit: string; // e.g., "1 kg", "500 g", "1 L", "6 pcs"
  rating: number; // 3.5 - 5.0
  reviewCount: number;
  description: string;
  inStock: boolean;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  emoji: string;
  unit: string;
  price: number;
  quantity: number;
}

export interface OrderDetails {
  orderId: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  deliverySlot: string;
  paymentMethod: "cod" | "upi" | "card";
  estimatedDelivery: string;
}

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "discount-desc";

