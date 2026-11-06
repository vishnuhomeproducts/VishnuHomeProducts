import { NextResponse } from 'next/server';
import { getOrderByIdFromStore, updateOrderStatusInStore, getAllOrdersFromStore } from '@/lib/ordersStore';
import {
  BANGALORE_WAREHOUSE_CONFIG,
  checkPincodeServiceability,
  calculateDelhiveryShippingRate,
} from '@/lib/delhivery';
import { getStoreConfig } from '@/lib/storeData';
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

export async function GET(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug?.[0] || '';

  // 1. Label Generation Route: /api/delhivery/label
  if (action === 'label') {
    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get('waybill') || 'DLV8891204891';
    const orderId = searchParams.get('orderId') || '';

    let order: any = null;
    if (orderId) {
      order = await getOrderByIdFromStore(orderId);
    }

    const recipientName = order?.shipping_name || 'Valued Customer';
    const recipientPhone = order?.shipping_phone || '+91 98450 XXXXX';
    const addressLine1 = order?.shipping_address?.line1 || 'Customer Address';
    const addressLine2 = order?.shipping_address?.line2 || '';
    const city = order?.shipping_address?.city || 'Bangalore';
    const state = order?.shipping_address?.state || 'Karnataka';
    const pincode = order?.shipping_address?.pincode || '560054';
    const paymentMode = order?.payment_method === 'cod' ? `COD: ₹${order?.total || 0}` : 'PREPAID';
    const routingCode = `BLR/IND/${pincode.slice(0, 3)}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Delhivery Shipping Label - ${waybill}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; color: #111; background: #f9fafb; }
    .label-box { max-width: 480px; margin: 0 auto; background: #fff; border: 2px solid #000; padding: 18px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 12px; }
    .brand { font-size: 18px; font-weight: 800; }
    .courier { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
    .barcode-area { text-align: center; padding: 14px 0; border-bottom: 2px dashed #000; }
    .barcode { font-family: monospace; font-size: 32px; letter-spacing: 5px; font-weight: bold; background: #eee; padding: 6px; display: inline-block; }
    .awb-text { font-size: 13px; font-weight: bold; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px 0; border-bottom: 2px solid #000; }
    .address-section { font-size: 11px; line-height: 1.4; }
    .address-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #555; margin-bottom: 3px; }
    .routing-banner { display: flex; justify-content: space-between; align-items: center; background: #000; color: #fff; padding: 8px 12px; margin-top: 12px; font-weight: bold; font-size: 14px; }
    .footer-notes { font-size: 10px; color: #666; margin-top: 10px; text-align: center; }
    @media print {
      body { background: #fff; padding: 0; }
      .label-box { box-shadow: none; border: 2px solid #000; page-break-after: always; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 480px; margin: 0 auto 12px auto; text-align: right;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #c81d25; color: #fff; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">
      🖨️ Print Label
    </button>
  </div>

  <div class="label-box">
    <div class="header">
      <div>
        <div class="brand">VISHNU HOME PRODUCTS</div>
        <div style="font-size: 11px; color: #555;">Authentic Mangalore Delicacies</div>
      </div>
      <div style="text-align: right;">
        <div class="courier">DELHIVERY</div>
        <div style="font-size: 10px; font-weight: bold; color: #16a34a;">SURFACE EXPRESS</div>
      </div>
    </div>

    <div class="barcode-area">
      <div class="barcode">||| | |||| ||| |||| | |||</div>
      <div class="awb-text">AWB: ${waybill}</div>
    </div>

    <div class="grid">
      <div class="address-section">
        <div class="address-title">SHIP TO (CONSIGNEE):</div>
        <strong>${recipientName}</strong><br/>
        ${addressLine1}<br/>
        ${addressLine2 ? addressLine2 + '<br/>' : ''}
        ${city}, ${state} - <strong>${pincode}</strong><br/>
        Phone: ${recipientPhone}
      </div>

      <div class="address-section">
        <div class="address-title">DISPATCH ORIGIN (SHIPPER):</div>
        <strong>${BANGALORE_WAREHOUSE_CONFIG.name}</strong><br/>
        ${BANGALORE_WAREHOUSE_CONFIG.address}<br/>
        ${BANGALORE_WAREHOUSE_CONFIG.city}, ${BANGALORE_WAREHOUSE_CONFIG.state} - <strong>${BANGALORE_WAREHOUSE_CONFIG.pincode}</strong><br/>
        Phone: ${BANGALORE_WAREHOUSE_CONFIG.phone}
      </div>
    </div>

    <div style="padding: 10px 0; font-size: 12px; display: flex; justify-content: space-between;">
      <div><strong>Order ID:</strong> ${order?.order_number || orderId || 'MANUAL-DISPATCH'}</div>
      <div><strong>Mode:</strong> ${paymentMode}</div>
    </div>

    <div class="routing-banner">
      <div>DESTINATION: ${pincode}</div>
      <div>HUB: ${routingCode}</div>
    </div>

    <div class="footer-notes">
      Official Delhivery Domestic Express Consignment • Keep Glass & Ceramic Jars Upright<br/>
      If undelivered, return to: 347, 8th Main Road, Phase 2 Gokula Stage 1, Bangalore, Karnataka - 560054
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  // 2. Serviceability / Shipping Rate Route: /api/delhivery/shipping or /api/delhivery/serviceability
  if (action === 'shipping' || action === 'serviceability') {
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

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string[] } }
) {
  const action = params.slug?.[0] || '';

  // 1. Webhook Route: /api/delhivery/webhook
  if (action === 'webhook') {
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

  // 2. Shipping Rate Calculator: /api/delhivery/shipping
  if (action === 'shipping' || action === 'rate') {
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

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
}
