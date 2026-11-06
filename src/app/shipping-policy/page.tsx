import React from 'react';
import Link from 'next/link';
import { Truck, Clock, PackageCheck, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | Vishnu Home Products',
  description:
    'Pan-India shipping policy, dispatch timelines (1-2 business days), transit times (2-5 business days), and free shipping thresholds for Vishnu Home Products.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-brandBg min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brandText font-semibold">Shipping & Delivery Policy</span>
        </nav>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-sm space-y-6">
          <div className="border-b border-brandBorder pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brandAccent uppercase tracking-wider mb-1">
              <Truck className="w-4 h-4" />
              Official Store Policy
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xs text-brandText3 mt-1">
              Last Updated: November 2026 • Applicable to all orders placed on vishnuhomeproducts.in
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder">
              <Clock className="w-5 h-5 text-brandAccent mb-1.5" />
              <div className="text-xs font-bold text-brandText">Order Handling Time</div>
              <p className="text-[11px] text-brandText2 mt-0.5">
                <strong>1–2 Business Days</strong> (Monday – Saturday). Freshly packed in bubble-wrapped glass/food-grade jars.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder">
              <Truck className="w-5 h-5 text-brandAccent mb-1.5" />
              <div className="text-xs font-bold text-brandText">Transit / Delivery Time</div>
              <p className="text-[11px] text-brandText2 mt-0.5">
                <strong>2–3 Business Days</strong> within Karnataka & South India; <strong>3–5 Business Days</strong> across rest of India.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <PackageCheck className="w-5 h-5 text-emerald-700 mb-1.5" />
              <div className="text-xs font-bold text-emerald-900">Shipping Charges</div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                <strong>FREE Shipping</strong> on orders ₹499 and above. Flat <strong>₹50</strong> standard shipping on orders below ₹499.
              </p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-4 text-xs sm:text-sm text-brandText2 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">1. Serviceable Locations & Exclusive Logistics Partner</h2>
              <p>
                Vishnu Home Products ships authentic Mangalorean traditional snacks and homemade products across 26,000+ serviceable PIN codes in India. All orders are packed and dispatched directly from our central fulfillment warehouse in <strong>Bangalore, Karnataka – 560038</strong>.
              </p>
              <p>
                To provide express speed, real-time GPS tracking, and reliable cash on delivery (COD), we partner <strong>exclusively with Delhivery (delhivery.com)</strong> as our sole logistics and shipping provider nationwide.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">2. Shipping Rates & Free Delivery Threshold</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Orders ₹499 and above:</strong> ₹0 (100% Free Express Shipping via Delhivery across India).
                </li>
                <li>
                  <strong>Orders below ₹499:</strong> Dynamic real-time shipping fee calculated directly via Delhivery rate APIs based on destination PIN code and package weight (Bangalore Local: ₹40, Regional Karnataka/South: ₹50, Pan-India: ₹60).
                </li>
                <li>
                  <strong>Transparent Billing:</strong> No hidden handling or packaging costs. All taxes (5% GST) are clearly included.
                </li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">3. Order Processing, Cut-Off Time & Dispatch</h2>
              <p>
                Orders placed before <strong>2:00 PM IST (Monday to Saturday)</strong> are scheduled for same-day packing and next-morning Delhivery courier pickup from our Bangalore facility. Orders placed on Sundays or public holidays are dispatched on the next business day.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">4. Spill-Proof Packaging & Real-Time Delhivery Tracking</h2>
              <p>
                Every snack packet and pickle jar is vacuum-sealed and packed in multi-ply corrugated boxes with shock-absorbent cushioning. Once Delhivery scans the parcel at our Bangalore hub, an instant <strong>Delhivery AWB Waybill</strong> is assigned and sent via SMS and WhatsApp. You can track your shipment live at any time on our{' '}
                <Link href="/track-order" className="text-brandAccent font-semibold underline">
                  Delhivery Live Tracking Page
                </Link>{' '}
                or directly on{' '}
                <a
                  href="https://www.delhivery.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brandAccent font-semibold underline"
                >
                  delhivery.com
                </a>
                .
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">5. Contact for Shipping Support</h2>
              <p>
                If your package is delayed or shows an exception, please contact our dispatch desk at{' '}
                <a href="tel:+919845012345" className="text-brandAccent font-semibold">
                  +91 98450 12345
                </a>{' '}
                or email{' '}
                <a href="mailto:support@vishnuhomeproducts.in" className="text-brandAccent font-semibold">
                  support@vishnuhomeproducts.in
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

