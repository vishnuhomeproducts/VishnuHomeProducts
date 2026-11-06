import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Vishnu Home Products',
  description:
    'Privacy Policy, SSL encryption, Razorpay payment security, and customer data protection practices of Vishnu Home Products.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brandBg min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brandText font-semibold">Privacy Policy</span>
        </nav>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-sm space-y-6">
          <div className="border-b border-brandBorder pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brandAccent uppercase tracking-wider mb-1">
              <Lock className="w-4 h-4" />
              Data Protection & Security
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
              Privacy Policy
            </h1>
            <p className="text-xs text-brandText3 mt-1">
              Last Updated: November 2026 • Compliant with Indian DPDP Act & Google Merchant Center Standards
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-brandText2 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">1. Information We Collect</h2>
              <p>
                When you browse or place an order on <strong>vishnuhomeproducts.in</strong>, we collect only the essential details required to fulfill and deliver your order: your Name, Delivery Address, Pin Code, Phone Number, and Email Address.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">2. Payment Security & PCI-DSS Compliance</h2>
              <p>
                All online payments are processed through <strong>Razorpay</strong> using 256-bit SSL/TLS encryption and PCI-DSS Level 1 security standards. Vishnu Home Products never stores your credit card numbers, CVV, UPI PIN, or netbanking passwords on our servers.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To pack, ship, and deliver your order via our exclusive logistics partner Delhivery Express.</li>
                <li>To send order confirmation, invoice, and live AWB tracking updates via Email/SMS/WhatsApp.</li>
                <li>To provide customer support, replacements, or refunds.</li>
                <li>We <strong>never sell or rent</strong> your personal information to third-party telemarketers.</li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">4. Cookies & Analytics</h2>
              <p>
                We use essential browser cookies and local storage to keep items in your shopping cart, remember your saved delivery address, and measure website performance for Google Shopping compliance.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">5. Data Deletion & Grievance Officer Contact</h2>
              <p>
                You may request access, correction, or deletion of your personal data at any time by contacting our Grievance Officer:
                <br />
                <strong>Vishnu Home Products — Privacy & Grievance Desk</strong>
                <br />
                Address: Indiranagar, Bangalore, Karnataka – 560038, India
                <br />
                Phone: <a href="tel:+919845012345" className="text-brandAccent font-semibold">+91 98450 12345</a> • Email:{' '}
                <a href="mailto:support@vishnuhomeproducts.in" className="text-brandAccent font-semibold">
                  support@vishnuhomeproducts.in
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

