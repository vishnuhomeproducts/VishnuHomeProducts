import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/server';

export interface StoreCoupon {
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order: number;
  uses: number;
  active: boolean;
  description?: string;
}

export interface ProductReview {
  id: string;
  product_id?: string;
  product_slug?: string;
  product_name: string;
  customer_name: string;
  city: string;
  rating: number;
  comment: string;
  created_at: string;
  approved: boolean;
  verified_buyer: boolean;
}

export interface CustomerQuery {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'Delivery Query' | 'Product Inquiry' | 'Bulk / Wholesale' | 'Order Support';
  message: string;
  status: 'Open' | 'Answered' | 'Resolved';
  reply?: string;
  created_at: string;
}

export interface StoreConfig {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  gstin: string;
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  codEnabled: boolean;
  announcementText: string;
  promoCode: string;
  promoSubtext: string;
  flashSaleActive: boolean;
  shippingPolicy?: string;
  refundPolicy?: string;
  bulkOrderNote?: string;
}

interface PersistedStoreData {
  coupons: StoreCoupon[];
  reviews: ProductReview[];
  queries: CustomerQuery[];
  settings: StoreConfig;
}

const DEFAULT_SETTINGS: StoreConfig = {
  storeName: 'Vishnu Home Products',
  storePhone: '+91 98450 12345',
  storeEmail: 'orders@vishnuhome.in',
  gstin: '29AAAAA0000A1Z5',
  freeShippingThreshold: 499,
  standardDeliveryFee: 50,
  codEnabled: true,
  announcementText: 'Free shipping on orders above ₹499',
  promoCode: 'VISHNU10',
  promoSubtext: 'for 10% off your order',
  flashSaleActive: true,
  shippingPolicy:
    'Mangaluru local orders are delivered within 24 hours. Pan-India orders are dispatched within 24–48 hours via Delhivery, Blue Dart, or Speed Post in leak-proof vacuum-sealed packaging.',
  refundPolicy:
    '100% Damage-Free Replacement Guarantee: If any jar is damaged or leaked in transit, share an unboxing photo on WhatsApp within 24 hours of delivery for a free replacement or full refund.',
  bulkOrderNote:
    'We offer up to 30% wholesale discount on Wedding Thamboolam 150g return-gift jars and 5kg catering buckets.',
};

const DEFAULT_COUPONS: StoreCoupon[] = [
  {
    code: 'VISHNU10',
    discount_type: 'percent',
    discount_value: 10,
    min_order: 0,
    uses: 38,
    active: true,
    description: 'Flat 10% OFF on all orders',
  },
  {
    code: 'MANGALORE50',
    discount_type: 'fixed',
    discount_value: 50,
    min_order: 499,
    uses: 64,
    active: true,
    description: '₹50 OFF on orders above ₹499',
  },
  {
    code: 'FESTIVE15',
    discount_type: 'percent',
    discount_value: 15,
    min_order: 799,
    uses: 19,
    active: true,
    description: '15% Festive Discount on orders above ₹799',
  },
  {
    code: 'WELCOME100',
    discount_type: 'fixed',
    discount_value: 100,
    min_order: 999,
    uses: 12,
    active: true,
    description: '₹100 OFF on orders above ₹999',
  },
];

const DEFAULT_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    product_slug: 'mango-pickle',
    product_name: 'Avakaya Mango Pickle',
    customer_name: 'Dr. Shruti Nair',
    city: 'Mumbai',
    rating: 5,
    comment:
      'The spice level and mustard flavour is exactly like my grandmother made in Mangalore. Very authentic and zero preservative taste!',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    approved: true,
    verified_buyer: true,
  },
  {
    id: 'rev-2',
    product_slug: 'kundapura-dry-mackerel',
    product_name: 'Sun-Dried Kundapura Mackerel',
    customer_name: 'Girish Shenoy',
    city: 'Bengaluru',
    rating: 5,
    comment:
      'Extremely fresh and cleaned properly. Vacuum packed neatly with no smell in transit, crisp and delicious when fried.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    approved: true,
    verified_buyer: true,
  },
  {
    id: 'rev-3',
    product_slug: 'tomato-thokku',
    product_name: 'Tomato Thokku',
    customer_name: 'Deepa Hegde',
    city: 'Udupi',
    rating: 5,
    comment:
      'Goes amazing with hot curd rice, chapatis, and dosas. My kids love it in their tiffin box. Ordering the 500g jar next!',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    approved: true,
    verified_buyer: true,
  },
  {
    id: 'rev-4',
    product_slug: 'country-garlic-thokku',
    product_name: 'Country Garlic Thokku',
    customer_name: 'Karthik Kamath',
    city: 'Mangaluru',
    rating: 5,
    comment:
      'Pure gingelly oil aroma hits you the moment you open the seal. Authentic coastal homemade preparation.',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    approved: true,
    verified_buyer: true,
  },
];

const DEFAULT_QUERIES: CustomerQuery[] = [
  {
    id: 'q-1',
    name: 'Rohan Shetty',
    phone: '9845112233',
    email: 'rohan.shetty@gmail.com',
    type: 'Delivery Query',
    message: 'Can you deliver 4 jars of Tomato Thokku by Thursday evening in Mangalore Kadri?',
    status: 'Resolved',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'q-2',
    name: 'Kavitha Pai',
    phone: '9980554433',
    email: 'kavitha.pai@yahoo.com',
    type: 'Product Inquiry',
    message: 'Is the Kundapura Mackerel cleaned and salted using sea salt?',
    status: 'Answered',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

declare global {
  var __vishnu_store_data: PersistedStoreData | undefined;
}

const STORE_DATA_FILE = process.env.VERCEL
  ? path.join('/tmp', 'vishnu_store_data.json')
  : path.join(process.cwd(), '.next', 'vishnu_store_data.json');

function loadStoreData(): PersistedStoreData {
  if (global.__vishnu_store_data) {
    return global.__vishnu_store_data;
  }

  try {
    if (fs.existsSync(STORE_DATA_FILE)) {
      const raw = fs.readFileSync(STORE_DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.coupons)) {
        global.__vishnu_store_data = {
          coupons: parsed.coupons,
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [...DEFAULT_REVIEWS],
          queries: Array.isArray(parsed.queries) ? parsed.queries : [...DEFAULT_QUERIES],
          settings: parsed.settings ? { ...DEFAULT_SETTINGS, ...parsed.settings } : { ...DEFAULT_SETTINGS },
        };
        return global.__vishnu_store_data;
      }
    }
  } catch (e) {
    // Ignore file read errors
  }

  global.__vishnu_store_data = {
    coupons: [...DEFAULT_COUPONS],
    reviews: [...DEFAULT_REVIEWS],
    queries: [...DEFAULT_QUERIES],
    settings: { ...DEFAULT_SETTINGS },
  };
  return global.__vishnu_store_data;
}

function saveStoreData(data: PersistedStoreData) {
  global.__vishnu_store_data = data;
  try {
    const dir = path.dirname(STORE_DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    // Ignore file write errors
  }
}

// ================= COUPONS =================

export async function getAllCoupons(): Promise<StoreCoupon[]> {
  const store = loadStoreData();
  return store.coupons;
}

export async function createOrUpdateCoupon(coupon: Omit<StoreCoupon, 'uses'> & { uses?: number }): Promise<StoreCoupon[]> {
  const store = loadStoreData();
  const code = coupon.code.trim().toUpperCase();
  const existingIdx = store.coupons.findIndex((c) => c.code === code);

  const normalized: StoreCoupon = {
    code,
    discount_type: coupon.discount_type,
    discount_value: Number(coupon.discount_value) || 10,
    min_order: Number(coupon.min_order) || 0,
    uses: existingIdx >= 0 ? store.coupons[existingIdx].uses : (coupon.uses || 0),
    active: coupon.active !== undefined ? Boolean(coupon.active) : true,
    description: coupon.description || '',
  };

  if (existingIdx >= 0) {
    store.coupons[existingIdx] = normalized;
  } else {
    store.coupons.unshift(normalized);
  }

  saveStoreData(store);
  return store.coupons;
}

export async function toggleCouponActive(code: string): Promise<StoreCoupon[]> {
  const store = loadStoreData();
  const normalized = code.trim().toUpperCase();
  store.coupons = store.coupons.map((c) =>
    c.code === normalized ? { ...c, active: !c.active } : c
  );
  saveStoreData(store);
  return store.coupons;
}

export async function deleteCouponByCode(code: string): Promise<StoreCoupon[]> {
  const store = loadStoreData();
  const normalized = code.trim().toUpperCase();
  store.coupons = store.coupons.filter((c) => c.code !== normalized);
  saveStoreData(store);
  return store.coupons;
}

export async function incrementCouponUse(code: string): Promise<void> {
  const store = loadStoreData();
  const normalized = code.trim().toUpperCase();
  store.coupons = store.coupons.map((c) =>
    c.code === normalized ? { ...c, uses: (c.uses || 0) + 1 } : c
  );
  saveStoreData(store);
}

export async function validateStoreCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; coupon?: StoreCoupon; discountAmount: number; error?: string }> {
  const normalizedCode = (code || '').trim().toUpperCase();
  if (!normalizedCode) {
    return { valid: false, discountAmount: 0, error: 'Coupon code is required' };
  }

  // 1. Check Supabase if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', normalizedCode)
        .eq('active', true)
        .single();

      if (data && !error) {
        const minOrder = Number(data.min_order || 0);
        if (minOrder > 0 && subtotal < minOrder) {
          return {
            valid: false,
            discountAmount: 0,
            error: `Minimum order amount of ₹${minOrder} required for ${normalizedCode}`,
          };
        }
        const couponObj: StoreCoupon = {
          code: data.code,
          discount_type: data.discount_type,
          discount_value: Number(data.discount_value),
          min_order: minOrder,
          uses: Number(data.uses || 0),
          active: true,
        };
        const discountAmount =
          couponObj.discount_type === 'percent'
            ? Math.round((subtotal * couponObj.discount_value) / 100)
            : Math.min(couponObj.discount_value, subtotal);

        return { valid: true, coupon: couponObj, discountAmount };
      }
    } catch (e) {
      // Fallback to local store
    }
  }

  // 2. Check persisted StoreCoupons
  const coupons = await getAllCoupons();
  const matched = coupons.find((c) => c.code === normalizedCode && c.active);

  if (!matched) {
    return { valid: false, discountAmount: 0, error: 'Invalid or expired coupon code' };
  }

  if (matched.min_order > 0 && subtotal < matched.min_order) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Minimum order amount of ₹${matched.min_order} required for this coupon`,
    };
  }

  const discountAmount =
    matched.discount_type === 'percent'
      ? Math.round((subtotal * matched.discount_value) / 100)
      : Math.min(matched.discount_value, subtotal);

  return { valid: true, coupon: matched, discountAmount };
}

// ================= REVIEWS =================

export async function getAllReviews(onlyApproved = false, productSlug?: string): Promise<ProductReview[]> {
  const store = loadStoreData();
  let list = [...store.reviews];
  if (onlyApproved) {
    list = list.filter((r) => r.approved);
  }
  if (productSlug) {
    list = list.filter(
      (r) =>
        r.product_slug?.toLowerCase() === productSlug.toLowerCase() ||
        r.product_name.toLowerCase().includes(productSlug.replace(/-/g, ' ').toLowerCase())
    );
  }
  return list;
}

export async function addProductReview(
  review: Omit<ProductReview, 'id' | 'created_at' | 'approved' | 'verified_buyer'> & {
    approved?: boolean;
    verified_buyer?: boolean;
  }
): Promise<ProductReview> {
  const store = loadStoreData();
  const newReview: ProductReview = {
    id: 'rev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    product_id: review.product_id,
    product_slug: review.product_slug,
    product_name: review.product_name || 'Vishnu Home Product',
    customer_name: review.customer_name.trim(),
    city: (review.city || 'India').trim(),
    rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
    comment: review.comment.trim(),
    created_at: new Date().toISOString(),
    approved: review.approved !== undefined ? review.approved : true,
    verified_buyer: review.verified_buyer !== undefined ? review.verified_buyer : true,
  };
  store.reviews.unshift(newReview);
  saveStoreData(store);
  return newReview;
}

export async function toggleReviewApproval(id: string): Promise<ProductReview[]> {
  const store = loadStoreData();
  store.reviews = store.reviews.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r));
  saveStoreData(store);
  return store.reviews;
}

export async function deleteReviewById(id: string): Promise<ProductReview[]> {
  const store = loadStoreData();
  store.reviews = store.reviews.filter((r) => r.id !== id);
  saveStoreData(store);
  return store.reviews;
}

// ================= QUERIES =================

export async function getAllQueries(): Promise<CustomerQuery[]> {
  const store = loadStoreData();
  return store.queries;
}

export async function addCustomerQuery(
  query: Omit<CustomerQuery, 'id' | 'created_at' | 'status'>
): Promise<CustomerQuery> {
  const store = loadStoreData();
  const newQuery: CustomerQuery = {
    id: 'q-' + Date.now(),
    name: query.name.trim(),
    phone: query.phone.trim(),
    email: query.email?.trim() || '',
    type: query.type || 'Product Inquiry',
    message: query.message.trim(),
    status: 'Open',
    created_at: new Date().toISOString(),
  };
  store.queries.unshift(newQuery);
  saveStoreData(store);
  return newQuery;
}

export async function updateCustomerQueryStatus(
  id: string,
  status: CustomerQuery['status'],
  reply?: string
): Promise<CustomerQuery[]> {
  const store = loadStoreData();
  store.queries = store.queries.map((q) =>
    q.id === id ? { ...q, status, reply: reply !== undefined ? reply : q.reply } : q
  );
  saveStoreData(store);
  return store.queries;
}

// ================= STORE SETTINGS =================

export async function getStoreConfig(): Promise<StoreConfig> {
  const store = loadStoreData();
  return store.settings || DEFAULT_SETTINGS;
}

export async function updateStoreConfig(patch: Partial<StoreConfig>): Promise<StoreConfig> {
  const store = loadStoreData();
  store.settings = {
    ...(store.settings || DEFAULT_SETTINGS),
    ...patch,
  };
  saveStoreData(store);
  return store.settings;
}


