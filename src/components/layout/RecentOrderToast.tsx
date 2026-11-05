'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, CheckCircle2, Tag, Gift, Sparkles } from 'lucide-react';
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

const MYSTERY_OFFERS = [
  {
    code: 'VISHNU10',
    title: 'Flat 10% OFF Storewide',
    sub: 'No minimum order required • Valid on all jars',
    discount_type: 'percent' as const,
    discount_value: 10,
    min_order: 0,
  },
  {
    code: 'MANGALORE50',
    title: '₹50 Instant Coastal Cashback',
    sub: 'Valid on orders ₹499+ • Plus FREE Express Delivery',
    discount_type: 'fixed' as const,
    discount_value: 50,
    min_order: 499,
  },
  {
    code: 'FESTIVE15',
    title: '15% Festive Family Discount',
    sub: 'Valid on orders ₹799+ • Best for 4+ Jars',
    discount_type: 'percent' as const,
    discount_value: 15,
    min_order: 799,
  },
];

export const RecentOrderToast: React.FC = () => {
  const { applyCoupon, coupon } = useCart();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 5000);

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

  const current = RECENT_PURCHASES[index];

  const handleSelectOffer = (offer: (typeof MYSTERY_OFFERS)[0]) => {
    applyCoupon({
      code: offer.code,
      discount_type: offer.discount_type,
      discount_value: offer.discount_value,
      min_order: offer.min_order,
      active: true,
    });
    setShowOfferModal(false);
  };

  return (
    <>
      {/* Interactive Mystery Coastal Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-300/60">
            <div className="bg-gradient-to-br from-[#2b090b] via-[#1a0808] to-[#3b120b] text-white p-6 relative">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                Exclusive Mangalore Kitchen Rewards
              </div>
              <h3 className="font-display text-2xl font-bold">
                Pick Your <span className="text-amber-400">Coastal Reward</span> 🎁
              </h3>
              <p className="text-xs text-white/75 mt-1">
                Tap any offer below to auto-apply it directly to your shopping cart!
              </p>
            </div>

            <div className="p-5 space-y-3">
              {MYSTERY_OFFERS.map((offer) => {
                const isApplied = coupon?.code === offer.code;
                return (
                  <div
                    key={offer.code}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isApplied
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-brandBg border-brandBorder hover:border-brandRed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded bg-brandRed text-white">
                          {offer.code}
                        </span>
                        <span className="font-bold text-xs text-brandText">{offer.title}</span>
                      </div>
                      <p className="text-[11px] text-brandText2 mt-1">{offer.sub}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectOffer(offer)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 ${
                        isApplied
                          ? 'bg-brandGreen text-white'
                          : 'bg-brandText hover:bg-brandRed text-white transition-colors'
                      }`}
                    >
                      {isApplied ? '✓ Applied' : 'Apply'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom-Left Social Proof Toast + Mystery Offer Trigger */}
      {!dismissed && visible && (
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

          <div className="mt-2.5 pt-2 border-t border-brandBorder flex items-center justify-between gap-2">
            <span className="text-[10px] text-brandText2 flex items-center gap-1 font-medium">
              <Gift className="w-3 h-3 text-brandRed" />
              {coupon ? `Active: ${coupon.code}` : 'Unlock up to 15% OFF:'}
            </span>
            <button
              type="button"
              onClick={() => setShowOfferModal(true)}
              className="px-2.5 py-0.5 rounded bg-brandRed text-white font-bold text-[10px] hover:bg-red-700 transition-colors"
            >
              {coupon ? 'Change Offer' : '🎁 Claim Offer'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
