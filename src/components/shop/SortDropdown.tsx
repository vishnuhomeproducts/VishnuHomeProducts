'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc';

interface SortDropdownProps {
  sortBy: SortOption;
  onChange: (sort: SortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-3.5 h-3.5 text-brandText3 hidden sm:block" />
      <span className="text-xs text-brandText3 hidden sm:inline">Sort:</span>
      <select
        value={sortBy}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="px-3 py-1.5 text-xs bg-white border border-brandBorder rounded-button text-brandText font-medium focus:outline-none focus:border-brandAccent cursor-pointer"
      >
        <option value="popular">Most Popular</option>
        <option value="newest">Newest First</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
};
