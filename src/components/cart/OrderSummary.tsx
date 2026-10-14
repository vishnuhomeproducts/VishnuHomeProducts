'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ showCheckoutButton = true }) => {
  const {
    items,
    coupon,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotal,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    setIsApplying(true);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });

      const data = await res.json();

      if (res.ok && data.coupon) {
        applyCoupon(data.coupon);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid or expired promo code');
      }
    } catch (err) {
      // Fallback local check if API isn't reached
      const codeUpper = couponInput.trim().toUpperCase();
      if (codeUpper === 'VISHNU10') {
        applyCoupon({ code: 'VISHNU10', discount_type: 'percent', discount_value: 10 });
        setCouponInput('');
      } else if (codeUpper === 'MANGALORE50' && subtotal >= 499) {
        applyCoupon({ code: 'MANGALORE50', discount_type: 'fixed', discount_value: 50, min_order: 499 });
        setCouponInput('');
      } else {
        setCouponError('Invalid coupon code');
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-6 self-start sticky top-24">
      <h3 className="font-bold text-base text-brandText pb-3 border-b border-brandBorder">
        Order Summary
      </h3>

      {/* Breakdown */}
      <div className="space-y-3 text-xs">
        <div className="flex justify-between text-brandText2">
          <span>Items Subtotal ({items.reduce((sum, i) => sum + i.qty, 0)})</span>
          <span className="font-semibold text-brandText">{formatINR(subtotal)}</span>
        </div>

        <div className="flex justify-between text-brandText2">
          <span>Delivery Fee</span>
          <span>
            {deliveryFee === 0 ? (
              <span className="text-brandGreen font-bold">FREE</span>
            ) : (
              formatINR(deliveryFee)
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-brandGreen font-semibold">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Coupon Discount ({coupon?.code})</span>
            </span>
            <span>-{formatINR(discount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-brandBorder flex justify-between items-baseline">
          <span className="text-sm font-bold text-brandText">Total Amount</span>
          <span className="text-lg font-bold text-brandAccent">{formatINR(total)}</span>
        </div>
      </div>

      {/* Coupon code applicator */}
      <div className="pt-2 border-t border-brandBorder">
        {coupon ? (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold">{coupon.code}</span> applied ({coupon.discount_type === 'percent' ? `${coupon.discount_value}% off` : `₹${coupon.discount_value} off`})
              </div>
            </div>
            <button
              onClick={removeCoupon}
              className="text-emerald-700 hover:text-emerald-900 p-1"
              title="Remove coupon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon (e.g. VISHNU10)"
                className="flex-1 px-3 py-2 text-xs uppercase bg-brandBg border border-brandBorder rounded-button focus:outline-none focus:border-brandAccent"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                isLoading={isApplying}
                disabled={!couponInput.trim()}
              >
                Apply
              </Button>
            </div>
            {couponError && <p className="text-[11px] text-brandRed font-medium">{couponError}</p>}
          </form>
        )}
      </div>

      {/* Action Button */}
      {showCheckoutButton && (
        <div className="space-y-3 pt-2">
          <Link
            href="/checkout"
            className="w-full h-12 inline-flex items-center justify-center gap-2 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold text-sm rounded-button shadow-md transition-all active:scale-[0.98]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-brandText3">
            <ShieldCheck className="w-4 h-4 text-brandGreen" />
            <span>100% Secure Checkout · Razorpay 256-bit SSL</span>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-brandText3 uppercase tracking-wider">
            <span>UPI</span> · <span>GPay</span> · <span>Credit/Debit</span> · <span>NetBanking</span> · <span>COD</span>
          </div>
        </div>
      )}

    </div>
  );
};
