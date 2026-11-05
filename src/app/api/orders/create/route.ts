import { NextResponse } from 'next/server';
import { createOrderInStore } from '@/lib/ordersStore';
import { getAllProducts } from '@/lib/productsStore';
import { calculateDeliveryFee } from '@/lib/delivery';
import { validateStoreCoupon, incrementCouponUse } from '@/lib/storeData';
import { calculateTieredUnitPrice } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain items' }, { status: 400 });
    }

    // Authoritative Server-Side Price & Coupon Calculation (including Tiered Price Slabs)
    const catalogProducts = await getAllProducts();
    let verifiedSubtotal = 0;

    const verifiedItems = orderData.items.map((item: any) => {
      const product = catalogProducts.find(
        (p) => p.id === item.product_id || p.slug === item.slug || p.name === item.name
      );
      const qty = Math.max(1, Number(item.qty) || 1);
      let unitPrice = Number(item.unit_price ?? item.price ?? 120);
      if (product) {
        const sizeOption =
          product.sizes.find(
            (s) => s.label?.toLowerCase() === String(item.size || '').toLowerCase()
          ) || product.sizes[0];
        if (sizeOption) {
          const { unitPrice: tieredPrice } = calculateTieredUnitPrice(
            sizeOption.price,
            qty,
            product.tiered_price_type,
            product.tiered_price_slabs
          );
          unitPrice = tieredPrice;
        }
      }
      verifiedSubtotal += unitPrice * qty;
      return {
        ...item,
        qty,
        unit_price: unitPrice,
      };
    });

    const pincode = orderData.shipping_address?.pincode || '';
    const { fee: verifiedDeliveryFee } = calculateDeliveryFee(
      pincode,
      verifiedSubtotal,
      orderData.delivery_fee
    );

    let verifiedDiscount = 0;
    if (orderData.coupon_code) {
      const couponResult = await validateStoreCoupon(
        String(orderData.coupon_code),
        verifiedSubtotal
      );
      if (couponResult.valid) {
        verifiedDiscount = couponResult.discountAmount;
        await incrementCouponUse(orderData.coupon_code).catch(() => {});
      }
    }

    const verifiedTotal = Math.max(
      0,
      verifiedSubtotal + verifiedDeliveryFee - verifiedDiscount
    );

    const savedOrder = await createOrderInStore({
      ...orderData,
      items: verifiedItems,
      subtotal: verifiedSubtotal,
      delivery_fee: verifiedDeliveryFee,
      discount: verifiedDiscount,
      total: verifiedTotal,
    });

    return NextResponse.json({ success: true, order: savedOrder });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save order' },
      { status: 500 }
    );
  }
}
