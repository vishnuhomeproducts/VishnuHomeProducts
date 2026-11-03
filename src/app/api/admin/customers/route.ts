import { NextResponse } from 'next/server';
import { getCustomersDirectory } from '@/lib/ordersStore';

export async function GET() {
  try {
    const customers = await getCustomersDirectory();
    return NextResponse.json({ customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch customers' }, { status: 500 });
  }
}

