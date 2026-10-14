'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, Truck, MapPin, ArrowRight, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '@/lib/utils';
import { Order } from '@/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d97706', '#f59e0b', '#16a34a', '#c0182b'],
      });
    } catch (e) {
      // ignore
    }

    // Retrieve order details from localStorage if available
    try {
      const orders = JSON.parse(localStorage.getItem('vishnu-orders') || '[]');
      const found = orders.find((o: any) => o.id === orderId);
      if (found) {
        setOrder(found);
      }
    } catch (e) {
      // ignore
    }
  }, [orderId]);

  return (
    <div className="py-12 bg-brandBg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        
        {/* Success Card */}
        <div className="bg-white p-8 rounded-2xl border border-brandBorder shadow-lg text-center space-y-4">
          
          <div className="w-16 h-16 rounded-full bg-brandAccent-light text-brandAccent flex items-center justify-center mx-auto text-3xl shadow-sm animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-brandAccent" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brandGreen">
              Payment & Order Verified
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
              Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-brandText2">
              Thank you for supporting authentic homemade flavours. Your order is being packed in Mangalore.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-brandBg border border-brandBorder inline-flex flex-wrap items-center justify-center gap-4 text-xs">
            <div>
              <span className="text-brandText3">Order ID: </span>
              <strong className="text-brandText font-mono font-bold">{orderId}</strong>
            </div>
            <div className="w-px h-4 bg-brandBorder hidden sm:block" />
            <div className="flex items-center gap-1.5 text-brandGreen font-medium">
              <Truck className="w-4 h-4" />
              <span>Est. Delivery: <strong>3–5 Business Days</strong></span>
            </div>
          </div>

        </div>

        {/* Order Details & Summary Card */}
        {order && (
          <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-brandBorder">
              <div className="flex items-center gap-2 font-bold text-sm text-brandText">
                <PackageCheck className="w-4 h-4 text-brandAccent" />
                <span>Order Summary</span>
              </div>

              <button
                onClick={() => window.print()}
                className="text-xs text-brandText3 hover:text-brandText flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>

            {/* Items */}
            <div className="divide-y divide-brandBorder">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-brandAccent-light flex items-center justify-center text-xl shrink-0">
                      {item.emoji || '🫙'}
                    </div>
                    <div>
                      <div className="font-semibold text-brandText">{item.name}</div>
                      <div className="text-[11px] text-brandText3">Size: {item.size} × Qty: {item.qty}</div>
                    </div>
                  </div>

                  <div className="font-bold text-brandText">
                    {formatINR((item.unit_price || 120) * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 pt-3 border-t border-brandBorder text-xs text-brandText2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.delivery_fee === 0 ? 'FREE' : formatINR(order.delivery_fee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brandGreen font-medium">
                  <span>Discount</span>
                  <span>-{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-brandText pt-2 border-t border-brandBorder">
                <span>Total Amount Paid</span>
                <span className="text-brandAccent">{formatINR(order.total)}</span>
              </div>
            </div>

            {/* Delivery address snippet */}
            {order.shipping_address && (
              <div className="pt-4 border-t border-brandBorder space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-brandText">
                  <MapPin className="w-3.5 h-3.5 text-brandAccent" />
                  <span>Delivering to:</span>
                </div>
                <p className="text-brandText2 pl-5">
                  <strong>{order.shipping_name}</strong> ({order.shipping_phone})
                  <br />
                  {order.shipping_address.line1}
                  {order.shipping_address.line2 && `, ${order.shipping_address.line2}`}
                  <br />
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Continue Shopping CTA */}
        <div className="text-center pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold text-sm rounded-button shadow-md transition-all active:scale-[0.98]"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
