import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, CheckCircle2, Clock, ChevronRight, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'Return, Replacement & Refund Policy | Vishnu Home Products',
  description:
    '7-Day hassle-free return, free replacement, and full refund policy for Vishnu Home Products orders.',
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="bg-brandBg min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brandText font-semibold">Return, Replacement & Refund Policy</span>
        </nav>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-sm space-y-6">
          <div className="border-b border-brandBorder pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brandAccent uppercase tracking-wider mb-1">
              <RotateCcw className="w-4 h-4" />
              Customer Buyer Protection
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
              Return, Replacement & Refund Policy
            </h1>
            <p className="text-xs text-brandText3 mt-1">
              Last Updated: November 2026 • Compliant with Google Merchant Center Return Standards
            </p>
          </div>

          {/* Key Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder">
              <Clock className="w-5 h-5 text-brandAccent mb-1.5" />
              <div className="text-xs font-bold text-brandText">7-Day Return Window</div>
              <p className="text-[11px] text-brandText2 mt-0.5">
                Report any transit damage, leakage, wrong item, or quality issue within <strong>7 calendar days</strong> of delivery.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 mb-1.5" />
              <div className="text-xs font-bold text-emerald-900">Free Return / Replacement</div>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                <strong>₹0 Return Shipping Cost</strong> for damaged, leaked, or incorrect items. We ship a fresh replacement jar free of cost.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-brandBg border border-brandBorder">
              <ShieldCheck className="w-5 h-5 text-brandAccent mb-1.5" />
              <div className="text-xs font-bold text-brandText">Fast 3–5 Day Refunds</div>
              <p className="text-[11px] text-brandText2 mt-0.5">
                100% refund credited back to your original payment method (UPI, Card, NetBanking, or Bank Account) within <strong>3–5 business days</strong>.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-brandText2 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">1. Eligibility for Returns, Replacements & Refunds</h2>
              <p>
                Because our pickles, thokkus, spices, and dry fish are freshly prepared food items, unopened jars or items affected by any of the following conditions qualify for an immediate <strong>100% Free Replacement or Full Refund within 7 days of delivery</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Jar or outer seal was damaged, broken, or leaked during courier transit.</li>
                <li>Wrong product, wrong weight/size variant, or missing item from your order.</li>
                <li>Product quality, freshness, or shelf-life issue upon opening.</li>
                <li>Unopened and sealed product that you wish to return within 7 days of delivery.</li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">2. How to Initiate a Return, Replacement, or Refund</h2>
              <p>
                You can request a return or replacement in under 2 minutes without filling out complicated forms:
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>
                  Send your <strong>Order ID</strong> and a quick photo of the jar/package on WhatsApp to{' '}
                  <a href="https://wa.me/919845012345" className="text-brandAccent font-semibold underline">
                    +91 98450 12345
                  </a>{' '}
                  or email{' '}
                  <a href="mailto:support@vishnuhomeproducts.in" className="text-brandAccent font-semibold underline">
                    support@vishnuhomeproducts.in
                  </a>
                  .
                </li>
                <li>
                  Our team verifies and approves the request within <strong>4 business hours</strong>.
                </li>
                <li>
                  Choose either a <strong>Free Express Replacement Jar</strong> dispatched within 24 hours OR a <strong>100% Full Refund</strong>.
                </li>
              </ol>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">3. Return Address & Reverse Pickup</h2>
              <p>
                For damaged or leaked food jars, you do not need to ship the broken jar back. For sealed/unopened returns, we arrange reverse courier pickup or accept returns at:
                <br />
                <strong>Vishnu Home Products — Returns Desk, Kadri Temple Road, Mangaluru, Karnataka – 575002, India.</strong>
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">4. Order Cancellation Policy</h2>
              <p>
                Orders can be cancelled for a <strong>100% instant refund</strong> any time before dispatch by contacting us on{' '}
                <a href="tel:+919845012345" className="text-brandAccent font-semibold">
                  +91 98450 12345
                </a>{' '}
                or{' '}
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

