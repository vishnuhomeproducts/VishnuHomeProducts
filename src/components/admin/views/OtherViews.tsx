'use client';

import React from 'react';
import {
  Star,
  CheckCircle2,
  MessageSquare,
  Layers,
  BarChart3,
  ScrollText,
} from 'lucide-react';
import { AdminTab } from '../AdminSidebar';

interface OtherViewsProps {
  tab: AdminTab;
}

export const OtherViews: React.FC<OtherViewsProps> = ({ tab }) => {
  // Reviews View: Clay Cards
  if (tab === 'reviews') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">Customer Product Reviews Moderation</h3>
            <p className="text-xs text-brandText2">Approve or feature genuine customer reviews on the shop</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-brandGreen">
            Average: 4.9 ★ (128 reviews)
          </span>
        </div>

        <div className="clay-card divide-y divide-white/60 text-xs overflow-hidden">
          {[
            { name: 'Dr. Shruti Nair', city: 'Mumbai', rating: 5, product: 'Avakaya Mango Pickle', comment: 'The spice level and mustard flavour is exactly like my grandmother made in Mangalore. Very authentic!', date: '2 days ago', approved: true },
            { name: 'Girish Shenoy', city: 'Bengaluru', rating: 5, product: 'Sun-Dried Kundapura Mackerel', comment: 'Extremely fresh and cleaned properly. No foul smell, crisp and delicious.', date: '3 days ago', approved: true },
            { name: 'Deepa Hegde', city: 'Udupi', rating: 5, product: 'Tomato Thokku', comment: 'Goes amazing with curd rice and dosas. Will order again regularly.', date: '5 days ago', approved: true },
          ].map((r, i) => (
            <div key={i} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-white/40 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brandText">{r.name}</span>
                  <span className="text-slate-400">({r.city})</span>
                  <span className="text-amber-500 font-bold">{'★'.repeat(r.rating)}</span>
                </div>
                <div className="text-slate-600 font-medium">Product: <strong>{r.product}</strong></div>
                <p className="text-brandText leading-relaxed italic">"{r.comment}"</p>
                <div className="text-[11px] text-slate-400">{r.date}</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-brandGreen font-bold text-[11px] shrink-0 shadow-xs">
                ✓ Approved & Live
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Customer Support & Queries: Clay Cards
  if (tab === 'queries') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">Customer Support & Queries</h3>
          <p className="text-xs text-brandText2">Customer delivery inquiries and direct product messages</p>
        </div>

        <div className="clay-card divide-y divide-white/60 text-xs overflow-hidden">
          {[
            { name: 'Rohan Shetty', phone: '9845112233', type: 'Delivery Query', message: 'Can you deliver by Thursday evening in Mangalore?', status: 'Resolved' },
            { name: 'Kavitha Pai', phone: '9980554433', type: 'Product Inquiry', message: 'Is the Kundapura Mackerel cleaned and head removed?', status: 'Answered' },
          ].map((q, i) => (
            <div key={i} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brandText">{q.name}</span>
                  <span className="text-slate-400">({q.phone})</span>
                  <span className="px-2.5 py-0.5 rounded-full clay-card-flat text-brandRed text-[10px] font-semibold">{q.type}</span>
                </div>
                <p className="text-brandText2">"{q.message}"</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-brandGreen font-bold text-[10px] shadow-xs">
                {q.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Categories View: Clay Cards
  if (tab === 'categories') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">Product Categories & Collections</h3>
          <p className="text-xs text-brandText2">Manage storefront collections</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {[
            { name: 'Pickles & Thokkus', icon: '🥭', count: '4 Products', slug: 'pickles' },
            { name: 'Spices & Masalas', icon: '🌶️', count: '2 Products', slug: 'spices' },
            { name: 'Dry Fish & Seafood', icon: '🐟', count: '2 Products', slug: 'dry-fish' },
            { name: 'Wellness & Cold-Pressed Oils', icon: '🪔', count: '1 Product', slug: 'wellness' },
          ].map((c, i) => (
            <div key={i} className="clay-card p-5 space-y-2 hover:translate-y-[-2px] transition-transform">
              <span className="text-3xl">{c.icon}</span>
              <div className="font-bold text-sm text-brandText">{c.name}</div>
              <div className="text-[11px] text-slate-400 font-medium">{c.count}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Tracking & Policies View: Clay Card
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">
          {tab === 'tracking' ? 'Google Ads & Tracking Hub' : 'Store Legal Policies'}
        </h3>
        <p className="text-xs text-brandText2">System integrations and compliance</p>
      </div>

      <div className="clay-card p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-brandText">
          <CheckCircle2 className="w-4 h-4 text-brandGreen" />
          <span>Status: Configured & Active</span>
        </div>
        <p className="text-brandText2 leading-relaxed">
          {tab === 'tracking'
            ? 'GA4 measurement ID and Meta Pixel scripts are configured in the application layout for automatic e-commerce purchase tracking.'
            : 'Shipping Policy (3-5 business days pan-India), Return/Refund Policy (perishable food items guarantee), and Terms of Service are active.'}
        </p>
      </div>
    </div>
  );
};
