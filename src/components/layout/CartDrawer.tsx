'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQty,
    getSubtotal,
    getDeliveryFee,
  } = useCart();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeDelivery = freeShippingThreshold - subtotal;

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slideLeft">
          
          {/* Header */}
          <div className="p-4 border-b border-brandBorder flex items-center justify-between bg-brandBg">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brandAccent" />
              <h2 className="font-bold text-brandText text-base">Your Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brandAccent-light text-brandAccent">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-brandBorder text-brandText2 hover:text-brandText transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-3 bg-brandAccent-light/60 border-b border-brandBorder text-xs">
            <div className="flex items-center gap-1.5 font-medium text-brandText mb-1.5">
              <Truck className="w-4 h-4 text-brandAccent shrink-0" />
              {remainingForFreeDelivery <= 0 ? (
                <span className="text-brandGreen font-semibold">🎉 You unlocked FREE Delivery!</span>
              ) : (
                <span>
                  Add <strong>{formatINR(remainingForFreeDelivery)}</strong> more for <strong>FREE Delivery</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-brandBorder h-2 rounded-full overflow-hidden">
              <div
                className="bg-brandAccent h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-brandBorder">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brandAccent-light text-brandAccent flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <h3 className="font-semibold text-brandText text-base">Your cart is empty</h3>
                <p className="text-xs text-brandText2 max-w-xs mx-auto">
                  Explore our authentic homemade thokkus, pickles, and dry fish from Mangalore.
                </p>
                <Button
                  onClick={closeDrawer}
                  variant="primary"
                  size="sm"
                  className="mt-2"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.product_id}-${item.size}`} className="py-3 flex gap-3 group">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-card bg-brandAccent-light border border-brandBorder flex items-center justify-center text-2xl shrink-0">
                    {item.emoji || '🫙'}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="font-semibold text-xs text-brandText hover:text-brandAccent line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product_id, item.size)}
                        className="text-brandText3 hover:text-brandRed p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-brandText3 mt-0.5">
                      Size: <span className="font-medium text-brandText2">{item.size}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-brandBorder rounded bg-brandBg">
                        <button
                          onClick={() => updateQty(item.product_id, item.size, item.qty - 1)}
                          className="px-2 py-0.5 hover:bg-brandBorder text-brandText transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-brandText min-w-[20px] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.product_id, item.size, item.qty + 1)}
                          className="px-2 py-0.5 hover:bg-brandBorder text-brandText transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xs font-bold text-brandText">
                          {formatINR(item.price * item.qty)}
                        </div>
                        {item.mrp > item.price && (
                          <div className="text-[10px] text-brandText3 line-through">
                            {formatINR(item.mrp * item.qty)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 border-t border-brandBorder bg-brandBg space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-brandText2">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brandText">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brandText2">
                  <span>Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-brandGreen font-bold">FREE</span>
                    ) : (
                      formatINR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brandText pt-1 border-t border-brandBorder">
                  <span>Estimated Total</span>
                  <span className="text-brandAccent">{formatINR(subtotal + deliveryFee)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full text-center py-2.5 text-xs font-semibold border border-brandBorder bg-white text-brandText hover:border-brandAccent rounded-button transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold bg-brandAccent hover:bg-brandAccent-mid text-white rounded-button shadow-sm transition-colors"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[10px] text-center text-brandText3">
                🔒 Guaranteed safe & secure checkout with Razorpay
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
