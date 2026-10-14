'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter, useParams } from 'next/navigation';
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  HeartHandshake,
  CheckCircle2,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { ImageGallery } from '@/components/product/ImageGallery';
import { SizePicker } from '@/components/product/SizePicker';
import { QuantityPicker } from '@/components/product/QuantityPicker';
import { ProductAccordion } from '@/components/product/ProductAccordion';
import { ProductSection } from '@/components/home/ProductSection';
import { formatINR, calculateDiscountPercent } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    // If invalid slug, fallback to first product or not found
    const fallback = SAMPLE_PRODUCTS[0];
    if (!fallback) return notFound();
  }

  const currentProduct = product || SAMPLE_PRODUCTS[0];

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openDrawer } = useCart();

  const selectedSize =
    currentProduct.sizes && currentProduct.sizes.length > 0
      ? currentProduct.sizes[selectedSizeIndex]
      : { label: 'Standard', price: 120, mrp: 145 };

  const discountPercent = calculateDiscountPercent(selectedSize.mrp, selectedSize.price);

  // Related products from same category or general catalog
  const relatedProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && p.category === currentProduct.category
  ).slice(0, 4);

  const fallbackRelated = relatedProducts.length > 0 
    ? relatedProducts 
    : SAMPLE_PRODUCTS.filter((p) => p.id !== currentProduct.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      product_id: currentProduct.id,
      name: currentProduct.name,
      slug: currentProduct.slug,
      size: selectedSize.label,
      price: selectedSize.price,
      mrp: selectedSize.mrp,
      emoji: currentProduct.emoji || '🫙',
      qty: quantity,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="py-8 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            href={`/shop?category=${encodeURIComponent(currentProduct.category)}`}
            className="hover:text-brandAccent transition-colors"
          >
            {currentProduct.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brandText font-semibold truncate max-w-[200px]">
            {currentProduct.name}
          </span>
        </nav>

        {/* Main 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery (50% / 6 cols) */}
          <div className="lg:col-span-6 sticky top-20">
            <ImageGallery product={currentProduct} />
          </div>

          {/* Right Column: Product Details & Purchase Form (50% / 6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-card border border-brandBorder shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold tracking-widest text-brandAccent uppercase">
                {currentProduct.brand}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brandText leading-tight">
                {currentProduct.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1 text-brandAccent-mid">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(currentProduct.rating || 5)
                          ? 'fill-brandAccent-mid'
                          : 'fill-brandBorder text-brandBorder'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-brandText">
                  {currentProduct.rating || 4.9}
                </span>
                <span className="text-xs text-brandText3">
                  ({currentProduct.review_count || 24} customer reviews)
                </span>
              </div>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-brandText">
                {formatINR(selectedSize.price)}
              </span>
              {selectedSize.mrp > selectedSize.price && (
                <span className="text-sm text-brandText3 line-through">
                  MRP {formatINR(selectedSize.mrp)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-brandGreen bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="border-t border-brandBorder" />

            {/* Size Selector */}
            <SizePicker
              sizes={currentProduct.sizes}
              selectedIndex={selectedSizeIndex}
              onSelectSize={setSelectedSizeIndex}
            />

            {/* Quantity Selector & Action CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-brandText">Quantity:</div>
                <QuantityPicker
                  quantity={quantity}
                  onChange={setQuantity}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="h-12 w-full inline-flex items-center justify-center gap-2 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold text-sm rounded-button shadow-md transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="h-12 w-full inline-flex items-center justify-center gap-2 bg-brandDark hover:bg-black text-white font-bold text-sm rounded-button shadow-sm transition-all active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 text-brandAccent" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Key Quality Highlights */}
            <div className="bg-brandBg p-3.5 rounded-card border border-brandBorder grid grid-cols-3 gap-2 text-center text-xs">
              <div className="flex flex-col items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-brandGreen" />
                <span className="text-[11px] font-semibold text-brandText">No Preservatives</span>
              </div>
              <div className="flex flex-col items-center gap-1 border-x border-brandBorder">
                <ShieldCheck className="w-4 h-4 text-brandGreen" />
                <span className="text-[11px] font-semibold text-brandText">FSSAI Certified</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <HeartHandshake className="w-4 h-4 text-brandAccent" />
                <span className="text-[11px] font-semibold text-brandText">100% Homemade</span>
              </div>
            </div>

            {/* Delivery Estimate */}
            <div className="flex items-center gap-2.5 text-xs text-brandText2 bg-brandAccent-light/60 p-3 rounded-lg border border-brandAccent/20">
              <Truck className="w-4 h-4 text-brandAccent shrink-0" />
              <span>
                Standard shipping delivers in <strong>3–5 business days</strong> across India.
              </span>
            </div>

            {/* Detailed Accordion (Description, Ingredients, Storage, Shipping) */}
            <ProductAccordion product={currentProduct} />

          </div>
        </div>

        {/* Related Products Grid */}
        <div className="pt-8">
          <ProductSection
            title="You May Also Relish"
            subtitle="Authentic accompaniments traditionally paired together"
            products={fallbackRelated}
            viewAllHref={`/shop?category=${encodeURIComponent(currentProduct.category)}`}
          />
        </div>

      </div>
    </div>
  );
}
