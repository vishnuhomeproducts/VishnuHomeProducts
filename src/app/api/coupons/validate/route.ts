import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const VALID_COUPONS = [
  {
    code: 'VISHNU10',
    discount_type: 'percent' as const,
    discount_value: 10,
    min_order: 0,
  },
  {
    code: 'MANGALORE50',
    discount_type: 'fixed' as const,
    discount_value: 50,
    min_order: 499,
  },
  {
    code: 'FESTIVE15',
    discount_type: 'percent' as const,
    discount_value: 15,
    min_order: 799,
  },
];

export async function POST(req: Request) {
  try {
    const { code, subtotal = 0 } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Check Supabase if configured
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', normalizedCode)
        .eq('active', true)
        .single();

      if (data && !error) {
        if (data.min_order && subtotal < data.min_order) {
          return NextResponse.json(
            { error: `Minimum order amount of ₹${data.min_order} required for this coupon` },
            { status: 400 }
          );
        }
        return NextResponse.json({
          coupon: {
            code: data.code,
            discount_type: data.discount_type,
            discount_value: Number(data.discount_value),
            min_order: Number(data.min_order || 0),
          },
        });
      }
    } catch (e) {
      // Fallback to static coupon verification
    }

    // Static verify
    const matched = VALID_COUPONS.find((c) => c.code === normalizedCode);
    if (!matched) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (matched.min_order && subtotal < matched.min_order) {
      return NextResponse.json(
        { error: `Minimum order amount of ₹${matched.min_order} required for this coupon` },
        { status: 400 }
      );
    }

    return NextResponse.json({ coupon: matched });
  } catch (error) {
    return NextResponse.json({ error: 'Server error validating coupon' }, { status: 500 });
  }
}
