import { NextResponse } from 'next/server';
import { getAllOrdersFromStore } from '@/lib/ordersStore';

export async function POST(req: Request) {
  try {
    const { orderId, contact } = await req.json();
    const cleanId = (orderId || '').trim().toUpperCase();
    const cleanContact = (contact || '').trim().toLowerCase();

    if (!cleanId && !cleanContact) {
      return NextResponse.json(
        { error: 'Please enter your Order ID or registered mobile number' },
        { status: 400 }
      );
    }

    const allOrders = await getAllOrdersFromStore();
    const matched = allOrders.filter((o) => {
      const idMatch =
        cleanId &&
        (o.id.toUpperCase().includes(cleanId) ||
          o.order_number.toUpperCase().includes(cleanId));

      const phoneDigits = cleanContact.replace(/\D/g, '');
      const orderPhoneDigits = (o.shipping_phone || '').replace(/\D/g, '');
      const contactMatch =
        cleanContact &&
        ((phoneDigits.length >= 8 && orderPhoneDigits.endsWith(phoneDigits.slice(-10))) ||
          (o.shipping_email && o.shipping_email.toLowerCase() === cleanContact));

      if (cleanId && cleanContact) {
        return idMatch || contactMatch;
      }
      return idMatch || contactMatch;
    });

    if (matched.length === 0) {
      return NextResponse.json(
        { error: 'No matching order found. Please check your Order ID or phone number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ orders: matched });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to look up order' }, { status: 500 });
  }
}

