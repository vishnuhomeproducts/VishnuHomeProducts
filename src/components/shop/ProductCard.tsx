'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Check, Star, Eye, X, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import {
  formatINR,
  calculateDiscountPercent,
  getProductCulinaryProfile,
  calculateTieredUnitPrice,
} from '@/lib/utils';
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
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickQty, setQuickQty] = useState(1);

  const currentSize =
    product.sizes && product.sizes.length > 0
      ? product.sizes[selectedSizeIndex]
      : { label: 'Standard', price: 120, mrp: 145 };

  const discountPercent = calculateDiscountPercent(currentSize.mrp, currentSize.price);
  const isWishlisted = isInWishlist(product.id);
  const culinary = getProductCulinaryProfile(product);

  const { unitPrice: quickUnitPrice, savingsPerUnit } = calculateTieredUnitPrice(
    currentSize.price,
    quickQty,
    product.tiered_price_type,
    product.tiered_price_slabs
  );

  const handleAddToCart = (e: React.MouseEvent, customQty = 1) => {
    e.preventDefault();
    e.stopPropagation();

    const { unitPrice } = calculateTieredUnitPrice(
      currentSize.price,
      customQty,
      product.tiered_price_type,
      product.tiered_price_slabs
    );

    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      size: currentSize.label,
      price: unitPrice,
      base_price: currentSize.price,
      mrp: currentSize.mrp,
      tiered_price_type: product.tiered_price_type,
      tiered_price_slabs: product.tiered_price_slabs,
      emoji: product.emoji || '🫙',
      qty: customQty,
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
    <>
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

          {/* Wishlist + Quick View Action Buttons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-md shadow-xs transition-all duration-200 ${
                isWishlisted
                  ? 'bg-brandRed text-white scale-110'
                  : 'bg-white/90 text-brandText3 hover:text-brandRed hover:bg-white'
              }`}
              title="Save to wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickQty(1);
                setShowQuickView(true);
              }}
              className="p-2 rounded-full bg-white/90 hover:bg-brandText hover:text-white text-brandText2 backdrop-blur-md shadow-xs transition-all duration-200"
              title="Instant Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Rating & Spice-O-Meter Pills */}
          <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between gap-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border border-brandBorder text-[10px] font-bold text-brandText shadow-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm border border-brandBorder text-[9px] font-bold text-brandText2 shadow-xs">
              <span>
                {culinary.chilies > 0 ? '🌶️'.repeat(culinary.chilies) : '🌿'} {culinary.spiceLabel}
              </span>
            </div>
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
            {/* Category & Dietary Tag */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brandRed/80 truncate">
                {product.category || product.brand}
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  culinary.dietary === '100% Veg'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : culinary.dietary === 'Coastal Seafood'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}
              >
                {culinary.dietary === '100% Veg'
                  ? '● Veg'
                  : culinary.dietary === 'Coastal Seafood'
                  ? '🐟 Dry Fish'
                  : '🌿 Herbal'}
              </span>
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
              onClick={(e) => handleAddToCart(e, 1)}
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

      {/* Instant Quick View & Multi-Size Tiered Add Modal */}
      {showQuickView && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowQuickView(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-brandBorder"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-[#fff5f3] to-[#fffbeb] border-b border-brandBorder flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white border border-red-200/70 flex items-center justify-center text-4xl shrink-0 shadow-xs">
                  {product.emoji || '🫙'}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-brandRed">
                    {product.category} • {culinary.dietary}
                  </div>
                  <h3 className="font-display text-xl font-bold text-brandText">{product.name}</h3>
                  <div className="text-xs text-brandText2 mt-0.5 flex items-center gap-2">
                    <span>⭐ {product.rating || '4.9'}</span>
                    <span>•</span>
                    <span>
                      {culinary.chilies > 0 ? '🌶️'.repeat(culinary.chilies) : '🌿'}{' '}
                      {culinary.spiceLabel}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickView(false)}
                className="p-1.5 rounded-full bg-white hover:bg-brandBorder text-brandText2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-brandText2 leading-relaxed">{product.description}</p>

              {product.ingredients && (
                <div className="p-3 rounded-xl bg-brandBg border border-brandBorder">
                  <span className="font-bold text-brandText">Key Ingredients: </span>
                  <span className="text-brandText2">{product.ingredients}</span>
                </div>
              )}

              {/* Size Selector */}
              <div className="space-y-1.5">
                <div className="font-bold text-brandText">Select Jar Weight:</div>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || [{ label: '300g', price: 120, mrp: 145 }]).map((s, idx) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl border font-bold transition-all ${
                        selectedSizeIndex === idx
                          ? 'bg-brandRed text-white border-brandRed shadow-xs'
                          : 'bg-brandBg text-brandText border-brandBorder'
                      }`}
                    >
                      {s.label} — {formatINR(s.price)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Tiered Volume Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brandText">Select Quantity (Tiered Savings):</span>
                  {savingsPerUnit > 0 && (
                    <span className="text-brandGreen font-bold">
                      Save {formatINR(savingsPerUnit)}/jar!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { q: 1, tag: '1 Jar' },
                    { q: 2, tag: '2 Jars (5% OFF)' },
                    { q: 5, tag: '5 Jars (10% OFF)' },
                    { q: 10, tag: '10 Jars (15% OFF)' },
                  ].map((opt) => (
                    <button
                      key={opt.q}
                      type="button"
                      onClick={() => setQuickQty(opt.q)}
                      className={`py-2 px-2 rounded-xl border text-center font-bold text-[11px] transition-all ${
                        quickQty === opt.q
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-brandText border-brandBorder hover:border-brandRed'
                      }`}
                    >
                      {opt.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 border-t border-brandBorder flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-brandText3">Total ({quickQty} Jars)</div>
                  <div className="text-lg font-extrabold text-brandRed font-price">
                    {formatINR(quickUnitPrice * quickQty)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={() => setShowQuickView(false)}
                    className="px-3.5 py-2.5 rounded-xl border border-brandBorder text-brandText font-bold hover:border-brandRed"
                  >
                    Full Page →
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      handleAddToCart(e, quickQty);
                      setShowQuickView(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brandRed hover:bg-brandAccent-dark text-white font-bold inline-flex items-center gap-1.5 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quickQty} to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
