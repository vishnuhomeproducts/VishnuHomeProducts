'use client';

import React from 'react';
import { SizeOption } from '@/types';
import { formatINR } from '@/lib/utils';

interface SizePickerProps {
  sizes: SizeOption[];
  selectedIndex: number;
  onSelectSize: (index: number) => void;
}

export const SizePicker: React.FC<SizePickerProps> = ({
  sizes,
  selectedIndex,
  onSelectSize,
}) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-brandText">
        <span>Select Pack Size:</span>
        <span className="text-brandAccent font-bold">{sizes[selectedIndex]?.label}</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {sizes.map((size, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={size.label}
              onClick={() => onSelectSize(idx)}
              className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-pill text-xs font-semibold border transition-all duration-150 flex flex-col items-center justify-center gap-0.5 ${
                isSelected
                  ? 'bg-brandAccent text-white border-brandAccent shadow-sm scale-[1.02]'
                  : 'bg-white text-brandText border-brandBorder hover:border-brandAccent/60 hover:bg-brandAccent-light/40'
              }`}
            >
              <span>{size.label}</span>
              <span className={`text-[11px] font-bold ${isSelected ? 'text-white/90' : 'text-brandAccent'}`}>
                {formatINR(size.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
