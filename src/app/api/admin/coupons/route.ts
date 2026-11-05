import { NextResponse } from 'next/server';
import {
  getAllCoupons,
  createOrUpdateCoupon,
  toggleCouponActive,
  deleteCouponByCode,
} from '@/lib/storeData';

export async function GET() {
  try {
    const coupons = await getAllCoupons();
    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load coupons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }
    const coupons = await createOrUpdateCoupon({
      code: body.code,
      discount_type: body.discount_type || body.type || 'percent',
      discount_value: Number(body.discount_value ?? body.value ?? 10),
      min_order: Number(body.min_order ?? 0),
      active: body.active !== undefined ? Boolean(body.active) : true,
      description: body.description || '',
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save coupon' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }
    const coupons = await toggleCouponActive(code);
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to toggle coupon' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }
    const coupons = await deleteCouponByCode(code);
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete coupon' }, { status: 500 });
  }
}

