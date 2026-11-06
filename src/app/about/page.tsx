import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Flame,
  HeartHandshake,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'About Us & Heritage Kitchen | Vishnu Home Products Mangalore',
  description:
    'Learn about Vishnu Home Products, an FSSAI-certified (Lic: 21223181000014) heritage coastal kitchen in Mangaluru, Karnataka crafting 100% preservative-free pickles, thokkus, spices, and sun-dried fish.',
};

export default function AboutPage() {
  return (
    <div className="bg-brandBg min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brandText font-semibold">About Us & Business Verification</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#2b090b] via-[#1a0808] to-[#3b120b] text-white p-8 sm:p-10 shadow-xl border border-amber-400/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            Verified Indian Food Business • FSSAI Lic: 21223181000014
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Authentic Coastal Flavours Crafted from <span className="text-amber-400">Mangalore Heritage</span>
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-3 max-w-2xl leading-relaxed">
            Vishnu Home Products brings traditional Mangalorean coastal heritage to your table. Every jar of our thokku, raw mango pickle, Kundapura masala, and sun-cured dry fish is crafted following time-honored home recipes from Dakshina Kannada, and prepared, packaged, and dispatched nationwide from our central operations and fulfillment hub in Bangalore, Karnataka.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-brandBorder shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brandAccent-light text-brandAccent flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-brandText">100% Wood-Pressed Oils</h2>
            <p className="text-xs text-brandText2 leading-relaxed">
              We never use refined vegetable oils or artificial acidity regulators. Traditional cold-pressed gingelly (sesame) and coconut oils naturally preserve our pickles.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brandBorder shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-brandText">FSSAI Certified Hygiene</h2>
            <p className="text-xs text-brandText2 leading-relaxed">
              Registered under FSSAI License <strong>21223181000014</strong>. Every batch undergoes strict moisture check, UV jar sterilization, and leak-proof vacuum sealing.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brandBorder shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-brandText">Direct Coastal Sourcing</h2>
            <p className="text-xs text-brandText2 leading-relaxed">
              Byadagi chillies from Haveri, country garlic from local farms, and sun-dried seafood directly from Mangaluru and Malpe coastal artisanal fishermen.
            </p>
          </div>
        </div>

        {/* Official Merchant & Business Information Table (Required by Google Shopping) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-sm space-y-5">
          <div>
            <h2 className="font-display text-xl font-bold text-brandText">
              Official Merchant & Legal Disclosure
            </h2>
            <p className="text-xs text-brandText2 mt-1">
              Complete business registration, physical address, and customer support details in compliance with Consumer Protection (E-Commerce) Rules & Google Merchant Center guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-1">
              <div className="text-brandText3 font-semibold uppercase tracking-wider text-[10px]">
                Legal Brand / Trade Name
              </div>
              <div className="font-bold text-brandText text-sm">Vishnu Home Products</div>
            </div>

            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-1">
              <div className="text-brandText3 font-semibold uppercase tracking-wider text-[10px]">
                FSSAI Food Safety License
              </div>
              <div className="font-bold text-emerald-700 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>21223181000014</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-1">
              <div className="text-brandText3 font-semibold uppercase tracking-wider text-[10px]">
                Business Location & Dispatch Warehouse
              </div>
              <div className="font-semibold text-brandText flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brandAccent shrink-0 mt-0.5" />
                <span>Indiranagar, Bangalore, Karnataka - 560038, India (Exclusive Shipping Partner: Delhivery Express)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder space-y-1">
              <div className="text-brandText3 font-semibold uppercase tracking-wider text-[10px]">
                Operating Hours & Customer Care
              </div>
              <div className="font-semibold text-brandText space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brandAccent" />
                  <a href="tel:+919845012345" className="hover:text-brandAccent">
                    +91 98450 12345
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brandAccent" />
                  <a href="mailto:support@vishnuhomeproducts.in" className="hover:text-brandAccent">
                    support@vishnuhomeproducts.in
                  </a>
                </div>
                <div className="flex items-center gap-2 text-brandText3">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mon – Sat: 9:00 AM – 7:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Policy Links */}
          <div className="pt-4 border-t border-brandBorder flex flex-wrap gap-3 text-xs font-semibold">
            <Link
              href="/shipping-policy"
              className="px-3.5 py-2 rounded-lg bg-brandAccent-light text-brandAccent hover:bg-brandAccent hover:text-white transition-colors"
            >
              Shipping & Delivery Policy →
            </Link>
            <Link
              href="/return-refund-policy"
              className="px-3.5 py-2 rounded-lg bg-brandAccent-light text-brandAccent hover:bg-brandAccent hover:text-white transition-colors"
            >
              Return & Refund Policy →
            </Link>
            <Link
              href="/privacy-policy"
              className="px-3.5 py-2 rounded-lg bg-brandAccent-light text-brandAccent hover:bg-brandAccent hover:text-white transition-colors"
            >
              Privacy Policy →
            </Link>
            <Link
              href="/terms-of-service"
              className="px-3.5 py-2 rounded-lg bg-brandAccent-light text-brandAccent hover:bg-brandAccent hover:text-white transition-colors"
            >
              Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

