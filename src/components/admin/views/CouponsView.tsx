'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, RefreshCw } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface CouponItem {
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order: number;
  uses: number;
  active: boolean;
  description?: string;
}

export const CouponsView: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percent' | 'fixed'>('percent');
  const [newValue, setNewValue] = useState(10);
  const [newMinOrder, setNewMinOrder] = useState(499);
  const [newDescription, setNewDescription] = useState('');
  const [isOpenForm, setIsOpenForm] = useState(false);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.coupons)) {
          setCoupons(data.coupons);
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const toggleCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.coupons)) setCoupons(data.coupons);
      }
    } catch (e) {
      // ignore
    }
  };

  const deleteCoupon = async (code: string) => {
    try {
      const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(code)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.coupons)) setCoupons(data.coupons);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode.trim().toUpperCase(),
          discount_type: newType,
          discount_value: Number(newValue),
          min_order: Number(newMinOrder),
          description: newDescription,
          active: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.coupons)) setCoupons(data.coupons);
        setNewCode('');
        setNewDescription('');
        setIsOpenForm(false);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">
            Discount Coupons & Live Offers
          </h3>
          <p className="text-xs text-brandText2">
            Coupons created or toggled here immediately sync with Storefront Checkout
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCoupons}
            className="p-2 clay-btn-light text-brandText2"
            title="Refresh coupons"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brandRed' : ''}`} />
          </button>
          <button
            onClick={() => setIsOpenForm(!isOpenForm)}
            className="px-4 py-2 clay-btn-red text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isOpenForm ? 'Cancel' : 'Create New Coupon'}</span>
          </button>
        </div>
      </div>

      {/* New Coupon Form: Clay Card */}
      {isOpenForm && (
        <form onSubmit={handleCreateCoupon} className="p-5 clay-card space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-brandText">
            New Coupon Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MONSOON20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2 clay-inset font-mono uppercase font-bold text-brandText focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Discount Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3.5 py-2 clay-card-flat border-none text-brandText focus:outline-none"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Flat Cash (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Discount Value ({newType === 'percent' ? '%' : '₹'})
              </label>
              <input
                type="number"
                required
                min={1}
                value={newValue}
                onChange={(e) => setNewValue(Number(e.target.value))}
                className="w-full px-3.5 py-2 clay-inset text-brandText focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Min Order Amount (₹)
              </label>
              <input
                type="number"
                min={0}
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 clay-inset text-brandText focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="px-5 py-2.5 clay-btn-red text-xs font-bold">
              Save & Activate Coupon
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table: Clay Card */}
      <div className="clay-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#e4e8ee]/80 text-slate-600 uppercase font-bold text-[10px] border-b border-white/60">
            <tr>
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Minimum Cart</th>
              <th className="py-3 px-4">Total Uses</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            {coupons.map((c) => (
              <tr key={c.code} className="hover:bg-white/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-brandRed text-sm flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{c.code}</span>
                </td>
                <td className="py-3 px-4 font-bold text-brandText">
                  {c.discount_type === 'percent'
                    ? `${c.discount_value}% OFF`
                    : `${formatINR(c.discount_value)} OFF`}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {c.min_order > 0 ? `Above ${formatINR(c.min_order)}` : 'No Minimum'}
                </td>
                <td className="py-3 px-4 text-slate-600 font-semibold">{c.uses} redemptions</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.active
                        ? 'bg-emerald-100 text-brandGreen'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {c.active ? '● Active on Store' : 'Paused'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => toggleCoupon(c.code)}
                    className="px-3 py-1 rounded-lg clay-btn-light text-[11px] font-semibold text-brandText"
                  >
                    {c.active ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteCoupon(c.code)}
                    className="p-1.5 rounded-lg clay-btn-light text-slate-400 hover:text-brandRed"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
