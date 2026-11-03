import { NextResponse } from 'next/server';
import { createOrderInStore } from '@/lib/ordersStore';

export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain items' }, { status: 400 });
    }

    const savedOrder = await createOrderInStore(orderData);
    return NextResponse.json({ success: true, order: savedOrder });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save order' }, { status: 500 });
  }
}

