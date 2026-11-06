'use client';

import React, { useState } from 'react';
import { Truck, Printer, ExternalLink, Copy, Check, MessageCircle } from 'lucide-react';
import { AdminOrder } from '@/types/admin';

interface ShipmentsViewProps {
  orders: AdminOrder[];
  onPrintInvoice: (order: AdminOrder) => void;
}

function getCourierTrackingUrl(courier?: string, awb?: string): string {
  if (!awb) return '';
  const c = (courier || '').toLowerCase();
  if (c.includes('delhivery')) {
    return `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`;
  }
  if (c.includes('blue') || c.includes('bluedart')) {
    return `https://www.bluedart.com/tracking?trackNumbers=${encodeURIComponent(awb)}`;
  }
  if (c.includes('india post') || c.includes('speed post')) {
    return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
  }
  if (c.includes('dtdc')) {
    return `https://www.dtdc.in/trace.asp`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`${courier || 'Courier'} tracking ${awb}`)}`;
}

export const ShipmentsView: React.FC<ShipmentsViewProps> = ({ orders, onPrintInvoice }) => {
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [copiedAwb, setCopiedAwb] = useState<string | null>(null);

  const shipments = orders.filter(
    (o) => !o.is_archived && ['packed', 'shipped', 'delivered'].includes(o.status)
  );

  const filteredShipments = shipments.filter((s) => {
    if (partnerFilter === 'all') return true;
    return s.courier_partner?.toLowerCase().includes(partnerFilter.toLowerCase());
  });

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard?.writeText(awb);
    setCopiedAwb(awb);
    setTimeout(() => setCopiedAwb(null), 2000);
  };

  const handleWhatsAppShare = (s: AdminOrder) => {
    const cleanPhone = (s.shipping_phone || '').replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const trackUrl = getCourierTrackingUrl(s.courier_partner, s.tracking_awb);
    const msg = `Namaskara ${s.shipping_name}! 🙏\nYour Vishnu Home Products order *${s.order_number}* has been dispatched via *${
      s.courier_partner || 'Express Courier'
    }*.\n📦 *Tracking AWB:* ${s.tracking_awb || 'Assigned soon'}${
      trackUrl ? `\n🔗 *Track Live:* ${trackUrl}` : ''
    }\nThank you for supporting authentic Mangalorean homemade food!`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Shipments Metrics: Clay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ready for Courier Pickup
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandRed mt-1">
            {orders.filter((o) => o.status === 'packed').length} Parcels
          </div>
        </div>

        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            In Transit with Courier
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandText mt-1">
            {orders.filter((o) => o.status === 'shipped').length} Parcels
          </div>
        </div>

        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Successfully Delivered
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandGreen mt-1">
            {orders.filter((o) => o.status === 'delivered').length} Parcels
          </div>
        </div>

        <div className="clay-card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dispatch Manifest
            </div>
            <div className="text-xs text-brandText2 mt-1">Print courier pickup sheet</div>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 clay-btn-red text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs: Clay Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-semibold mr-1">Partner:</span>
        {['all', 'Delhivery', 'Blue Dart', 'India Post', 'Local'].map((p) => (
          <button
            key={p}
            onClick={() => setPartnerFilter(p)}
            className={`px-4 py-1.5 transition-all ${
              partnerFilter === p ? 'clay-pill-active font-bold' : 'clay-pill-inactive font-medium'
            }`}
          >
            {p === 'all' ? 'All Partners' : p}
          </button>
        ))}
      </div>

      {/* Shipments Table: Clay Card */}
      <div className="clay-card overflow-hidden">
        <div className="p-4 border-b border-white/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-brandRed" />
            <h3 className="font-bold text-sm text-brandText">Courier Parcels &amp; Live Tracking Manifest</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">{filteredShipments.length} shipments found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#e4e8ee]/80 text-slate-600 uppercase font-bold text-[10px] border-b border-white/60">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Courier Partner</th>
                <th className="py-3 px-4">Tracking AWB &amp; Link</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filteredShipments.map((s) => {
                const trackUrl = getCourierTrackingUrl(s.courier_partner, s.tracking_awb);
                return (
                  <tr key={s.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brandRed">{s.order_number}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-brandText">{s.shipping_name}</div>
                      <div className="text-slate-500 text-[11px]">{s.shipping_phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-brandText">
                        {s.shipping_address?.city}, {s.shipping_address?.state}
                      </div>
                      <div className="text-slate-400 text-[11px]">PIN: {s.shipping_address?.pincode}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-brandText">
                      {s.courier_partner || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4">
                      {s.tracking_awb ? (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={trackUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Open live courier tracking page"
                            className="font-mono clay-card-flat px-2.5 py-1 rounded-md font-bold text-[11px] text-brandText hover:text-brandRed inline-flex items-center gap-1 transition-colors"
                          >
                            <span>{s.tracking_awb}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyAwb(s.tracking_awb!)}
                            title="Copy AWB Number"
                            className="p-1.5 rounded-lg clay-btn-light text-slate-600 hover:text-brandText"
                          >
                            {copiedAwb === s.tracking_awb ? (
                              <Check className="w-3 h-3 text-brandGreen" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-brandRed italic text-[11px]">Pending AWB</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs ${
                          s.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'shipped'
                            ? 'bg-red-100 text-brandRed'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleWhatsAppShare(s)}
                          title="Send AWB Tracking Link on WhatsApp"
                          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onPrintInvoice(s)}
                          className="px-3 py-1.5 text-xs font-semibold text-brandText clay-btn-light"
                        >
                          Shipping Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
