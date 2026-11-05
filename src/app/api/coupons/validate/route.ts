import { NextResponse } from 'next/server';
import { getAllCoupons, validateStoreCoupon } from '@/lib/storeData';

export async function GET() {
  try {
    const coupons = await getAllCoupons();
    const activeCoupons = coupons.filter((c) => c.active);
    return NextResponse.json({ coupons: activeCoupons });
  } catch (error) {
    return NextResponse.json({ coupons: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { code, subtotal = 0 } = await req.json();
    const result = await validateStoreCoupon(code, Number(subtotal) || 0);

    if (!result.valid || !result.coupon) {
      return NextResponse.json(
        { error: result.error || 'Invalid or expired coupon code' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      coupon: {
        code: result.coupon.code,
        discount_type: result.coupon.discount_type,
        discount_value: result.coupon.discount_value,
        min_order: result.coupon.min_order,
      },
      discountAmount: result.discountAmount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error validating coupon' }, { status: 500 });
  }
}
