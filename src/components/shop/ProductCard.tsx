'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check } from 'lucide-react';
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

  const currentSize = product.sizes && product.sizes.length > 0 
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
    <div className="group relative bg-white border border-brandBorder rounded-card overflow-hidden hover:shadow-cardHover hover:border-brandAccent/30 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image / Media Area */}
      <div className="relative aspect-square w-full bg-brandAccent-light flex items-center justify-center overflow-hidden">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.badge && <Badge type={product.badge} />}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isWishlisted
              ? 'bg-brandRed/10 text-brandRed scale-110'
              : 'bg-white/80 text-brandText3 hover:text-brandRed hover:bg-white'
          }`}
          title="Save to wishlist"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brandRed text-brandRed' : ''}`} />
        </button>

        {/* Product Visual / Emoji */}
        <Link href={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center p-6">
          <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300 select-none">
            {product.emoji || '🫙'}
          </div>
        </Link>
      </div>

      {/* Product Content Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand Tag */}
          <div className="text-[10px] font-semibold uppercase tracking-wider text-brandText3 mb-1">
            {product.brand}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-sm text-brandText group-hover:text-brandAccent transition-colors line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Size Pills / Selection if multiple */}
          {product.sizes && product.sizes.length > 1 ? (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.sizes.map((s, idx) => (
                <button
                  key={s.label}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSizeIndex(idx);
                  }}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-colors ${
                    selectedSizeIndex === idx
                      ? 'bg-brandAccent text-white border-brandAccent'
                      : 'bg-brandBg text-brandText2 border-brandBorder hover:border-brandAccent'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-brandText3 mb-3 font-medium">
              Pack of {currentSize.label}
            </div>
          )}
        </div>

        {/* Footer: Price & Add Button */}
        <div className="pt-2 border-t border-brandBorder/60 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-bold text-brandText">
                {formatINR(currentSize.price)}
              </span>
              {currentSize.mrp > currentSize.price && (
                <span className="text-xs text-brandText3 line-through">
                  {formatINR(currentSize.mrp)}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-brandGreen">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`text-xs font-semibold px-3 py-1.5 rounded-button border transition-all duration-200 flex items-center gap-1 shrink-0 ${
              isAddedRecently
                ? 'bg-brandGreen text-white border-brandGreen'
                : 'border-brandAccent text-brandAccent hover:bg-brandAccent hover:text-white bg-white shadow-sm'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
