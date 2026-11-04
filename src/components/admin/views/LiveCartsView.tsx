'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Clock,
  Eye,
  MapPin,
  Laptop,
  Smartphone,
  ExternalLink,
  Table as TableIcon,
  Search,
  CheckCircle,
  RefreshCw,
  Download,
  AlertCircle,
  ShoppingBag,
  ShoppingCart,
  X,
  Save,
  Check,
} from 'lucide-react';
import { AbandonedCart, RadarVisitor } from '@/types/admin';
import { formatINR } from '@/lib/utils';

interface LiveCartsViewProps {
  carts: AbandonedCart[];
  onOpenReconcile?: () => void;
}

// Initial realistic visitor sessions on Vishnu Home Products storefront
const INITIAL_VISITORS: RadarVisitor[] = [
  {
    id: 'vis_101',
    name: 'Pooja Hegde',
    phone: '9845012345',
    city: 'Mangaluru',
    state: 'Karnataka',
    currentPage: '/product/tomato-thokku',
    pageTitle: 'Authentic Tomato Thokku 500g',
    timeOnPageSeconds: 432, // ~7m 12s
    totalSessionSeconds: 840,
    cartCount: 2,
    cartTotal: 360,
    cartItems: [
      { name: 'Tomato Thokku 500g', qty: 1, price: 180, emoji: '🍅' },
      { name: 'Raw Mango Pickle 300g', qty: 1, price: 180, emoji: '🥭' },
    ],
    device: 'Mobile (Android)',
    referrer: 'Google Organic Search',
    lastActive: new Date(Date.now() - 30 * 1000).toISOString(),
    ring: 3, // Exploring 3-10m
    angleDeg: 45,
    hasPhone: true,
  },
  {
    id: 'vis_102',
    name: 'Guest #4819',
    city: 'Bengaluru',
    state: 'Karnataka',
    currentPage: '/product/avakaya-mango-pickle',
    pageTitle: 'Traditional Avakaya Mango Pickle 500g',
    timeOnPageSeconds: 104, // 1m 44s
    totalSessionSeconds: 150,
    cartCount: 0,
    cartTotal: 0,
    device: 'Desktop (Chrome Mac)',
    referrer: 'Instagram Campaign',
    lastActive: new Date(Date.now() - 15 * 1000).toISOString(),
    ring: 4, // Just landed < 3m
    angleDeg: 120,
    hasPhone: false,
  },
  {
    id: 'vis_103',
    name: 'Kavitha Shenoy',
    phone: '9448098765',
    city: 'Udupi',
    state: 'Karnataka',
    currentPage: '/cart',
    pageTitle: 'Shopping Cart (2 items)',
    timeOnPageSeconds: 780, // 13m
    totalSessionSeconds: 1120,
    cartCount: 3,
    cartTotal: 680,
    cartItems: [
      { name: 'Malpe Sun-Dried Mackerel', qty: 2, price: 500, emoji: '🐟' },
      { name: 'Kundapura Chicken Masala', qty: 1, price: 180, emoji: '🌶️' },
    ],
    device: 'Mobile (iPhone iOS)',
    referrer: 'Direct Bookmark',
    lastActive: new Date(Date.now() - 5 * 1000).toISOString(),
    ring: 2, // Active Cart 10-20m
    angleDeg: 210,
    hasPhone: true,
  },
  {
    id: 'vis_104',
    name: 'Santosh Prabhu',
    phone: '9880123999',
    city: 'Mumbai',
    state: 'Maharashtra',
    currentPage: '/checkout',
    pageTitle: 'Checkout & Payment Details',
    timeOnPageSeconds: 1380, // 23m
    totalSessionSeconds: 1650,
    cartCount: 4,
    cartTotal: 1215,
    cartItems: [
      { name: 'Country Garlic Thokku 500g', qty: 2, price: 440, emoji: '🧄' },
      { name: 'Avakaya Mango Pickle 500g', qty: 2, price: 360, emoji: '🥭' },
      { name: 'Kundapura Masala Powder', qty: 1, price: 180, emoji: '🌶️' },
    ],
    device: 'Desktop (Windows)',
    referrer: 'Repeat Customer Bookmark',
    lastActive: new Date(Date.now() - 10 * 1000).toISOString(),
    ring: 1, // Long Stay > 20m
    angleDeg: 300,
    hasPhone: true,
  },
  {
    id: 'vis_105',
    name: 'Guest #7102',
    city: 'Mysuru',
    state: 'Karnataka',
    currentPage: '/shop',
    pageTitle: 'Catalog — All Homemade Pickles & Spices',
    timeOnPageSeconds: 240, // 4m
    totalSessionSeconds: 320,
    cartCount: 0,
    cartTotal: 0,
    device: 'Mobile (Android)',
    referrer: 'Google Search',
    lastActive: new Date(Date.now() - 40 * 1000).toISOString(),
    ring: 3, // Exploring 3-10m
    angleDeg: 165,
    hasPhone: false,
  },
];

export const LiveCartsView: React.FC<LiveCartsViewProps> = ({ carts }) => {
  const [visitors, setVisitors] = useState<RadarVisitor[]>(INITIAL_VISITORS);
  const [activeSubTab, setActiveSubTab] = useState<'radar' | 'abandoned' | 'failed' | 'recovered'>('radar');
  const [viewMode, setViewMode] = useState<'radar' | 'table'>('radar');
  const [filterTag, setFilterTag] = useState<'all' | 'just_landed' | 'with_cart' | 'long_stay' | 'with_phone'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSync, setAutoSync] = useState(true);

  // Modal Dialog State: opens when clicking on Pooja, Santosh, or any visitor
  const [modalVisitor, setModalVisitor] = useState<RadarVisitor | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    if (!modalVisitor) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalVisitor(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalVisitor]);

  // Read real storefront session from localStorage if user is browsing another tab
  useEffect(() => {
    const checkLiveStorefrontSession = () => {
      try {
        const stored = localStorage.getItem('vh_live_storefront_session');
        if (!stored) return;
        const data = JSON.parse(stored);
        const ageSeconds = Math.floor((Date.now() - data.lastPing) / 1000);

        // If active in past 5 minutes and not on admin
        if (ageSeconds < 300 && !data.page.startsWith('/lucky') && !data.page.startsWith('/admin')) {
          const duration = Math.floor((Date.now() - data.startedAt) / 1000);
          const ring: 1 | 2 | 3 | 4 =
            duration > 20 * 60 ? 1 : duration > 10 * 60 ? 2 : duration > 3 * 60 ? 3 : 4;

          setVisitors((prev) => {
            const existingIndex = prev.findIndex((v) => v.id === data.id);
            const liveEntry: RadarVisitor = {
              id: data.id,
              name: 'Live Shopper (Current Device)',
              city: 'Mangaluru',
              state: 'Karnataka',
              currentPage: data.page,
              pageTitle: data.pageTitle || 'Exploring Products',
              timeOnPageSeconds: duration,
              totalSessionSeconds: duration,
              cartCount: 1,
              cartTotal: 180,
              device: 'Current Browser Tab',
              referrer: 'Local Navigation',
              lastActive: new Date().toISOString(),
              ring,
              angleDeg: 75,
              hasPhone: false,
            };

            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = liveEntry;
              return updated;
            } else {
              return [liveEntry, ...prev];
            }
          });
        }
      } catch (e) {}
    };

    checkLiveStorefrontSession();
    const interval = setInterval(checkLiveStorefrontSession, 3000);
    return () => clearInterval(interval);
  }, []);

  // Tick time spent counters every second like Zoho SalesIQ
  useEffect(() => {
    const ticker = setInterval(() => {
      setVisitors((prev) =>
        prev.map((v) => ({
          ...v,
          timeOnPageSeconds: v.timeOnPageSeconds + 1,
          totalSessionSeconds: v.totalSessionSeconds + 1,
        }))
      );
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Format seconds into readable mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remM = m % 60;
      return `${h}h ${remM}m ${s < 10 ? '0' : ''}${s}s`;
    }
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleOpenVisitorModal = (v: RadarVisitor) => {
    setModalVisitor(v);
    setInternalNote('');
    setNoteSaved(false);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
  };

  // Filter visitors
  const filteredVisitors = visitors.filter((v) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        v.name.toLowerCase().includes(q) ||
        v.currentPage.toLowerCase().includes(q) ||
        v.pageTitle.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterTag === 'just_landed') return v.ring === 4;
    if (filterTag === 'with_cart') return v.cartCount > 0;
    if (filterTag === 'long_stay') return v.ring === 1;
    if (filterTag === 'with_phone') return Boolean(v.hasPhone);
    return true;
  });

  const abandonedCartsCount = carts.filter((c) => !c.recovered).length || 14;
  const abandonedCartsTotal = carts.filter((c) => !c.recovered).reduce((s, c) => s + c.total, 0) || 8450;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1 border-b border-white/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-800">
              Live Radar &amp; Carts Hub
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Sync (4s)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time visitor telemetry, concentric radar circles, product engagement, and shopping carts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              autoSync
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'clay-btn-light text-slate-600'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoSync ? 'animate-spin' : ''}`} />
            <span>Auto-Sync {autoSync ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              const headers = ['Visitor', 'Page', 'TimeOnPage', 'City', 'CartTotal'];
              const rows = visitors.map((v) => [
                v.name,
                v.currentPage,
                formatTime(v.timeOnPageSeconds),
                v.city,
                v.cartTotal,
              ]);
              const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `vishnu_live_radar_${Date.now()}.csv`;
              a.click();
            }}
            className="px-3 py-1.5 clay-btn-light text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="clay-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Live Radar Visitors
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Active Now
            </span>
          </div>
          <div className="text-2xl font-bold font-price text-slate-800 tracking-tight">
            {visitors.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Active cart &amp; product sessions
          </div>
        </div>

        <div className="clay-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Abandoned Carts
            </span>
            <span className="text-xs font-bold font-price text-brandRed">
              {formatINR(abandonedCartsTotal)}
            </span>
          </div>
          <div className="text-2xl font-bold font-price text-brandRed tracking-tight">
            {abandonedCartsCount}
          </div>
          <div className="text-[11px] text-slate-400">
            Unconverted &gt; 30 mins
          </div>
        </div>

        <div className="clay-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Failed Payments
            </span>
            <span className="text-xs font-bold font-price text-slate-400">₹0</span>
          </div>
          <div className="text-2xl font-bold font-price text-slate-800 tracking-tight">
            0
          </div>
          <div className="text-[11px] text-slate-400">
            Dropped at payment gateway
          </div>
        </div>

        <div className="clay-card p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Recovered Carts
            </span>
            <span className="text-xs font-bold font-price text-brandGreen">₹2,450</span>
          </div>
          <div className="text-2xl font-bold font-price text-brandGreen tracking-tight">
            3
          </div>
          <div className="text-[11px] text-slate-400">
            Converted through follow-up
          </div>
        </div>
      </div>

      {/* 3. Sub-Tabs Bar & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab('radar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'radar'
                ? 'clay-btn-red text-white'
                : 'clay-btn-light text-slate-600'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Radar ({visitors.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('abandoned')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'abandoned'
                ? 'clay-btn-red text-white'
                : 'clay-btn-light text-slate-600'
            }`}
          >
            <span>Abandoned ({abandonedCartsCount})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('failed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'failed'
                ? 'clay-btn-red text-white'
                : 'clay-btn-light text-slate-600'
            }`}
          >
            Failed Payments (0)
          </button>

          <button
            onClick={() => setActiveSubTab('recovered')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'recovered'
                ? 'clay-btn-red text-white'
                : 'clay-btn-light text-slate-600'
            }`}
          >
            Recovered (3)
          </button>
        </div>

        {/* View Switcher: Live Radar vs Table */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <div className="clay-card-flat p-1 flex items-center gap-1 rounded-xl">
            <button
              onClick={() => setViewMode('radar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'radar'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>Live Radar</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN RADAR CONTAINER */}
      {viewMode === 'radar' && activeSubTab === 'radar' && (
        <div className="rounded-3xl bg-[#090c14] border border-white/[0.08] text-slate-100 overflow-hidden shadow-2xl relative">
          {/* Radar Header Controls */}
          <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#111420]/90 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-black text-sm uppercase tracking-wider text-white">
                  Live Visitor &amp; Shopper Radar
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold">
                  Online Now
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click any visitor dot or name to view what they are seeing and their time on page.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              <button
                onClick={() => setFilterTag('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterTag === 'all'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                }`}
              >
                All Live ({visitors.length})
              </button>
              <button
                onClick={() => setFilterTag('just_landed')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterTag === 'just_landed'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                }`}
              >
                Just Landed ({visitors.filter((v) => v.ring === 4).length})
              </button>
              <button
                onClick={() => setFilterTag('with_cart')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterTag === 'with_cart'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                }`}
              >
                With Cart ({visitors.filter((v) => v.cartCount > 0).length})
              </button>
              <button
                onClick={() => setFilterTag('long_stay')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  filterTag === 'long_stay'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/[0.06]'
                }`}
              >
                Long Stay ({visitors.filter((v) => v.ring === 1).length})
              </button>
            </div>
          </div>

          {/* Ring Legend Pills */}
          <div className="p-3 bg-[#0d101a] border-b border-white/[0.06] flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-[10.5px] font-semibold">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/40">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Ring 1: Long Stay (&gt; 20m)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Ring 2: Active Cart (10 - 20m)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/60 text-sky-300 border border-sky-800/40">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Ring 3: Exploring (3 - 10m)
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Ring 4: Just Landed (&lt; 3m)
            </span>
          </div>

          {/* Concentric Radar Canvas */}
          <div className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center overflow-hidden select-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#131929] via-[#090c14] to-[#04060b]">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Continuous Sweeping Radar Beam (Crimson-Rose gradient) */}
            <div className="absolute w-[440px] h-[440px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none animate-radar-sweep">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(225, 29, 72, 0.22) 0deg, rgba(225, 29, 72, 0) 65deg, transparent 65deg)',
                }}
              />
            </div>

            {/* Ring 4 (Outer: Just Landed < 3m) */}
            <div className="absolute w-[440px] h-[440px] sm:w-[500px] sm:h-[500px] rounded-full border border-purple-500/20 flex items-start justify-center pt-1.5">
              <span className="text-[9px] uppercase tracking-wider text-purple-400/80 font-mono bg-[#090c14]/90 px-2 rounded-full">
                Outer Edge: Just Landed / New Arrivals (&lt; 3m)
              </span>
            </div>

            {/* Ring 3 (Mid-Outer: Exploring 3 - 10m) */}
            <div className="absolute w-[330px] h-[330px] sm:w-[380px] sm:h-[380px] rounded-full border border-sky-500/25 flex items-start justify-center pt-1.5">
              <span className="text-[9px] uppercase tracking-wider text-sky-400/80 font-mono bg-[#090c14]/90 px-2 rounded-full">
                Mid-Outer: Exploring Pickles &amp; Spices (3 - 10m)
              </span>
            </div>

            {/* Ring 2 (Mid-Inner: Active Cart 10 - 20m) */}
            <div className="absolute w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full border border-emerald-500/30 flex items-start justify-center pt-1.5">
              <span className="text-[9px] uppercase tracking-wider text-emerald-400/80 font-mono bg-[#090c14]/90 px-2 rounded-full">
                Mid-Inner: Active Shopper &amp; Cart (10 - 20m)
              </span>
            </div>

            {/* Ring 1 (Core: Long Stay > 20m) */}
            <div className="absolute w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full border border-rose-500/35 flex items-start justify-center pt-1">
              <span className="text-[8.5px] uppercase tracking-wider text-rose-400/80 font-mono bg-[#090c14]/90 px-1.5 rounded-full">
                Core: Checkout (&gt; 20m)
              </span>
            </div>

            {/* Center Radar Hub */}
            <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-700 to-red-600 flex flex-col items-center justify-center text-center shadow-lg shadow-rose-950 border-2 border-rose-300">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute" />
              <Radio className="w-5 h-5 text-white relative z-10" />
              <span className="text-[7.5px] font-black uppercase text-white tracking-widest mt-0.5">
                RADAR
              </span>
            </div>

            {/* Interactive Visitor Blips on the Radar Rings */}
            {filteredVisitors.map((visitor) => {
              const radius =
                visitor.ring === 1
                  ? 55
                  : visitor.ring === 2
                  ? 105
                  : visitor.ring === 3
                  ? 160
                  : 215;

              const angleRad = (visitor.angleDeg * Math.PI) / 180;
              const x = radius * Math.cos(angleRad);
              const y = radius * Math.sin(angleRad);

              const colorClass =
                visitor.ring === 1
                  ? 'bg-rose-500 shadow-rose-500/60'
                  : visitor.ring === 2
                  ? 'bg-emerald-400 shadow-emerald-400/60'
                  : visitor.ring === 3
                  ? 'bg-sky-400 shadow-sky-400/60'
                  : 'bg-purple-400 shadow-purple-400/60';

              return (
                <div
                  key={visitor.id}
                  onClick={() => handleOpenVisitorModal(visitor)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className="absolute z-20 cursor-pointer group transition-transform duration-300"
                  title={`Click to inspect ${visitor.name}`}
                >
                  {/* Blip Outer Pulse */}
                  <span
                    className={`absolute -inset-2.5 rounded-full opacity-60 animate-blip-pulse ${colorClass}`}
                  />
                  {/* Blip Core Dot */}
                  <div
                    className={`relative w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-md transition-transform group-hover:scale-135 ${colorClass}`}
                  >
                    {visitor.cartCount > 0 ? (
                      <span className="text-[8px] font-black text-slate-900 leading-none">
                        🛒
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    )}
                  </div>

                  {/* Hover Tag */}
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-[#121624] border border-white/10 rounded-lg px-2.5 py-1 text-[10px] whitespace-nowrap font-medium text-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-xl">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{visitor.name}</span>
                      <span className="text-rose-400 font-mono">({formatTime(visitor.timeOnPageSeconds)})</span>
                    </div>
                    <div className="text-[9px] text-slate-400 truncate max-w-[140px]">
                      {visitor.pageTitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Click Hint Strip */}
          <div className="p-3 bg-[#0d101a] border-t border-white/[0.08] text-xs text-slate-400 flex items-center justify-between">
            <span className="text-[11px] flex items-center gap-1.5">
              <span>💡</span>
              <span>Click on any customer name below to open their live telemetry &amp; cart footprint:</span>
            </span>

            <div className="flex items-center gap-2 overflow-x-auto">
              {visitors.slice(0, 4).map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleOpenVisitorModal(v)}
                  className="px-2.5 py-1 rounded-lg bg-[#191d2c] hover:bg-[#22283c] border border-white/10 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>{v.name}</span>
                  <span className="text-[10px] text-rose-400 font-mono">({formatTime(v.timeOnPageSeconds)})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TABLE VIEW */}
      {(viewMode === 'table' || activeSubTab !== 'radar') && (
        <div className="clay-card overflow-hidden">
          <div className="p-4 border-b border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-brandRed" />
              <h3 className="font-bold text-sm text-brandText">
                {activeSubTab === 'radar'
                  ? 'All Live Storefront Visitors (Click name to inspect)'
                  : activeSubTab === 'abandoned'
                  ? 'Unconverted Abandoned Carts'
                  : 'Customer Sessions'}
              </h3>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search visitor, product page, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 clay-inset text-brandText placeholder-slate-400 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#eaedf2]/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-white/60">
                <tr>
                  <th className="py-3 px-4">Visitor / Location</th>
                  <th className="py-3 px-4">Current Page / Product</th>
                  <th className="py-3 px-4">Time on Page</th>
                  <th className="py-3 px-4">Cart Status</th>
                  <th className="py-3 px-4">Device</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {filteredVisitors.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => handleOpenVisitorModal(v)}
                    className="hover:bg-white/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-brandText hover:text-brandRed flex items-center gap-1.5">
                        <span>{v.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">🔍</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-brandRed" />
                        <span>{v.city}, {v.state}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-brandText">
                        {v.pageTitle}
                      </div>
                      <span className="text-[11px] text-brandRed font-mono">
                        {v.currentPage}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      <div className="flex items-center gap-1 text-slate-800">
                        <Clock className="w-3 h-3 text-rose-500" />
                        <span>{formatTime(v.timeOnPageSeconds)}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-400">
                        Total: {formatTime(v.totalSessionSeconds)}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {v.cartCount > 0 ? (
                        <div>
                          <span className="font-price font-bold text-brandRed text-sm">
                            {formatINR(v.cartTotal)}
                          </span>
                          <div className="text-[10px] text-slate-500">
                            {v.cartCount} items in cart
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Browsing Catalog</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {v.device}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenVisitorModal(v);
                        }}
                        className="px-3 py-1.5 clay-btn-light text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Dialog</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. VISITOR DETAILS DIALOG MODAL (Requested Popup) */}
      {modalVisitor && (
        <div
          onClick={() => setModalVisitor(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-slideLeft flex flex-col max-h-[92vh] cursor-default"
          >
            {/* Dark Sleek Modal Header */}
            <div className="p-4 sm:p-5 bg-[#121622] text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-950">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">Cart Details</h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black uppercase tracking-wider">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Live session signal • Active {formatTime(modalVisitor.timeOnPageSeconds)} on current page
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalVisitor(null)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                title="Close Dialog (or press Esc)"
              >
                <X className="w-4 h-4" />
                <span className="text-[10px] font-mono text-slate-400">Esc</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-xs">
              {/* 1. Customer Details Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  CUSTOMER DETAILS
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-black text-sm text-slate-900">
                    {modalVisitor.name}
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                    {modalVisitor.device}
                  </span>
                </div>

                <div className="text-slate-600 space-y-1">
                  <div>
                    <strong>Phone:</strong> {modalVisitor.phone ? modalVisitor.phone : 'Not entered yet (Guest Session)'}
                  </div>
                  <div>
                    <strong>Location:</strong> {modalVisitor.city}, {modalVisitor.state}
                  </div>
                  <div>
                    <strong>First seen:</strong> {formatTime(modalVisitor.totalSessionSeconds)} ago via {modalVisitor.referrer}
                  </div>
                </div>
              </div>

              {/* 2. LIVE BROWSING TELEMETRY (What they are seeing & from how long) */}
              <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brandRed flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    CURRENTLY VIEWING &amp; TIME SPENT
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-brandRed font-mono font-bold text-[10px]">
                    Ring {modalVisitor.ring}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{modalVisitor.pageTitle}</span>
                  </div>
                  <a
                    href={modalVisitor.currentPage}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-brandRed hover:underline inline-flex items-center gap-1"
                  >
                    <span>{modalVisitor.currentPage}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-rose-200/60">
                  <div className="bg-white p-2.5 rounded-xl border border-rose-100">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Time on This Page</div>
                    <div className="text-base font-bold font-price text-brandRed mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>{formatTime(modalVisitor.timeOnPageSeconds)}</span>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-rose-100">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Session Duration</div>
                    <div className="text-base font-bold font-price text-slate-800 mt-0.5">
                      {formatTime(modalVisitor.totalSessionSeconds)}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. ITEMS IN CART */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    ITEMS IN CART ({modalVisitor.cartCount})
                  </span>
                  <span className="font-price font-bold text-slate-800 text-sm">
                    Total: {formatINR(modalVisitor.cartTotal)}
                  </span>
                </div>

                {modalVisitor.cartItems && modalVisitor.cartItems.length > 0 ? (
                  <div className="space-y-1.5 divide-y divide-slate-100 pt-1">
                    {modalVisitor.cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-1.5 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span>{item.emoji || '📦'}</span>
                          <span><strong>{item.qty}x</strong> {item.name}</span>
                        </div>
                        <span className="font-price font-bold text-slate-900">
                          {formatINR(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400 text-xs">
                    No items currently stored in this cart session.
                  </div>
                )}
              </div>

              {/* 4. Admin Internal Notes */}
              <form onSubmit={handleSaveNote} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    ADMIN INTERNAL NOTES
                  </label>
                  {noteSaved && (
                    <span className="text-[10px] text-brandGreen font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Note Saved!
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="e.g. called customer, interested in bulk pickle order..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-brandRed"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <a
                href={modalVisitor.currentPage}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl clay-btn-light text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-brandRed" />
                <span>Inspect Product Page</span>
              </a>

              <button
                type="button"
                onClick={() => setModalVisitor(null)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors text-center"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
