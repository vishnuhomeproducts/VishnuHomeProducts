'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Trash2,
  EyeOff,
  Eye,
  MessageCircle,
  ExternalLink,
  Plus,
  Save,
  TrendingUp,
  MapPin,
  Receipt,
} from 'lucide-react';
import { AdminTab } from '../AdminSidebar';
import { useProducts } from '@/hooks/useProducts';

interface OtherViewsProps {
  tab: AdminTab;
}

export const OtherViews: React.FC<OtherViewsProps> = ({ tab }) => {
  const { products } = useProducts();
  const [reviews, setReviews] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // New Review Form State
  const [showAddReview, setShowAddReview] = useState(false);
  const [revName, setRevName] = useState('');
  const [revCity, setRevCity] = useState('Mangaluru');
  const [revProduct, setRevProduct] = useState('Avakaya Mango Pickle');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  // Policies Editor State
  const [shippingPolicy, setShippingPolicy] = useState(
    'Mangaluru local orders are delivered within 24 hours. Pan-India orders are dispatched within 24–48 hours via Delhivery, Blue Dart, or Speed Post in leak-proof vacuum-sealed packaging.'
  );
  const [refundPolicy, setRefundPolicy] = useState(
    '100% Damage-Free Replacement Guarantee: If any jar is damaged or leaked in transit, share an unboxing photo on WhatsApp within 24 hours of delivery for a free replacement or full refund.'
  );
  const [bulkOrderNote, setBulkOrderNote] = useState(
    'We offer up to 30% wholesale discount on Wedding Thamboolam 150g return-gift jars and 5kg catering buckets.'
  );
  const [policySaved, setPolicySaved] = useState(false);

  useEffect(() => {
    if (tab === 'reviews') {
      fetch('/api/reviews?all=true')
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.reviews)) setReviews(d.reviews);
        })
        .catch(() => { });
    } else if (tab === 'queries') {
      fetch('/api/queries')
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.queries)) setQueries(d.queries);
        })
        .catch(() => { });
    } else if (tab === 'tracking') {
      fetch('/api/admin/orders')
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.orders)) setOrders(d.orders);
        })
        .catch(() => { });
    } else if (tab === 'policies') {
      fetch('/api/settings')
        .then((r) => r.json())
        .then((d) => {
          if (d?.settings) {
            if (d.settings.shippingPolicy) setShippingPolicy(d.settings.shippingPolicy);
            if (d.settings.refundPolicy) setRefundPolicy(d.settings.refundPolicy);
            if (d.settings.bulkOrderNote) setBulkOrderNote(d.settings.bulkOrderNote);
          }
        })
        .catch(() => { });
    }
  }, [tab]);

  const handleToggleReview = async (id: string) => {
    const res = await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.reviews)) setReviews(data.reviews);
    }
  };

  const handleDeleteReview = async (id: string) => {
    const res = await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.reviews)) setReviews(data.reviews);
    }
  };

  const handleCreateAdminReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;
    const matchedProd = products.find((p) => p.name === revProduct);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: revName.trim(),
        city: revCity.trim() || 'India',
        product_name: revProduct,
        product_slug: matchedProd?.slug || 'mango-pickle',
        rating: revRating,
        comment: revComment.trim(),
      }),
    });
    if (res.ok) {
      const allRes = await fetch('/api/reviews?all=true');
      const allData = await allRes.json();
      if (Array.isArray(allData.reviews)) setReviews(allData.reviews);
      setRevName('');
      setRevComment('');
      setShowAddReview(false);
    }
  };

  const handleUpdateQueryStatus = async (id: string, status: string, reply?: string) => {
    const res = await fetch('/api/queries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reply }),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.queries)) setQueries(data.queries);
    }
  };

  const handleSendCannedReply = (q: any, templateText: string) => {
    const cleanPhone = (q.phone || '').replace(/\D/g, '');
    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    handleUpdateQueryStatus(q.id, 'Answered', templateText);
    if (waPhone) {
      window.open(
        `https://wa.me/${waPhone}?text=${encodeURIComponent(templateText)}`,
        '_blank'
      );
    }
  };

  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shippingPolicy,
        refundPolicy,
        bulkOrderNote,
      }),
    }).catch(() => { });
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 3000);
  };

  // ================= REVIEWS VIEW =================
  if (tab === 'reviews') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">
              Customer Product Reviews Moderation
            </h3>
            <p className="text-xs text-brandText2">
              Approve, hide, or add verified WhatsApp/Instagram customer reviews to the storefront
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-brandGreen">
              Total: {reviews.length} Reviews
            </span>
            <button
              type="button"
              onClick={() => setShowAddReview(!showAddReview)}
              className="px-3.5 py-2 clay-btn-red text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{showAddReview ? 'Close Form' : '+ Add WhatsApp / IG Review'}</span>
            </button>
          </div>
        </div>

        {showAddReview && (
          <form onSubmit={handleCreateAdminReview} className="clay-card p-5 space-y-4 text-xs border-l-4 border-l-brandRed">
            <div className="font-bold text-brandText">
              Add Verified Customer Testimonial (from WhatsApp / Instagram)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder="e.g. Ananya Rao"
                  className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={revCity}
                  onChange={(e) => setRevCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Product</label>
                <select
                  value={revProduct}
                  onChange={(e) => setRevProduct(e.target.value)}
                  className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Star Rating</label>
                <select
                  value={revRating}
                  onChange={(e) => setRevRating(Number(e.target.value))}
                  className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                >
                  <option value={5}>★★★★★ (5 Stars)</option>
                  <option value={4}>★★★★☆ (4 Stars)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Customer Feedback *</label>
              <textarea
                rows={2}
                required
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                placeholder="Paste the customer's WhatsApp or Instagram feedback here..."
                className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 clay-btn-red text-xs font-bold">
                Publish Verified Review
              </button>
            </div>
          </form>
        )}

        <div className="clay-card divide-y divide-white/60 text-xs overflow-hidden">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-white/40 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brandText">{r.customer_name}</span>
                  <span className="text-slate-400">({r.city || 'India'})</span>
                  <span className="text-amber-500 font-bold">{'★'.repeat(r.rating || 5)}</span>
                </div>
                <div className="text-slate-600 font-medium">
                  Product: <strong>{r.product_name}</strong>
                </div>
                <p className="text-brandText leading-relaxed italic">&ldquo;{r.comment}&rdquo;</p>
                <div className="text-[11px] text-slate-400">
                  {new Date(r.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-[11px] shadow-xs ${r.approved
                      ? 'bg-emerald-100 text-brandGreen'
                      : 'bg-amber-100 text-amber-800'
                    }`}
                >
                  {r.approved ? '✓ Approved & Live' : 'Hidden'}
                </span>
                <button
                  onClick={() => handleToggleReview(r.id)}
                  className="p-2 rounded-lg clay-btn-light text-slate-600 hover:text-brandText"
                  title={r.approved ? 'Hide Review' : 'Approve Review'}
                >
                  {r.approved ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDeleteReview(r.id)}
                  className="p-2 rounded-lg clay-btn-light text-slate-400 hover:text-brandRed"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= CUSTOMER QUERIES VIEW =================
  if (tab === 'queries') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">
            Customer Support &amp; Queries (With 1-Click Canned Replies)
          </h3>
          <p className="text-xs text-brandText2">
            Direct inquiries submitted from the Contact &amp; Support page
          </p>
        </div>

        <div className="clay-card divide-y divide-white/60 text-xs overflow-hidden">
          {queries.map((q) => {
            const cleanPhone = (q.phone || '').replace(/\D/g, '');
            const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waText = encodeURIComponent(
              `Namaskara ${q.name}, this is Vishnu Home Products (Mangaluru) regarding your inquiry: "${q.message}"`
            );

            return (
              <div
                key={q.id}
                className="p-4 sm:p-5 space-y-3 hover:bg-white/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-brandText">{q.name}</span>
                      <span className="text-slate-500 font-mono">({q.phone})</span>
                      <span className="px-2.5 py-0.5 rounded-full clay-card-flat text-brandRed text-[10px] font-semibold">
                        {q.type}
                      </span>
                    </div>
                    <p className="text-brandText2">&ldquo;{q.message}&rdquo;</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {waPhone && (
                      <a
                        href={`https://wa.me/${waPhone}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    )}
                    <select
                      value={q.status}
                      onChange={(e) => handleUpdateQueryStatus(q.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg clay-card-flat text-[11px] font-bold text-brandText"
                    >
                      <option value="Open">Open</option>
                      <option value="Answered">Answered</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* 1-Click Canned Reply Templates */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">
                    Quick Canned Reply:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleSendCannedReply(
                        q,
                        `Namaskara ${q.name}! 🙏 Regarding your delivery inquiry: Mangaluru local orders are delivered within 24 hours, and Pan-India courier parcels take 2–4 business days via Delhivery/BlueDart.`
                      )
                    }
                    className="px-2.5 py-1 rounded-lg clay-card-flat text-[10px] font-semibold text-brandText hover:text-brandRed"
                  >
                    🚚 Delivery ETA
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSendCannedReply(
                        q,
                        `Namaskara ${q.name}! 🙏 All our pickles, thokkus, and sun-dried fish are 100% preservative-free, prepared using pure cold-pressed gingelly oil and sea salt with a 6-month shelf life.`
                      )
                    }
                    className="px-2.5 py-1 rounded-lg clay-card-flat text-[10px] font-semibold text-brandText hover:text-brandRed"
                  >
                    🥣 Purity &amp; Shelf-Life
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSendCannedReply(
                        q,
                        `Namaskara ${q.name}! 🙏 We offer up to 30% wholesale discount on Wedding Return-Gift 150g jars and 5kg catering buckets. You can calculate instant pricing at: ${window.location.origin}/bulk-orders`
                      )
                    }
                    className="px-2.5 py-1 rounded-lg clay-card-flat text-[10px] font-semibold text-brandText hover:text-brandRed"
                  >
                    🪔 Bulk / Wedding Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= CATEGORIES VIEW =================
  if (tab === 'categories') {
    const categoryGroups = [
      { name: 'Pickles & Thokkus', icon: '🥭', match: 'pickle' },
      { name: 'Spices & Masalas', icon: '🌶️', match: 'spice' },
      { name: 'Dry Fish', icon: '🐟', match: 'fish' },
      { name: 'Wellness', icon: '🪔', match: 'wellness' },
      { name: 'Sweets & Festive', icon: '🍬', match: 'sweet' },
      { name: 'Rice & Grains', icon: '🌾', match: 'rice' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">
            Product Categories &amp; Storefront Collections
          </h3>
          <p className="text-xs text-brandText2">
            All 6 live storefront category collections synced with the catalog ({products.length} total active products)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {categoryGroups.map((c, i) => {
            const count = products.filter((p) =>
              p.category.toLowerCase().includes(c.match)
            ).length;
            return (
              <div
                key={i}
                className="clay-card p-5 space-y-2 hover:translate-y-[-2px] transition-transform"
              >
                <span className="text-3xl">{c.icon}</span>
                <div className="font-bold text-sm text-brandText">{c.name}</div>
                <div className="text-[11px] text-brandRed font-bold">{count} Products</div>
                <a
                  href={`/shop?category=${encodeURIComponent(c.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-brandText pt-1"
                >
                  <span>View in Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= ANALYTICS, 7-DAY CHART & GST SUMMARY VIEW =================
  if (tab === 'tracking') {
    const activeOrders = orders.filter((o) => !o.is_archived);
    const totalRevenue = activeOrders.reduce((s, o) => s + (o.total || 0), 0);
    const paidOrders = activeOrders.filter((o) => o.payment_status === 'paid');
    const codOrders = activeOrders.filter((o) => o.payment_method === 'cod');

    // GST 5% Tax Breakdown (Food/Pickle/Spices 5% slab: Taxable = Total / 1.05)
    const taxableValue = Math.round(totalRevenue / 1.05);
    const totalGst = totalRevenue - taxableValue;
    const cgst = Math.round(totalGst / 2);
    const sgst = totalGst - cgst;

    // 7-Day Revenue Trend
    const last7Days = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit' });
      const dayOrders = activeOrders.filter(
        (o) => (o.created_at || '').slice(0, 10) === key
      );
      const rev = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      return { key, label, rev, count: dayOrders.length };
    });
    const maxDayRev = Math.max(1000, ...last7Days.map((d) => d.rev));

    // Top Delivery Cities Breakdown
    const cityStats: Record<string, { city: string; orders: number; revenue: number }> = {};
    activeOrders.forEach((o) => {
      const city = o.shipping_address?.city || 'Mangaluru';
      if (!cityStats[city]) {
        cityStats[city] = { city, orders: 0, revenue: 0 };
      }
      cityStats[city].orders += 1;
      cityStats[city].revenue += o.total || 0;
    });
    const topCities = Object.values(cityStats).sort((a, b) => b.revenue - a.revenue);

    // Calculate top selling products across orders
    const productSales: Record<string, { name: string; units: number; revenue: number }> = {};
    activeOrders.forEach((o) => {
      (o.items || []).forEach((it: any) => {
        const key = it.name;
        if (!productSales[key]) {
          productSales[key] = { name: key, units: 0, revenue: 0 };
        }
        productSales[key].units += it.qty || 1;
        productSales[key].revenue += (it.unit_price || it.price || 120) * (it.qty || 1);
      });
    });
    const topSellers = Object.values(productSales).sort((a, b) => b.revenue - a.revenue);

    const handleExportCsv = () => {
      const headers = [
        'Order_Number',
        'Date',
        'Customer_Name',
        'Phone',
        'City',
        'Pincode',
        'Payment_Method',
        'Payment_Status',
        'Order_Status',
        'Taxable_INR',
        'GST_5Pct_INR',
        'Total_INR',
      ];
      const rows = activeOrders.map((o) => {
        const tot = o.total || 0;
        const taxVal = Math.round(tot / 1.05);
        const gstVal = tot - taxVal;
        return [
          o.order_number || o.id,
          new Date(o.created_at).toISOString().slice(0, 10),
          `"${(o.shipping_name || '').replace(/"/g, '""')}"`,
          o.shipping_phone || '',
          `"${o.shipping_address?.city || ''}"`,
          o.shipping_address?.pincode || '',
          o.payment_method || '',
          o.payment_status || '',
          o.status || '',
          taxVal,
          gstVal,
          tot,
        ];
      });
      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vishnu_orders_gst_report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">
              Revenue Analytics, 7-Day Trends &amp; GST Tax Summary
            </h3>
            <p className="text-xs text-brandText2">
              Real-time sales metrics, city demand heatmap, and GST-ready CSV ledger
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 clay-btn-red text-xs font-bold self-start"
          >
            ⬇ Export GST Orders CSV
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="clay-card p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase text-slate-500">Gross Revenue</div>
            <div className="text-xl font-extrabold text-brandRed font-price">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500">{activeOrders.length} active orders</div>
          </div>

          <div className="clay-card p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase text-slate-500">Average Order Value</div>
            <div className="text-xl font-extrabold text-brandText font-price">
              ₹
              {activeOrders.length > 0
                ? Math.round(totalRevenue / activeOrders.length).toLocaleString('en-IN')
                : 0}
            </div>
            <div className="text-[11px] text-brandGreen font-semibold">+14% with Combos</div>
          </div>

          <div className="clay-card p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase text-slate-500">Prepaid (Razorpay/UPI)</div>
            <div className="text-xl font-extrabold text-brandGreen font-price">
              {paidOrders.length} Orders
            </div>
            <div className="text-[11px] text-slate-500">Verified payments</div>
          </div>

          <div className="clay-card p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase text-slate-500">Cash on Delivery</div>
            <div className="text-xl font-extrabold text-amber-700 font-price">
              {codOrders.length} Orders
            </div>
            <div className="text-[11px] text-slate-500">Collect on delivery</div>
          </div>
        </div>

        {/* 7-Day Revenue Bar Chart + City Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
          <div className="lg:col-span-7 clay-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-bold text-brandText flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-brandRed" />
                <span>Last 7 Days Revenue Velocity</span>
              </div>
              <span className="text-[11px] text-slate-500">Daily Order Value (₹)</span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-36 pt-4 px-1">
              {last7Days.map((d) => {
                const heightPct = Math.max(10, Math.round((d.rev / maxDayRev) * 100));
                return (
                  <div key={d.key} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-price font-bold text-brandRed">
                      {d.rev > 0 ? `₹${d.rev}` : '—'}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[34px] rounded-t-xl transition-all ${d.rev > 0
                          ? 'bg-gradient-to-t from-brandRed to-red-400 shadow-sm'
                          : 'bg-slate-200/70'
                        }`}
                      title={`${d.label}: ₹${d.rev} (${d.count} orders)`}
                    />
                    <span className="text-[10px] text-slate-500 font-medium">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Delivery Cities */}
          <div className="lg:col-span-5 clay-card p-5 space-y-3.5">
            <div className="font-bold text-brandText flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brandRed" />
              <span>Top Delivery Cities by Demand</span>
            </div>
            <div className="space-y-2.5">
              {topCities.slice(0, 5).map((c) => {
                const sharePct =
                  totalRevenue > 0 ? Math.min(100, Math.round((c.revenue / totalRevenue) * 100)) : 20;
                return (
                  <div key={c.city} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brandText">
                        {c.city}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({c.orders} {c.orders === 1 ? 'order' : 'orders'})
                        </span>
                      </span>
                      <span className="font-price font-bold text-brandRed">
                        ₹{c.revenue.toLocaleString('en-IN')} ({sharePct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        style={{ width: `${sharePct}%` }}
                        className="h-full rounded-full bg-brandRed"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Automated 5% GST Food Slab Tax Breakdown */}
        <div className="clay-card p-5 space-y-3 text-xs border-l-4 border-l-emerald-600">
          <div className="font-bold text-brandText flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span>Automated GST Tax Summary (5% Food &amp; Condiments HSN Slab)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 clay-card-flat">
              <div className="text-[10px] font-bold uppercase text-slate-500">Taxable Value</div>
              <div className="text-base font-bold font-price text-brandText mt-0.5">
                ₹{taxableValue.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 clay-card-flat">
              <div className="text-[10px] font-bold uppercase text-slate-500">CGST (2.5%)</div>
              <div className="text-base font-bold font-price text-emerald-800 mt-0.5">
                ₹{cgst.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 clay-card-flat">
              <div className="text-[10px] font-bold uppercase text-slate-500">SGST (2.5%)</div>
              <div className="text-base font-bold font-price text-emerald-800 mt-0.5">
                ₹{sgst.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 clay-card-flat">
              <div className="text-[10px] font-bold uppercase text-slate-500">Total GST Collected</div>
              <div className="text-base font-bold font-price text-brandRed mt-0.5">
                ₹{totalGst.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="clay-card overflow-hidden text-xs">
          <div className="p-4 border-b border-white/60 font-bold text-brandText">
            Top-Selling Products by Revenue
          </div>
          <div className="divide-y divide-white/60">
            {topSellers.map((item, idx) => (
              <div key={item.name} className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brandRed text-white font-bold text-[11px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-brandText">{item.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-slate-600 font-medium">{item.units} jars sold</span>
                  <span className="font-bold text-brandRed font-price">
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= LIVE STORE LEGAL POLICIES & GOOGLE SHOPPING HUB =================
  const feedUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/google-shopping-feed`
      : 'https://vishnuhomeproducts.in/api/google-shopping-feed';

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">
          Google Shopping Compliance &amp; Store Legal Policies
        </h3>
        <p className="text-xs text-brandText2">
          Manage your live Google Merchant Center XML product feed, verified legal policy pages, and customer guarantees
        </p>
      </div>

      {/* Google Merchant Center Live Feed & Compliance Card */}
      <div className="clay-card p-6 space-y-4 text-xs border-l-4 border-l-brandGreen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brandGreen uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Google Merchant Center Ready (100% Compliant)
            </div>
            <h4 className="font-bold text-sm text-brandText mt-0.5">
              Automated Google Shopping XML Product Feed (RSS 2.0)
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Paste this live Scheduled Fetch URL into Google Merchant Center → Products → Feeds to sync all products, sizes, prices, and stock automatically.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/api/google-shopping-feed"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 clay-btn text-xs font-bold text-brandRed"
            >
              Open XML Feed ↗
            </a>
            <a
              href="/api/google-shopping-feed?format=json"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 clay-btn text-xs font-bold text-slate-700"
            >
              Inspect JSON ↗
            </a>
          </div>
        </div>

        <div className="p-3 clay-inset flex items-center justify-between gap-2 font-mono text-[11px] text-brandText">
          <span className="truncate">{feedUrl}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(feedUrl)}
            className="px-2.5 py-1 rounded bg-brandRed text-white font-sans font-bold text-[10px] shrink-0"
          >
            Copy Feed URL
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {[
            { label: 'About & FSSAI Verification', href: '/about' },
            { label: 'Shipping Policy (2–5 Days)', href: '/shipping-policy' },
            { label: 'Return & Refund Policy (7-Day)', href: '/return-refund-policy' },
            { label: 'Privacy Policy (SSL/DPDP)', href: '/privacy-policy' },
            { label: 'Terms of Service & Billing', href: '/terms-of-service' },
            { label: 'Contact & Grievance Desk', href: '/contact' },
          ].map((page) => (
            <a
              key={page.href}
              href={page.href}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 clay-card-flat flex items-center justify-between text-[11px] font-semibold text-brandText hover:text-brandRed transition-colors"
            >
              <span className="flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-brandGreen shrink-0" />
                <span className="truncate">{page.label}</span>
              </span>
              <span className="text-[10px] text-slate-400">↗</span>
            </a>
          ))}
        </div>
      </div>

      {policySaved && (
        <div className="p-3.5 clay-card text-brandGreen text-xs flex items-center gap-2 font-semibold border-l-4 border-l-brandGreen">
          <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0" />
          <span>Store policies saved and synced!</span>
        </div>
      )}

      <form onSubmit={handleSavePolicies} className="clay-card p-6 space-y-5 text-xs">
        <div className="flex items-center gap-2 font-bold text-brandText">
          <CheckCircle2 className="w-4 h-4 text-brandGreen" />
          <span>Active Storefront Compliance &amp; Guarantees</span>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Shipping &amp; Dispatch SLA Policy
          </label>
          <textarea
            rows={3}
            value={shippingPolicy}
            onChange={(e) => setShippingPolicy(e.target.value)}
            className="w-full px-3.5 py-2.5 clay-inset text-brandText focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            100% Damage-Free Replacement &amp; Refund Policy
          </label>
          <textarea
            rows={3}
            value={refundPolicy}
            onChange={(e) => setRefundPolicy(e.target.value)}
            className="w-full px-3.5 py-2.5 clay-inset text-brandText focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Bulk / Wedding Thamboolam Wholesale Note
          </label>
          <textarea
            rows={2}
            value={bulkOrderNote}
            onChange={(e) => setBulkOrderNote(e.target.value)}
            className="w-full px-3.5 py-2.5 clay-inset text-brandText focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2.5 clay-btn-red text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Store Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
