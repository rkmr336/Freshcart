export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  tagline?: string;
  itemCount?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  // Modern Dropshipping additions
  image: string;
  gallery?: string[];
  sizes?: string[]; // e.g. ["S", "M", "L", "XL"]
  colors?: ProductColor[]; // e.g. [{ name: "Onyx Black", hex: "#111827" }]
  material?: string;
  details?: string[];
  badge?: string; // e.g. "Trending", "Limited", "Best Seller"
  unit?: string; // backwards compatibility
  emoji?: string; // backwards compatibility
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  unit?: string;
  emoji?: string;
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
