import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PromoBanners: React.FC = () => {
  return (
    <section className="py-6 bg-brandBg">
      <div className="max-w-site mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Banner: Coastal Dry Fish (Dark Theme) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c1c1c] via-[#241708] to-[#2d1a00] p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg border border-white/10 group">
            
            {/* Background floating emoji */}
            <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-300">
              🐟
            </div>

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brandAccent/20 border border-brandAccent/40 text-[11px] font-bold tracking-wider text-brandAccent uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Coastal Special</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                Authentic Sun-Dried Fish
              </h3>

              <p className="text-xs sm:text-sm text-white/70 max-w-sm">
                Freshly caught from the Arabian Sea, sun-cured naturally on the Mangalore shores with zero chemical additives.
              </p>
            </div>

            <div className="pt-6 relative z-10">
              <Link
                href="/shop?category=Dry+Fish"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-brandAccent hover:bg-brandAccent-mid text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98]"
              >
                <span>Shop Dry Fish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Banner: Ayurvedic Hair Oil (Warm Amber Theme) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#fff8ed] to-[#fef3c7] p-6 sm:p-8 text-brandText flex flex-col justify-between shadow-md border border-brandAccent/20 group">
            
            {/* Background floating emoji */}
            <div className="absolute right-4 bottom-2 text-7xl opacity-30 pointer-events-none group-hover:scale-110 transition-transform duration-300">
              🪔
            </div>

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brandAccent/10 border border-brandAccent/30 text-[11px] font-bold tracking-wider text-brandAccent uppercase">
                <Sparkles className="w-3 h-3" />
                <span>Wellness Range</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-brandText leading-tight">
                Ayurvedic Herbal Hair Oil
              </h3>

              <p className="text-xs sm:text-sm text-brandText2 max-w-sm">
                Slow-infused with 18 coastal botanicals in cold-pressed virgin coconut oil for deep root nourishment.
              </p>
            </div>

            <div className="pt-6 relative z-10">
              <Link
                href="/product/ayurvedic-hair-oil"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-button bg-brandDark hover:bg-black text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98]"
              >
                <span>Explore Hair Oil</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
