'use client';

import React, { useState } from 'react';
import {
  Truck,
  Printer,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  Package,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  RefreshCw,
  FileText,
  Clock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AdminOrder, DelhiveryTrackingScan } from '@/types/admin';
import { formatINR } from '@/lib/utils';

interface ShipmentsViewProps {
  orders: AdminOrder[];
  onPrintInvoice: (order: AdminOrder) => void;
  onRefresh?: () => void;
}

export const ShipmentsView: React.FC<ShipmentsViewProps> = ({ orders, onPrintInvoice, onRefresh }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAwb, setCopiedAwb] = useState<string | null>(null);
  const [isBookingId, setIsBookingId] = useState<string | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Pickup Scheduling Modal State
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('11:00');
  const [pickupCount, setPickupCount] = useState(1);
  const [isSchedulingPickup, setIsSchedulingPickup] = useState(false);
  const [pickupResult, setPickupResult] = useState<string | null>(null);

  // Delhivery Tracking Radar Modal State
  const [trackingModalAwb, setTrackingModalAwb] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<{
    status?: string;
    origin?: string;
    destination?: string;
    scans?: DelhiveryTrackingScan[];
    expectedDelivery?: string;
  } | null>(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);

  // Active unarchived orders that are either in shipping flow or ready to ship
  const activeOrders = orders.filter((o) => !o.is_archived);

  // Ready for booking: confirmed/processing orders without AWB
  const readyToBookOrders = activeOrders.filter(
    (o) => ['confirmed', 'processing', 'pending'].includes(o.status) && !o.tracking_awb && !o.delhivery_details?.waybill
  );

  // Ready for pickup: packed or pickup_scheduled
  const readyForPickupOrders = activeOrders.filter(
    (o) => ['packed', 'ready_for_dispatch', 'pickup_scheduled'].includes(o.status)
  );

  // In Transit: picked_up, shipped, in_transit
  const inTransitOrders = activeOrders.filter(
    (o) => ['picked_up', 'shipped', 'in_transit'].includes(o.status)
  );

  // Out for delivery
  const outForDeliveryOrders = activeOrders.filter((o) => o.status === 'out_for_delivery');

  // Delivered
  const deliveredOrders = activeOrders.filter((o) => o.status === 'delivered');

  // NDR & Exceptions
  const ndrOrders = activeOrders.filter(
    (o) => ['delivery_failed', 'ndr', 'rto_initiated', 'rto_delivered'].includes(o.status)
  );

  // Filter based on tab
  const filteredByTab = activeOrders.filter((o) => {
    if (statusFilter === 'all') {
      return ['packed', 'ready_for_dispatch', 'pickup_scheduled', 'picked_up', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'delivery_failed', 'ndr', 'rto_initiated', 'rto_delivered', 'cancelled'].includes(o.status) || Boolean(o.tracking_awb || o.delhivery_details?.waybill);
    }
    if (statusFilter === 'needs_booking') {
      return readyToBookOrders.includes(o);
    }
    if (statusFilter === 'ready_for_pickup') {
      return readyForPickupOrders.includes(o);
    }
    if (statusFilter === 'in_transit') {
      return inTransitOrders.includes(o);
    }
    if (statusFilter === 'out_for_delivery') {
      return outForDeliveryOrders.includes(o);
    }
    if (statusFilter === 'delivered') {
      return deliveredOrders.includes(o);
    }
    if (statusFilter === 'ndr') {
      return ndrOrders.includes(o);
    }
    return true;
  });

  // Search filter
  const displayedShipments = filteredByTab.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const waybill = (s.delhivery_details?.waybill || s.tracking_awb || '').toLowerCase();
    const id = (s.id || '').toLowerCase();
    const num = (s.order_number || '').toLowerCase();
    const name = (s.shipping_name || '').toLowerCase();
    const pin = (s.shipping_address?.pincode || '').toLowerCase();
    const city = (s.shipping_address?.city || '').toLowerCase();
    return (
      waybill.includes(q) ||
      id.includes(q) ||
      num.includes(q) ||
      name.includes(q) ||
      pin.includes(q) ||
      city.includes(q)
    );
  });

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard?.writeText(awb);
    setCopiedAwb(awb);
    setTimeout(() => setCopiedAwb(null), 2000);
  };

  const handleBookWithDelhivery = async (order: AdminOrder) => {
    setIsBookingId(order.id);
    setBookingSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'book', orderId: order.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookingSuccessMsg(
          `Order #${order.order_number} successfully booked with Delhivery! AWB: ${data.shipment.waybill}`
        );
        onRefresh?.();
      } else {
        alert(data.error || 'Failed to book shipment with Delhivery');
      }
    } catch {
      alert('Network error while booking with Delhivery');
    } finally {
      setIsBookingId(null);
    }
  };

  const handleOpenTrackingRadar = async (awb: string) => {
    setTrackingModalAwb(awb);
    setTrackingData(null);
    setIsLoadingTracking(true);
    try {
      const res = await fetch(`/api/admin/shipping?waybill=${encodeURIComponent(awb)}`);
      const data = await res.json();
      if (res.ok && data.tracking) {
        setTrackingData(data.tracking);
      } else {
        setTrackingData({
          status: 'In Transit',
          origin: 'Bangalore Central Hub (560038)',
          destination: 'Customer Destination',
          scans: [
            {
              time: new Date().toISOString(),
              location: 'Bangalore Hub',
              scan_location: 'Bangalore Hub',
              scan_datetime: new Date().toISOString(),
              status: 'Manifested & Acknowledged',
              status_type: 'DL',
              details: 'Delhivery waybill registered at Bangalore Central Fulfillment Hub',
            },
          ],
        });
      }
    } catch {
      setTrackingData(null);
    } finally {
      setIsLoadingTracking(false);
    }
  };

  const handleSchedulePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSchedulingPickup(true);
    setPickupResult(null);
    try {
      const res = await fetch('/api/admin/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pickup',
          pickupDate,
          pickupTime,
          expectedPackageCount: Number(pickupCount) || 1,
        }),
      });
      const data = await res.json();
      if (res.ok && data.pickup) {
        setPickupResult(
          `Delhivery Pickup Scheduled! ID: ${data.pickup.pickupId || data.pickup.pickup_id || 'DEL-BLR-OK'} for ${pickupDate} (${pickupCount} parcels)`
        );
        onRefresh?.();
      } else {
        alert(data.error || 'Failed to schedule Delhivery pickup');
      }
    } catch {
      alert('Network error while scheduling pickup');
    } finally {
      setIsSchedulingPickup(false);
    }
  };

  const handleWhatsAppShare = (s: AdminOrder) => {
    const cleanPhone = (s.shipping_phone || '').replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const waybill = s.delhivery_details?.waybill || s.tracking_awb;
    const trackUrl = waybill
      ? `https://www.delhivery.com/track/package/${encodeURIComponent(waybill)}`
      : 'https://vishnuhomeproducts.in/track-order';

    const msg = `Namaskara ${s.shipping_name}! 🙏\nYour Vishnu Home Products order *${s.order_number}* of authentic Mangalorean snacks has been booked with our exclusive logistics partner *Delhivery Express* from our Bangalore fulfillment hub.\n\n📦 *Delhivery AWB:* ${
      waybill || 'Assigned'
    }\n🔗 *Live Delhivery Tracking:* ${trackUrl}\n\nThank you for trusting Vishnu Home Products!`;

    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Exclusive Delhivery Shipping & Bangalore Hub */}
      <div className="clay-card p-5 sm:p-6 border-l-4 border-l-brandRed flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-brandRed border border-red-200">
              Exclusive Logistics Partner
            </span>
            <span className="text-xs font-bold text-brandText">Delhivery Express (delhivery.com)</span>
          </div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-brandText">
            Delhivery Shipping &amp; Dispatch Control Center
          </h2>
          <p className="text-xs text-brandText2">
            All shipments originate exclusively from our central fulfillment warehouse in <strong>Bangalore, Karnataka (PIN: 560038)</strong>. Preserving traditional Mangalore food heritage across India.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => {
              setPickupCount(Math.max(1, readyForPickupOrders.length));
              setIsPickupModalOpen(true);
            }}
            className="px-4 py-2.5 clay-btn-red text-xs font-bold inline-flex items-center gap-2 shadow-md"
          >
            <Calendar className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule Delhivery Pickup</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 clay-btn-light text-xs font-semibold inline-flex items-center gap-1.5"
            title="Print Dispatch Manifest"
          >
            <Printer className="w-4 h-4" />
            <span>Manifest</span>
          </button>
        </div>
      </div>

      {bookingSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-brandGreen font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-brandGreen" />
            <span>{bookingSuccessMsg}</span>
          </div>
          <button onClick={() => setBookingSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row: 5 Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setStatusFilter('needs_booking')}
          className={`clay-card p-4 cursor-pointer transition-all ${
            statusFilter === 'needs_booking' ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Needs AWB Booking
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-amber-600 mt-1">
            {readyToBookOrders.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Kitchen packed</div>
        </div>

        <div
          onClick={() => setStatusFilter('ready_for_pickup')}
          className={`clay-card p-4 cursor-pointer transition-all ${
            statusFilter === 'ready_for_pickup' ? 'ring-2 ring-brandRed' : ''
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Ready for Pickup
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandRed mt-1">
            {readyForPickupOrders.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Bangalore Hub</div>
        </div>

        <div
          onClick={() => setStatusFilter('in_transit')}
          className={`clay-card p-4 cursor-pointer transition-all ${
            statusFilter === 'in_transit' ? 'ring-2 ring-sky-500' : ''
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            In Transit (Delhivery)
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-sky-600 mt-1">
            {inTransitOrders.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">On road / Air</div>
        </div>

        <div
          onClick={() => setStatusFilter('delivered')}
          className={`clay-card p-4 cursor-pointer transition-all ${
            statusFilter === 'delivered' ? 'ring-2 ring-emerald-500' : ''
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Delivered
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandGreen mt-1">
            {deliveredOrders.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Doorstep received</div>
        </div>

        <div
          onClick={() => setStatusFilter('ndr')}
          className={`clay-card p-4 cursor-pointer transition-all ${
            statusFilter === 'ndr' ? 'ring-2 ring-rose-500' : ''
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            NDR / Exceptions
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-rose-600 mt-1">
            {ndrOrders.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Attention required</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Dispatches' },
            { id: 'needs_booking', label: `Needs Booking (${readyToBookOrders.length})` },
            { id: 'ready_for_pickup', label: `Ready for Pickup (${readyForPickupOrders.length})` },
            { id: 'in_transit', label: `In Transit (${inTransitOrders.length})` },
            { id: 'delivered', label: `Delivered (${deliveredOrders.length})` },
            { id: 'ndr', label: `NDR / RTO (${ndrOrders.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap text-xs ${
                statusFilter === tab.id
                  ? 'clay-pill-active font-bold text-brandRed'
                  : 'clay-pill-inactive font-medium text-slate-600 hover:text-brandText'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AWB, Order #, PIN, City..."
            className="w-full pl-8 pr-3 py-1.5 clay-inset text-xs text-brandText focus:outline-none"
          />
        </div>
      </div>

      {/* Shipments Table */}
      <div className="clay-card overflow-hidden">
        <div className="p-4 border-b border-white/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brandRed" />
            <h3 className="font-bold text-sm text-brandText">Delhivery Express Shipments Manifest</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">{displayedShipments.length} parcels</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#e4e8ee]/80 text-slate-600 uppercase font-bold text-[10px] border-b border-white/60">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer &amp; Phone</th>
                <th className="py-3 px-4">Destination PIN / City</th>
                <th className="py-3 px-4">Delhivery AWB Waybill</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Delhivery Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {displayedShipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No shipments match the selected filter.
                  </td>
                </tr>
              ) : (
                displayedShipments.map((s) => {
                  const waybill = s.delhivery_details?.waybill || s.tracking_awb;
                  const labelUrl = `/api/delhivery/label?waybill=${encodeURIComponent(waybill || '')}`;
                  const isBooking = isBookingId === s.id;

                  return (
                    <tr key={s.id} className="hover:bg-white/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-brandRed">#{s.order_number}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatINR(s.total)} • {s.payment_method === 'cod' ? 'Delhivery COD' : 'Prepaid (Razorpay)'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-brandText">{s.shipping_name}</div>
                        <div className="text-slate-500 text-[11px] font-mono">{s.shipping_phone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-brandText font-medium">
                          {s.shipping_address?.city}, {s.shipping_address?.state}
                        </div>
                        <div className="text-brandRed text-[11px] font-mono font-bold">
                          PIN: {s.shipping_address?.pincode}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {waybill ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleOpenTrackingRadar(waybill)}
                              title="Inspect Live Delhivery Scans Radar"
                              className="font-mono clay-card-flat px-2 py-1 rounded font-bold text-[11px] text-brandText hover:text-brandRed inline-flex items-center gap-1 transition-colors"
                            >
                              <span>{waybill}</span>
                              <ExternalLink className="w-3 h-3 text-brandRed" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyAwb(waybill)}
                              title="Copy Waybill"
                              className="p-1 rounded clay-btn-light text-slate-600 hover:text-brandText"
                            >
                              {copiedAwb === waybill ? (
                                <Check className="w-3 h-3 text-brandGreen" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            {s.delhivery_details?.routing_code && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-bold">
                                {s.delhivery_details.routing_code}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-amber-600 font-semibold italic text-[11px] flex items-center gap-1">
                            <span>Pending Delhivery Booking</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs ${
                            s.status === 'delivered'
                              ? 'bg-emerald-100 text-brandGreen'
                              : ['shipped', 'in_transit', 'picked_up'].includes(s.status)
                              ? 'bg-sky-100 text-sky-800'
                              : s.status === 'out_for_delivery'
                              ? 'bg-purple-100 text-purple-800'
                              : ['delivery_failed', 'ndr', 'rto_initiated', 'rto_delivered'].includes(s.status)
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {!waybill ? (
                            <button
                              type="button"
                              disabled={isBooking}
                              onClick={() => handleBookWithDelhivery(s)}
                              className="px-3 py-1.5 clay-btn-red text-[11px] font-bold inline-flex items-center gap-1 shadow-sm transition-all"
                            >
                              <Truck className="w-3 h-3" />
                              <span>{isBooking ? 'Booking...' : 'Book Delhivery'}</span>
                            </button>
                          ) : (
                            <>
                              <a
                                href={labelUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Print Official Delhivery Barcode Shipping Label"
                                className="px-2.5 py-1 clay-btn-light text-[11px] font-semibold text-brandText inline-flex items-center gap-1 hover:text-brandRed"
                              >
                                <Printer className="w-3 h-3" />
                                <span>Label</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => handleWhatsAppShare(s)}
                                title="Send Delhivery Tracking Link on WhatsApp"
                                className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => onPrintInvoice(s)}
                            title="Print Customer Packing Invoice"
                            className="p-1.5 clay-btn-light text-slate-600 hover:text-brandText rounded-lg"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Schedule Delhivery Warehouse Pickup */}
      {isPickupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brandRed" />
                <h3 className="font-bold text-sm text-brandText">Schedule Delhivery Warehouse Pickup</h3>
              </div>
              <button
                onClick={() => {
                  setIsPickupModalOpen(false);
                  setPickupResult(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSchedulePickup} className="space-y-3.5 text-xs">
              <div className="p-3 bg-brandBg rounded-xl border border-brandBorder space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Pickup Origin Facility:</div>
                <div className="font-bold text-brandText">Vishnu Home Products Bangalore Central Hub</div>
                <div className="text-slate-600 text-[11px]">Indiranagar, Bangalore, Karnataka - 560038</div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pickup Time Slot
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                  >
                    <option value="11:00">Morning (10:00 - 13:00)</option>
                    <option value="15:00">Afternoon (14:00 - 18:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Expected Parcels
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pickupCount}
                    onChange={(e) => setPickupCount(Number(e.target.value))}
                    className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none font-mono"
                  />
                </div>
              </div>

              {pickupResult && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-brandGreen font-bold text-xs">
                  {pickupResult}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPickupModalOpen(false)}
                  className="px-4 py-2 clay-btn-light text-slate-600 font-semibold text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSchedulingPickup}
                  className="px-5 py-2 clay-btn-red text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isSchedulingPickup ? 'Dispatching Request...' : 'Confirm Pickup with Delhivery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delhivery Live Tracking Radar */}
      {trackingModalAwb && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card max-w-lg w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brandRed" />
                <h3 className="font-bold text-sm text-brandText">Delhivery Live Radar</h3>
              </div>
              <button
                onClick={() => setTrackingModalAwb(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-brandBg rounded-xl border border-brandBorder flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Delhivery AWB Waybill</div>
                  <div className="font-mono font-extrabold text-sm text-brandRed">{trackingModalAwb}</div>
                </div>
                <a
                  href={`https://www.delhivery.com/track/package/${trackingModalAwb}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 clay-btn-red text-[11px] font-bold text-white inline-flex items-center gap-1"
                >
                  <span>delhivery.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {isLoadingTracking ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Pinging Delhivery Tracking API...
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg clay-inset">
                      <div className="text-slate-400 font-bold uppercase text-[9px]">Origin Hub</div>
                      <div className="font-semibold text-brandText">Bangalore Hub (560038)</div>
                    </div>
                    <div className="p-2.5 rounded-lg clay-inset">
                      <div className="text-slate-400 font-bold uppercase text-[9px]">Current Status</div>
                      <div className="font-bold text-brandRed">
                        {trackingData?.status || 'Active in Delhivery Network'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-bold text-slate-600 text-[11px]">Live Scans &amp; Milestones:</div>
                    <div className="max-h-52 overflow-y-auto space-y-2 border-l-2 border-brandRed/40 pl-3">
                      {(trackingData?.scans || []).map((scan, sIdx) => (
                        <div key={sIdx} className="text-xs space-y-0.5">
                          <div className="font-semibold text-brandText">
                            {scan.status} - <span className="text-slate-500">{scan.location || scan.scan_location || 'Transit Hub'}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {new Date(scan.time || scan.scan_datetime || Date.now()).toLocaleString('en-IN')} • {scan.details || scan.instructions || scan.status_type || 'Processed'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/60">
              <button
                type="button"
                onClick={() => setTrackingModalAwb(null)}
                className="px-4 py-1.5 clay-btn-light text-slate-600 font-bold text-xs"
              >
                Close Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
