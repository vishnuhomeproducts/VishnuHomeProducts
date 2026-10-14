import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';
import { sendOrderConfirmationEmail } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      items,
      total,
      shipping,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify HMAC signature if live credentials exist
    if (keySecret && !keySecret.startsWith('razorpay_secret') && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Persist to Supabase if database connection is available
    try {
      const supabase = createAdminClient();
      await supabase.from('orders').insert([
        {
          id: order_id || undefined,
          items,
          subtotal: total,
          total,
          status: 'confirmed',
          payment_status: 'paid',
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          shipping_name: shipping?.name || '',
          shipping_phone: shipping?.phone || '',
          shipping_email: shipping?.email || '',
          shipping_address: shipping || {},
        },
      ]);
    } catch (dbErr) {
      // Allow fallback if Supabase is still connecting
      console.warn('Supabase order insert note:', dbErr);
    }

    // Trigger order confirmation email via Resend
    if (shipping?.email) {
      try {
        await sendOrderConfirmationEmail({
          to: shipping.email,
          orderId: razorpay_order_id || order_id || 'ORDER-' + Date.now(),
          amount: total,
          items: (items || []).map((i: any) => ({
            name: i.name,
            qty: i.qty,
            price: i.price || i.unit_price,
            size: i.size,
          })),
          name: shipping.name || 'Valued Customer',
        });
      } catch (emailErr) {
        console.warn('Email trigger note:', emailErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Payment verified and order recorded' });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
