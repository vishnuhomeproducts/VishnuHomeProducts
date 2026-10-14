import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR', items, shipping } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    // Check if live Razorpay keys are configured
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || keyId.startsWith('rzp_test_placeholder') || !keySecret || keySecret.startsWith('razorpay_secret')) {
      // Return simulated mock order for development/demo
      const simulatedOrderId = 'order_sim_' + Math.random().toString(36).substring(2, 11);
      return NextResponse.json({
        order_id: simulatedOrderId,
        amount: Math.round(amount * 100),
        currency,
        simulated: true,
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      notes: {
        customer_name: shipping?.name || '',
        customer_email: shipping?.email || '',
        item_count: items?.length || 0,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
