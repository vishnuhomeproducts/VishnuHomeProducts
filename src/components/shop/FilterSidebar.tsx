'use client';

import React from 'react';
import { RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/sampleProducts';
import { formatINR } from '@/lib/utils';

interface FilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  onResetFilters: () => void;
  isFiltersActive: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onMaxPriceChange,
  inStockOnly,
  onInStockChange,
  onResetFilters,
  isFiltersActive,
}) => {
  return (
    <aside className="w-full lg:w-60 shrink-0 space-y-6 bg-white p-5 rounded-card border border-brandBorder shadow-sm self-start lg:sticky lg:top-20">
      
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between pb-3 border-b border-brandBorder">
        <div className="flex items-center gap-2 font-bold text-sm text-brandText">
          <SlidersHorizontal className="w-4 h-4 text-brandAccent" />
          <span>Filters</span>
        </div>
        {isFiltersActive && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-brandAccent hover:text-brandAccent-mid flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brandText3">
          Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected =
              cat.id === 'all'
                ? selectedCategory === 'all' || !selectedCategory
                : selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-brandAccent-light text-brandAccent font-bold'
                    : 'text-brandText hover:bg-brandBg hover:text-brandAccent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brandAccent" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-4 border-t border-brandBorder">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-brandText3">Max Price</span>
          <span className="font-bold text-brandAccent">{formatINR(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="50"
          max="600"
          step="10"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-brandBorder rounded-lg appearance-none cursor-pointer accent-brandAccent"
        />
        <div className="flex justify-between text-[10px] text-brandText3">
          <span>₹50</span>
          <span>₹600</span>
        </div>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-4 border-t border-brandBorder">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded border-brandBorder text-brandAccent focus:ring-brandAccent accent-brandAccent"
          />
          <span className="text-xs font-semibold text-brandText">In Stock Only</span>
        </label>
      </div>

    </aside>
  );
};
