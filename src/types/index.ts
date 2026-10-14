export type BadgeType = 'SALE' | 'NEW' | 'HOT' | 'FESTIVE' | 'COASTAL' | null;

export interface SizeOption {
  label: string;
  price: number;
  mrp: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients?: string;
  storage?: string;
  category: string;
  brand: string;
  images: string[];
  sizes: SizeOption[];
  badge?: BadgeType;
  is_featured?: boolean;
  in_stock: boolean;
  sort_order?: number;
  rating?: number;
  review_count?: number;
  emoji?: string;
  created_at?: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  size: string;
  price: number;
  mrp: number;
  qty: number;
  image?: string;
  emoji?: string;
}

export interface Coupon {
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order?: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  slug: string;
  size: string;
  qty: number;
  unit_price: number;
  image?: string;
  emoji?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  coupon_code?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_email: string;
  shipping_address: ShippingAddress;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  name: string;
  city?: string;
  rating: number;
  review: string;
  created_at: string;
}
