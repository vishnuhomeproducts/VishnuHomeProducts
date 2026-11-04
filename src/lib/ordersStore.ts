import { AdminOrder, CustomerProfile, AbandonedCart, AdminStats } from '@/types/admin';
import { createAdminClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

// Seed demo orders for Vishnu Home Products E-Commerce
const INITIAL_DEMO_ORDERS: AdminOrder[] = [
  {
    id: 'VHP-261044300001',
    order_number: 'VHP-261044300001',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    shipping_name: 'Pooja Hegde',
    shipping_phone: '9845012345',
    shipping_email: 'pooja.hegde@gmail.com',
    shipping_address: {
      name: 'Pooja Hegde',
      phone: '9845012345',
      email: 'pooja.hegde@gmail.com',
      line1: 'Flat 302, Sagar View Apts, Kadri Temple Road',
      line2: 'Near Mallikatte Circle',
      city: 'Mangaluru',
      state: 'Karnataka',
      pincode: '575002',
    },
    items: [
      { product_id: '1', name: 'Avakaya Mango Pickle', slug: 'avakaya-mango-pickle', size: '500g', qty: 2, unit_price: 180, emoji: '🥭' },
      { product_id: '4', name: 'Gongura Pickle (Andhra Style)', slug: 'gongura-pickle', size: '300g', qty: 1, unit_price: 130, emoji: '🌿' },
    ],
    subtotal: 490,
    delivery_fee: 0,
    discount: 49,
    total: 441,
    coupon_code: 'VISHNU10',
    status: 'processing',
    payment_status: 'paid',
    payment_method: 'razorpay',
    razorpay_order_id: 'order_Nx78921FaQ',
    razorpay_payment_id: 'pay_Nx78921KlpQ',
    delivery_type: 'mangaluru_local',
    courier_partner: 'Local Express (Porter)',
    expected_delivery: 'Today by 6:00 PM',
    admin_notes: 'Customer requested mild oil on top. Fresh batch packed.',
    is_seen: false,
    is_archived: false,
  },
  {
    id: 'VHP-261044300002',
    order_number: 'VHP-261044300002',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    shipping_name: 'Arjun Kamath',
    shipping_phone: '9980124567',
    shipping_email: 'arjun.kamath@outlook.com',
    shipping_address: {
      name: 'Arjun Kamath',
      phone: '9980124567',
      email: 'arjun.kamath@outlook.com',
      line1: 'B-704, Prestige Ozone, Whitefield Main Road',
      line2: 'Opp. Forum Value Mall',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
    items: [
      { product_id: '3', name: 'Tomato Thokku (Spicy)', slug: 'tomato-thokku', size: '500g', qty: 2, unit_price: 175, emoji: '🍅' },
      { product_id: '5', name: 'Byadgi Chilli Powder (Direct Cold Milled)', slug: 'byadgi-chilli-powder', size: '500g', qty: 1, unit_price: 210, emoji: '🌶️' },
      { product_id: '7', name: 'Sun-Dried Kundapura Mackerel (Bangude)', slug: 'kundapura-mackerel', size: '250g', qty: 2, unit_price: 260, emoji: '🐟' },
    ],
    subtotal: 1080,
    delivery_fee: 0,
    discount: 50,
    total: 1030,
    coupon_code: 'MANGALORE50',
    status: 'packed',
    payment_status: 'paid',
    payment_method: 'razorpay',
    razorpay_order_id: 'order_Nx88912ZzA',
    razorpay_payment_id: 'pay_Nx88912WwB',
    delivery_type: 'pan_india_courier',
    courier_partner: 'Delhivery Surface',
    tracking_awb: 'DLV9842104992',
    expected_delivery: 'Tomorrow, Nov 4',
    admin_notes: 'Fragile glass jar packaging done with bubble layer.',
    is_seen: true,
    is_archived: false,
  },
  {
    id: 'VHP-261044300003',
    order_number: 'VHP-261044300003',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    shipping_name: 'Dr. Shruti Nair',
    shipping_phone: '9820541298',
    shipping_email: 'shruti.nair@pediatrics.org',
    shipping_address: {
      name: 'Dr. Shruti Nair',
      phone: '9820541298',
      email: 'shruti.nair@pediatrics.org',
      line1: '14, Silver Arch, Nepeansea Road',
      line2: 'Behind Priyadarshini Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400006',
    },
    items: [
      { product_id: '2', name: 'Lime Pickle (Nimbu Ka Achaar)', slug: 'lime-pickle', size: '300g', qty: 2, unit_price: 110, emoji: '🍋' },
      { product_id: '9', name: 'Pure Wood-Pressed Sesame (Gingelly) Oil', slug: 'sesame-oil', size: '1 Litre', qty: 1, unit_price: 420, emoji: '🪔' },
      { product_id: '6', name: 'Mangalorean Bafat Powder (Special Roast)', slug: 'bafat-powder', size: '250g', qty: 2, unit_price: 140, emoji: '🍲' },
    ],
    subtotal: 920,
    delivery_fee: 60,
    discount: 0,
    total: 980,
    status: 'shipped',
    payment_status: 'paid',
    payment_method: 'razorpay',
    razorpay_order_id: 'order_Nx99021Klm',
    razorpay_payment_id: 'pay_Nx99021Opp',
    delivery_type: 'pan_india_courier',
    courier_partner: 'Blue Dart Air',
    tracking_awb: 'BLU773829104',
    expected_delivery: 'Nov 5, 2026',
    is_seen: true,
    is_archived: false,
  },
  {
    id: 'VHP-261044300004',
    order_number: 'VHP-261044300004',
    created_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    shipping_name: 'Raghavendra Rao',
    shipping_phone: '9448135790',
    shipping_email: 'raghu.rao@rediffmail.com',
    shipping_address: {
      name: 'Raghavendra Rao',
      phone: '9448135790',
      email: 'raghu.rao@rediffmail.com',
      line1: '#42, Anugraha, Sharavu Temple Cross',
      line2: 'Kodialbail',
      city: 'Mangaluru',
      state: 'Karnataka',
      pincode: '575003',
    },
    items: [
      { product_id: '1', name: 'Avakaya Mango Pickle', slug: 'avakaya-mango-pickle', size: '1kg', qty: 1, unit_price: 340, emoji: '🥭' },
      { product_id: '8', name: 'Crispy Dry Prawns (Sun Salted)', slug: 'dry-prawns', size: '200g', qty: 2, unit_price: 240, emoji: '🦐' },
    ],
    subtotal: 820,
    delivery_fee: 0,
    discount: 0,
    total: 820,
    status: 'pending',
    payment_status: 'unpaid',
    payment_method: 'cod',
    delivery_type: 'mangaluru_local',
    admin_notes: 'Customer selected COD. Phone call verification pending.',
    is_seen: false,
    is_archived: false,
  },
  {
    id: 'VHP-261044300005',
    order_number: 'VHP-261044300005',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    shipping_name: 'Meenakshi Sundaram',
    shipping_phone: '9840192837',
    shipping_email: 'meenakshi.s@tcs.com',
    shipping_address: {
      name: 'Meenakshi Sundaram',
      phone: '9840192837',
      email: 'meenakshi.s@tcs.com',
      line1: 'Villa 18, Emerald Enclave, OMR Road',
      line2: 'Navalur',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600130',
    },
    items: [
      { product_id: '4', name: 'Gongura Pickle (Andhra Style)', slug: 'gongura-pickle', size: '500g', qty: 3, unit_price: 195, emoji: '🌿' },
      { product_id: '3', name: 'Tomato Thokku (Spicy)', slug: 'tomato-thokku', size: '500g', qty: 2, unit_price: 175, emoji: '🍅' },
    ],
    subtotal: 935,
    delivery_fee: 0,
    discount: 50,
    total: 885,
    status: 'delivered',
    payment_status: 'paid',
    payment_method: 'razorpay',
    razorpay_order_id: 'order_Nx654321',
    razorpay_payment_id: 'pay_Nx654321',
    delivery_type: 'pan_india_courier',
    courier_partner: 'India Post Speed Post',
    tracking_awb: 'EK88472910IN',
    expected_delivery: 'Delivered on Nov 2',
    is_seen: true,
    is_archived: false,
  },
];

// In-flight pending checkouts (reconcile gateway)
const INITIAL_IN_FLIGHT_CARTS: AbandonedCart[] = [
  {
    id: 'cart-inf-101',
    customer_name: 'Vikas Shenoy',
    customer_phone: '9880199201',
    customer_email: 'vikas.shenoy@gmail.com',
    city: 'Udupi',
    items: [
      { product_id: '1', name: 'Avakaya Mango Pickle (500g)', slug: 'avakaya-mango-pickle', size: '500g', qty: 2, unit_price: 180 },
      { product_id: '7', name: 'Sun-Dried Kundapura Mackerel', slug: 'kundapura-mackerel', size: '250g', qty: 1, unit_price: 260 },
    ],
    total: 620,
    last_active: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    recovered: false,
  },
  {
    id: 'cart-inf-102',
    customer_name: 'Ananya Deshpande',
    customer_phone: '9769018422',
    customer_email: 'ananya.d@gmail.com',
    city: 'Pune',
    items: [
      { product_id: '3', name: 'Tomato Thokku (500g)', slug: 'tomato-thokku', size: '500g', qty: 1, unit_price: 175 },
      { product_id: '5', name: 'Byadgi Chilli Powder', slug: 'byadgi-chilli-powder', size: '500g', qty: 2, unit_price: 210 },
    ],
    total: 595,
    last_active: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    recovered: false,
  },
];

// Global in-memory cache for hot reloading & server execution
declare global {
  var __vishnu_admin_orders: AdminOrder[] | undefined;
  var __vishnu_in_flight_carts: AbandonedCart[] | undefined;
}

const DATA_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'vishnu_orders_cache.json')
  : path.join(process.cwd(), '.next', 'vishnu_orders_cache.json');

function loadPersistedOrders(): AdminOrder[] {
  if (global.__vishnu_admin_orders && global.__vishnu_admin_orders.length > 0) {
    return global.__vishnu_admin_orders;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__vishnu_admin_orders = parsed;
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }

  global.__vishnu_admin_orders = [...INITIAL_DEMO_ORDERS];
  return global.__vishnu_admin_orders;
}

function persistOrders(orders: AdminOrder[]) {
  global.__vishnu_admin_orders = orders;
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(orders, null, 2), 'utf8');
  } catch (e) {
    // ignore write errors
  }
}

export async function getAllAdminOrders(): Promise<AdminOrder[]> {
  // Only attempt Supabase if a real configured URL is provided
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // Map supabase rows to AdminOrder structure
      const dbOrders: AdminOrder[] = data.map((row: any) => ({
        id: row.id,
        order_number: row.id?.startsWith('VHP') ? row.id : `VHP-${row.id?.substring(0, 8)?.toUpperCase()}`,
        user_id: row.user_id,
        items: row.items || [],
        subtotal: Number(row.subtotal) || Number(row.total) || 0,
        delivery_fee: Number(row.delivery_fee) || 0,
        discount: Number(row.discount) || 0,
        total: Number(row.total) || 0,
        coupon_code: row.coupon_code,
        status: row.status || 'confirmed',
        payment_status: row.payment_status || 'paid',
        payment_method: row.razorpay_order_id ? 'razorpay' : 'cod',
        razorpay_order_id: row.razorpay_order_id,
        razorpay_payment_id: row.razorpay_payment_id,
        shipping_name: row.shipping_name || row.shipping_address?.name || 'Customer',
        shipping_phone: row.shipping_phone || row.shipping_address?.phone || '',
        shipping_email: row.shipping_email || row.shipping_address?.email || '',
        shipping_address: row.shipping_address || {},
        delivery_type: row.shipping_address?.city?.toLowerCase()?.includes('mangal') ? 'mangaluru_local' : 'pan_india_courier',
        courier_partner: row.courier_partner || 'Pending Courier Assignment',
        tracking_awb: row.tracking_awb || '',
        expected_delivery: row.expected_delivery || '',
        admin_notes: row.admin_notes || '',
        is_seen: true,
        is_archived: false,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      // Merge with demo orders if database only has 1 or 2
      const persisted = loadPersistedOrders();
      const existingIds = new Set(dbOrders.map(o => o.id));
      const merged = [...dbOrders, ...persisted.filter(o => !existingIds.has(o.id))];
        return merged;
      }
    } catch (e) {
      // fallback
    }
  }

  return loadPersistedOrders();
}

export async function createOrderInStore(orderData: Partial<AdminOrder>): Promise<AdminOrder> {
  const currentOrders = await getAllAdminOrders();

  const id = orderData.id || `VHP-${Date.now().toString().slice(-8)}`;
  const orderNumber = orderData.order_number || id;
  const isLocal = orderData.shipping_address?.city?.toLowerCase().includes('mangal') || false;

  const newOrder: AdminOrder = {
    id,
    order_number: orderNumber,
    user_id: orderData.user_id || null,
    items: orderData.items || [],
    subtotal: orderData.subtotal || orderData.total || 0,
    delivery_fee: orderData.delivery_fee || 0,
    discount: orderData.discount || 0,
    total: orderData.total || 0,
    coupon_code: orderData.coupon_code || '',
    status: orderData.status || (orderData.payment_method === 'cod' ? 'pending' : 'confirmed'),
    payment_status: orderData.payment_status || (orderData.payment_method === 'cod' ? 'unpaid' : 'paid'),
    payment_method: orderData.payment_method || 'cod',
    razorpay_order_id: orderData.razorpay_order_id,
    razorpay_payment_id: orderData.razorpay_payment_id,
    razorpay_signature: orderData.razorpay_signature,
    shipping_name: orderData.shipping_name || orderData.shipping_address?.name || 'Customer',
    shipping_phone: orderData.shipping_phone || orderData.shipping_address?.phone || '',
    shipping_email: orderData.shipping_email || orderData.shipping_address?.email || '',
    shipping_address: orderData.shipping_address || {
      name: orderData.shipping_name || '',
      phone: orderData.shipping_phone || '',
      email: orderData.shipping_email || '',
      line1: '',
      city: 'Mangaluru',
      state: 'Karnataka',
      pincode: '575001',
    },
    delivery_type: isLocal ? 'mangaluru_local' : 'pan_india_courier',
    courier_partner: isLocal ? 'Mangaluru Local Express' : 'India Post / Delhivery',
    tracking_awb: orderData.tracking_awb || '',
    expected_delivery: isLocal ? 'Within 24 Hours' : '3-5 Business Days',
    admin_notes: orderData.admin_notes || '',
    is_seen: false,
    is_archived: false,
    created_at: orderData.created_at || new Date().toISOString(),
  };

  const updated = [newOrder, ...currentOrders.filter(o => o.id !== id)];
  persistOrders(updated);

  // Also push to Supabase if valid URL configured
  if (supabaseUrl && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')) {
    try {
      const supabase = createAdminClient();
      await supabase.from('orders').insert([
        {
          id: newOrder.id,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.delivery_fee,
          discount: newOrder.discount,
          total: newOrder.total,
          coupon_code: newOrder.coupon_code,
          status: newOrder.status,
          payment_status: newOrder.payment_status,
          razorpay_order_id: newOrder.razorpay_order_id,
          razorpay_payment_id: newOrder.razorpay_payment_id,
          shipping_name: newOrder.shipping_name,
          shipping_phone: newOrder.shipping_phone,
          shipping_email: newOrder.shipping_email,
          shipping_address: newOrder.shipping_address,
        },
      ]);
    } catch (e) {
      // Non-fatal
    }
  }

  // Sync new orders to Google Sheets if configured
  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'new_order',
          timestamp: new Date().toISOString(),
          order_id: newOrder.id,
          customer_name: newOrder.shipping_name,
          customer_phone: newOrder.shipping_phone,
          customer_email: newOrder.shipping_email,
          city: newOrder.shipping_address?.city,
          pincode: newOrder.shipping_address?.pincode,
          items: newOrder.items.map(i => `${i.name} (${i.size || ''}) x${i.qty}`).join(', '),
          total: newOrder.total,
          payment_status: newOrder.payment_status,
          status: newOrder.status,
        }),
      }).catch(() => {});
    } catch (sheetErr) {
      // Non-blocking background sync
    }
  }

  return newOrder;
}

export async function updateOrderInStore(
  id: string,
  updates: Partial<AdminOrder>
): Promise<AdminOrder | null> {
  const currentOrders = await getAllAdminOrders();
  const index = currentOrders.findIndex(o => o.id === id);
  if (index === -1) return null;

  const updatedOrder = {
    ...currentOrders[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  currentOrders[index] = updatedOrder;
  persistOrders([...currentOrders]);

  // Attempt Supabase update if valid URL configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('placeholder') && !supabaseUrl.includes('your-project')) {
    try {
      const supabase = createAdminClient();
      await supabase.from('orders').update({
        status: updatedOrder.status,
        payment_status: updatedOrder.payment_status,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
    } catch (e) {
      // Non-fatal
    }
  }

  // Sync new orders to Google Sheets if configured
  if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'order_update',
          timestamp: new Date().toISOString(),
          order_id: updatedOrder.id,
          customer_name: updatedOrder.shipping_name,
          payment_status: updatedOrder.payment_status,
          status: updatedOrder.status,
          tracking_awb: updatedOrder.tracking_awb,
          admin_notes: updatedOrder.admin_notes,
        }),
      }).catch(() => {});
    } catch (sheetErr) {
      // Non-blocking background sync
    }
  }

  return updatedOrder;
}

export async function archiveOrderInStore(id: string): Promise<boolean> {
  const currentOrders = await getAllAdminOrders();
  const index = currentOrders.findIndex(o => o.id === id);
  if (index === -1) return false;

  currentOrders[index].is_archived = true;
  persistOrders([...currentOrders]);
  return true;
}

export async function getAbandonedCarts(): Promise<AbandonedCart[]> {
  if (!global.__vishnu_in_flight_carts) {
    global.__vishnu_in_flight_carts = [...INITIAL_IN_FLIGHT_CARTS];
  }
  return global.__vishnu_in_flight_carts;
}

export async function getCustomersDirectory(): Promise<CustomerProfile[]> {
  const orders = await getAllAdminOrders();
  const customerMap = new Map<string, CustomerProfile>();

  for (const order of orders) {
    const key = order.shipping_phone || order.shipping_email || order.shipping_name;
    if (!key) continue;

    const existing = customerMap.get(key);
    if (!existing) {
      customerMap.set(key, {
        id: `cust-${customerMap.size + 1}`,
        name: order.shipping_name,
        phone: order.shipping_phone,
        email: order.shipping_email,
        city: order.shipping_address?.city || 'Karnataka',
        state: order.shipping_address?.state || 'India',
        total_orders: 1,
        total_spent: order.total,
        last_order_date: order.created_at,
        tags: order.total > 1000 ? ['VIP Customer'] : ['Direct Shopper'],
        default_address: `${order.shipping_address?.line1 || ''}, ${order.shipping_address?.city || ''} - ${order.shipping_address?.pincode || ''}`,
      });
    } else {
      existing.total_orders += 1;
      existing.total_spent += order.total;
      if (new Date(order.created_at) > new Date(existing.last_order_date)) {
        existing.last_order_date = order.created_at;
      }
      if (existing.total_orders >= 2 && !existing.tags?.includes('Repeat Buyer')) {
        existing.tags = [...(existing.tags || []), 'Repeat Buyer'];
      }
    }
  }

  return Array.from(customerMap.values());
}

export async function getAdminStats(): Promise<AdminStats> {
  const orders = await getAllAdminOrders();
  const activeOrders = orders.filter(o => !o.is_archived);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = activeOrders.filter(o => o.created_at.startsWith(todayStr));

  const todayRevenue = todayOrders
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const unfulfilled = activeOrders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length;
  const inTransit = activeOrders.filter(o => ['packed', 'shipped', 'out_for_delivery'].includes(o.status)).length;
  const delivered = activeOrders.filter(o => o.status === 'delivered').length;
  const pendingVerification = activeOrders.filter(o => o.payment_status === 'unpaid' || o.payment_status === 'pending_verification').length;

  const inFlight = (await getAbandonedCarts()).filter(c => !c.recovered).length;
  const customers = await getCustomersDirectory();

  return {
    today_revenue: todayRevenue > 0 ? todayRevenue : 1471, // Demo fallback figure
    today_orders_count: todayOrders.length > 0 ? todayOrders.length : 2,
    unfulfilled_orders_count: unfulfilled,
    in_transit_count: inTransit,
    delivered_count: delivered,
    pending_verification_count: pendingVerification,
    in_flight_checkouts_count: inFlight,
    total_customers_count: customers.length,
  };
}

