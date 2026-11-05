'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check, Star } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatINR, calculateDiscountPercent } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const currentSize =
    product.sizes && product.sizes.length > 0
      ? product.sizes[selectedSizeIndex]
      : { label: 'Standard', price: 120, mrp: 145 };

  const discountPercent = calculateDiscountPercent(currentSize.mrp, currentSize.price);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      size: currentSize.label,
      price: currentSize.price,
      mrp: currentSize.mrp,
      emoji: product.emoji || '🫙',
      qty: 1,
    });

    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white border border-brandBorder rounded-card overflow-hidden hover:shadow-cardHover hover:border-brandRed/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image / Media Area */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-[#fff7f5] via-[#fff2ee] to-[#fde8e4] flex items-center justify-center overflow-hidden border-b border-brandBorder/50">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.badge && <Badge type={product.badge} />}
          {discountPercent > 0 && (
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md shadow-xs transition-all duration-200 ${
            isWishlisted
              ? 'bg-brandRed text-white scale-110'
              : 'bg-white/90 text-brandText3 hover:text-brandRed hover:bg-white'
          }`}
          title="Save to wishlist"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : ''}`} />
        </button>

        {/* Rating Pill */}
        <div className="absolute bottom-2.5 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm border border-brandBorder text-[10px] font-bold text-brandText shadow-xs">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{product.rating || '4.9'}</span>
        </div>

        {/* Product Visual / Emoji */}
        <Link
          href={`/product/${product.slug}`}
          className="w-full h-full flex items-center justify-center p-6"
        >
          <div className="text-6xl sm:text-7xl transform group-hover:scale-110 transition-transform duration-300 select-none drop-shadow-sm">
            {product.emoji || '🫙'}
          </div>
        </Link>
      </div>

      {/* Product Content Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Brand Tag */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-brandRed/80 mb-1">
            {product.category || product.brand}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-sm text-brandText group-hover:text-brandRed transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Size Pills / Selection if multiple */}
          {product.sizes && product.sizes.length > 1 ? (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.sizes.map((s, idx) => (
                <button
                  key={s.label}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSizeIndex(idx);
                  }}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border transition-all ${
                    selectedSizeIndex === idx
                      ? 'bg-brandRed text-white border-brandRed shadow-xs'
                      : 'bg-brandBg text-brandText2 border-brandBorder hover:border-brandRed/50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-brandText3 mb-3 font-medium">
              Jar Size: <strong className="text-brandText2">{currentSize.label}</strong>
            </div>
          )}
        </div>

        {/* Footer: Price & Add Button */}
        <div className="pt-2.5 border-t border-brandBorder/70 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-brandText font-price">
                {formatINR(currentSize.price)}
              </span>
              {currentSize.mrp > currentSize.price && (
                <span className="text-xs text-brandText3 line-through font-price">
                  {formatINR(currentSize.mrp)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-brandGreen font-semibold block">
              ✓ Fresh Kitchen Batch
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`text-xs font-bold px-3.5 py-2 rounded-button border transition-all duration-200 flex items-center gap-1 shrink-0 ${
              isAddedRecently
                ? 'bg-brandGreen text-white border-brandGreen shadow-sm'
                : 'bg-brandRed hover:bg-brandAccent-dark text-white border-brandRed shadow-sm active:scale-95'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
