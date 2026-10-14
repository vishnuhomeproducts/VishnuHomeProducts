'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-xs text-brandText3">
        Loading cart details...
      </div>
    );
  }

  return (
    <div className="py-8 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brandBorder">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
              Shopping Cart
            </h1>
            <p className="text-xs text-brandText2 mt-1">
              Review your selected coastal items before proceeding to checkout
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-brandAccent hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-card border border-brandBorder text-center space-y-4 shadow-sm max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-brandAccent-light text-brandAccent flex items-center justify-center mx-auto text-3xl">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-bold text-base text-brandText">Your cart is empty</h2>
            <p className="text-xs text-brandText2">
              Looks like you haven't added any authentic thokkus or pickles to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brandAccent hover:bg-brandAccent-mid text-white text-xs font-semibold rounded-button shadow-sm transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Cart Items List (65% / 8 cols) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-brandText3 pb-2 border-b border-brandBorder">
                Cart Items ({items.reduce((s, i) => s + i.qty, 0)})
              </div>

              <div className="divide-y divide-brandBorder">
                {items.map((item) => (
                  <CartItem key={`${item.product_id}-${item.size}`} item={item} />
                ))}
              </div>

              <div className="pt-4 border-t border-brandBorder flex justify-between items-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brandAccent hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Add more items</span>
                </Link>
              </div>
            </div>

            {/* Right: Order Summary (35% / 4 cols) */}
            <div className="lg:col-span-4">
              <OrderSummary showCheckoutButton={true} />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
