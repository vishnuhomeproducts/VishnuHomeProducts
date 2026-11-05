'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    coupon,
    isDrawerOpen,
    closeDrawer,
    addItem,
    removeItem,
    updateQty,
    applyCoupon,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotal,
    freeShippingThreshold: storeThreshold,
  } = useCart();
  const { products } = useProducts();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotal();
  const freeShippingThreshold = storeThreshold || 499;
  const tier2Threshold = 799;
  const tier3Threshold = 1199;
  const progressPercent = Math.min(100, (subtotal / tier3Threshold) * 100);
  const remainingForFreeDelivery = freeShippingThreshold - subtotal;

  // Suggest up to 2 products not currently in cart for 1-tap upsell
  const upsellProducts = products
    .filter((p) => p.in_stock && !items.some((i) => i.product_id === p.id))
    .slice(0, 2);

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

  const buildWhatsAppCartLink = () => {
    const lines = items.map(
      (i, idx) => `${idx + 1}. ${i.name} (${i.size}) x ${i.qty} = ₹${i.price * i.qty}`
    );
    const msg = [
      'Namaskara Vishnu Home Products! 🙏',
      'I would like to place an order for:',
      ...lines,
      `Subtotal: ₹${subtotal}`,
      `Delivery: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}`,
      `*Total: ₹${subtotal + deliveryFee}*`,
      '',
      'Please share payment/delivery confirmation.',
    ].join('\n');
    return `https://wa.me/919845012345?text=${encodeURIComponent(msg)}`;
  };

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

          {/* 3-Stage Multi-Tier Cart Milestone Progress Bar */}
          <div className="p-3.5 bg-gradient-to-r from-[#fff5f3] to-[#fffbeb] border-b border-brandBorder text-xs space-y-2">
            <div className="flex items-center justify-between gap-2 font-medium text-brandText">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-brandRed shrink-0" />
                {subtotal < freeShippingThreshold ? (
                  <span>
                    Add <strong className="text-brandRed">{formatINR(freeShippingThreshold - subtotal)}</strong> for{' '}
                    <strong>FREE Express Delivery</strong>
                  </span>
                ) : subtotal < tier2Threshold ? (
                  <span>
                    <strong className="text-brandGreen">✓ Free Delivery!</strong> Add{' '}
                    <strong className="text-brandRed">{formatINR(tier2Threshold - subtotal)}</strong> for{' '}
                    <strong>10% OFF</strong>
                  </span>
                ) : subtotal < tier3Threshold ? (
                  <span>
                    <strong className="text-brandGreen">✓ 10% OFF Unlocked!</strong> Add{' '}
                    <strong className="text-brandRed">{formatINR(tier3Threshold - subtotal)}</strong> for{' '}
                    <strong>15% OFF</strong>
                  </span>
                ) : (
                  <span className="text-brandGreen font-bold">
                    🎉 All 3 Rewards Unlocked! (Free Delivery + 15% OFF)
                  </span>
                )}
              </div>

              {subtotal >= tier3Threshold && coupon?.code !== 'FESTIVE15' ? (
                <button
                  type="button"
                  onClick={() =>
                    applyCoupon({
                      code: 'FESTIVE15',
                      discount_type: 'percent',
                      discount_value: 15,
                      min_order: 799,
                      active: true,
                    })
                  }
                  className="px-2 py-0.5 rounded bg-brandRed text-white font-bold text-[10px] shrink-0 shadow-xs"
                >
                  Apply 15% OFF
                </button>
              ) : subtotal >= tier2Threshold && !coupon ? (
                <button
                  type="button"
                  onClick={() =>
                    applyCoupon({
                      code: 'VISHNU10',
                      discount_type: 'percent',
                      discount_value: 10,
                      min_order: 0,
                      active: true,
                    })
                  }
                  className="px-2 py-0.5 rounded bg-brandRed text-white font-bold text-[10px] shrink-0 shadow-xs"
                >
                  Apply 10% OFF
                </button>
              ) : null}
            </div>

            <div className="w-full bg-brandBorder h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brandRed to-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 text-[10px] font-semibold pt-0.5">
              <div className={subtotal >= freeShippingThreshold ? 'text-brandGreen font-bold' : 'text-brandText3'}>
                {subtotal >= freeShippingThreshold ? '✓' : '○'} ₹{freeShippingThreshold} Free Ship
              </div>
              <div className={`text-center ${subtotal >= tier2Threshold ? 'text-brandGreen font-bold' : 'text-brandText3'}`}>
                {subtotal >= tier2Threshold ? '✓' : '○'} ₹{tier2Threshold} (10% OFF)
              </div>
              <div className={`text-right ${subtotal >= tier3Threshold ? 'text-brandGreen font-bold' : 'text-brandText3'}`}>
                {subtotal >= tier3Threshold ? '✓' : '○'} ₹{tier3Threshold} (15% OFF)
              </div>
            </div>
          </div>

          {/* Items List + 1-Tap Upsell */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brandAccent-light text-brandAccent flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <h3 className="font-semibold text-brandText text-base">Your cart is empty</h3>
                <p className="text-xs text-brandText2 max-w-xs mx-auto">
                  Explore our authentic homemade thokkus, pickles, and dry fish from Mangalore.
                </p>
                <Button onClick={closeDrawer} variant="primary" size="sm" className="mt-2">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-brandBorder">
                  {items.map((item) => (
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
                  ))}
                </div>

                {/* In-Cart 1-Tap Upsell Strip */}
                {upsellProducts.length > 0 && (
                  <div className="pt-3 border-t border-brandBorder space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-brandAccent">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Pair With Your Order
                      </span>
                      {remainingForFreeDelivery > 0 && (
                        <span className="text-[10px] text-brandGreen font-semibold">
                          Unlock Free Shipping
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {upsellProducts.map((up) => {
                        const sz = up.sizes?.[0] || { label: '250g', price: 120, mrp: 150 };
                        return (
                          <div
                            key={up.id}
                            className="p-2.5 rounded-xl bg-brandBg border border-brandBorder flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xl shrink-0">{up.emoji || '🫙'}</span>
                              <div className="min-w-0">
                                <div className="font-semibold text-brandText truncate">
                                  {up.name}
                                </div>
                                <div className="text-[11px] text-brandText3">
                                  {sz.label} • <strong className="text-brandText">{formatINR(sz.price)}</strong>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                addItem({
                                  product_id: up.id,
                                  name: up.name,
                                  slug: up.slug,
                                  size: sz.label,
                                  price: sz.price,
                                  mrp: sz.mrp,
                                  emoji: up.emoji || '🫙',
                                  qty: 1,
                                })
                              }
                              className="px-2.5 py-1.5 bg-white hover:bg-brandAccent hover:text-white text-brandAccent border border-brandAccent font-bold text-[11px] rounded-lg shrink-0 transition-colors"
                            >
                              + Add
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 border-t border-brandBorder bg-brandBg space-y-2.5">
              <div className="space-y-1 text-xs">
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
                {discount > 0 && (
                  <div className="flex justify-between text-brandGreen font-semibold">
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-brandText pt-1 border-t border-brandBorder">
                  <span>Estimated Total</span>
                  <span className="text-brandAccent">{formatINR(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full text-center py-2.5 text-xs font-semibold border border-brandBorder bg-white text-brandText hover:border-brandAccent rounded-button transition-colors"
                >
                  View Cart & Coupons
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

              <a
                href={buildWhatsAppCartLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-button bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
                <span>Order Directly on WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
