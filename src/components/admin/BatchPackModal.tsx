'use client';

import React, { useEffect } from 'react';
import { X, Printer, Check, Boxes } from 'lucide-react';
import { AdminOrder } from '@/types/admin';

interface BatchPackModalProps {
  orders: AdminOrder[];
  isOpen: boolean;
  onClose: () => void;
  onMarkBatchPacked: () => void;
}

export const BatchPackModal: React.FC<BatchPackModalProps> = ({
  orders,
  isOpen,
  onClose,
  onMarkBatchPacked,
}) => {
  // ESC key dismiss
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

  if (!isOpen) return null;

  // Aggregate items across all unfulfilled orders
  const unfulfilledOrders = orders.filter(
    (o) => !o.is_archived && ['pending', 'confirmed', 'processing'].includes(o.status)
  );

  const itemCounts: Record<string, { name: string; size: string; count: number; emoji?: string }> = {};

  unfulfilledOrders.forEach((o) => {
    o.items.forEach((item) => {
      const key = `${item.name}-${item.size}`;
      if (!itemCounts[key]) {
        itemCounts[key] = {
          name: item.name,
          size: item.size,
          count: 0,
          emoji: item.emoji,
        };
      }
      itemCounts[key].count += item.qty;
    });
  });

  const summaryList = Object.values(itemCounts).sort((a, b) => b.count - a.count);
  const totalUnits = summaryList.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="clay-card max-w-xl w-full max-h-[88vh] overflow-y-auto shadow-2xl cursor-default"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/60 flex items-center justify-between sticky top-0 clay-bg z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl clay-btn-red flex items-center justify-center font-bold">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brandText">
                Auto-Prepare Today's Batch Packing
              </h3>
              <p className="text-xs text-brandText2">
                Packaging checklist for {unfulfilledOrders.length} unfulfilled orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl clay-btn-light text-slate-500 hover:text-brandText"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Quick Metrics: Clay Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 clay-card-flat">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Orders to Pack</div>
              <div className="text-2xl font-bold font-price tracking-tight text-brandText mt-0.5">{unfulfilledOrders.length}</div>
            </div>
            <div className="p-4 clay-card-flat border-l-4 border-l-brandRed">
              <div className="text-[11px] font-semibold text-brandRed uppercase tracking-wider">Total Bottles / Packets</div>
              <div className="text-2xl font-bold font-price tracking-tight text-brandRed mt-0.5">{totalUnits} units</div>
            </div>
          </div>

          {/* Checklist by Item */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Warehouse Picking & Packing List
            </h4>

            {summaryList.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 clay-inset">
                All current orders are already packed or shipped!
              </div>
            ) : (
              <div className="divide-y divide-white/60 clay-card-flat overflow-hidden">
                {summaryList.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-white/40 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{item.emoji || '📦'}</span>
                      <div>
                        <div className="font-bold text-brandText">{item.name}</div>
                        <div className="text-[11px] text-slate-500">Size: {item.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full font-bold clay-card text-brandRed text-xs">
                        {item.count} {item.count === 1 ? 'pack' : 'packs'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-white/60 flex flex-col sm:flex-row items-center justify-end gap-2.5">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-4 py-2 text-brandText text-xs font-semibold clay-btn-light inline-flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Batch Manifest</span>
            </button>
            <button
              onClick={() => {
                onMarkBatchPacked();
                onClose();
              }}
              disabled={unfulfilledOrders.length === 0}
              className="w-full sm:w-auto px-5 py-2.5 disabled:opacity-50 text-white text-xs font-bold clay-btn-red inline-flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Mark All {unfulfilledOrders.length} as Packed</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
