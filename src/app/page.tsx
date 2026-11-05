'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RotateCcw, Utensils, ArrowRight, Sparkles } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { CategoryChips } from '@/components/home/CategoryChips';
import { ProductSection } from '@/components/home/ProductSection';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatINR } from '@/lib/utils';

// Lazy-load below-the-fold sections for instant First Contentful Paint (FCP)
const PromoBanners = dynamic(() =>
  import('@/components/home/PromoBanners').then((mod) => mod.PromoBanners)
);
const FlavourQuiz = dynamic(() =>
  import('@/components/home/FlavourQuiz').then((mod) => mod.FlavourQuiz)
);
const Reviews = dynamic(() =>
  import('@/components/home/Reviews').then((mod) => mod.Reviews)
);

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lastOrder, setLastOrder] = useState<any | null>(null);
  const { products } = useProducts();
  const { addItem } = useCart();

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('vishnu-orders') || '[]');
      if (Array.isArray(savedOrders) && savedOrders.length > 0 && savedOrders[0]?.items?.length > 0) {
        setLastOrder(savedOrders[0]);
      }
    } catch (e) { }
  }, []);

  const handleOneTapReorder = () => {
    if (!lastOrder?.items) return;
    lastOrder.items.forEach((it: any) => {
      addItem({
        product_id: it.product_id || 'prod-1',
        name: it.name,
        slug: it.slug || 'tomato-thokku',
        size: it.size || '300g',
        price: it.unit_price || it.price || 120,
        base_price: it.unit_price || it.price || 120,
        mrp: it.mrp || 145,
        emoji: it.emoji || '🫙',
        qty: it.qty || 1,
      });
    });
  };

  // Filter products dynamically if category chip is selected on homepage
  const displayedProducts =
    activeCategory === 'all'
      ? products
      : products.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );

  // Best Sellers (first 4 featured items)
  const bestSellers = products.slice(0, 4);

  // More Products / Seasonal Specials
  const moreProducts = products.slice(4, 8);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

      {/* 1b. Returning Customer 1-Tap Pantry Refill Banner */}
      {lastOrder && (
        <div className="bg-gradient-to-r from-[#fff5f3] via-[#fffbeb] to-[#fff5f3] border-b border-red-200/60 py-3 px-4">
          <div className="max-w-site mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-brandRed text-white flex items-center justify-center shrink-0 shadow-xs">
                <RotateCcw className="w-4 h-4" />
              </span>
              <div>
                <span className="font-bold text-brandText">
                  Running low on your coastal pantry?
                </span>{' '}
                <span className="text-brandText2">
                  Last order ({lastOrder.items.map((i: any) => `${i.name} ×${i.qty}`).join(', ')}) —{' '}
                  <strong className="text-brandRed">{formatINR(lastOrder.total || 0)}</strong>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOneTapReorder}
              className="px-4 py-1.5 rounded-full bg-brandRed hover:bg-brandAccent-dark text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs shrink-0 transition-transform active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder in 1 Tap</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. Category Chips */}
      <CategoryChips
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* If a category filter is active, show filtered grid directly */}
      {activeCategory !== 'all' ? (
        <ProductSection
          title={`${activeCategory}`}
          subtitle={`Freshly made small batches ready for express shipping`}
          products={displayedProducts}
          viewAllHref={`/shop?category=${encodeURIComponent(activeCategory)}`}
        />
      ) : (
        <>
          {/* 4. Best Sellers */}
          <ProductSection
            title="Best Sellers"
            subtitle="Our most loved homemade traditional thokkus & pickles"
            products={bestSellers}
            viewAllHref="/shop"
          />

          {/* 5. Promotional Banners */}
          <PromoBanners />

          {/* 6. More Products & Regional Specials */}
          <ProductSection
            title="Mangalore Specials & Snacks"
            subtitle="Festive savouries, crunchy paper poha, and specialty recipes"
            products={moreProducts}
            viewAllHref="/shop"
          />

          {/* 6a. Interactive 30-Second Flavour Finder Quiz */}
          <FlavourQuiz />

          {/* 6b. Coastal Kitchen Recipes & Pairing Guide Spotlight */}
          <section className="py-10 px-4 max-w-site mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-[#2b090b] via-[#1a0808] to-[#3b120b] text-white p-7 sm:p-10 shadow-xl border border-amber-400/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Mangalore Heritage Kitchen Guide</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold">
                  Cook Authentic <span className="text-amber-400">Ghee Roast &amp; Coastal Meals</span> in 10 Mins
                </h2>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Explore step-by-step coastal recipes—from Kundapura Paneer/Chicken Ghee Roast and Temple Curd Rice bowls to Crispy Rava-Fried Bangude—with 1-tap jar pairing.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/recipes"
                  className="px-5 py-3 rounded-xl bg-brandRed hover:bg-brandRed/90 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
                >
                  <span>Explore Coastal Recipes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/combos"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-400/30 text-amber-300 font-bold text-xs inline-flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build 3-Jar Combo (15% OFF)</span>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 7. Verified Customer Reviews */}
      <Reviews />
    </div>
  );
}
