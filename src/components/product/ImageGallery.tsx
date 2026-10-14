'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

interface ImageGalleryProps {
  product: Product;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ product }) => {
  const [activeThumb, setActiveThumb] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  // Fallback visual thumbnails for gallery demonstration
  const galleryThumbs = [
    { label: 'Main View', emoji: product.emoji || '🫙' },
    { label: 'Ingredients', emoji: '🌿' },
    { label: 'Texture', emoji: '✨' },
    { label: 'Packaging', emoji: '📦' },
  ];

  return (
    <div className="space-y-4">
      {/* Main Large Visual Frame */}
      <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-br from-brandAccent-light to-brandAccent-subtle/50 border border-brandBorder flex items-center justify-center overflow-hidden shadow-sm">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {product.badge && <Badge type={product.badge} className="text-xs px-2.5 py-1" />}
          <span className="text-[10px] font-bold bg-white/90 text-brandText px-2 py-0.5 rounded shadow-sm">
            100% Homemade
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-brandRed/10 text-brandRed scale-110 shadow'
              : 'bg-white/80 text-brandText3 hover:text-brandRed hover:bg-white shadow-sm'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-brandRed text-brandRed' : ''}`} />
        </button>

        {/* Main Display Emoji/Image */}
        <div className="text-8xl sm:text-9xl transform hover:scale-105 transition-transform duration-300 select-none animate-fadeIn">
          {galleryThumbs[activeThumb].emoji}
        </div>

        {/* Caption */}
        <div className="absolute bottom-3 left-4 right-4 text-center">
          <span className="text-[11px] font-medium text-brandText2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-brandBorder/60 shadow-xs">
            {galleryThumbs[activeThumb].label}
          </span>
        </div>
      </div>

      {/* 4 Thumbnail Strip */}
      <div className="grid grid-cols-4 gap-3">
        {galleryThumbs.map((item, idx) => (
          <button
            key={item.label}
            onClick={() => setActiveThumb(idx)}
            className={`aspect-square rounded-card border flex flex-col items-center justify-center transition-all ${
              activeThumb === idx
                ? 'border-brandAccent bg-brandAccent-light ring-2 ring-brandAccent/20'
                : 'border-brandBorder bg-white hover:border-brandAccent/50'
            }`}
          >
            <span className="text-2xl sm:text-3xl">{item.emoji}</span>
            <span className="text-[9px] font-semibold text-brandText3 mt-1 truncate px-1">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
