import { NextResponse } from 'next/server';
import { checkPincodeServiceability, calculateDelhiveryShippingRate } from '@/lib/delhivery';
import { getStoreConfig } from '@/lib/storeData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get('pincode') || '';

    if (!pincode || pincode.trim().length !== 6) {
      return NextResponse.json(
        { error: 'Please provide a valid 6-digit Indian PIN code' },
        { status: 400 }
      );
    }

    const service = await checkPincodeServiceability(pincode);
    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to check serviceability' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pincode = body.pincode || body.destinationPincode || body.pin;
    const subtotal = body.subtotal ?? body.orderTotal ?? body.total ?? 0;
    const weightGrams = body.weightGrams ?? body.weight ?? 500;
    const paymentMethod = body.paymentMethod || 'razorpay';

    if (!pincode) {
      return NextResponse.json({ error: 'PIN code is required' }, { status: 400 });
    }

    const storeConfig = await getStoreConfig();
    const threshold = storeConfig.freeShippingThreshold || 499;

    const rateEstimate = await calculateDelhiveryShippingRate({
      pincode,
      orderSubtotal: Number(subtotal) || 0,
      weightGrams: Number(weightGrams) || 500,
      paymentMethod,
      freeShippingThreshold: threshold,
    });

    return NextResponse.json({ success: true, rate: rateEstimate });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to calculate shipping rate' },
      { status: 500 }
    );
  }
}
