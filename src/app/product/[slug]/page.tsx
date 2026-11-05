'use client';

import React, { useState, useEffect } from 'react';
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
  MapPin,
  Sparkles,
  MessageSquarePlus,
  Heart,
  Share2,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useWishlist } from '@/hooks/useWishlist';
import { ImageGallery } from '@/components/product/ImageGallery';
import { SizePicker } from '@/components/product/SizePicker';
import { QuantityPicker } from '@/components/product/QuantityPicker';
import { ProductAccordion } from '@/components/product/ProductAccordion';
import { ProductSection } from '@/components/home/ProductSection';
import {
  formatINR,
  calculateDiscountPercent,
  calculateTieredUnitPrice,
  DEFAULT_TIERED_SLABS,
} from '@/lib/utils';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const { products } = useProducts();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const product = products.find((p) => p.slug === slug);
  const currentProduct = product || products[0];

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Pincode Delivery Estimator State
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{
    valid: boolean;
    eta: string;
    feeText: string;
    zone: string;
  } | null>(null);

  // Product Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customer_name: '',
    city: '',
    rating: 5,
    comment: '',
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    setSelectedSizeIndex(0);
    setQuantity(1);
  }, [slug]);

  useEffect(() => {
    if (!currentProduct) return;
    fetch(`/api/reviews?slug=${encodeURIComponent(currentProduct.slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, [currentProduct]);

  if (!currentProduct) {
    return notFound();
  }

  const selectedSize =
    currentProduct.sizes && currentProduct.sizes.length > 0
      ? currentProduct.sizes[selectedSizeIndex] || currentProduct.sizes[0]
      : { label: 'Standard', price: 120, mrp: 145 };

  const activeTieredType = currentProduct.tiered_price_type || 'percentage_discount';
  const activeTieredSlabs =
    activeTieredType === 'none'
      ? []
      : currentProduct.tiered_price_slabs && currentProduct.tiered_price_slabs.length > 0
      ? currentProduct.tiered_price_slabs
      : DEFAULT_TIERED_SLABS;

  const {
    unitPrice: effectiveUnitPrice,
    activeSlab,
    savingsPerUnit,
  } = calculateTieredUnitPrice(
    selectedSize.price,
    quantity,
    activeTieredType,
    activeTieredSlabs
  );

  const discountPercent = calculateDiscountPercent(selectedSize.mrp, effectiveUnitPrice);
  const wishlisted = isInWishlist(currentProduct.id);

  // Related products from same category or general catalog
  const relatedProducts = products
    .filter((p) => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : products.filter((p) => p.id !== currentProduct.id).slice(0, 4);

  // Combo companion item
  const companionProduct =
    fallbackRelated[0] || products.find((p) => p.id !== currentProduct.id);

  const handleAddToCart = () => {
    if (!currentProduct.in_stock) return;
    addItem({
      product_id: currentProduct.id,
      name: currentProduct.name,
      slug: currentProduct.slug,
      size: selectedSize.label,
      price: effectiveUnitPrice,
      base_price: selectedSize.price,
      mrp: selectedSize.mrp,
      tiered_price_type: activeTieredType,
      tiered_price_slabs: activeTieredSlabs,
      emoji: currentProduct.emoji || '🫙',
      qty: quantity,
    });
  };

  const handleBuyNow = () => {
    if (!currentProduct.in_stock) return;
    handleAddToCart();
    router.push('/checkout');
  };

  const handleAddCombo = () => {
    handleAddToCart();
    if (companionProduct && companionProduct.sizes?.[0]) {
      addItem({
        product_id: companionProduct.id,
        name: companionProduct.name,
        slug: companionProduct.slug,
        size: companionProduct.sizes[0].label,
        price: companionProduct.sizes[0].price,
        mrp: companionProduct.sizes[0].mrp,
        emoji: companionProduct.emoji || '🫙',
        qty: 1,
      });
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setPincodeResult({
        valid: false,
        eta: 'Please enter a valid 6-digit Indian pincode.',
        feeText: '',
        zone: '',
      });
      return;
    }

    if (clean.startsWith('575') || clean.startsWith('576')) {
      setPincodeResult({
        valid: true,
        zone: 'Mangaluru / Coastal Express Zone',
        eta: 'Same-Day / Next-Day Express Delivery',
        feeText: '₹60 shipping (FREE on orders above ₹999) • COD & UPI Available',
      });
    } else if (clean.startsWith('560')) {
      setPincodeResult({
        valid: true,
        zone: 'Bengaluru Priority Zone',
        eta: '1–2 Business Days Express Delivery',
        feeText: '₹50 shipping (FREE on orders above ₹999) • COD & UPI Available',
      });
    } else {
      setPincodeResult({
        valid: true,
        zone: 'Pan-India Serviceable Zone',
        eta: '3–5 Business Days Air/Surface Courier',
        feeText: '₹80 shipping (FREE on orders above ₹999) • COD & Online Payment Available',
      });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.customer_name.trim() || !reviewForm.comment.trim()) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: currentProduct.id,
          product_slug: currentProduct.slug,
          product_name: currentProduct.name,
          ...reviewForm,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          setReviews([data.review, ...reviews]);
        }
        setReviewSubmitted(true);
        setShowReviewForm(false);
        setReviewForm({ customer_name: '', city: '', rating: 5, comment: '' });
      }
    } catch (err) {
      // ignore
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Structured Data JSON-LD for Google Rich Snippets
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: currentProduct.name,
    description: currentProduct.description,
    brand: {
      '@type': 'Brand',
      name: currentProduct.brand || 'Vishnu Home Products',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: selectedSize.price,
      availability: currentProduct.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: currentProduct.rating || 4.9,
      reviewCount: (currentProduct.review_count || 24) + reviews.length,
    },
  };

  return (
    <div className="py-8 pb-24 lg:pb-12 bg-brandBg min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

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
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-20">
            <ImageGallery product={currentProduct} />
          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-card border border-brandBorder shadow-sm space-y-6">
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold tracking-widest text-brandAccent uppercase">
                  {currentProduct.brand}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(currentProduct.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      wishlisted
                        ? 'bg-red-50 border-red-200 text-brandRed'
                        : 'border-brandBorder text-brandText3 hover:text-brandRed'
                    }`}
                    title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-brandRed' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 rounded-full border border-brandBorder text-brandText3 hover:text-brandText transition-colors text-xs flex items-center gap-1"
                    title="Copy Product Link"
                  >
                    <Share2 className="w-4 h-4" />
                    {copiedShare && <span className="text-[10px] font-bold text-brandGreen">Copied!</span>}
                  </button>
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brandText leading-tight">
                {currentProduct.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(currentProduct.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-brandBorder text-brandBorder'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-brandText">
                  {currentProduct.rating || 4.9}
                </span>
                <a
                  href="#customer-reviews"
                  className="text-xs text-brandText2 hover:text-brandRed underline font-medium"
                >
                  ({(currentProduct.review_count || 20) + reviews.length} verified reviews)
                </a>
                {currentProduct.in_stock ? (
                  <span className="ml-auto text-[11px] font-bold text-brandGreen bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ● Fresh Batch In Stock
                  </span>
                ) : (
                  <span className="ml-auto text-[11px] font-bold text-brandRed bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Price Display */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#fff5f3] to-[#fffbeb] border border-red-200/70 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-brandRed font-price">
                  {formatINR(effectiveUnitPrice)}
                </span>
                {selectedSize.mrp > effectiveUnitPrice && (
                  <span className="text-sm text-brandText3 line-through font-price">
                    MRP {formatINR(selectedSize.mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-extrabold text-white bg-brandGreen px-2.5 py-0.5 rounded-full shadow-xs">
                    Save {discountPercent}%
                  </span>
                )}
                <span className="text-[11px] text-brandText2 font-medium ml-auto">
                  Inclusive of all taxes • Freshly Sealed
                </span>
              </div>
              {activeSlab && savingsPerUnit > 0 && (
                <div className="text-xs font-bold text-brandGreen flex items-center justify-between pt-1 border-t border-red-200/50">
                  <span>
                    🎉 Tiered Volume Slab Active ({activeSlab.min_qty}–{activeSlab.max_qty} units):{' '}
                    {formatINR(effectiveUnitPrice)}/jar
                  </span>
                  <span>Total: {formatINR(effectiveUnitPrice * quantity)}</span>
                </div>
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
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold text-brandText">Quantity:</div>
                  <QuantityPicker quantity={quantity} onChange={setQuantity} />
                </div>
                {quantity > 1 && (
                  <div className="text-xs font-bold text-brandText">
                    Total for {quantity} jars:{' '}
                    <span className="text-brandRed font-price text-sm">
                      {formatINR(effectiveUnitPrice * quantity)}
                    </span>
                  </div>
                )}
              </div>

              {/* Interactive Tiered Price Slabs Table */}
              {activeTieredType !== 'none' && activeTieredSlabs.length > 0 && (
                <div className="rounded-xl border border-brandBorder overflow-hidden bg-white shadow-xs">
                  <div className="px-3.5 py-2 bg-gradient-to-r from-[#190d0c] to-[#3a1215] text-white flex items-center justify-between text-[11px]">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Tiered Volume Price Slabs (Click a slab to apply)</span>
                    </span>
                    <span className="text-amber-300 font-semibold">Buy More, Save More</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f4efe8] text-brandText2 font-bold text-[10px] uppercase border-b border-brandBorder">
                      <tr>
                        <th className="py-2 px-3">Min – Max Qty</th>
                        <th className="py-2 px-3">
                          {activeTieredType === 'percentage_discount'
                            ? 'Percentage Discount'
                            : activeTieredType === 'fixed_discount'
                            ? 'Discount / Jar'
                            : 'Slab Rate'}
                        </th>
                        <th className="py-2 px-3">Price / Jar</th>
                        <th className="py-2 px-3 text-right">Select</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brandBorder">
                      {activeTieredSlabs.map((slab, idx) => {
                        const isCurrentSlab =
                          quantity >= slab.min_qty && quantity <= (slab.max_qty || 9999);
                        const { unitPrice: slabUnitPrice } = calculateTieredUnitPrice(
                          selectedSize.price,
                          slab.min_qty,
                          activeTieredType,
                          activeTieredSlabs
                        );
                        return (
                          <tr
                            key={idx}
                            onClick={() => setQuantity(slab.min_qty)}
                            className={`cursor-pointer transition-colors ${
                              isCurrentSlab
                                ? 'bg-red-50/90 font-bold text-brandRed'
                                : 'hover:bg-brandBg text-brandText'
                            }`}
                          >
                            <td className="py-2 px-3 font-mono font-semibold">
                              {slab.min_qty} – {slab.max_qty >= 999 ? '99+' : slab.max_qty} Jars
                            </td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-brandGreen border border-emerald-200">
                                {activeTieredType === 'percentage_discount'
                                  ? `${slab.value}% OFF`
                                  : activeTieredType === 'fixed_discount'
                                  ? `₹${slab.value} OFF`
                                  : `₹${slab.value} Fixed`}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-price font-extrabold text-brandRed">
                              {formatINR(slabUnitPrice)}/jar
                            </td>
                            <td className="py-2 px-3 text-right">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                  isCurrentSlab
                                    ? 'bg-brandRed text-white'
                                    : 'bg-brandBg text-brandText2 border border-brandBorder'
                                }`}
                              >
                                {isCurrentSlab ? '✓ Active' : `Buy ${slab.min_qty}`}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!currentProduct.in_stock}
                  className="h-12 w-full inline-flex items-center justify-center gap-2 bg-brandAccent hover:bg-brandAccent-mid disabled:opacity-50 text-white font-bold text-sm rounded-button shadow-md transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{currentProduct.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!currentProduct.in_stock}
                  className="h-12 w-full inline-flex items-center justify-center gap-2 bg-brandDark hover:bg-black disabled:opacity-50 text-white font-bold text-sm rounded-button shadow-sm transition-all active:scale-[0.98]"
                >
                  <Zap className="w-4 h-4 text-brandAccent" />
                  <span>Buy Now (Express Checkout)</span>
                </button>
              </div>
            </div>

            {/* Pincode Delivery Estimator & Serviceability Checker */}
            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-brandText">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brandRed" />
                  Check Delivery Date & COD Availability
                </span>
                <span className="text-[10px] text-brandGreen font-semibold">Pan-India Dispatch</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode (e.g. 575002)"
                  className="flex-1 px-3 py-2 text-xs bg-white border border-brandBorder rounded-button focus:outline-none focus:border-brandAccent font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-brandText hover:bg-brandAccent text-white text-xs font-bold rounded-button transition-colors"
                >
                  Check
                </button>
              </form>

              {pincodeResult ? (
                <div
                  className={`text-xs p-2.5 rounded-lg border ${
                    pincodeResult.valid
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-red-50 border-red-200 text-brandRed'
                  }`}
                >
                  {pincodeResult.valid ? (
                    <div className="space-y-0.5">
                      <div className="font-bold flex items-center gap-1.5 text-brandGreen">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{pincodeResult.eta}</span>
                      </div>
                      <div className="text-[11px] text-emerald-800">{pincodeResult.feeText}</div>
                    </div>
                  ) : (
                    <span>{pincodeResult.eta}</span>
                  )}
                </div>
              ) : (
                <div className="text-[11px] text-brandText3 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-brandAccent shrink-0" />
                  <span>
                    Free shipping on orders above <strong>₹999</strong>. Express local delivery in Mangaluru & Bengaluru.
                  </span>
                </div>
              )}
            </div>

            {/* Frequently Bought Together / Combo Upsell */}
            {companionProduct && companionProduct.sizes?.[0] && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brandText flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brandAccent" />
                    Frequently Bought Together
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brandRed text-white">
                    Popular Pair
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl">{currentProduct.emoji || '🫙'}</span>
                    <span className="font-semibold text-brandText truncate">{currentProduct.name}</span>
                    <span className="text-brandText3 font-bold">+</span>
                    <span className="text-xl">{companionProduct.emoji || '🫙'}</span>
                    <Link
                      href={`/product/${companionProduct.slug}`}
                      className="font-semibold text-brandText hover:text-brandAccent truncate underline"
                    >
                      {companionProduct.name}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
                  <div className="text-xs">
                    <span className="text-brandText2">Combo Price: </span>
                    <strong className="text-brandText font-bold text-sm">
                      {formatINR(selectedSize.price + companionProduct.sizes[0].price)}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCombo}
                    className="px-3.5 py-1.5 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold text-xs rounded-button shadow-xs transition-all"
                  >
                    + Add Both to Cart
                  </button>
                </div>
              </div>
            )}

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

            {/* Coastal Taste Profile & Serving Guide */}
            <div className="p-4 rounded-xl bg-white border border-brandBorder space-y-3 text-xs">
              <div className="font-bold text-brandText uppercase tracking-wider text-[11px]">
                🌶️ Coastal Taste Profile & Best Pairings
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-brandBg border border-brandBorder">
                  <div className="text-[10px] text-brandText3">Spice Level</div>
                  <div className="font-bold text-brandRed mt-0.5">
                    {currentProduct.name.toLowerCase().includes('chilli') ||
                    currentProduct.name.toLowerCase().includes('mango')
                      ? '🌶️🌶️🌶️ Fiery'
                      : '🌶️🌶️ Medium'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-brandBg border border-brandBorder">
                  <div className="text-[10px] text-brandText3">Oil Medium</div>
                  <div className="font-bold text-brandText mt-0.5">Wood-Pressed Oil</div>
                </div>
                <div className="p-2.5 rounded-lg bg-brandBg border border-brandBorder">
                  <div className="text-[10px] text-brandText3">Shelf Life</div>
                  <div className="font-bold text-brandGreen mt-0.5">6 Months Fresh</div>
                </div>
              </div>
              <div className="text-[11px] text-brandText2 pt-1">
                <strong>Best Paired With:</strong> Hot Steamed Ghee Rice, Neer Dosa, Curd Rice, Chapati Rolls & Idli/Dosa Tiffin.
              </div>
            </div>

            {/* Detailed Accordion (Description, Ingredients, Storage, Shipping) */}
            <ProductAccordion product={currentProduct} />
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section
          id="customer-reviews"
          className="bg-white p-6 sm:p-8 rounded-card border border-brandBorder shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brandBorder">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-brandText">
                Customer Reviews & Ratings
              </h2>
              <p className="text-xs text-brandText2 mt-0.5">
                Verified feedback from families across India enjoying {currentProduct.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold text-xs rounded-button inline-flex items-center gap-1.5 self-start"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
            </button>
          </div>

          {reviewSubmitted && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0" />
              <span>Thank you! Your review has been published.</span>
            </div>
          )}

          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="p-5 rounded-xl bg-brandBg border border-brandBorder space-y-4 text-xs"
            >
              <h3 className="font-bold text-sm text-brandText">Share Your Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-brandText mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.customer_name}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, customer_name: e.target.value })
                    }
                    placeholder="e.g. Ananya Rao"
                    className="w-full px-3 py-2 bg-white border border-brandBorder rounded-button"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brandText mb-1">City</label>
                  <input
                    type="text"
                    value={reviewForm.city}
                    onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-2 bg-white border border-brandBorder rounded-button"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brandText mb-1">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-brandBorder rounded-button font-semibold"
                  >
                    <option value={5}>★★★★★ (5/5 - Excellent)</option>
                    <option value={4}>★★★★☆ (4/5 - Very Good)</option>
                    <option value={3}>★★★☆☆ (3/5 - Good)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-brandText mb-1">Your Review *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="How did you enjoy the taste, aroma, and packaging?"
                  className="w-full px-3 py-2 bg-white border border-brandBorder rounded-button"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-brandRed hover:bg-red-700 text-white font-bold rounded-button"
              >
                Submit Verified Review
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.length === 0 ? (
              <div className="col-span-2 text-center py-6 text-xs text-brandText3">
                Be the first to review {currentProduct.name}!
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-brandBg/60 border border-brandBorder space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-brandText flex items-center gap-1.5">
                      <span>{rev.customer_name}</span>
                      {rev.city && <span className="text-brandText3 font-normal">({rev.city})</span>}
                    </div>
                    <span className="text-amber-500 font-bold tracking-tight">
                      {'★'.repeat(rev.rating || 5)}
                    </span>
                  </div>
                  <p className="text-brandText2 leading-relaxed italic">"{rev.comment}"</p>
                  <div className="flex items-center justify-between text-[10px] text-brandText3 pt-1">
                    <span className="text-brandGreen font-semibold">✓ Verified Purchase</span>
                    <span>
                      {new Date(rev.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Products Grid */}
        <div className="pt-4">
          <ProductSection
            title="You May Also Relish"
            subtitle="Authentic accompaniments traditionally paired together"
            products={fallbackRelated}
            viewAllHref={`/shop?category=${encodeURIComponent(currentProduct.category)}`}
          />
        </div>
      </div>

      {/* Sticky Mobile Add-to-Cart / Buy Now Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brandBorder p-3 shadow-2xl flex items-center justify-between gap-3 lg:hidden">
        <div>
          <div className="text-[11px] text-brandText3 font-medium truncate max-w-[140px]">
            {currentProduct.name} ({selectedSize.label} × {quantity})
          </div>
          <div className="text-base font-bold text-brandRed font-price">
            {formatINR(effectiveUnitPrice * quantity)}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <button
            onClick={handleAddToCart}
            disabled={!currentProduct.in_stock}
            className="flex-1 py-2.5 px-3 bg-brandAccent text-white font-bold text-xs rounded-button shadow-sm"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!currentProduct.in_stock}
            className="flex-1 py-2.5 px-3 bg-brandDark text-white font-bold text-xs rounded-button shadow-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
