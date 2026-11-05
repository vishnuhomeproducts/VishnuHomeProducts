'use client';

import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Calculator,
  MessageCircle,
  CheckCircle2,
  Send,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { formatINR } from '@/lib/utils';

const PACK_OPTIONS = [
  { id: '150g', label: '150g Mini Return-Gift Jar (Wedding Thamboolam)', basePrice: 75 },
  { id: '300g', label: '300g Classic Retail Jar', basePrice: 120 },
  { id: '500g', label: '500g Family Pack Jar', basePrice: 190 },
  { id: '5kg', label: '5kg Catering / Restaurant Bucket', basePrice: 1450 },
];

function getTierDiscount(qty: number): number {
  if (qty >= 250) return 30;
  if (qty >= 100) return 25;
  if (qty >= 50) return 20;
  if (qty >= 20) return 15;
  return 10;
}

export default function BulkOrdersPage() {
  const { products } = useProducts();

  const [selectedPackId, setSelectedPackId] = useState('150g');
  const [selectedProduct, setSelectedProduct] = useState('Tomato Thokku');
  const [quantity, setQuantity] = useState(50);
  const [customLabel, setCustomLabel] = useState(true);

  const [contact, setContact] = useState({
    name: '',
    phone: '',
    city: 'Mangaluru',
    occasion: 'Wedding Return Gifts (Thamboolam)',
  });
  const [submitted, setSubmitted] = useState(false);

  const pack = PACK_OPTIONS.find((p) => p.id === selectedPackId) || PACK_OPTIONS[0];
  const discountPercent = getTierDiscount(quantity);
  const rawTotal = pack.basePrice * quantity;
  const discountedUnit = Math.round(pack.basePrice * (1 - discountPercent / 100));
  const netTotal = discountedUnit * quantity;
  const totalSavings = rawTotal - netTotal;

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name || !contact.phone) return;

    const summary = `${contact.occasion} | Product: ${selectedProduct} | Pack: ${pack.label} | Qty: ${quantity} units | Custom Label: ${customLabel ? 'Yes' : 'No'} | Est. Wholesale Total: ₹${netTotal} (${discountPercent}% OFF)`;

    try {
      await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          phone: contact.phone,
          type: 'Bulk / Wholesale',
          message: summary,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      // ignore
    }
  };

  const waQuoteLink = () => {
    const text = [
      'Namaskara Vishnu Home Products! 🙏',
      'I would like a *Bulk / Wholesale Quote*:',
      `• Occasion: ${contact.occasion}`,
      `• Item: ${selectedProduct}`,
      `• Pack Size: ${pack.label}`,
      `• Quantity: *${quantity} units*`,
      `• Custom Event Sticker: ${customLabel ? 'Yes (Free)' : 'Standard'}`,
      `• Tiered Wholesale Price: *₹${discountedUnit}/unit (${discountPercent}% OFF)*`,
      `• Estimated Total: *₹${netTotal.toLocaleString('en-IN')}*`,
    ].join('\n');
    return `https://wa.me/919845012345?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="py-10 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-10">
        {/* Hero */}
        <div className="bg-brandDark text-white p-8 sm:p-10 rounded-2xl shadow-lg space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandAccent/20 text-brandAccent-mid text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>Weddings • Return Gifts • Restaurants • Retail</span>
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-bold">
            Bulk, Catering & Wedding Return-Gift Calculator
          </h1>
          <p className="text-xs sm:text-sm text-white/75 max-w-2xl leading-relaxed">
            Delight your wedding guests with custom-labeled mini jars of authentic Mangalorean Tomato Thokku, Avakaya Mango Pickle, or Garlic Thokku, or order 5kg catering buckets for your kitchen at up to <strong>30% wholesale discount</strong>.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Configurator */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-sm space-y-6 text-xs">
            <div className="flex items-center gap-2 font-bold text-base text-brandText pb-3 border-b border-brandBorder">
              <Calculator className="w-5 h-5 text-brandAccent" />
              <span>1. Configure Your Bulk Order</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-brandText mb-1.5">
                  Select Pickle / Thokku / Masala Variety
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button font-semibold text-brandText"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.emoji} {p.name} ({p.category})
                    </option>
                  ))}
                  <option value="Assorted Mix (Tomato + Mango + Garlic Thokku)">
                    🎁 Assorted Mix (Tomato + Mango + Garlic Thokku)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-brandText mb-1.5">
                  Choose Jar / Container Size
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PACK_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedPackId(opt.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPackId === opt.id
                          ? 'bg-brandAccent-light border-brandAccent text-brandText font-bold ring-1 ring-brandAccent'
                          : 'bg-brandBg border-brandBorder text-brandText2 hover:border-brandAccent'
                      }`}
                    >
                      <div className="text-xs font-bold text-brandText">{opt.label}</div>
                      <div className="text-[11px] text-brandText3 mt-0.5">
                        Retail MRP: {formatINR(opt.basePrice)}/unit
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-bold text-brandText">
                    Order Quantity: <span className="text-brandRed text-sm">{quantity} units</span>
                  </label>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-brandGreen font-bold text-[11px]">
                    {discountPercent}% Wholesale Discount Unlocked!
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={500}
                  step={5}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-brandAccent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-brandText3 font-medium mt-1">
                  <span>20+ (15% OFF)</span>
                  <span>50+ (20% OFF)</span>
                  <span>100+ (25% OFF)</span>
                  <span>250+ (30% OFF)</span>
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customLabel}
                  onChange={(e) => setCustomLabel(e.target.checked)}
                  className="w-4 h-4 accent-brandAccent"
                />
                <span className="font-semibold text-brandText">
                  Include FREE Custom Wedding / Family Name Tag on Jars
                </span>
              </label>
            </div>
          </div>

          {/* Right: Instant Wholesale Quote & Inquiry Submission */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-sm space-y-5 text-xs">
            <h2 className="font-bold text-base text-brandText pb-3 border-b border-brandBorder">
              2. Instant Wholesale Estimate
            </h2>

            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-2">
              <div className="flex justify-between text-brandText2">
                <span>Regular Retail Value ({quantity} units)</span>
                <span className="line-through">{formatINR(rawTotal)}</span>
              </div>
              <div className="flex justify-between text-brandGreen font-bold">
                <span>Wholesale Tier Savings ({discountPercent}% OFF)</span>
                <span>-{formatINR(totalSavings)}</span>
              </div>
              <div className="pt-2 border-t border-brandBorder flex justify-between items-baseline">
                <span className="font-bold text-sm text-brandText">Net Wholesale Total</span>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-brandRed font-price">
                    {formatINR(netTotal)}
                  </div>
                  <div className="text-[10px] text-brandText3">
                    ({formatINR(discountedUnit)} per unit • Inclusive of GST)
                  </div>
                </div>
              </div>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brandGreen shrink-0" />
                <span>
                  Bulk quote logged in our Operations Hub! Our Mangaluru kitchen manager will call you shortly.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="space-y-3">
                <input
                  type="text"
                  required
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Your Name / Business Name *"
                  className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button"
                />
                <input
                  type="tel"
                  required
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="10-Digit Mobile / WhatsApp Number *"
                  className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button"
                />
                <select
                  value={contact.occasion}
                  onChange={(e) => setContact({ ...contact, occasion: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button font-medium"
                >
                  <option value="Wedding Return Gifts (Thamboolam)">
                    Wedding Return Gifts (Thamboolam)
                  </option>
                  <option value="Festive / Corporate Gifting">Festive / Corporate Gifting</option>
                  <option value="Restaurant / Catering Supply">
                    Restaurant / Catering Supply
                  </option>
                  <option value="Retail Store Reselling">Retail Store Reselling</option>
                </select>

                <button
                  type="submit"
                  className="w-full py-3 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold rounded-button shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Callback & Lock Wholesale Rate</span>
                </button>
              </form>
            )}

            <a
              href={waQuoteLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-button bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send This Quote on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

