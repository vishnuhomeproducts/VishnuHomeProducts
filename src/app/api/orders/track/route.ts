import { NextResponse } from 'next/server';
import { getAllOrdersFromStore } from '@/lib/ordersStore';
import { trackDelhiveryShipment } from '@/lib/delhivery';

export async function POST(req: Request) {
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
          (o.tracking_number && o.tracking_number.toUpperCase().includes(cleanId)) ||
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

    // Enhance matched orders with live Delhivery tracking if waybill is present
    const enrichedOrders = await Promise.all(
      matched.map(async (order) => {
        const waybill = order.delhivery_details?.waybill || order.tracking_awb || order.tracking_number;
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
          } catch {
            // Keep fallback
          }
        }
        return {
          ...order,
          courier_partner: 'Delhivery Express',
        };
      })
    );

    return NextResponse.json({ orders: enrichedOrders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 });
  }
}

