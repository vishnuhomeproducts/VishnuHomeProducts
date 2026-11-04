'use client';

import React, { useState } from 'react';
import {
  Printer,
  Trash2,
  Clock,
  Eye,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { AdminOrder, OrderFulfillmentStatus } from '@/types/admin';
import { formatINR } from '@/lib/utils';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';

interface OrdersViewProps {
  orders: AdminOrder[];
  inFlightCount: number;
  onUpdateStatus: (orderId: string, status: OrderFulfillmentStatus) => void;
  onUpdateCourier: (orderId: string, courier: string, awb: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onPrintInvoice: (order: AdminOrder) => void;
  onOpenReconcile: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  inFlightCount,
  onUpdateStatus,
  onUpdateCourier,
  onDeleteOrder,
  onPrintInvoice,
  onOpenReconcile,
}) => {
  // Main Tabs: Active Orders, Pending Verification, Recycle Bin
  const [activeMainTab, setActiveMainTab] = useState<'active' | 'pending' | 'archived'>('active');
  // Delivery Sub-filters: All, Local, Pan-India Courier
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'mangaluru_local' | 'pan_india_courier'>('all');
  // Selected order IDs for bulk operations
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  // Selected Order for Detail Modal
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<AdminOrder | null>(null);
  // Copied indicator state
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Tab Filtering
  const filteredByTab = orders.filter((o) => {
    if (activeMainTab === 'archived') return o.is_archived;
    if (o.is_archived) return false;
    if (activeMainTab === 'pending') {
      return o.payment_status === 'unpaid' || o.payment_status === 'pending_verification';
    }
    return true; // 'active'
  });

  // Delivery Sub-filtering
  const displayedOrders = filteredByTab.filter((o) => {
    if (deliveryFilter === 'all') return true;
    return o.delivery_type === deliveryFilter;
  });

  const activeCount = orders.filter((o) => !o.is_archived).length;
  const pendingCount = orders.filter(
    (o) => !o.is_archived && (o.payment_status === 'unpaid' || o.payment_status === 'pending_verification')
  ).length;
  const archivedCount = orders.filter((o) => o.is_archived).length;

  const localCount = filteredByTab.filter((o) => o.delivery_type === 'mangaluru_local').length;
  const courierCount = filteredByTab.filter((o) => o.delivery_type === 'pan_india_courier').length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrderIds(displayedOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const handleCopyOrderNumber = (orderNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderId(orderNumber);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* 1. Main Order Status Tabs (Tactile Clay Buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setActiveMainTab('active')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold transition-all shrink-0 ${
              activeMainTab === 'active' ? 'clay-btn-red' : 'clay-btn-light text-brandText2'
            }`}
          >
            <span>Active Orders</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeMainTab === 'active' ? 'bg-white text-brandRed' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('pending')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold transition-all shrink-0 ${
              activeMainTab === 'pending' ? 'clay-btn-red' : 'clay-btn-light text-brandText2'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Verification</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeMainTab === 'pending' ? 'bg-white text-brandRed' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('archived')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold transition-all shrink-0 ${
              activeMainTab === 'archived' ? 'clay-btn-red' : 'clay-btn-light text-brandText2'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Recycle Bin</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
              {archivedCount}
            </span>
          </button>
        </div>

        {/* Bulk select check */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-brandText2 px-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={displayedOrders.length > 0 && selectedOrderIds.length === displayedOrders.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 rounded text-brandRed focus:ring-brandRed cursor-pointer"
            />
            <span className="font-medium">Select All ({displayedOrders.length})</span>
          </label>
        </div>
      </div>

      {/* 2. Delivery Sub-Filter Pills */}
      <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setDeliveryFilter('all')}
          className={`text-xs px-3.5 sm:px-4 py-1.5 transition-all shrink-0 ${
            deliveryFilter === 'all' ? 'clay-pill-active font-bold' : 'clay-pill-inactive font-medium'
          }`}
        >
          All Orders ({filteredByTab.length})
        </button>

        <button
          onClick={() => setDeliveryFilter('mangaluru_local')}
          className={`text-xs px-3.5 sm:px-4 py-1.5 transition-all flex items-center gap-1.5 shrink-0 ${
            deliveryFilter === 'mangaluru_local' ? 'clay-pill-active font-bold' : 'clay-pill-inactive font-medium'
          }`}
        >
          <span>🛵 Mangaluru Local</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              deliveryFilter === 'mangaluru_local' ? 'bg-white text-brandRed font-bold' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {localCount}
          </span>
        </button>

        <button
          onClick={() => setDeliveryFilter('pan_india_courier')}
          className={`text-xs px-3.5 sm:px-4 py-1.5 transition-all flex items-center gap-1.5 shrink-0 ${
            deliveryFilter === 'pan_india_courier' ? 'clay-pill-active font-bold' : 'clay-pill-inactive font-medium'
          }`}
        >
          <span>🇮🇳 Pan-India Courier</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              deliveryFilter === 'pan_india_courier' ? 'bg-white text-brandRed font-bold' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {courierCount}
          </span>
        </button>
      </div>

      {/* 3. Streamlined, Highly Legible Order Cards */}
      <div className="space-y-3 pt-1">
        {displayedOrders.length === 0 ? (
          <div className="clay-card p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl clay-card-flat text-brandRed flex items-center justify-center mx-auto text-2xl">
              📦
            </div>
            <h3 className="font-display font-bold text-base text-brandText">No Orders in this View</h3>
            <p className="text-xs text-brandText2 max-w-sm mx-auto">
              There are currently no orders matching your selected filter.
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => {
            const isSelected = selectedOrderIds.includes(order.id);
            const totalItemCount = order.items.reduce((s, i) => s + i.qty, 0);

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrderForModal(order)}
                className={`clay-card p-4 sm:p-4.5 cursor-pointer hover:border-brandRed/40 transition-all space-y-3 ${
                  isSelected ? 'ring-2 ring-brandRed' : ''
                }`}
              >
                {/* ---------------------------------------------------- */}
                {/* LINE 1: High-Contrast Order #, Badges, Date, Actions  */}
                {/* ---------------------------------------------------- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/60">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onClick={(e) => handleToggleSelect(order.id, e)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-brandRed focus:ring-brandRed cursor-pointer"
                    />

                    {/* HIGH CONTRAST ORDER NUMBER (CRYSTAL CLEAR) */}
                    <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1 rounded-lg shadow-sm border border-slate-800">
                      <span className="font-mono font-black text-xs sm:text-sm tracking-wide">
                        {order.order_number}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyOrderNumber(order.order_number, e)}
                        className="p-0.5 rounded text-slate-300 hover:text-white"
                        title="Copy Order ID"
                      >
                        {copiedOrderId === order.order_number ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Delivery Type Badge */}
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold clay-card-flat text-brandText">
                      {order.delivery_type === 'mangaluru_local' ? '🛵 Mangaluru Local' : '🇮🇳 Pan-India Courier'}
                    </span>

                    {/* Target Time if available */}
                    {order.expected_delivery && (
                      <span className="text-[11px] font-semibold text-slate-600 clay-card-flat px-2 py-0.5 rounded-md">
                        Target: {order.expected_delivery}
                      </span>
                    )}

                    {/* Date & Time */}
                    <span className="text-[11px] font-medium text-slate-500">
                      {new Date(order.created_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Right side: Status Dropdown & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-white/60 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                    {/* Fulfillment Status Select */}
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderFulfillmentStatus)}
                      className={`text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border-none focus:outline-none transition-all shadow-xs cursor-pointer flex-1 sm:flex-none ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'shipped' || order.status === 'packed'
                          ? 'bg-red-100 text-brandRed'
                          : order.status === 'processing'
                          ? 'bg-amber-100 text-amber-900'
                          : order.status === 'cancelled'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-white/80 text-brandText'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="packed">Packed & Ready</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {/* View Details Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForModal(order)}
                      className="px-2.5 py-1.5 rounded-xl clay-btn-light text-slate-700 hover:text-brandRed text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                      title="View Full Details Dialog"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    {/* Print Packing Slip */}
                    <button
                      type="button"
                      onClick={() => onPrintInvoice(order)}
                      className="p-1.5 rounded-xl clay-btn-light text-slate-700 hover:text-brandText shadow-xs"
                      title="Print Tax Invoice & Shipping Slip"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    {/* Move to Recycle Bin */}
                    <button
                      type="button"
                      onClick={() => onDeleteOrder(order.id)}
                      className="p-1.5 rounded-xl clay-btn-light text-slate-400 hover:text-brandRed shadow-xs"
                      title="Move to Recycle Bin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* LINE 2: Clean Summary: Customer, Items & Bill Total   */}
                {/* ---------------------------------------------------- */}
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-3 sm:items-center text-xs">
                  {/* Customer Brief (Cols 1-4) */}
                  <div className="sm:col-span-4 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {order.shipping_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-brandText text-xs sm:text-sm truncate flex items-center gap-1">
                        <span className="truncate">{order.shipping_name}</span>
                        {order.shipping_address?.city && (
                          <span className="text-[10px] sm:text-[11px] font-normal text-slate-400 shrink-0">
                            ({order.shipping_address.city})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {order.shipping_phone}
                      </div>
                    </div>
                  </div>

                  {/* Ordered Menu Items (Cols 5-9): Clean, compact string summary */}
                  <div className="sm:col-span-5 text-slate-700 bg-slate-100/60 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px] shrink-0">
                        {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                      </span>
                      <span className="line-clamp-1 sm:truncate text-slate-600">
                        {order.items.map((i) => `${i.qty}x ${i.name} (${i.size})`).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Total Bill & Payment Pill (Cols 10-12) */}
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/60">
                    <div className="flex sm:flex-col items-baseline sm:items-end gap-1.5 sm:gap-0">
                      <span className="text-[10px] text-slate-400 uppercase font-bold sm:hidden">Total:</span>
                      <div className="font-price font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                        {formatINR(order.total)}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                        order.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {order.payment_method.toUpperCase()} • {order.payment_status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. Rich Order Details Modal (All Detailed Endpoints Data) */}
      {/* ======================================================== */}
      <OrderDetailModal
        order={selectedOrderForModal}
        isOpen={Boolean(selectedOrderForModal)}
        onClose={() => setSelectedOrderForModal(null)}
        onUpdateStatus={(id, status) => {
          onUpdateStatus(id, status);
          if (selectedOrderForModal && selectedOrderForModal.id === id) {
            setSelectedOrderForModal({ ...selectedOrderForModal, status });
          }
        }}
        onUpdateCourier={(id, courier, awb) => {
          onUpdateCourier(id, courier, awb);
          if (selectedOrderForModal && selectedOrderForModal.id === id) {
            setSelectedOrderForModal({
              ...selectedOrderForModal,
              courier_partner: courier,
              tracking_awb: awb,
            });
          }
        }}
        onPrintInvoice={(order) => onPrintInvoice(order)}
      />
    </div>
  );
};
