import { NextResponse } from 'next/server';
import { trackDelhiveryShipment, createDelhiveryShipment, requestDelhiveryPickup } from '@/lib/delhivery';
import { updateOrderStatusInStore, getOrderByIdFromStore } from '@/lib/ordersStore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get('waybill') || searchParams.get('awb') || '';

    if (!waybill) {
      return NextResponse.json({ error: 'Waybill / AWB is required' }, { status: 400 });
    }

    const tracking = await trackDelhiveryShipment(waybill);
    return NextResponse.json({ success: true, tracking });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to track package' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, orderId, pickupDate, pickupTime, packageCount } = body;

    // Action 1: Book Shipment
    if (action === 'book') {
      const order = await getOrderByIdFromStore(orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (order.tracking_awb && order.tracking_awb.startsWith('DLV')) {
        return NextResponse.json({
          success: true,
          message: 'Shipment already booked with Delhivery',
          waybill: order.tracking_awb,
          order,
        });
      }

      const booking = await createDelhiveryShipment(order);
      if (booking.success) {
        const updated = await updateOrderStatusInStore(orderId, 'packed', {
          courier_partner: 'Delhivery',
          tracking_awb: booking.waybill,
          expected_delivery: booking.pickup_scheduled_date,
          admin_notes: `Shipment booked with Delhivery. Routing Code: ${booking.routing_code}`,
        });

        return NextResponse.json({ success: true, booking, order: updated });
      }

      return NextResponse.json({ error: booking.error || 'Failed to book Delhivery shipment' }, { status: 500 });
    }

    // Action 2: Schedule Warehouse Pickup
    if (action === 'pickup') {
      const pickupResult = await requestDelhiveryPickup({
        pickupDate: pickupDate || new Date().toISOString().slice(0, 10),
        pickupTime: pickupTime || '14:00:00',
        expectedPackages: Number(packageCount) || 1,
      });

      return NextResponse.json({ success: true, pickup: pickupResult });
    }

    return NextResponse.json({ error: 'Invalid shipping action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Shipment operation failed' }, { status: 500 });
  }
}
