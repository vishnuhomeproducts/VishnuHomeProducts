import { NextResponse } from 'next/server';
import { getAllAdminOrders } from '@/lib/ordersStore';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const orders = await getAllAdminOrders();
    const order = orders.find(o => o.id === id || o.order_number === id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch order' }, { status: 500 });
  }
}

