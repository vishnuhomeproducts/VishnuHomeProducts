'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gift, Plus, ShieldCheck, Flame, Award } from 'lucide-react';
import { formatINR, calculateDiscountPercent } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

export const Hero: React.FC = () => {
  const { products } = useProducts();
  const { addItem } = useCart();

  const previewItems = products.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#190d0c] via-[#2b1111] to-[#471215] text-white border-b border-white/10 py-12 md:py-20">
      {/* Ambient Heritage Glows matching VISHNU Crimson & Coastal Gold */}
      <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-[#dc2626]/25 pointer-events-none blur-3xl" />
      <div className="absolute -bottom-32 right-10 w-[28rem] h-[28rem] rounded-full bg-amber-500/15 pointer-events-none blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-site mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (7 cols): Brand Story & High-Contrast CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Heritage Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 shadow-lg text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Mangalore Heritage Kitchen · Zero Preservatives · FSSAI Certified</span>
            </div>

            {/* H1 Playfair Display */}
            <h1 className="font-display text-3xl sm:text-5xl md:text-[54px] font-bold text-white leading-[1.12] tracking-tight">
              Authentic Coastal Flavours Crafted in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
                Mangalore
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
              From fiery Kundapura Ghee Roast masalas and sun-ripened Avakaya pickles to coastal sun-dried fish—slow-cooked in small home batches with 100% pure wood-pressed gingelly &amp; coconut oils.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-button bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-bold text-sm shadow-xl shadow-red-950/50 border border-red-400/30 transition-all active:scale-[0.98]"
              >
                <span>Explore Full Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/combos"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-button bg-white/10 hover:bg-white/20 backdrop-blur-md border border-amber-300/40 text-amber-200 font-bold text-sm transition-all"
              >
                <Gift className="w-4 h-4 text-amber-300" />
                <span>Build Custom Combo (Save 15%)</span>
              </Link>
            </div>

            {/* Trust & Heritage Stats Row */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-red-500/20 border border-red-400/30 text-amber-300 shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-extrabold text-white font-price">50+</div>
                  <div className="text-[11px] text-white/65 font-medium">Coastal Recipes</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-extrabold text-white font-price">4.9 ★</div>
                  <div className="text-[11px] text-white/65 font-medium">2,500+ Families</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-extrabold text-amber-300 font-price">100%</div>
                  <div className="text-[11px] text-white/65 font-medium">Wood-Pressed Oil</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols) - Showcase Card with Live 1-Click Add */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-amber-200/60 shadow-2xl text-brandText space-y-4 relative">
              {/* Top Ribbon */}
              <div className="flex items-center justify-between pb-3 border-b border-brandBorder">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brandRed animate-ping" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-brandText">
                    🔥 Today&apos;s Fresh Kitchen Batch
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-brandGreen border border-emerald-200 text-[10px] font-bold">
                  Ready to Ship
                </span>
              </div>

              <div className="space-y-2.5">
                {previewItems.map((item) => {
                  const sz = item.sizes?.[0] || { label: '300g', price: 120, mrp: 145 };
                  const disc = calculateDiscountPercent(sz.mrp, sz.price);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#fffaf5] to-white border border-brandBorder hover:border-brandRed/50 hover:shadow-md transition-all group"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center gap-3.5 min-w-0 flex-1"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fff0ed] to-[#fde2de] border border-red-200/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-xs">
                          {item.emoji || '🫙'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-brandText group-hover:text-brandRed transition-colors truncate">
                              {item.name}
                            </h4>
                            {disc > 0 && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-red-50 text-brandRed border border-red-200 shrink-0">
                                {disc}% OFF
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-brandText2 mt-0.5 font-medium">
                            Jar of {sz.label} •{' '}
                            <strong className="text-brandRed font-price text-xs">
                              {formatINR(sz.price)}
                            </strong>
                            {sz.mrp > sz.price && (
                              <span className="text-[10px] text-brandText3 line-through ml-1 font-price">
                                {formatINR(sz.mrp)}
                              </span>
                            )}
                          </p>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          addItem({
                            product_id: item.id,
                            name: item.name,
                            slug: item.slug,
                            size: sz.label,
                            price: sz.price,
                            mrp: sz.mrp,
                            emoji: item.emoji || '🫙',
                            qty: 1,
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-brandRed hover:bg-brandAccent-dark text-white font-bold text-xs inline-flex items-center gap-1 shrink-0 shadow-sm transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-brandBorder">
                <span className="text-[11px] text-brandText2 font-medium">
                  🚚 Free express shipping above ₹499
                </span>
                <Link
                  href="/shop"
                  className="font-bold text-brandRed hover:underline inline-flex items-center gap-1"
                >
                  <span>View All {products.length} Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
