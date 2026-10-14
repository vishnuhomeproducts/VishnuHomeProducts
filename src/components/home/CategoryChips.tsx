'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/sampleProducts';

interface CategoryChipsProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-8 bg-brandBg border-b border-brandBorder">
      <div className="max-w-site mx-auto px-4">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-brandText">
            Shop by <span className="text-brandAccent">Category</span>
          </h2>
          <span className="text-xs text-brandText3">Select to filter</span>
        </div>

        {/* Scrollable Chip Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-pill text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                  isActive
                    ? 'bg-brandAccent text-white border-brandAccent shadow-sm scale-105'
                    : 'bg-white text-brandText hover:bg-brandAccent-light hover:text-brandAccent border-brandBorder shadow-sm'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
