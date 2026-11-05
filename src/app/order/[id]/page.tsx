'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  MapPin,
  ArrowRight,
  Printer,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Gift,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '@/lib/utils';
import { Order } from '@/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#c81d25', '#f59e0b', '#15803d', '#ffffff'],
      });
    } catch (e) {}

    const loadOrder = async () => {
      try {
        const orders = JSON.parse(localStorage.getItem('vishnu-orders') || '[]');
        const found = orders.find((o: any) => o.id === orderId);
        if (found) {
          setOrder(found);
        }

        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setOrder(data.order);
          }
        }
      } catch (e) {}
    };

    loadOrder();
  }, [orderId]);

  const waMessage = encodeURIComponent(
    `Namaskara Vishnu Home Products! 🙏\nI have just placed Order *#${orderId}*${
      order ? ` for *${formatINR(order.total)}*` : ''
    }.\nPlease share live dispatch updates on my WhatsApp!`
  );

  return (
    <div className="min-h-screen bg-brandBg pb-16">
      {/* Celebratory Heritage Banner */}
      <div className="bg-gradient-to-br from-[#190d0c] via-[#311113] to-[#521318] text-white py-12 px-4 border-b border-white/10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brandRed/25 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/40 border border-emerald-300/40">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-amber-300/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Confirmed · Mangalore Kitchen Notified</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Dhanyavadagalu! Thank You for Your Order
          </h1>

          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
            Your order <strong className="text-amber-300 font-mono">#{orderId}</strong> has been received by our Mangalore home kitchen and is being freshly prepared &amp; vacuum-sealed for dispatch.
          </p>

          {/* Quick Action Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/track-order`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-brandRed hover:bg-brandAccent-mid text-white text-xs font-bold shadow-lg transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Shipment</span>
            </Link>

            <a
              href={`https://wa.me/919845012345?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get Updates on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-button bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 space-y-6 relative z-20">
        {/* Live 4-Step Order Progress Card */}
        <div className="bg-white p-6 rounded-2xl border border-brandBorder shadow-card space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brandText uppercase tracking-wider">
              Live Kitchen &amp; Dispatch Timeline
            </span>
            <span className="text-brandGreen font-bold">Est. Delivery: 2–4 Business Days</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { label: 'Order Confirmed', sub: 'Completed', active: true },
              { label: 'Kitchen Packing', sub: 'In Progress', active: true },
              { label: 'Courier Picked', sub: 'Within 24h', active: false },
              { label: 'Delivered', sub: 'Doorstep', active: false },
            ].map((step, i) => (
              <div key={step.label} className="text-center space-y-1">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                    step.active
                      ? 'bg-brandRed text-white shadow-sm'
                      : 'bg-brandBg text-brandText3 border border-brandBorder'
                  }`}
                >
                  {step.active ? '✓' : i + 1}
                </div>
                <div className="text-[11px] font-bold text-brandText">{step.label}</div>
                <div className="text-[10px] text-brandText3">{step.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {order && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brandBorder">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="VISHNU" className="h-7 w-auto object-contain" />
                <div>
                  <div className="font-bold text-sm text-brandText flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-brandRed" />
                    <span>Official Order Summary</span>
                  </div>
                  <div className="text-[11px] text-brandText3 font-mono">Order ID: #{orderId}</div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-brandGreen border border-emerald-200 text-xs font-bold uppercase">
                {order.payment_status === 'paid' ? '✓ Paid Online' : 'Cash on Delivery'}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-brandBorder">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-brandAccent-light border border-red-200/60 flex items-center justify-center text-2xl shrink-0">
                      {item.emoji || '🫙'}
                    </div>
                    <div>
                      <div className="font-bold text-brandText text-sm">{item.name}</div>
                      <div className="text-[11px] text-brandText2">
                        Jar Size: <strong>{item.size}</strong> × Qty: <strong>{item.qty}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="font-extrabold text-brandText font-price text-sm">
                    {formatINR((item.unit_price || 120) * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-2 pt-4 border-t border-brandBorder text-xs text-brandText2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-price font-semibold text-brandText">{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping &amp; Packaging</span>
                <span className="font-price font-semibold text-brandGreen">
                  {order.delivery_fee === 0 ? 'FREE' : formatINR(order.delivery_fee)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brandGreen font-bold">
                  <span>Promo Savings</span>
                  <span className="font-price">-{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-brandText pt-3 border-t border-brandBorder">
                <span>Total Order Value</span>
                <span className="text-brandRed font-price text-lg">{formatINR(order.total)}</span>
              </div>
            </div>

            {/* Delivery address snippet */}
            {order.shipping_address && (
              <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-brandText">
                  <MapPin className="w-4 h-4 text-brandRed" />
                  <span>Delivery Destination</span>
                </div>
                <p className="text-brandText2 leading-relaxed pl-5">
                  <strong>{order.shipping_name}</strong> ({order.shipping_phone})
                  <br />
                  {order.shipping_address.line1}
                  {order.shipping_address.line2 && `, ${order.shipping_address.line2}`}
                  <br />
                  {order.shipping_address.city}, {order.shipping_address.state} -{' '}
                  <strong>{order.shipping_address.pincode}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Order Repeat Reward Card */}
        <div className="bg-gradient-to-r from-[#fff4f2] to-[#fffbeb] p-6 rounded-2xl border border-amber-300/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brandRed text-white flex items-center justify-center shrink-0 shadow-md">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-brandRed">
                VIP Patron Reward Unlocked
              </div>
              <div className="text-sm font-bold text-brandText">
                Get 10% OFF your next order with code <span className="font-mono underline text-brandRed">VISHNU10</span>
              </div>
              <div className="text-[11px] text-brandText2">
                Share the taste of Mangalore with friends &amp; family!
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brandRed hover:bg-brandAccent-dark text-white font-bold text-xs rounded-button shadow-md shrink-0 transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
