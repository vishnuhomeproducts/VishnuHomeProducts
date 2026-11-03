import { OrderItem, ShippingAddress } from './index';

export type OrderFulfillmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing' // Packing in warehouse
  | 'packed'     // Packed & ready for courier
  | 'shipped'    // In transit with courier
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded' | 'pending_verification';
export type PaymentMethod = 'razorpay' | 'cod' | 'upi_direct' | 'manual';
export type DeliveryType = 'pan_india_courier' | 'mangaluru_local' | 'express_air';

export interface AdminOrder {
  id: string;
  order_number: string;
  user_id?: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  coupon_code?: string;
  status: OrderFulfillmentStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_email: string;
  shipping_address: ShippingAddress;
  delivery_type: DeliveryType;
  courier_partner?: string; // e.g. 'Delhivery' | 'BlueDart' | 'DTDC' | 'India Post' | 'Local Delivery'
  tracking_awb?: string;
  expected_delivery?: string;
  admin_notes?: string;
  is_seen?: boolean;
  is_archived?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AbandonedCart {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  city?: string;
  items: OrderItem[];
  total: number;
  last_active: string;
  recovered?: boolean;
}

export interface RadarVisitor {
  id: string;
  name: string;
  phone?: string;
  city: string;
  state?: string;
  currentPage: string;
  pageTitle: string;
  timeOnPageSeconds: number;
  totalSessionSeconds: number;
  cartCount: number;
  cartTotal: number;
  cartItems?: { name: string; qty: number; price: number; emoji?: string }[];
  device: string;
  referrer: string;
  lastActive: string;
  ring: 1 | 2 | 3 | 4; // 1: >20m, 2: 10-20m, 3: 3-10m, 4: <3m
  angleDeg: number; // 0 - 360
  hasPhone: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  tags?: string[]; // e.g. 'VIP', 'Repeat Buyer', 'COD High Value'
  default_address?: string;
}

export interface AdminStats {
  today_revenue: number;
  today_orders_count: number;
  unfulfilled_orders_count: number;
  in_transit_count: number;
  delivered_count: number;
  pending_verification_count: number;
  in_flight_checkouts_count: number;
  total_customers_count: number;
}

