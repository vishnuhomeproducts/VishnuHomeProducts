import { NextResponse } from 'next/server';
import {
  getAllAdminOrders,
  getAllOrdersFromStore,
  createOrderInStore,
} from '@/lib/ordersStore';
import { getAllProducts } from '@/lib/productsStore';
import { calculateDeliveryFee } from '@/lib/delivery';
import { validateStoreCoupon, incrementCouponUse } from '@/lib/storeData';
import { calculateTieredUnitPrice } from '@/lib/utils';
import { trackDelhiveryShipment } from '@/lib/delhivery';

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  try {
    const id = params.slug?.[0];
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const orders = await getAllAdminOrders();
    const order = orders.find(
      (o) =>
        o.id.toLowerCase() === id.toLowerCase() ||
        o.order_number.toLowerCase() === id.toLowerCase()
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch order' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug?.[0];

  // 1. Order Creation: /api/orders/create
  if (action === 'create') {
    try {
      const orderData = await req.json();

      if (!orderData || !orderData.items || orderData.items.length === 0) {
        return NextResponse.json({ error: 'Order must contain items' }, { status: 400 });
      }

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

  // 2. Order Live Tracking: /api/orders/track
  if (action === 'track') {
    try {
      const { orderId, contact } = await req.json();
      const cleanId = (orderId || '').trim().toUpperCase();
      const cleanContact = (contact || '').trim().toLowerCase();

      if (!cleanId && !cleanContact) {
        return NextResponse.json(
          { error: 'Please enter your Order ID, Delhivery AWB, or registered mobile number' },
          { status: 400 }
        );
      }

      const allOrders = await getAllOrdersFromStore();
      const matched = allOrders.filter((o) => {
        const idMatch =
          cleanId &&
          (o.id.toUpperCase().includes(cleanId) ||
            o.order_number.toUpperCase().includes(cleanId) ||
            (o.tracking_awb && o.tracking_awb.toUpperCase().includes(cleanId)) ||
            (o.delhivery_details?.waybill && o.delhivery_details.waybill.toUpperCase().includes(cleanId)));

        const phoneDigits = cleanContact.replace(/\D/g, '');
        const orderPhoneDigits = (o.shipping_phone || '').replace(/\D/g, '');
        const contactMatch =
          cleanContact &&
          ((phoneDigits.length >= 8 && orderPhoneDigits.endsWith(phoneDigits.slice(-10))) ||
            (o.shipping_email && o.shipping_email.toLowerCase() === cleanContact));

        return idMatch || contactMatch;
      });

      if (matched.length === 0) {
        return NextResponse.json(
          { error: 'No matching order found. Please check your Order ID, Delhivery AWB, or phone number.' },
          { status: 404 }
        );
      }

      const enrichedOrders = await Promise.all(
        matched.map(async (order) => {
          const waybill = order.delhivery_details?.waybill || order.tracking_awb;
          if (waybill) {
            try {
              const trackResult = await trackDelhiveryShipment(waybill);
              if (trackResult && trackResult.scans && trackResult.scans.length > 0) {
                return {
                  ...order,
                  courier_partner: 'Delhivery Express',
                  delhivery_tracking: trackResult,
                };
              }
            } catch {}
          }
          return {
            ...order,
            courier_partner: 'Delhivery Express',
          };
        })
      );

      return NextResponse.json({ orders: enrichedOrders });
    } catch {
      return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}

