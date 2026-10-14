import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { formatINR } from '@/lib/utils';

const PREVIEW_ITEMS = [
  { name: 'Tomato Thokku', weight: '300g', price: 120, emoji: '🍅', slug: 'tomato-thokku' },
  { name: 'Avakaya Mango Pickle', weight: '300g', price: 120, emoji: '🥭', slug: 'avakaya-mango-pickle' },
  { name: 'Garlic Thokku (Poondu)', weight: '300g', price: 120, emoji: '🧄', slug: 'garlic-thokku' },
  { name: 'Dry Fish Kollatharu', weight: '200g', price: 199, emoji: '🐟', slug: 'dry-fish-kollatharu' },
];

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fffbf5] via-[#fff8ed] to-[#fef3c7] border-b border-brandBorder py-12 md:py-16">
      
      {/* Decorative ambient background circle */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brandAccent/[0.07] pointer-events-none blur-2xl" />

      <div className="max-w-site mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (60% split: 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-brandAccent/40 shadow-sm text-xs font-semibold text-brandAccent">
              <Sparkles className="w-3.5 h-3.5 text-brandAccent" />
              <span>Homemade · No Preservatives · FSSAI Certified</span>
            </div>

            {/* H1 Playfair Display */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brandText leading-[1.15] tracking-tight">
              Authentic Homemade Flavours from{' '}
              <span className="text-brandAccent underline decoration-brandAccent/30 decoration-wavy underline-offset-4">
                Mangalore
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm md:text-base text-brandText2 leading-relaxed max-w-xl">
              Handcrafted in small batches using traditional wood-pressed oils, sun-ripened ingredients, and time-honoured coastal recipes. Pure comfort delivered straight from our home kitchen to your dining table.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-button bg-brandAccent hover:bg-brandAccent-mid text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-button bg-white border border-brandAccent text-brandAccent hover:bg-brandAccent-light font-semibold text-sm transition-all"
              >
                <span>View All Products</span>
              </Link>
            </div>

            {/* Stats Row with Dividers */}
            <div className="pt-6 border-t border-brandBorder/80 grid grid-cols-3 gap-2 max-w-lg">
              <div className="pr-3">
                <div className="text-lg md:text-xl font-bold text-brandText">50+</div>
                <div className="text-xs text-brandText3 font-medium">Products</div>
              </div>
              <div className="px-3 border-x border-brandBorder/80">
                <div className="text-lg md:text-xl font-bold text-brandText">2,000+</div>
                <div className="text-xs text-brandText3 font-medium">Happy Orders</div>
              </div>
              <div className="pl-3">
                <div className="text-lg md:text-xl font-bold text-brandAccent">100%</div>
                <div className="text-xs text-brandText3 font-medium">Homemade</div>
              </div>
            </div>

          </div>

          {/* Right Column (40% split: 5 cols) - Stacked Mini Cards */}
          <div className="lg:col-span-5">
            <div className="bg-white/70 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-brandBorder shadow-xl space-y-3">
              <div className="text-xs font-bold text-brandText uppercase tracking-wider flex items-center justify-between pb-1 border-b border-brandBorder">
                <span>🔥 Customer Favorites</span>
                <span className="text-brandAccent text-[11px] font-medium">Delivering Fresh</span>
              </div>

              <div className="space-y-2.5">
                {PREVIEW_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={`/product/${item.slug}`}
                    className="flex items-center justify-between p-3 rounded-card bg-white border border-brandBorder shadow-sm hover:shadow-cardHover hover:border-brandAccent/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-brandAccent-light flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-brandText group-hover:text-brandAccent transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-brandText3">Pack of {item.weight}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-brandAccent">
                        {formatINR(item.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-brandAccent hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore full coastal catalog</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
