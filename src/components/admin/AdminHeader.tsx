'use client';

import React from 'react';
import {
  Menu,
  Plus,
  Zap,
  RefreshCw,
  CheckCircle,
  Search,
  Printer,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileMenu: () => void;
  onRefresh: () => void;
  onReconcile?: () => void;
  onCreateManualOrder: () => void;
  onBatchPack: () => void;
  onMarkAllSeen?: () => void;
  isRefreshing?: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  orders: {
    title: 'Live Orders Control Panel',
    subtitle: 'Manage Pan-India courier dispatches, local deliveries, items, and live payment verification.',
  },
  carts: {
    title: 'Live Radar & Abandoned Carts',
    subtitle: 'Real-time cart activity. Monitor and recover uncompleted customer checkouts.',
  },
  shipments: {
    title: 'Courier Dispatch & Shipments',
    subtitle: 'Manage AWB tracking, Delhivery, BlueDart, DTDC, and India Post parcel manifests.',
  },
  queries: {
    title: 'Customer Support & Queries',
    subtitle: 'Inquiries, special delivery instructions, and product feedback.',
  },
  customers: {
    title: 'Customer Directory & Profiles',
    subtitle: 'Complete database of customers, order histories, and lifetime spend.',
  },
  reviews: {
    title: 'Customer Product Reviews',
    subtitle: 'Moderate and approve genuine customer testimonials for the public shop.',
  },
  coupons: {
    title: 'Discount Coupons & Offers',
    subtitle: 'Create promo codes, minimum cart thresholds, and expiry dates.',
  },
  inventory: {
    title: 'Product Catalog & Stock Manager',
    subtitle: 'Update jar sizes, prices, MRP, and stock availability instantly.',
  },
  categories: {
    title: 'Categories & Collections',
    subtitle: 'Organize pickles, thokkus, spices, dry fish, and coastal specialities.',
  },
  settings: {
    title: 'Store Configuration & Keys',
    subtitle: 'Manage business address, GSTIN, Razorpay credentials, and shipping thresholds.',
  },
  tracking: {
    title: 'Google Ads & Tracking Hub',
    subtitle: 'Configure GA4 measurement ID, Meta Pixel, and conversion tags.',
  },
  policies: {
    title: 'Store Legal Policies',
    subtitle: 'Review and update Shipping & Delivery, Return & Refund, and Terms.',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onRefresh,
  onReconcile,
  onCreateManualOrder,
  onBatchPack,
  onMarkAllSeen,
  isRefreshing,
  searchQuery,
  onSearchChange,
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'Operations Hub',
    subtitle: 'Vishnu Home Products E-Commerce Management',
  };

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 py-3.5 space-y-3.5 backdrop-blur-md bg-[#eaedf2]/90 border-b border-white/60">
      {/* Top row: Menu toggle, Title, Status & Top Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl clay-btn-light lg:hidden"
          >
            <Menu className="w-5 h-5 text-brandText" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-brandText tracking-tight">
                {currentTabInfo.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 text-brandGreen border border-emerald-200/80 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-brandGreen animate-pulse" />
                Live Store
              </span>
            </div>
            <p className="text-xs text-brandText2 hidden sm:block mt-0.5">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Tactile Clay Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Create Manual Order: Red Clay Button */}
          <button
            onClick={onCreateManualOrder}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold clay-btn-red"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Create Manual Order</span>
          </button>

          {/* Batch Pack & Slips: Light Clay with Red Accent */}
          <button
            onClick={onBatchPack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-brandRed clay-btn-light"
            title="Batch packing slips for today's pending orders"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-Prepare Today's Batch</span>
            <span className="sm:hidden">Batch Pack</span>
          </button>

          {/* Refresh: Light Clay */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-brandText2 clay-btn-light"
            title="Refresh order data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brandRed' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Clay Inset Search Bar (Matte well, very easy on the eyes) */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders, customer name, mobile number, pincode, product..."
            className="w-full pl-10 pr-4 py-2.5 text-xs text-brandText placeholder-slate-400 focus:outline-none clay-inset"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 font-medium whitespace-nowrap px-3 py-2 rounded-xl clay-card-flat">
          <span>Mangaluru, KA</span>
          <span className="w-1 h-1 rounded-full bg-slate-400" />
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </header>
  );
};
