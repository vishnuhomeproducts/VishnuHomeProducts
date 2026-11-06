import { NextResponse } from 'next/server';
import { updateOrderStatusInStore, getAllOrdersFromStore } from '@/lib/ordersStore';
import { OrderFulfillmentStatus } from '@/types/admin';

// Map Delhivery status codes to our standard 12-stage shipping lifecycle
function mapDelhiveryStatus(rawStatus: string): OrderFulfillmentStatus {
  const s = (rawStatus || '').toUpperCase().trim();
  if (s.includes('DL') || s.includes('DELIVERED')) return 'delivered';
  if (s.includes('OFD') || s.includes('OUT FOR DELIVERY')) return 'out_for_delivery';
  if (s.includes('IT') || s.includes('IN TRANSIT') || s.includes('DISPATCHED')) return 'shipped';
  if (s.includes('PU') || s.includes('PICKED UP')) return 'picked_up';
  if (s.includes('SCHEDULED')) return 'pickup_scheduled';
  if (s.includes('MANIFEST') || s.includes('MANIFESTED')) return 'packed';
  if (s.includes('NDR') || s.includes('UNDELIVERED') || s.includes('FAILED')) return 'delivery_failed';
  if (s.includes('RTO-INIT') || s.includes('RTO INITIATED')) return 'rto_initiated';
  if (s.includes('RTO-DEL') || s.includes('RTO DELIVERED')) return 'rto_delivered';
  if (s.includes('CANCEL') || s.includes('CANCELLED')) return 'cancelled';
  return 'shipped';
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const waybill = rawBody?.waybill || rawBody?.AWB || rawBody?.ShipmentData?.[0]?.Shipment?.AWB;
    const statusText =
      rawBody?.status ||
      rawBody?.Status?.Status ||
      rawBody?.ShipmentData?.[0]?.Shipment?.Status?.Status ||
      '';

    if (!waybill) {
      return NextResponse.json({ error: 'Missing waybill identifier' }, { status: 400 });
    }

    const allOrders = await getAllOrdersFromStore();
    const targetOrder = allOrders.find(
      (o) =>
        (o.tracking_awb && o.tracking_awb.trim() === waybill.trim()) ||
        (o.order_number && rawBody?.order && o.order_number === rawBody.order)
    );

    if (targetOrder) {
      const mappedStatus = mapDelhiveryStatus(statusText);
      await updateOrderStatusInStore(targetOrder.id, mappedStatus, {
        courier_partner: 'Delhivery',
        admin_notes: `Delhivery webhook sync: ${statusText} at ${new Date().toISOString()}`,
      });

      return NextResponse.json({
        success: true,
        orderId: targetOrder.id,
        waybill,
        status: mappedStatus,
      });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed; no order match found.' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Webhook processing failed' }, { status: 500 });
  }
}
