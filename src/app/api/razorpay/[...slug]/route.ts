import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRazorpayInstance, RAZORPAY_KEY_ID, getRazorpaySecret } from '@/lib/razorpay';
import { getAllProducts } from '@/lib/productsStore';
import { calculateDeliveryFee } from '@/lib/delivery';
import { validateStoreCoupon } from '@/lib/storeData';
import { calculateTieredUnitPrice } from '@/lib/utils';
import { createAdminClient } from '@/lib/supabase/server';
import { sendOrderConfirmationEmail } from '@/lib/resend';

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug?.[0];

  // 1. Create Razorpay Order: /api/razorpay/create-order
  if (action === 'create-order') {
    try {
      const { amount, currency = 'INR', items, shipping, coupon_code } = await req.json();

      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'Cart must contain at least one item' }, { status: 400 });
      }

      // Pincode Evaluation & Validation
      const pincode = shipping?.pincode ? String(shipping.pincode).trim() : '';
      if (pincode) {
        const isSixDigits = /^\d{6}$/.test(pincode);
        if (!isSixDigits) {
          return NextResponse.json(
            { error: `Invalid pincode '${pincode}'. Must be a 6-digit Indian postal code.` },
            { status: 400 }
          );
        }
      }

      // Authoritative Server Pricing Verification
      const catalogProducts = await getAllProducts();
      let verifiedSubtotal = 0;
      for (const item of items) {
        const product = catalogProducts.find(
          (p) => p.id === item.product_id || p.slug === item.slug || p.name === item.name
        );

        if (product) {
          const sizeOption =
            product.sizes.find(
              (s) => s.label?.toLowerCase() === (item.size || '').toLowerCase()
            ) || product.sizes[0];
          const qty = Math.max(1, Number(item.qty) || 1);
          const basePrice = sizeOption ? sizeOption.price : item.price || item.unit_price || 0;
          const { unitPrice: canonicalPrice } = calculateTieredUnitPrice(
            basePrice,
            qty,
            product.tiered_price_type,
            product.tiered_price_slabs
          );
          verifiedSubtotal += canonicalPrice * qty;
        } else {
          verifiedSubtotal += (item.price || item.unit_price || 0) * (item.qty || 1);
        }
      }

      const clientDeliveryFee =
        typeof shipping?.delivery_fee === 'number' ? shipping.delivery_fee : undefined;
      const { fee: verifiedDeliveryFee, deliveryType } = calculateDeliveryFee(
        pincode,
        verifiedSubtotal,
        clientDeliveryFee
      );

      let verifiedDiscount = 0;
      if (coupon_code) {
        const couponResult = await validateStoreCoupon(String(coupon_code), verifiedSubtotal);
        if (couponResult.valid) {
          verifiedDiscount = couponResult.discountAmount;
        }
      }

      const verifiedTotal = Math.max(0, verifiedSubtotal + verifiedDeliveryFee - verifiedDiscount);

      if (Math.abs(amount - verifiedTotal) > 2) {
        return NextResponse.json(
          {
            error: `Order total mismatch: Screen total was ₹${amount}, but verified server total is ₹${verifiedTotal}`,
            verifiedTotal,
            verifiedSubtotal,
            verifiedDeliveryFee,
          },
          { status: 400 }
        );
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || RAZORPAY_KEY_ID;
      const keySecret = getRazorpaySecret();

      if (
        !keyId ||
        keyId.startsWith('rzp_test_placeholder') ||
        !keySecret ||
        keySecret.startsWith('razorpay_secret')
      ) {
        const simulatedOrderId = 'order_sim_' + Math.random().toString(36).substring(2, 11);
        return NextResponse.json({
          order_id: simulatedOrderId,
          key_id: keyId,
          amount: Math.round(verifiedTotal * 100),
          currency,
          deliveryType,
          verifiedTotal,
          simulated: true,
        });
      }

      const options = {
        amount: Math.round(verifiedTotal * 100),
        currency,
        receipt: `rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          customer_name: shipping?.name || '',
          customer_email: shipping?.email || '',
          item_count: items?.length || 0,
          delivery_type: deliveryType,
        },
      };

      const razorpayClient = getRazorpayInstance();
      const order = await razorpayClient.orders.create(options);

      return NextResponse.json({
        order_id: order.id,
        key_id: keyId,
        amount: order.amount,
        currency: order.currency,
        deliveryType,
        verifiedTotal,
      });
    } catch (error: any) {
      console.error('Razorpay create-order error:', error);
      return NextResponse.json(
        { error: error?.message || 'Failed to create payment order' },
        { status: 500 }
      );
    }
  }

  // 2. Verify Razorpay Payment: /api/razorpay/verify
  if (action === 'verify') {
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

      const keySecret = getRazorpaySecret();

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

      const appOrderId = order_id || `VHP-${Date.now().toString().slice(-8)}`;
      try {
        const { createOrderInStore } = await import('@/lib/ordersStore');
        await createOrderInStore({
          id: appOrderId,
          order_number: appOrderId,
          items,
          subtotal: total,
          total,
          status: 'confirmed',
          payment_status: 'paid',
          payment_method: 'razorpay',
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          shipping_name: shipping?.name || '',
          shipping_phone: shipping?.phone || '',
          shipping_email: shipping?.email || '',
          shipping_address: shipping || {},
        });
      } catch (storeErr) {
        console.warn('Store order insert note:', storeErr);
      }

      try {
        const supabase = createAdminClient();
        await supabase.from('orders').insert([
          {
            id: appOrderId,
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
        console.warn('Supabase order insert note:', dbErr);
      }

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

      return NextResponse.json({
        success: true,
        app_order_id: appOrderId,
        message: 'Payment verified and order recorded',
      });
    } catch (error: any) {
      console.error('Payment verification error:', error);
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}

