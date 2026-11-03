'use client';

import React, { useState } from 'react';
import { X, Zap, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { AbandonedCart } from '@/types/admin';
import { formatINR } from '@/lib/utils';

interface ReconcileModalProps {
  carts: AbandonedCart[];
  isOpen: boolean;
  onClose: () => void;
  onReconcileCart: (cartId: string) => Promise<void>;
  onSyncAll: () => Promise<void>;
}

export const ReconcileModal: React.FC<ReconcileModalProps> = ({
  carts,
  isOpen,
  onClose,
  onReconcileCart,
  onSyncAll,
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const inFlightCarts = carts.filter((c) => !c.recovered);

  const handleSyncSingle = async (cartId: string) => {
    setSyncingId(cartId);
    setSuccessMessage('');
    try {
      await onReconcileCart(cartId);
      setSuccessMessage('Checkout verified and promoted to Active Orders!');
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    setSuccessMessage('');
    try {
      await onSyncAll();
      setSuccessMessage('All in-flight gateway sessions synced successfully.');
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
      <div className="clay-card max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/60 flex items-center justify-between sticky top-0 clay-bg z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl clay-btn-red flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brandText">
                Payment Gateway Reconciliation Hub
              </h3>
              <p className="text-xs text-brandText2">
                Sync pending Razorpay / UPI checkouts and verify callbacks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl clay-btn-light text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-brandGreen text-xs font-semibold flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Banner */}
          <div className="clay-card-flat p-4 text-brandText space-y-2 border border-red-200/60 bg-red-50/50">
            <div className="flex items-center gap-2 font-bold text-xs text-brandRed">
              <AlertTriangle className="w-4 h-4 text-brandRed shrink-0" />
              <span>{inFlightCarts.length} In-Flight Checkouts Detected (Last 72 Hours)</span>
            </div>
            <p className="text-xs text-brandText2 leading-relaxed">
              Customers initiated checkout on UPI/NetBanking. If their payment went through but their browser closed before the webhook returned, clicking <strong>Sync Gateway</strong> will automatically verify their payment with Razorpay and convert it into a confirmed order.
            </p>
          </div>

          {/* List of In-flight Carts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending In-Flight Transactions
            </h4>

            {inFlightCarts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 clay-inset rounded-xl">
                No unresolved gateway checkouts found. All payments are reconciled!
              </div>
            ) : (
              <div className="space-y-3">
                {inFlightCarts.map((cart) => (
                  <div key={cart.id} className="clay-card-flat p-4 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-brandText">{cart.customer_name}</div>
                        <div className="text-slate-500 text-[11px]">
                          {cart.customer_phone} • {cart.city} • Active {new Date(cart.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-price font-bold text-brandRed text-sm tracking-tight">{formatINR(cart.total)}</div>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-100 text-brandRed font-semibold border border-red-200/60">
                          Awaiting Callback
                        </span>
                      </div>
                    </div>

                    <div className="text-slate-600 text-[11px]">
                      Items: {cart.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleSyncSingle(cart.id)}
                        disabled={syncingId === cart.id}
                        className="px-3.5 py-1.5 clay-btn-red disabled:opacity-50 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
                      >
                        <Zap className="w-3 h-3 fill-white" />
                        <span>{syncingId === cart.id ? 'Verifying...' : 'Sync & Promote to Active'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/60 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 clay-btn-light text-slate-700 text-xs font-semibold rounded-xl"
            >
              Close
            </button>
            <button
              onClick={handleSyncAll}
              disabled={isSyncingAll || inFlightCarts.length === 0}
              className="px-5 py-2 clay-btn-red disabled:opacity-50 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Syncing...' : 'Sync All with Gateway'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
