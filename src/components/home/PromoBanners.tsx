import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  return (
    <section className="py-6 bg-brandBg">
      <div className="max-w-site mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Banner 1: Coastal Dry Fish */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c1c1c] via-[#241708] to-[#2d1a00] p-6 text-white flex flex-col justify-between shadow-lg border border-white/10 group">
            <div className="absolute right-3 bottom-2 text-6xl opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-300">
              🐟
            </div>

            <div className="space-y-2.5 relative z-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brandAccent/20 border border-brandAccent/40 text-[10px] font-bold tracking-wider text-brandAccent uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Coastal Special</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                Authentic Sun-Dried Fish
              </h3>

              <p className="text-xs text-white/70">
                Freshly caught from the Arabian Sea, sun-cured naturally on Mangalore shores with zero chemicals.
              </p>
            </div>

            <div className="pt-5 relative z-10">
              <Link
                href="/shop?category=Dry+Fish"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-brandAccent hover:bg-brandAccent-mid text-white text-xs font-semibold shadow-md transition-all"
              >
                <span>Shop Dry Fish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Banner 2: Build Your Own Combo Box */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] p-6 text-white flex flex-col justify-between shadow-lg border border-white/10 group">
            <div className="absolute right-3 bottom-2 text-6xl opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-300">
              🎁
            </div>

            <div className="space-y-2.5 relative z-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/30 text-[10px] font-bold tracking-wider text-amber-200 uppercase">
                <Gift className="w-3 h-3" />
                <span>Bundle & Save 15%</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                Custom 3 & 5 Jar Combo Boxes
              </h3>

              <p className="text-xs text-white/80">
                Mix and match your favourite Thokkus, Pickles, and Podis into a custom family or gift box.
              </p>
            </div>

            <div className="pt-5 relative z-10">
              <Link
                href="/combos"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-white text-brandRed hover:bg-amber-50 text-xs font-bold shadow-md transition-all"
              >
                <span>Build Your Combo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Banner 3: Wedding Return Gifts & Bulk Calculator */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#fff8ed] to-[#fef3c7] p-6 text-brandText flex flex-col justify-between shadow-md border border-brandAccent/20 group">
            <div className="absolute right-3 bottom-2 text-6xl opacity-25 pointer-events-none group-hover:scale-110 transition-transform duration-300">
              🪔
            </div>

            <div className="space-y-2.5 relative z-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brandAccent/10 border border-brandAccent/30 text-[10px] font-bold tracking-wider text-brandAccent uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Up to 30% Wholesale Off</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-brandText leading-tight">
                Wedding Return-Gifts & Bulk Orders
              </h3>

              <p className="text-xs text-brandText2">
                Custom-labeled 150g Thamboolam gift jars & 5kg catering buckets with instant wholesale pricing.
              </p>
            </div>

            <div className="pt-5 relative z-10">
              <Link
                href="/bulk-orders"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-button bg-brandDark hover:bg-black text-white text-xs font-semibold shadow-md transition-all"
              >
                <span>Open Bulk Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
