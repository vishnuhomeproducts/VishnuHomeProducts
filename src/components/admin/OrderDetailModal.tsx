'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Printer,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Save,
  Package,
} from 'lucide-react';
import { AdminOrder, OrderFulfillmentStatus } from '@/types/admin';
import { formatINR } from '@/lib/utils';

interface OrderDetailModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderFulfillmentStatus) => void;
  onUpdateCourier: (orderId: string, courier: string, awb: string) => void;
  onUpdateNotes?: (orderId: string, notes: string) => void;
  onPrintInvoice: (order: AdminOrder) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateCourier,
  onUpdateNotes,
  onPrintInvoice,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [courierPartner, setCourierPartner] = useState('');
  const [trackingAwb, setTrackingAwb] = useState('');
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [trackingSaved, setTrackingSaved] = useState(false);

  useEffect(() => {
    if (order) {
      setCourierPartner(order.courier_partner || 'Delhivery Surface');
      setTrackingAwb(order.tracking_awb || '');
      setTrackingSaved(false);
    }
  }, [order]);

  // Handle ESC key to close/go back
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fullAddressString = [
    order.shipping_name,
    order.shipping_address?.line1,
    order.shipping_address?.line2,
    `${order.shipping_address?.city || ''}, ${order.shipping_address?.state || ''} - ${order.shipping_address?.pincode || ''}`,
    `Phone: ${order.shipping_phone}`,
  ]
    .filter(Boolean)
    .join(', ');

  const handleSaveTracking = async () => {
    setIsSavingTracking(true);
    try {
      await onUpdateCourier(order.id, courierPartner, trackingAwb);
      setTrackingSaved(true);
      setTimeout(() => setTrackingSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingTracking(false);
    }
  };

  const formattedDate = new Date(order.created_at).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="clay-card w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden my-auto shadow-2xl border border-white/80 cursor-default"
      >
        
        {/* ======================================================== */}
        {/* MODAL HEADER: High Contrast, Prominent Order # & Badges */}
        {/* ======================================================== */}
        <div className="p-3.5 sm:p-5 border-b border-white/60 bg-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-brandRed/10 text-brandRed flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Package className="w-5 h-5 text-brandRed" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-black text-sm sm:text-lg text-slate-900 tracking-tight bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300">
                  {order.order_number}
                </span>

                <button
                  type="button"
                  onClick={() => copyToClipboard(order.order_number, 'order_no')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Copy Order Number"
                >
                  {copiedKey === 'order_no' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                {/* Delivery Badge */}
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold clay-card-flat text-brandText whitespace-nowrap">
                  {order.delivery_type === 'mangaluru_local' ? '🛵 Mangaluru Local' : '🇮🇳 Pan-India Courier'}
                </span>

                {/* Payment Badge */}
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                    order.payment_status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {order.payment_status === 'paid' ? '● PAID' : '○ PENDING PAYMENT'}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Placed on {formattedDate}</span>
                {order.expected_delivery && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>Target: <strong>{order.expected_delivery}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/60">
            {/* Quick Invoice Print */}
            <button
              type="button"
              onClick={() => onPrintInvoice(order)}
              className="clay-btn-light px-3 py-1.5 text-xs font-bold text-brandText inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>

            {/* Close Button with Esc indicator */}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl clay-btn-light text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1 text-xs font-bold"
              title="Close Dialog (or press Esc)"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-mono text-slate-400">Esc</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL BODY: Two-Column Clean Layout                     */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-brandText">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* ---------------------------------------------------- */}
            {/* LEFT COLUMN: Customer, Address & Courier Details (7) */}
            {/* ---------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Customer Details Box */}
              <div className="clay-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/60 pb-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brandRed" />
                    <span>Customer & Delivery Details</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Direct Customer Record</span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-brandText">{order.shipping_name}</div>
                      <div className="text-slate-500 text-[11px]">{order.shipping_email || 'No email provided'}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${order.shipping_phone}`}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] inline-flex items-center gap-1 border border-emerald-200"
                        title="Call Customer"
                      >
                        <Phone className="w-3 h-3 text-emerald-700" />
                        <span>{order.shipping_phone}</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(order.shipping_phone, 'cust_phone')}
                        className="p-1 rounded text-slate-400 hover:text-slate-700"
                        title="Copy Phone Number"
                      >
                        {copiedKey === 'cust_phone' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address Box */}
                  <div className="p-3.5 clay-inset rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Shipping Address</div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(fullAddressString, 'address')}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 inline-flex items-center gap-1.5 border border-slate-300 shadow-xs transition-colors"
                        title="Copy Complete Delivery Address"
                      >
                        {copiedKey === 'address' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy Address</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-brandText text-xs leading-relaxed font-medium">
                      {order.shipping_address?.line1 || ''}{' '}
                      {order.shipping_address?.line2 ? `${order.shipping_address.line2}, ` : ''}
                      <br />
                      {order.shipping_address?.city}, {order.shipping_address?.state} - <strong className="font-mono text-slate-900">{order.shipping_address?.pincode}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier & Shipping Logistics Box */}
              <div className="clay-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/60 pb-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-brandRed" />
                    <span>Courier & Logistics Partner</span>
                  </div>
                  {trackingSaved && (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Saved!
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Assigned Courier Partner
                      </label>
                      <select
                        value={courierPartner}
                        onChange={(e) => setCourierPartner(e.target.value)}
                        className="w-full px-3 py-2 clay-inset text-xs font-medium focus:outline-none"
                      >
                        <option value="Delhivery Surface">Delhivery Surface</option>
                        <option value="Blue Dart Express">Blue Dart Express</option>
                        <option value="India Post Speed Post">India Post Speed Post</option>
                        <option value="DTDC Courier">DTDC Courier</option>
                        <option value="Local Express (Porter / Dunzo)">Local Express (Porter / Dunzo)</option>
                        <option value="Shiprocket Direct Express">Shiprocket Direct Express</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tracking AWB / Waybill #
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. DLV9842104992"
                          value={trackingAwb}
                          onChange={(e) => setTrackingAwb(e.target.value)}
                          className="w-full px-3 py-2 clay-inset font-mono text-xs focus:outline-none"
                        />
                        {trackingAwb && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(trackingAwb, 'awb')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                            title="Copy AWB"
                          >
                            {copiedKey === 'awb' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveTracking}
                      disabled={isSavingTracking}
                      className="clay-btn-red px-3.5 py-2 text-xs font-bold inline-flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSavingTracking ? 'Saving...' : 'Update Courier / AWB'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* ---------------------------------------------------- */}
            {/* RIGHT COLUMN: Ordered Items, Bill & Gateway Data (5) */}
            {/* ---------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Ordered Items List */}
              <div className="clay-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/60 pb-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Ordered Menu Items ({order.items.reduce((s, i) => s + i.qty, 0)})
                  </div>
                  <span className="text-[11px] font-bold text-brandRed">Itemized</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 clay-inset rounded-xl flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg shrink-0">{item.emoji || '🥣'}</span>
                        <div className="truncate">
                          <div className="font-bold text-brandText truncate">
                            <span className="text-brandRed font-black mr-1">{item.qty}x</span>
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {item.size} • ₹{item.unit_price} each
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-price font-bold text-xs text-brandText">
                          {formatINR(item.unit_price * item.qty)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="pt-2 border-t border-white/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Items Subtotal:</span>
                    <span className="font-price font-bold">{formatINR(order.subtotal || order.total)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Delivery Charges:</span>
                    <span className="font-price font-bold">
                      {order.delivery_fee ? formatINR(order.delivery_fee) : '₹0 (Free Delivery)'}
                    </span>
                  </div>

                  {order.discount ? (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Coupon Discount ({order.coupon_code || 'PROMO'}):</span>
                      <span className="font-price font-bold">-{formatINR(order.discount)}</span>
                    </div>
                  ) : null}

                  <div className="pt-2 border-t border-white/60 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800">Final Total Bill:</span>
                    <span className="font-price font-black text-xl text-brandRed">
                      {formatINR(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gateway & Technical Endpoints Telemetry */}
              <div className="clay-card p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/60 pb-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-brandRed" />
                    <span>Payment Gateway &amp; Telemetry</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {order.payment_method}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
                  <div className="flex items-center justify-between p-2 clay-inset rounded-lg">
                    <span>Razorpay Order:</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-800 truncate max-w-[140px] sm:max-w-[180px]">
                        {order.razorpay_order_id || 'N/A (Direct / COD)'}
                      </strong>
                      {order.razorpay_order_id && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.razorpay_order_id!, 'rzp_order')}
                          className="p-0.5 text-slate-400 hover:text-slate-700"
                        >
                          {copiedKey === 'rzp_order' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 clay-inset rounded-lg">
                    <span>Payment ID:</span>
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-800 truncate max-w-[140px] sm:max-w-[180px]">
                        {order.razorpay_payment_id || 'N/A (Unpaid / COD)'}
                      </strong>
                      {order.razorpay_payment_id && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.razorpay_payment_id!, 'rzp_pay')}
                          className="p-0.5 text-slate-400 hover:text-slate-700"
                        >
                          {copiedKey === 'rzp_pay' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 clay-inset rounded-lg">
                    <span>Internal Store UUID:</span>
                    <strong className="text-slate-700">{order.id}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL FOOTER: Live Fulfillment Status Selector           */}
        {/* ======================================================== */}
        <div className="p-3.5 sm:p-4 border-t border-white/60 bg-white/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-0 z-10 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
            <span className="font-bold text-xs text-slate-700">Update Status:</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderFulfillmentStatus)}
              className={`text-xs font-bold px-3 py-2 sm:py-1.5 rounded-xl border-none focus:outline-none transition-all shadow-xs w-full sm:w-auto ${
                order.status === 'delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'shipped' || order.status === 'packed'
                  ? 'bg-red-100 text-brandRed'
                  : order.status === 'processing'
                  ? 'bg-amber-100 text-amber-900'
                  : order.status === 'cancelled'
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-white text-brandText'
              }`}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed & Ready</option>
              <option value="shipped">Shipped (In Transit)</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onPrintInvoice(order)}
              className="clay-btn-red flex-1 sm:flex-none px-4 py-2 text-xs font-bold inline-flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="clay-btn-light flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-brandText text-center"
            >
              Close (Esc)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

