'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatINR } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brandBorder last:border-0 group">
      
      {/* Product info */}
      <div className="flex items-center gap-4">
        {/* Media */}
        <div className="w-20 h-20 rounded-card bg-brandAccent-light border border-brandBorder flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
          {item.emoji || '🫙'}
        </div>

        <div>
          <Link
            href={`/product/${item.slug}`}
            className="font-semibold text-sm text-brandText hover:text-brandAccent transition-colors line-clamp-1"
          >
            {item.name}
          </Link>
          <div className="text-xs text-brandText3 mt-0.5">
            Pack Size: <span className="font-medium text-brandText2">{item.size}</span>
          </div>
          <div className="text-xs font-bold text-brandAccent mt-1 sm:hidden">
            {formatINR(item.price * item.qty)}
          </div>
        </div>
      </div>

      {/* Stepper, Subtotal, and Delete Action */}
      <div className="flex items-center justify-between sm:justify-end gap-6">
        
        {/* Quantity Stepper */}
        <div className="flex items-center border border-brandBorder rounded-button bg-white h-9 shadow-xs">
          <button
            type="button"
            onClick={() => updateQty(item.product_id, item.size, item.qty - 1)}
            className="px-2.5 h-full flex items-center justify-center text-brandText hover:bg-brandBg transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-xs font-bold text-brandText">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => updateQty(item.product_id, item.size, item.qty + 1)}
            className="px-2.5 h-full flex items-center justify-center text-brandText hover:bg-brandBg transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Price on larger screens */}
        <div className="hidden sm:block text-right min-w-[90px]">
          <div className="text-sm font-bold text-brandText">
            {formatINR(item.price * item.qty)}
          </div>
          {item.mrp > item.price && (
            <div className="text-xs text-brandText3 line-through">
              {formatINR(item.mrp * item.qty)}
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => removeItem(item.product_id, item.size)}
          className="text-brandText3 hover:text-brandRed p-2 rounded-full hover:bg-red-50 transition-colors"
          title="Remove from cart"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
