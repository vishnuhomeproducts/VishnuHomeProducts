'use client';

import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export const CouponsView: React.FC = () => {
  const [coupons, setCoupons] = useState([
    { code: 'VISHNU10', type: 'percent', value: 10, min_order: 0, uses: 38, active: true },
    { code: 'MANGALORE50', type: 'fixed', value: 50, min_order: 499, uses: 64, active: true },
    { code: 'FESTIVE15', type: 'percent', value: 15, min_order: 799, uses: 19, active: true },
    { code: 'WELCOME100', type: 'fixed', value: 100, min_order: 999, uses: 12, active: false },
  ]);

  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'percent' | 'fixed'>('percent');
  const [newValue, setNewValue] = useState(10);
  const [newMinOrder, setNewMinOrder] = useState(499);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const toggleCoupon = (code: string) => {
    setCoupons(
      coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setCoupons([
      ...coupons,
      {
        code: newCode.trim().toUpperCase(),
        type: newType,
        value: Number(newValue),
        min_order: Number(newMinOrder),
        uses: 0,
        active: true,
      },
    ]);
    setNewCode('');
    setIsOpenForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">Discount Coupons & Offers</h3>
          <p className="text-xs text-brandText2">Configure promotional vouchers for checkout</p>
        </div>
        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          className="px-4 py-2 clay-btn-red text-xs font-bold inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{isOpenForm ? 'Cancel' : 'Create New Coupon'}</span>
        </button>
      </div>

      {/* New Coupon Form: Clay Card */}
      {isOpenForm && (
        <form
          onSubmit={handleCreateCoupon}
          className="p-5 clay-card space-y-4"
        >
          <h4 className="font-bold text-xs uppercase tracking-wider text-brandText">New Coupon Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Coupon Code</label>
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
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Discount Type</label>
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
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Min Order Amount (₹)</label>
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
            <button
              type="submit"
              className="px-5 py-2.5 clay-btn-red text-xs font-bold"
            >
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
              <th className="py-3 px-4 text-right">Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            {coupons.map((c) => (
              <tr key={c.code} className="hover:bg-white/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-brandRed text-sm">
                  {c.code}
                </td>
                <td className="py-3 px-4 font-semibold text-brandText font-price">
                  {c.type === 'percent' ? `${c.value}% Off` : formatINR(c.value) + ' Off'}
                </td>
                <td className="py-3 px-4 text-brandText2 font-price">
                  {c.min_order > 0 ? `Above ${formatINR(c.min_order)}` : 'No minimum'}
                </td>
                <td className="py-3 px-4 font-bold text-brandText">
                  {c.uses} orders
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs ${
                      c.active ? 'bg-emerald-100 text-brandGreen' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => toggleCoupon(c.code)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl clay-btn-light"
                  >
                    {c.active ? 'Deactivate' : 'Activate'}
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
