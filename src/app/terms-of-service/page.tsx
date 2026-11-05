import React from 'react';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service & Billing Terms | Vishnu Home Products',
  description:
    'Terms of Service, pricing transparency, accepted payment methods, and FSSAI food compliance terms for Vishnu Home Products.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-brandBg min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brandText font-semibold">Terms of Service & Billing Policy</span>
        </nav>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brandBorder shadow-sm space-y-6">
          <div className="border-b border-brandBorder pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brandAccent uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              Legal & Billing Terms
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
              Terms of Service & Billing Policy
            </h1>
            <p className="text-xs text-brandText3 mt-1">
              Last Updated: November 2026 • Vishnu Home Products (FSSAI Lic: 21223181000014)
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-brandText2 leading-relaxed">
            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">1. Overview & Merchant Identity</h2>
              <p>
                This website (<strong>vishnuhomeproducts.in</strong>) is operated by <strong>Vishnu Home Products</strong>, located at Kadri Temple Road, Mangaluru, Karnataka – 575002, India (FSSAI License No: <strong>21223181000014</strong>). By placing an order on our website, you agree to these Terms of Service.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">2. Transparent Pricing & Taxes (INR)</h2>
              <p>
                All prices displayed on product pages, tiered volume discount tables, and cart summaries are in <strong>Indian Rupees (₹ INR)</strong> and are <strong>100% inclusive of applicable GST</strong>. Any applicable shipping fee (₹50 on orders below ₹499, or FREE on orders ₹499 and above) is clearly itemized on the Cart and Checkout pages before you complete payment.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">3. Accepted Payment Methods</h2>
              <p>
                We accept the following secure payment methods at checkout:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>UPI:</strong> Google Pay (GPay), PhonePe, Paytm, BHIM, and all UPI IDs via Razorpay.</li>
                <li><strong>Cards:</strong> Visa, Mastercard, RuPay, and Maestro Debit & Credit Cards.</li>
                <li><strong>NetBanking & Wallets:</strong> All major Indian banks via Razorpay.</li>
                <li><strong>Cash on Delivery (COD):</strong> Available across serviceable Indian pin codes with no hidden surcharges.</li>
              </ul>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">4. Product Accuracy, Ingredients & Allergen Notice</h2>
              <p>
                Every product page lists full ingredients, net weight (e.g., 300g, 500g, 1kg), and storage instructions. Since our products are handcrafted in small kitchen batches using natural agricultural produce, slight natural variations in color or texture may occur without affecting taste or quality. Customers with specific food allergies (such as sesame/gingelly, mustard, garlic, or seafood) should review the ingredient list on the product page before ordering.
              </p>
            </section>

            <section className="space-y-1.5">
              <h2 className="font-bold text-base text-brandText">5. Governing Law & Jurisdiction</h2>
              <p>
                These Terms of Service and any separate agreements whereby we provide you products shall be governed by and construed in accordance with the laws of India, under the jurisdiction of Mangalore, Karnataka.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

