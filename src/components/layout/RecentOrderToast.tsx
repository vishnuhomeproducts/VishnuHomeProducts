'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, CheckCircle2, Tag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const RECENT_PURCHASES = [
  {
    name: 'Ananya Rao',
    city: 'Bengaluru',
    product: 'Tomato Thokku (500g)',
    slug: 'tomato-thokku',
    emoji: '🍅',
    time: '3 mins ago',
  },
  {
    name: 'Karthik Shenoy',
    city: 'Mangaluru',
    product: 'Garlic Thokku (300g)',
    slug: 'garlic-thokku',
    emoji: '🧄',
    time: '7 mins ago',
  },
  {
    name: 'Dr. Shruti Nair',
    city: 'Mumbai',
    product: 'Avakaya Mango Pickle (500g)',
    slug: 'avakaya-mango-pickle',
    emoji: '🥭',
    time: '12 mins ago',
  },
  {
    name: 'Raghavendra Pai',
    city: 'Udupi',
    product: '3-Jar Coastal Combo Box',
    slug: 'tomato-thokku',
    emoji: '🎁',
    time: '18 mins ago',
  },
];

export const RecentOrderToast: React.FC = () => {
  const { applyCoupon, coupon } = useCart();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const [couponClaimed, setCouponClaimed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 6000);

    const cycleTimer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_PURCHASES.length);
        setVisible(true);
      }, 1500);
    }, 22000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(cycleTimer);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const current = RECENT_PURCHASES[index];

  const handleClaimMysteryCoupon = () => {
    applyCoupon({
      code: 'VISHNU10',
      discount_type: 'percent',
      discount_value: 10,
    });
    setCouponClaimed(true);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 z-40 max-w-xs bg-white border border-brandBorder rounded-2xl shadow-xl p-3.5 text-xs animate-fadeIn">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 text-brandText3 hover:text-brandText"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3 pr-4">
        <div className="w-10 h-10 rounded-xl bg-brandAccent-light flex items-center justify-center text-2xl shrink-0">
          {current.emoji}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-brandGreen flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified Coastal Order • {current.time}</span>
          </div>
          <div className="font-bold text-brandText truncate">
            {current.name} ({current.city})
          </div>
          <Link
            href={`/product/${current.slug}`}
            className="text-[11px] text-brandAccent hover:underline truncate block font-medium"
          >
            Bought {current.product} →
          </Link>
        </div>
      </div>

      {!coupon && !couponClaimed && (
        <div className="mt-2.5 pt-2 border-t border-brandBorder flex items-center justify-between gap-2">
          <span className="text-[10px] text-brandText2 flex items-center gap-1 font-medium">
            <Tag className="w-3 h-3 text-brandRed" />
            First order? Get 10% OFF:
          </span>
          <button
            type="button"
            onClick={handleClaimMysteryCoupon}
            className="px-2 py-0.5 rounded bg-brandRed text-white font-bold text-[10px] hover:bg-red-700 transition-colors"
          >
            Claim VISHNU10
          </button>
        </div>
      )}
    </div>
  );
};

