'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

interface ImageGalleryProps {
  product: Product;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ product }) => {
  const [activeThumb, setActiveThumb] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const galleryThumbs = [
    { label: 'Fresh Jar View', emoji: product.emoji || '🫙', sub: 'Small-Batch Sealed' },
    { label: 'Pure Ingredients', emoji: '🌶️', sub: 'Sun-Ripened Spices' },
    { label: 'Wood-Pressed Oil', emoji: '🪔', sub: '100% Cold-Pressed' },
    { label: 'Leak-Proof Pack', emoji: '📦', sub: 'Vacuum Protected' },
  ];

  return (
    <div className="space-y-4">
      {/* Main Large Visual Frame */}
      <div className="relative aspect-square w-full rounded-3xl bg-gradient-to-br from-[#fff5f3] via-[#ffede8] to-[#fde0d9] border border-red-200/70 flex items-center justify-center overflow-hidden shadow-card">
        {/* Decorative background halo */}
        <div className="w-64 h-64 rounded-full bg-white/60 blur-2xl absolute pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {product.badge && <Badge type={product.badge} className="text-xs px-3 py-1 shadow-xs" />}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/95 text-brandRed border border-red-200 px-2.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>100% Mangalore Homemade</span>
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-brandRed text-white scale-110 shadow-md'
              : 'bg-white/90 text-brandText3 hover:text-brandRed hover:bg-white shadow-sm'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white text-white' : ''}`} />
        </button>

        {/* Main Display Emoji/Image */}
        <div className="relative z-10 text-8xl sm:text-9xl transform hover:scale-110 transition-transform duration-300 select-none animate-fadeIn drop-shadow-md">
          {galleryThumbs[activeThumb].emoji}
        </div>

        {/* Bottom Caption Pill */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="text-[11px] font-bold text-brandText bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-brandBorder shadow-xs">
            {galleryThumbs[activeThumb].label} — <span className="text-brandRed">{galleryThumbs[activeThumb].sub}</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-brandGreen bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FSSAI Certified</span>
          </span>
        </div>
      </div>

      {/* 4 Thumbnail Strip */}
      <div className="grid grid-cols-4 gap-3">
        {galleryThumbs.map((item, idx) => (
          <button
            key={item.label}
            onClick={() => setActiveThumb(idx)}
            className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all p-2 ${
              activeThumb === idx
                ? 'border-brandRed bg-brandAccent-light ring-2 ring-brandRed/20 shadow-xs'
                : 'border-brandBorder bg-white hover:border-brandRed/50'
            }`}
          >
            <span className="text-2xl sm:text-3xl">{item.emoji}</span>
            <span className="text-[10px] font-bold text-brandText mt-1.5 truncate w-full text-center">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
