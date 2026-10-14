'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantityPickerProps {
  quantity: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
}

export const QuantityPicker: React.FC<QuantityPickerProps> = ({
  quantity,
  onChange,
  min = 1,
  max = 20,
}) => {
  return (
    <div className="flex items-center border border-brandBorder rounded-button bg-white overflow-hidden shadow-xs h-12">
      <button
        type="button"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="px-3.5 h-full flex items-center justify-center text-brandText hover:bg-brandBg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-12 text-center text-sm font-bold text-brandText select-none">
        {quantity}
      </span>

      <button
        type="button"
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="px-3.5 h-full flex items-center justify-center text-brandText hover:bg-brandBg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
