import { NextResponse } from 'next/server';
import { getRazorpayInstance, RAZORPAY_KEY_ID, getRazorpaySecret } from '@/lib/razorpay';
import { getAllProducts } from '@/lib/productsStore';
import { calculateDeliveryFee } from '@/lib/delivery';
import { validateStoreCoupon } from '@/lib/storeData';
import { calculateTieredUnitPrice } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR', items, shipping, coupon_code } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart must contain at least one item' }, { status: 400 });
    }

    // 1. Pincode Evaluation & Validation
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

    // 2. Authoritative Server Pricing Verification (Price Tampering Defense)
    const catalogProducts = await getAllProducts();
    let verifiedSubtotal = 0;
    for (const item of items) {
      const product = catalogProducts.find(
        (p) => p.id === item.product_id || p.slug === item.slug || p.name === item.name
      );

      if (product) {
        const sizeOption = product.sizes.find(
          (s) => s.label?.toLowerCase() === (item.size || '').toLowerCase()
        ) || product.sizes[0];
        const qty = Math.max(1, Number(item.qty) || 1);
        const basePrice = sizeOption ? sizeOption.price : (item.price || item.unit_price || 0);
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

    const clientDeliveryFee = typeof shipping?.delivery_fee === 'number' ? shipping.delivery_fee : undefined;
    const { fee: verifiedDeliveryFee, deliveryType } = calculateDeliveryFee(pincode, verifiedSubtotal, clientDeliveryFee);
    
    // Calculate coupon discount against live store coupons
    let verifiedDiscount = 0;
    if (coupon_code) {
      const couponResult = await validateStoreCoupon(String(coupon_code), verifiedSubtotal);
      if (couponResult.valid) {
        verifiedDiscount = couponResult.discountAmount;
      }
    }

    const verifiedTotal = Math.max(0, verifiedSubtotal + verifiedDeliveryFee - verifiedDiscount);

    // If client total deviates by more than ₹2 from verified server total, reject the request!
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

    // Check if live Razorpay keys are configured
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || RAZORPAY_KEY_ID;
    const keySecret = getRazorpaySecret();

    if (!keyId || keyId.startsWith('rzp_test_placeholder') || !keySecret || keySecret.startsWith('razorpay_secret')) {
      // Return simulated mock order for development/demo
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
      amount: Math.round(verifiedTotal * 100), // Amount in paise
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
