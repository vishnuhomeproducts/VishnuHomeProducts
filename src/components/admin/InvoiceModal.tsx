'use client';

import React from 'react';
import { X, Printer } from 'lucide-react';
import { AdminOrder } from '@/types/admin';
import { formatINR } from '@/lib/utils';

interface InvoiceModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs print:p-0 print:bg-white">
      <div className="bg-white rounded-card max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-dropdown border border-brandBorder print:border-none print:shadow-none print:max-w-none print:max-h-none print:rounded-none">
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="p-4 border-b border-brandBorder flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-brandRed" />
            <span className="font-bold text-sm text-brandText font-display">
              Tax Invoice & Dispatch Slip • #{order.order_number}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-brandRed hover:bg-red-700 text-white font-bold text-xs rounded-button inline-flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice / Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-button text-brandText3 hover:text-brandText hover:bg-brandBg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="p-6 sm:p-8 space-y-6 text-brandText text-xs">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-6 border-brandBorder">
            <div>
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="VISHNU"
                  className="h-8 w-auto object-contain"
                />
                <div className="border border-brandText text-brandText font-bold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
                  Home Products
                </div>
              </div>
              <p className="mt-2 text-[11px] text-brandText2 leading-relaxed">
                Authentic Homemade Pickles, Thokkus, Spices & Dry Fish<br />
                Kadri Temple Road, Kadri, Mangaluru, Karnataka - 575002<br />
                Contact: +91 98450 12345 | support@vishnuhome.in<br />
                <strong>GSTIN:</strong> 29AAAAA0000A1Z5 (Composite / MSME)
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-red-50 text-brandRed border border-red-200">
                TAX INVOICE
              </span>
              <div className="text-sm font-bold font-mono text-brandText mt-1">
                {order.order_number}
              </div>
              <div className="text-[11px] text-brandText3">
                Date: {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div className="text-[11px]">
                Status: <strong className="uppercase text-brandGreen">{order.payment_status}</strong>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Section */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-card bg-brandBg border border-brandBorder">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-brandText3 mb-1">
                Bill To / Customer Details:
              </div>
              <div className="font-bold text-brandText">{order.shipping_name}</div>
              <div className="text-brandText2">Phone: {order.shipping_phone}</div>
              <div className="text-brandText2">Email: {order.shipping_email}</div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-brandText3 mb-1">
                Ship To Address:
              </div>
              <div className="font-semibold text-brandText">
                {order.shipping_address?.line1 || ''}
              </div>
              {order.shipping_address?.line2 && (
                <div className="text-brandText2">{order.shipping_address.line2}</div>
              )}
              <div className="text-brandText font-medium">
                {order.shipping_address?.city}, {order.shipping_address?.state} - <strong>{order.shipping_address?.pincode}</strong>
              </div>
              <div className="mt-1 text-[11px] text-brandText3">
                Method: <strong>{order.delivery_type === 'mangaluru_local' ? '🛵 Mangaluru Local Delivery' : '🇮🇳 Pan-India Courier'}</strong>
                {order.courier_partner && ` (${order.courier_partner})`}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-brandBorder rounded-card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-brandBg text-[11px] text-brandText3 font-bold uppercase border-b border-brandBorder">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3 text-center">Pack Size</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brandBorder text-xs">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 text-brandText3 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-brandText">
                      {item.name}
                    </td>
                    <td className="py-2 px-3 text-center text-brandText2">{item.size}</td>
                    <td className="py-2 px-3 text-center font-bold text-brandRed">{item.qty}</td>
                    <td className="py-2 px-3 text-right text-brandText2">{formatINR(item.unit_price)}</td>
                    <td className="py-2 px-3 text-right font-bold text-brandText">
                      {formatINR(item.unit_price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes */}
          <div className="flex justify-between items-start pt-2">
            <div className="max-w-xs space-y-1 text-[11px] text-brandText3">
              <p><strong>Packing & Handling:</strong> Clean Food-Grade Sealed Containers.</p>
              <p><strong>Storage Notice:</strong> Store in a cool dry place. Use dry spoon.</p>
              {order.admin_notes && (
                <div className="p-2.5 rounded-button bg-red-50 border border-red-200 text-brandRed text-[10px]">
                  <strong>Special Note:</strong> {order.admin_notes}
                </div>
              )}
            </div>

            <div className="w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-brandText2">
                <span>Subtotal:</span>
                <span className="font-semibold text-brandText">{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brandGreen font-medium">
                  <span>Discount ({order.coupon_code || 'PROMO'}):</span>
                  <span>- {formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-brandText2">
                <span>Shipping / Courier:</span>
                <span>{order.delivery_fee === 0 ? 'FREE' : formatINR(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-brandText pt-2 border-t border-brandBorder">
                <span>Grand Total:</span>
                <span className="text-base text-brandRed font-price font-bold tracking-tight">{formatINR(order.total)}</span>
              </div>
              <div className="text-[10px] text-brandText3 pt-1">
                Payment Method: <span className="uppercase font-semibold text-brandText">{order.payment_method}</span> ({order.payment_status.toUpperCase()})
              </div>
            </div>
          </div>

          {/* Barcode / Dispatch Footer */}
          <div className="border-t border-dashed border-brandBorder pt-4 flex items-center justify-between text-[11px] text-brandText3">
            <div>
              <strong>Dispatch Check:</strong> [ ] Jar Seal Verified &nbsp; [ ] Bubble Packed &nbsp; [ ] Bill Enclosed
            </div>
            <div className="font-mono text-xs tracking-widest uppercase text-brandText font-bold">
              *VHP-{order.order_number}*
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
