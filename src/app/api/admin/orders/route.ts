import { NextResponse } from 'next/server';
import { 
  getAllAdminOrders, 
  createOrderInStore, 
  updateOrderInStore, 
  archiveOrderInStore 
} from '@/lib/ordersStore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tab = searchParams.get('tab') || 'active'; // 'active' | 'pending' | 'archived'
    const delivery = searchParams.get('delivery') || 'all'; // 'all' | 'local' | 'courier'
    const q = searchParams.get('q')?.toLowerCase() || '';

    let orders = await getAllAdminOrders();

    // Tab filter
    if (tab === 'archived') {
      orders = orders.filter(o => o.is_archived);
    } else {
      orders = orders.filter(o => !o.is_archived);
      if (tab === 'pending') {
        orders = orders.filter(o => o.payment_status === 'unpaid' || o.payment_status === 'pending_verification');
      }
    }

    // Delivery sub-filter
    if (delivery === 'local') {
      orders = orders.filter(o => o.delivery_type === 'mangaluru_local');
    } else if (delivery === 'courier') {
      orders = orders.filter(o => o.delivery_type === 'pan_india_courier');
    }

    // Search query filter
    if (q) {
      orders = orders.filter(o => 
        o.order_number.toLowerCase().includes(q) ||
        o.shipping_name.toLowerCase().includes(q) ||
        o.shipping_phone.includes(q) ||
        o.shipping_address?.city?.toLowerCase().includes(q) ||
        o.shipping_address?.pincode?.includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Admin orders GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await createOrderInStore(body);
    return NextResponse.json({ success: true, order: created });
  } catch (error: any) {
    console.error('Admin orders POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const updated = await updateOrderInStore(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    console.error('Admin orders PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const success = await archiveOrderInStore(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Admin orders DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to archive order' }, { status: 500 });
  }
}

