import { OrderItem, ShippingAddress } from './index';

export type OrderFulfillmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'        // Ready for Dispatch / Kitchen Packaging
  | 'packed'            // Packed & Ready for Delhivery Pickup
  | 'pickup_scheduled'  // Pickup Scheduled with Delhivery
  | 'picked_up'         // Picked Up by Delhivery Executive
  | 'shipped'           // In Transit with Delhivery
  | 'out_for_delivery'  // Out for Delivery (Local Hub)
  | 'delivered'         // Delivered Successfully
  | 'delivery_failed'   // Delivery Attempt Failed
  | 'ndr'               // Non-Delivery Report / Action Required
  | 'rto_initiated'     // Return to Origin Initiated
  | 'rto_delivered'     // Returned to Bangalore Warehouse
  | 'cancelled'         // Order or Shipment Cancelled
  | 'returned';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded' | 'pending_verification';
export type PaymentMethod = 'razorpay' | 'cod' | 'upi_direct' | 'manual';
export type DeliveryType = 'bangalore_local' | 'pan_india_courier' | 'express_air' | 'mangaluru_local';

export interface DelhiveryTrackingScan {
  scan_datetime?: string;
  scan_location?: string;
  status: string;
  status_type?: string;
  instructions?: string;
  time?: string;
  location?: string;
  details?: string;
}

export interface DelhiveryShipmentDetails {
  waybill: string;
  status: OrderFulfillmentStatus;
  status_description?: string;
  courier: 'Delhivery';
  service_type: 'Express' | 'Surface';
  origin_city: 'Bangalore';
  destination_city?: string;
  pickup_date?: string;
  expected_delivery?: string;
  routing_code?: string;
  label_url?: string;
  scans?: DelhiveryTrackingScan[];
  weight_grams?: number;
  chargeable_weight?: number;
  shipping_cost?: number;
}

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
  courier_partner?: string; // Exclusively 'Delhivery'
  tracking_awb?: string;
  tracking_number?: string;
  expected_delivery?: string;
  admin_notes?: string;
  delhivery_details?: DelhiveryShipmentDetails;
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

