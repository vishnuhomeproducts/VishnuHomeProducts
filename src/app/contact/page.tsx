'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Sparkles,
  ScrollText,
} from 'lucide-react';

export default function ContactAndPoliciesPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Product Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', phone: '', email: '', type: 'Product Inquiry', message: '' });
      }
    } catch (err) {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-12">
        {/* Top Contact & Support Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Direct Contact Info */}
          <div className="lg:col-span-5 bg-brandDark text-white p-8 rounded-2xl space-y-6 shadow-lg">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brandAccent-mid">
                Bangalore Central Dispatch Hub • Mangalore Food Heritage
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                We’d Love to Hear From You
              </h1>
              <p className="text-xs text-white/70 leading-relaxed">
                Have a question about our traditional Mangalore snack batches, custom wedding/bulk orders, or Delhivery live tracking? Reach out directly.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brandAccent shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Central Operations & Dispatch Address</div>
                  <div className="text-white/70">
                    Indiranagar, Bangalore, Karnataka - 560038
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brandAccent shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Phone & WhatsApp Support</div>
                  <a href="tel:+919845012345" className="text-white/70 hover:text-brandAccent">
                    +91 98450 12345 (Mon–Sat, 9 AM – 7 PM)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brandAccent shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Customer Care Email</div>
                  <a
                    href="mailto:support@vishnuhomeproducts.in"
                    className="text-white/70 hover:text-brandAccent"
                  >
                    support@vishnuhomeproducts.in
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="font-bold text-brandAccent flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Bulk, Catering & Gifting Orders</span>
              </div>
              <p className="text-white/70 text-[11px]">
                We supply fresh coastal thokkus and condiments in bulk for family functions, corporate gifting, and retail stores.
              </p>
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-sm space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-brandText">
                Send a Direct Message
              </h2>
              <p className="text-xs text-brandText2 mt-0.5">
                Your message goes straight to our Operations Hub team for priority response.
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-brandGreen shrink-0" />
                <span>
                  Thank you! Your inquiry has been received by our Bangalore fulfillment team. We will reply shortly via WhatsApp/Phone.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brandText mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rajesh Kamath"
                    className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brandText mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 9845012345"
                    className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brandText mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brandText mb-1">Inquiry Topic</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button font-medium"
                  >
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Delivery Query">Delivery & Tracking Query</option>
                    <option value="Bulk / Wholesale">Bulk / Wholesale Order</option>
                    <option value="Order Support">Order Replacement / Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brandText mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  className="w-full px-3.5 py-2.5 bg-brandBg border border-brandBorder rounded-button"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold rounded-button inline-flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Store Policies Section */}
        <div id="policies" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div id="shipping" className="bg-white p-6 rounded-2xl border border-brandBorder space-y-2 text-xs">
            <div className="w-9 h-9 rounded-xl bg-brandAccent-light text-brandAccent flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-brandText">
              Shipping & Delivery Policy
            </h3>
            <p className="text-brandText2 leading-relaxed">
              Authentic Mangalorean snacks freshly packed and dispatched exclusively from our Bangalore hub via <strong>Delhivery Express</strong>. Bangalore local deliveries arrive within <strong>24–48 hours</strong>; South India within <strong>2–3 business days</strong>; Pan-India in <strong>3–5 business days</strong>. Free shipping on all orders above ₹499.
            </p>
          </div>

          <div id="returns" className="bg-white p-6 rounded-2xl border border-brandBorder space-y-2 text-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-brandGreen flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-brandText">
              7-Day Damaged Jar Replacement
            </h3>
            <p className="text-brandText2 leading-relaxed">
              Every jar is double-sealed and bubble-wrapped. If a jar is damaged or leaks during transit, share a photo on WhatsApp within 7 days of delivery for a <strong>100% free replacement or instant full refund</strong>.
            </p>
          </div>

          <div id="terms" className="bg-white p-6 rounded-2xl border border-brandBorder space-y-2 text-xs">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-brandRed flex items-center justify-center">
              <ScrollText className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-brandText">
              FSSAI Quality & Privacy Terms
            </h3>
            <p className="text-brandText2 leading-relaxed">
              Licensed under <strong>FSSAI Reg. 21223181000014</strong>. Prepared in hygienic small batches with zero synthetic preservatives. Customer contact details are strictly used for order fulfillment and encrypted Razorpay transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

