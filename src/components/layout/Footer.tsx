import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brandDark text-white pt-14 pb-8 border-t border-white/10">
      <div className="max-w-site mx-auto px-4">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & FSSAI */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <div className="bg-brandRed text-white font-black text-lg px-2.5 py-0.5 rounded tracking-tighter">
                VISHNU
              </div>
              <div className="border border-white/60 text-white font-bold text-xs px-2 py-0.5 rounded uppercase tracking-wider">
                Home Products
              </div>
            </div>
            
            <p className="text-xs text-white/70 leading-relaxed">
              Crafting traditional, small-batch Mangalorean pickles, thokkus, sun-cured dry fish, and Ayurvedic formulations. 100% homemade with pure wood-pressed oils and zero artificial preservatives.
            </p>

            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white/80">
              <ShieldCheck className="w-4 h-4 text-brandGreen" />
              <span>FSSAI Lic: <strong>21223181000014</strong></span>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brandAccent-mid">
              Shop Categories
            </h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/shop?category=Pickles+%26+Thokkus" className="hover:text-brandAccent transition-colors">
                  Pickles & Thokkus
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Spices+%26+Masalas" className="hover:text-brandAccent transition-colors">
                  Spices & Masalas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Dry+Fish" className="hover:text-brandAccent transition-colors">
                  Coastal Dry Fish
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Wellness" className="hover:text-brandAccent transition-colors">
                  Ayurvedic Wellness & Oils
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Sweets+%26+Festive" className="hover:text-brandAccent transition-colors">
                  Sweets & Festive Specials
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Rice+%26+Grains" className="hover:text-brandAccent transition-colors">
                  Rice & Paper Poha
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick & Help Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brandAccent-mid">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <Link href="/account" className="hover:text-brandAccent transition-colors">
                  My Account & Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brandAccent transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <span className="hover:text-brandAccent cursor-pointer transition-colors">
                  Shipping & Delivery (3–5 Days)
                </span>
              </li>
              <li>
                <span className="hover:text-brandAccent cursor-pointer transition-colors">
                  7-Day Return Policy
                </span>
              </li>
              <li>
                <span className="hover:text-brandAccent cursor-pointer transition-colors">
                  Privacy Policy & Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brandAccent-mid">
              Get in Touch
            </h3>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brandAccent shrink-0 mt-0.5" />
                <span>Kadri Temple Road, Mangaluru, Karnataka - 575002</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brandAccent shrink-0" />
                <a href="tel:+919845012345" className="hover:text-brandAccent transition-colors">
                  +91 98450 12345
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brandAccent shrink-0" />
                <a href="mailto:support@vishnuhomeproducts.in" className="hover:text-brandAccent transition-colors">
                  support@vishnuhomeproducts.in
                </a>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-1.5 text-[11px] text-brandAccent bg-brandAccent/10 px-2.5 py-1 rounded">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Wholesale & Bulk Inquiries Welcome</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} Vishnu Home Products. All rights reserved. Handcrafted with ❤️ in Mangalore.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/40 mr-1">Secured by:</span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-medium text-[10px] tracking-wide border border-white/10">
              Razorpay
            </span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-medium text-[10px] tracking-wide border border-white/10">
              UPI / GPay
            </span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-medium text-[10px] tracking-wide border border-white/10">
              Cards & NetBanking
            </span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-medium text-[10px] tracking-wide border border-white/10">
              COD Available
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
