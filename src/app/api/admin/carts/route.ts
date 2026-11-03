import { NextResponse } from 'next/server';
import { getAbandonedCarts } from '@/lib/ordersStore';

export async function GET() {
  try {
    const carts = await getAbandonedCarts();
    return NextResponse.json({ carts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch carts' }, { status: 500 });
  }
}

