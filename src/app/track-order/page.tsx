'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

const STATUS_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Bangalore Hub' },
  { key: 'packed', label: 'Packed & Labeled', desc: 'Delhivery AWB Generated' },
  { key: 'picked_up', label: 'Delhivery Picked Up', desc: 'Departed BLR Hub' },
  { key: 'in_transit', label: 'In Transit', desc: 'Delhivery Network' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Destination Courier' },
  { key: 'delivered', label: 'Delivered', desc: 'Delivered to Doorstep' },
];

function getStepIndex(status: string): number {
  switch (status) {
    case 'pending':
    case 'confirmed':
    case 'processing':
      return 0;
    case 'packed':
    case 'ready_for_dispatch':
      return 1;
    case 'pickup_scheduled':
    case 'picked_up':
    case 'shipped':
      return 2;
    case 'in_transit':
      return 3;
    case 'out_for_delivery':
      return 4;
    case 'delivered':
      return 5;
    default:
      return 0;
  }
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e?: React.FormEvent, presetId?: string) => {
    if (e) e.preventDefault();
    const targetId = presetId !== undefined ? presetId : orderId;
    setError('');
    setOrders([]);

    if (!targetId.trim() && !contact.trim()) {
      setError('Please enter your Order ID (e.g. VHP-90412) or registered mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: targetId, contact }),
      });
      const data = await res.json();
      if (!res.ok || !data.orders) {
        setError(data.error || 'No matching order found.');
      } else {
        setOrders(data.orders);
      }
    } catch (err) {
      setError('Unable to fetch tracking details right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brandBg pb-16">
      {/* Dramatic Crimson & Espresso Hero Header */}
      <div className="bg-gradient-to-br from-[#190d0c] via-[#2e1012] to-[#4c1216] text-white py-12 px-4 border-b border-white/10 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brandRed/25 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-amber-300/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Delhivery Express Live Tracking</span>
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Track Your Authentic Mangalorean Snacks Parcel
          </h1>
          <p className="text-xs sm:text-sm text-white/75 max-w-lg mx-auto">
            Dispatched from our Bangalore fulfillment hub exclusively via Delhivery Express. Enter your Order ID, Delhivery AWB, or mobile number.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 space-y-8 relative z-20">
        {/* Search Form Card */}
        <form
          onSubmit={(e) => handleTrack(e)}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-card space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-brandText mb-1.5">
                Order ID / Delhivery AWB
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. VHP-90412 or 12847921001"
                className="w-full px-4 py-3 bg-brandBg border border-brandBorder rounded-button font-mono uppercase text-brandText focus:outline-none focus:border-brandRed focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-brandText mb-1.5">
                Mobile Number or Email
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. 9845012345"
                className="w-full px-4 py-3 bg-brandBg border border-brandBorder rounded-button text-brandText focus:outline-none focus:border-brandRed focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Quick Demo Lookup Chips */}
          <div className="flex items-center gap-2 flex-wrap text-[11px]">
            <span className="text-brandText3 font-medium">Quick test lookup:</span>
            {['VHP-90412', 'VHP-90411', 'VHP-90410'].map((sampleId) => (
              <button
                key={sampleId}
                type="button"
                onClick={() => {
                  setOrderId(sampleId);
                  handleTrack(undefined, sampleId);
                }}
                className="px-2.5 py-1 rounded-full bg-brandAccent-light text-brandRed border border-red-200 font-mono font-bold hover:bg-brandRed hover:text-white transition-colors"
              >
                #{sampleId}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-brandRed font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-brandRed to-brandAccent-dark hover:from-red-600 hover:to-brandRed text-white font-bold text-xs sm:text-sm rounded-button shadow-lg inline-flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Checking Delhivery Live Radar...' : 'Track with Delhivery Express'}</span>
          </button>
        </form>

        {/* Results */}
        {orders.map((order) => {
          const activeStep = getStepIndex(order.status);
          const waybill =
            order.delhivery_details?.waybill || order.tracking_awb || order.tracking_number;
          const scans = order.delhivery_tracking?.scans || [];

          return (
            <div
              key={order.id}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-card space-y-6 animate-fadeIn"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brandBorder">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-extrabold text-lg text-brandRed">
                      #{order.order_number || order.id}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-brandGreen border border-emerald-200">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-brandText2 mt-1">
                    Placed on{' '}
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    • Origin: <span className="font-semibold text-brandText">Bangalore Hub (560038)</span> • Total Value:{' '}
                    <strong className="text-brandText font-price">{formatINR(order.total)}</strong>
                  </div>
                </div>

                {waybill ? (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] text-amber-900 uppercase font-bold flex items-center gap-1">
                        <Truck className="w-3 h-3 text-brandRed" />
                        <span>Delhivery Express AWB</span>
                      </div>
                      <div className="font-mono font-extrabold text-brandText text-sm">{waybill}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://www.delhivery.com/track/package/${waybill}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-brandRed text-white hover:bg-brandAccent-dark text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                        title="Live Tracking on Delhivery"
                      >
                        <span>Delhivery Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Packing fresh authentic Mangalore snacks at Bangalore kitchen</span>
                  </div>
                )}
              </div>

              {/* 6-Step Progress Timeline */}
              <div className="relative pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {STATUS_STEPS.map((step, index) => {
                    const completed = index <= activeStep;
                    return (
                      <div key={step.key} className="text-center space-y-1.5 relative z-10">
                        <div
                          className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            completed
                              ? 'bg-brandRed text-white shadow-md ring-4 ring-red-100'
                              : 'bg-brandBg text-brandText3 border border-brandBorder'
                          }`}
                        >
                          {completed ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </div>
                        <div
                          className={`text-[11px] font-bold leading-tight ${
                            completed ? 'text-brandText' : 'text-brandText3'
                          }`}
                        >
                          {step.label}
                        </div>
                        <div className="text-[9px] text-brandText3 hidden sm:block">{step.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Delhivery Scan Milestones if available */}
              {scans.length > 0 && (
                <div className="p-4 rounded-xl bg-gray-50 border border-brandBorder space-y-3">
                  <div className="text-xs font-bold text-brandText flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-brandRed" />
                    <span>Live Delhivery Transit Scans</span>
                  </div>
                  <div className="space-y-2 border-l-2 border-brandRed/30 pl-3">
                    {scans.map((scan: any, sIdx: number) => (
                      <div key={sIdx} className="text-xs text-brandText2">
                        <div className="font-semibold text-brandText">
                          {scan.status} - <span className="text-brandText3">{scan.location}</span>
                        </div>
                        <div className="text-[10px] text-brandText3 font-mono">
                          {new Date(scan.time).toLocaleString('en-IN')} • {scan.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-brandBorder text-xs">
                <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-2.5">
                  <div className="font-bold text-brandText flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-brandRed" />
                    <span>Items in Shipment</span>
                  </div>
                  <div className="space-y-1.5">
                    {(order.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-brandText2">
                        <span>
                          {item.emoji || '🫙'} <strong>{item.name}</strong> ({item.size}) × {item.qty}
                        </span>
                        <span className="font-bold text-brandText font-price">
                          {formatINR((item.unit_price || item.price || 120) * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-2">
                  <div className="font-bold text-brandText flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brandRed" />
                    <span>Delivery Destination</span>
                  </div>
                  <p className="text-brandText2 leading-relaxed">
                    <strong>{order.shipping_name}</strong> ({order.shipping_phone})
                    <br />
                    {order.shipping_address?.line1}
                    <br />
                    {order.shipping_address?.city}, {order.shipping_address?.state} -{' '}
                    <strong>{order.shipping_address?.pincode}</strong>
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Need Help Banner */}
        <div className="bg-white p-5 rounded-2xl border border-brandBorder flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brandGreen flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-brandText">Need Direct Dispatch Support?</div>
              <div className="text-brandText2">
                Our Bangalore fulfillment desk is available on WhatsApp from 9 AM to 8 PM IST.
              </div>
            </div>
          </div>
          <a
            href="https://wa.me/919845012345?text=Namaskara%20Vishnu%20Home%20Products!%20I%20need%20help%20tracking%20my%20order."
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-button bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-1.5 shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
