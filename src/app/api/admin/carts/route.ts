import { NextResponse } from 'next/server';
import { getAbandonedCarts, upsertAbandonedCart } from '@/lib/ordersStore';

export async function GET() {
  try {
    const carts = await getAbandonedCarts();
    return NextResponse.json({ carts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch carts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id) {
      return NextResponse.json({ error: 'Cart session ID required' }, { status: 400 });
    }
    const carts = await upsertAbandonedCart(body);
    return NextResponse.json({ success: true, carts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to sync cart' }, { status: 500 });
  }
}
