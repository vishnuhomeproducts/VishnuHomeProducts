import { NextResponse } from 'next/server';
import { getOrderByIdFromStore } from '@/lib/ordersStore';
import { BANGALORE_WAREHOUSE_CONFIG } from '@/lib/delhivery';

export async function GET(req: Request) {
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
        <div style="font-size: 10px; color: #555;">Authentic Mangalorean Heritage Foods</div>
      </div>
      <div class="courier">DELHIVERY</div>
    </div>

    <div class="barcode-area">
      <div class="barcode">||| | |||| || ||| ||||</div>
      <div class="awb-text">AWB: ${waybill}</div>
    </div>

    <div class="routing-banner">
      <span>${routingCode}</span>
      <span>${paymentMode}</span>
    </div>

    <div class="grid">
      <div class="address-section">
        <div class="address-title">Ship To (Customer):</div>
        <strong>${recipientName}</strong><br>
        ${addressLine1}<br>
        ${addressLine2 ? `${addressLine2}<br>` : ''}
        ${city}, ${state} - <strong>${pincode}</strong><br>
        Ph: ${recipientPhone}
      </div>

      <div class="address-section" style="border-left: 1px solid #ddd; padding-left: 10px;">
        <div class="address-title">Shipped From (Central Warehouse Hub):</div>
        <strong>${BANGALORE_WAREHOUSE_CONFIG.name}</strong><br>
        ${BANGALORE_WAREHOUSE_CONFIG.address}<br>
        ${BANGALORE_WAREHOUSE_CONFIG.city}, ${BANGALORE_WAREHOUSE_CONFIG.state} - <strong>${BANGALORE_WAREHOUSE_CONFIG.pincode}</strong><br>
        Ph: ${BANGALORE_WAREHOUSE_CONFIG.phone}
      </div>
    </div>

    <div style="font-size: 11px; padding: 10px 0; border-bottom: 1px solid #000; display: flex; justify-content: space-between;">
      <div>Order: <strong>${order?.order_number || orderId || 'VHP-ORDER'}</strong></div>
      <div>Item Qty: <strong>${order?.items?.reduce((s: number, i: any) => s + (i.qty || 1), 0) || 1} Jars</strong></div>
      <div>FSSAI: <strong>21223181000014</strong></div>
    </div>

    <div class="footer-notes">
      Official Delhivery Domestic Express Consignment • Keep Glass & Ceramic Jars Upright
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
