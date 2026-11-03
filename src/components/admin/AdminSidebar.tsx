'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Truck,
  MessageSquare,
  Users,
  Star,
  Tag,
  Boxes,
  Layers,
  Settings,
  BarChart3,
  ScrollText,
  Lock,
  ExternalLink,
  X,
  ChevronDown,
  LayoutGrid,
  SlidersHorizontal,
  Radio,
} from 'lucide-react';

export type AdminTab =
  | 'orders'
  | 'carts'
  | 'shipments'
  | 'queries'
  | 'customers'
  | 'reviews'
  | 'coupons'
  | 'inventory'
  | 'categories'
  | 'settings'
  | 'tracking'
  | 'policies';

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  items: NavItem[];
}

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onLock: () => void;
  inFlightCount?: number;
  unfulfilledCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  onLock,
  inFlightCount = 2,
  unfulfilledCount = 3,
}) => {
  const navSections: NavSection[] = [
    {
      id: 'operations',
      title: '1. ORDERS & OPERATIONS',
      icon: LayoutGrid,
      badgeCount: (unfulfilledCount > 0 ? unfulfilledCount : 0) + (inFlightCount > 0 ? inFlightCount : 0),
      items: [
        {
          id: 'orders',
          label: 'Live Orders & History',
          icon: Package,
          badge: unfulfilledCount > 0 ? `${unfulfilledCount} new` : undefined,
          badgeColor: 'bg-rose-500 text-white font-bold',
        },
        {
          id: 'carts',
          label: 'Live Radar & Carts',
          icon: Radio,
          badge: inFlightCount > 0 ? `${inFlightCount} Live` : 'Live',
          badgeColor: 'bg-emerald-400 text-slate-950 font-black',
        },
        {
          id: 'shipments',
          label: 'Courier Dispatch & Shipments',
          icon: Truck,
          badge: 'Pan-India',
          badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
        },
        {
          id: 'queries',
          label: 'Customer Support & Queries',
          icon: MessageSquare,
        },
      ],
    },
    {
      id: 'customers',
      title: '2. CUSTOMER MANAGEMENT',
      icon: Users,
      items: [
        {
          id: 'customers',
          label: 'Customer Directory',
          icon: Users,
        },
        {
          id: 'reviews',
          label: 'Customer Reviews',
          icon: Star,
        },
        {
          id: 'coupons',
          label: 'Discount Coupons',
          icon: Tag,
        },
      ],
    },
    {
      id: 'catalog',
      title: '3. CATALOG & INVENTORY',
      icon: Boxes,
      items: [
        {
          id: 'inventory',
          label: 'Products & Stock Manager',
          icon: Boxes,
        },
        {
          id: 'categories',
          label: 'Categories & Collections',
          icon: Layers,
        },
      ],
    },
    {
      id: 'store',
      title: '4. STORE SETTINGS',
      icon: SlidersHorizontal,
      items: [
        {
          id: 'settings',
          label: 'Store Configuration & Keys',
          icon: Settings,
        },
        {
          id: 'tracking',
          label: 'Google Ads & Tracking',
          icon: BarChart3,
        },
        {
          id: 'policies',
          label: 'Store Legal Policies',
          icon: ScrollText,
        },
      ],
    },
  ];

  // Accordion state: by default all sections start open
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    operations: true,
    customers: true,
    catalog: true,
    store: true,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Auto-expand active parent category
  useEffect(() => {
    const parent = navSections.find((sec) => sec.items.some((i) => i.id === activeTab));
    if (parent && !expandedSections[parent.id]) {
      setExpandedSections((prev) => ({ ...prev, [parent.id]: true }));
    }
  }, [activeTab]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar: Modern Warm Obsidian & Crimson Ruby Theme */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#111319] border-r border-white/[0.08] text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl`}
      >
        {/* Brand Header */}
        <div className="p-3.5 m-3 mb-1 bg-[#181b24] border border-white/[0.08] rounded-2xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white font-black text-lg flex items-center justify-center tracking-tighter shadow-md shadow-rose-950/60 group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <div className="text-white font-black text-sm tracking-tight leading-tight">
                Vishnu Foods
              </div>
              <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mt-0.5">
                Operations Hub
              </div>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List with Distinct Modern Graphite & Ruby Category Cards */}
        <div className="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-3.5 scrollbar-thin">
          {navSections.map((sec) => {
            const isExpanded = Boolean(expandedSections[sec.id]);
            const SectionIcon = sec.icon;
            const hasActiveChild = sec.items.some((i) => i.id === activeTab);

            return (
              <div key={sec.id} className="space-y-1">
                {/* Modern Embossed Category Header Card */}
                <button
                  type="button"
                  onClick={() => toggleSection(sec.id)}
                  aria-expanded={isExpanded}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all select-none border ${
                    hasActiveChild
                      ? 'bg-[#1e2330] border-rose-500/40 text-rose-300 shadow-md shadow-rose-950/20'
                      : 'bg-[#181c26] border-white/[0.08] hover:border-rose-500/30 text-slate-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SectionIcon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        hasActiveChild ? 'text-rose-400' : 'text-rose-500/80'
                      }`}
                    />
                    <span className="truncate">{sec.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isExpanded && sec.badgeCount !== undefined && sec.badgeCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-bold">
                        {sec.badgeCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-rose-400' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Sub-Items with Vertical Ruby Connecting Line */}
                {isExpanded && (
                  <div className="relative ml-3 pl-3.5 border-l-2 border-rose-500/30 space-y-1 pt-1.5 pb-0.5 animate-fadeIn">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectTab(item.id);
                            onClose();
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 text-left ${
                            isActive
                              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold shadow-lg shadow-rose-950/50'
                              : 'text-slate-300 hover:text-white hover:bg-white/[0.06] font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-white' : 'text-slate-400'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full shrink-0 font-bold ${
                                isActive
                                  ? 'bg-white text-rose-700 shadow-xs'
                                  : item.badgeColor || 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions: Storefront & Lock Panel */}
        <div className="p-3 m-3 mt-1 bg-[#181b24] border border-white/[0.08] rounded-2xl space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#1e222e] hover:bg-[#252b3a] border border-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              <span>Public Storefront</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">vishnuhome.in</span>
          </Link>

          <button
            onClick={onLock}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Lock Panel (Logout)</span>
            </div>
            <span className="text-[10px] font-mono text-rose-400/90">Security PIN</span>
          </button>
        </div>
      </aside>
    </>
  );
};
