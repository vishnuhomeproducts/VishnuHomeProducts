'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Plus, X, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';

export default function ComboBuilderPage() {
  const router = useRouter();
  const { products } = useProducts();
  const { addItem, applyCoupon } = useCart();

  const [boxSize, setBoxSize] = useState<3 | 5>(3);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const discountPercent = boxSize === 3 ? 10 : 15;
  const slotsRemaining = boxSize - selectedProducts.length;

  const handleAddJarToBox = (product: Product) => {
    if (selectedProducts.length >= boxSize) return;
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleRemoveFromSlot = (index: number) => {
    const next = [...selectedProducts];
    next.splice(index, 1);
    setSelectedProducts(next);
  };

  const rawTotal = selectedProducts.reduce(
    (sum, p) => sum + (p.sizes?.[0]?.price || 120),
    0
  );
  const discountedTotal = Math.round(rawTotal * (1 - discountPercent / 100));
  const savings = rawTotal - discountedTotal;

  const handleAddComboBoxToCart = () => {
    if (selectedProducts.length < boxSize) return;

    selectedProducts.forEach((p) => {
      const sz = p.sizes?.[0] || { label: '250g', price: 120, mrp: 150 };
      addItem({
        product_id: p.id,
        name: p.name,
        slug: p.slug,
        size: sz.label,
        price: sz.price,
        mrp: sz.mrp,
        emoji: p.emoji || '🫙',
        qty: 1,
      });
    });

    applyCoupon({
      code: boxSize === 3 ? 'VISHNU10' : 'FESTIVE15',
      discount_type: 'percent',
      discount_value: discountPercent,
    });

    router.push('/cart');
  };

  return (
    <div className="py-10 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-8">
        {/* Hero Banner */}
        <div className="bg-brandDark text-white p-6 sm:p-10 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandAccent/20 text-brandAccent-mid text-xs font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Custom Assorted Gift & Family Box</span>
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold">
              Build Your Own Coastal Combo Box
            </h1>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              Mix and match any {boxSize} jars of your choice — from spicy Tomato Thokku and Avakaya Mango Pickle to Kundapura Dry Fish — and unlock instant bundle savings!
            </p>
          </div>

          {/* Box Size Selector */}
          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setBoxSize(3);
                setSelectedProducts((prev) => prev.slice(0, 3));
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                boxSize === 3
                  ? 'bg-brandAccent text-white border-brandAccent shadow-md'
                  : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'
              }`}
            >
              <div className="text-xs font-bold uppercase">3-Jar Taster Box</div>
              <div className="text-lg font-extrabold mt-0.5">Save 10% OFF</div>
            </button>

            <button
              type="button"
              onClick={() => setBoxSize(5)}
              className={`p-4 rounded-xl border text-left transition-all ${
                boxSize === 5
                  ? 'bg-brandAccent text-white border-brandAccent shadow-md'
                  : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'
              }`}
            >
              <div className="text-xs font-bold uppercase">5-Jar Family Box</div>
              <div className="text-lg font-extrabold mt-0.5">Save 15% OFF</div>
            </button>
          </div>
        </div>

        {/* Visual Box Slot Bar */}
        <div className="bg-white p-6 rounded-2xl border border-brandBorder shadow-sm sticky top-20 z-30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-sm sm:text-base text-brandText flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brandAccent" />
                <span>
                  Your {boxSize}-Jar Assorted Box ({selectedProducts.length}/{boxSize} selected)
                </span>
              </h2>
              <p className="text-xs text-brandText2">
                {slotsRemaining > 0
                  ? `Select ${slotsRemaining} more ${slotsRemaining === 1 ? 'jar' : 'jars'} below to complete your box`
                  : '🎉 Your combo box is complete and ready for checkout!'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {selectedProducts.length > 0 && (
                <div className="text-right">
                  <div className="text-[11px] text-brandText3 line-through">
                    MRP {formatINR(rawTotal)}
                  </div>
                  <div className="text-base font-bold text-brandRed font-price">
                    {formatINR(discountedTotal)}{' '}
                    <span className="text-[11px] text-brandGreen font-semibold">
                      (Save {formatINR(savings)})
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={slotsRemaining > 0}
                onClick={handleAddComboBoxToCart}
                className="px-5 py-3 bg-brandAccent hover:bg-brandAccent-mid disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-button shadow-md inline-flex items-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {slotsRemaining > 0
                    ? `Pick ${slotsRemaining} More`
                    : `Add ${boxSize}-Jar Box to Cart`}
                </span>
              </button>
            </div>
          </div>

          {/* Slots */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[...Array(boxSize)].map((_, idx) => {
              const item = selectedProducts[idx];
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 min-h-[60px] ${
                    item
                      ? 'bg-amber-50/70 border-brandAccent text-brandText'
                      : 'bg-brandBg border-dashed border-brandBorder text-brandText3'
                  }`}
                >
                  {item ? (
                    <>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">{item.emoji || '🫙'}</span>
                        <span className="font-semibold truncate text-[11px]">{item.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromSlot(idx)}
                        className="p-1 text-brandText3 hover:text-brandRed shrink-0"
                        title="Remove from box"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <span className="mx-auto text-[11px] font-medium">Slot #{idx + 1} Empty</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selectable Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {products
            .filter((p) => p.in_stock)
            .map((product) => {
              const sz = product.sizes?.[0] || { label: '250g', price: 120, mrp: 150 };
              const countInBox = selectedProducts.filter((x) => x.id === product.id).length;

              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-card border border-brandBorder shadow-sm flex flex-col justify-between space-y-3 hover:border-brandAccent transition-all"
                >
                  <div className="space-y-2">
                    <div className="aspect-video rounded-xl bg-brandAccent-light flex items-center justify-center text-5xl relative">
                      {product.emoji || '🫙'}
                      {countInBox > 0 && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brandGreen text-white font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {countInBox} in box
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold uppercase text-brandAccent">
                      {product.category}
                    </div>
                    <h3 className="font-bold text-sm text-brandText line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-brandText2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-brandBorder flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-brandText">
                        {formatINR(sz.price)}
                      </span>
                      <span className="text-[10px] text-brandText3 ml-1">({sz.label})</span>
                    </div>

                    <button
                      type="button"
                      disabled={slotsRemaining <= 0}
                      onClick={() => handleAddJarToBox(product)}
                      className="px-3 py-1.5 bg-brandAccent hover:bg-brandAccent-mid disabled:opacity-40 text-white font-bold text-xs rounded-button inline-flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Box</span>
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

