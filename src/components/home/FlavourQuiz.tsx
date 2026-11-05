'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatINR, getProductCulinaryProfile } from '@/lib/utils';

export const FlavourQuiz: React.FC = () => {
  const { products } = useProducts();
  const { addItem } = useCart();

  const [mealPref, setMealPref] = useState<'rice' | 'dosa' | 'roti'>('rice');
  const [spicePref, setSpicePref] = useState<'fiery' | 'tangy' | 'mild'>('tangy');
  const [dietPref, setDietPref] = useState<'veg' | 'garlic' | 'seafood'>('veg');
  const [addedPack, setAddedPack] = useState(false);

  // Recommend 2 matching products based on selections
  const recommended = products
    .filter((p) => {
      const profile = getProductCulinaryProfile(p);
      if (dietPref === 'seafood') {
        return profile.dietary === 'Coastal Seafood';
      }
      if (dietPref === 'veg' && profile.dietary === 'Coastal Seafood') {
        return false;
      }
      if (dietPref === 'garlic' && !p.name.toLowerCase().includes('garlic') && profile.noOnionGarlic) {
        return spicePref === 'fiery' ? profile.chilies >= 3 : true;
      }
      if (spicePref === 'fiery') return profile.chilies >= 3;
      if (spicePref === 'mild') return profile.chilies <= 2;
      return true;
    })
    .slice(0, 2);

  const finalPicks = recommended.length >= 2 ? recommended : products.slice(0, 2);

  const packTotal = finalPicks.reduce(
    (sum, p) => sum + (p.sizes?.[0]?.price || 120),
    0
  );

  const handleAddRecommendedPack = () => {
    finalPicks.forEach((p) => {
      const sz = p.sizes?.[0] || { label: '300g', price: 120, mrp: 145 };
      addItem({
        product_id: p.id,
        name: p.name,
        slug: p.slug,
        size: sz.label,
        price: sz.price,
        base_price: sz.price,
        mrp: sz.mrp,
        tiered_price_type: p.tiered_price_type,
        tiered_price_slabs: p.tiered_price_slabs,
        emoji: p.emoji || '🫙',
        qty: 1,
      });
    });
    setAddedPack(true);
    setTimeout(() => setAddedPack(false), 2000);
  };

  return (
    <section className="py-10 px-4 max-w-site mx-auto">
      <div className="bg-white rounded-3xl border border-brandBorder shadow-card p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive 3-Step Selector */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brandRed mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>30-Second Mangalore Flavour Finder</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
              Not Sure Which Jar to Pick?
            </h2>
            <p className="text-xs text-brandText2 mt-1">
              Tell us how you love your meals and we&apos;ll pair your ideal coastal jars.
            </p>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Step 1 */}
            <div>
              <div className="font-bold text-brandText mb-1.5">1. Your Favourite Daily Meal:</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rice', label: '🍚 Hot Rice & Ghee' },
                  { id: 'dosa', label: '🥞 Idli / Dosa / Tiffin' },
                  { id: 'roti', label: '🫓 Chapati / Parotta' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setMealPref(opt.id as any)}
                    className={`py-2 px-2.5 rounded-xl border font-bold text-[11px] transition-all ${
                      mealPref === opt.id
                        ? 'bg-brandRed text-white border-brandRed shadow-xs'
                        : 'bg-brandBg text-brandText border-brandBorder hover:border-brandRed/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="font-bold text-brandText mb-1.5">2. Your Spice &amp; Tang Preference:</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'tangy', label: '🌶️🌶️ Medium Tangy' },
                  { id: 'fiery', label: '🌶️🌶️🌶️ Fiery Coastal' },
                  { id: 'mild', label: '🌿 Mild & Aromatic' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSpicePref(opt.id as any)}
                    className={`py-2 px-2.5 rounded-xl border font-bold text-[11px] transition-all ${
                      spicePref === opt.id
                        ? 'bg-brandRed text-white border-brandRed shadow-xs'
                        : 'bg-brandBg text-brandText border-brandBorder hover:border-brandRed/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="font-bold text-brandText mb-1.5">3. Dietary Preference:</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'veg', label: '🌱 100% Pure Veg' },
                  { id: 'garlic', label: '🧄 Garlic Lover' },
                  { id: 'seafood', label: '🐟 Coastal Dry Fish' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDietPref(opt.id as any)}
                    className={`py-2 px-2.5 rounded-xl border font-bold text-[11px] transition-all ${
                      dietPref === opt.id
                        ? 'bg-brandRed text-white border-brandRed shadow-xs'
                        : 'bg-brandBg text-brandText border-brandBorder hover:border-brandRed/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recommended 2-Jar Tasting Pack */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#fff5f3] to-[#fffbeb] border border-red-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brandRed">
              ✨ Your Custom Mangalore Pairing
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-brandGreen">
              Fresh Batch Ready
            </span>
          </div>

          <div className="space-y-2.5">
            {finalPicks.map((p) => {
              const sz = p.sizes?.[0] || { label: '300g', price: 120, mrp: 145 };
              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-white border border-brandBorder flex items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{p.emoji || '🫙'}</span>
                    <div className="min-w-0">
                      <Link
                        href={`/product/${p.slug}`}
                        className="font-bold text-brandText hover:text-brandRed truncate block"
                      >
                        {p.name}
                      </Link>
                      <div className="text-[11px] text-brandText3">
                        {sz.label} • <strong className="text-brandText">{formatINR(sz.price)}</strong>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/product/${p.slug}`}
                    className="text-[11px] font-bold text-brandRed hover:underline shrink-0"
                  >
                    View →
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-red-200/60 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-brandText3 font-semibold uppercase">2-Jar Pack Total</div>
              <div className="text-lg font-extrabold text-brandRed font-price">
                {formatINR(packTotal)}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddRecommendedPack}
              className="px-5 py-2.5 rounded-xl bg-brandRed hover:bg-brandAccent-dark text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
            >
              {addedPack ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pack Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Add Both Jars</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

