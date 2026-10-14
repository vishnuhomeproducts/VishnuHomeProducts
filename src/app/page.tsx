'use client';

import React, { useState } from 'react';
import { Hero } from '@/components/home/Hero';
import { TrustStrip } from '@/components/home/TrustStrip';
import { CategoryChips } from '@/components/home/CategoryChips';
import { ProductSection } from '@/components/home/ProductSection';
import { PromoBanners } from '@/components/home/PromoBanners';
import { Reviews } from '@/components/home/Reviews';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products dynamically if category chip is selected on homepage
  const displayedProducts =
    activeCategory === 'all'
      ? SAMPLE_PRODUCTS
      : SAMPLE_PRODUCTS.filter(
          (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
        );

  // Best Sellers (first 4 featured items)
  const bestSellers = SAMPLE_PRODUCTS.slice(0, 4);

  // More Products / Seasonal Specials
  const moreProducts = SAMPLE_PRODUCTS.slice(4, 8);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero />

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
        </>
      )}

      {/* 7. Verified Customer Reviews */}
      <Reviews />
    </div>
  );
}
