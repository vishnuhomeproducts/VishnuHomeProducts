import { NextResponse } from 'next/server';
import { getStoreConfig, updateStoreConfig } from '@/lib/storeData';

export async function GET() {
  try {
    const settings = await getStoreConfig();
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = await updateStoreConfig(body);
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save settings' }, { status: 500 });
  }
}

