'use client';

import React, { useState } from 'react';
import { Users, Search, Download, Mail, MessageCircle, Eye, X, ShoppingBag, MapPin, Award } from 'lucide-react';
import { CustomerProfile, AdminOrder } from '@/types/admin';
import { formatINR } from '@/lib/utils';

interface CustomersViewProps {
  customers: CustomerProfile[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [customerOrders, setCustomerOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpentAll = customers.reduce((sum, c) => sum + c.total_spent, 0);
  const avgOrderValue =
    customers.length > 0
      ? Math.round(totalSpentAll / Math.max(1, customers.reduce((sum, c) => sum + c.total_orders, 0)))
      : 0;

  const handleOpenCustomer360 = async (customer: CustomerProfile) => {
    setSelectedCustomer(customer);
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        const allOrders: AdminOrder[] = data.orders || [];
        const cleanPhone = customer.phone.replace(/\D/g, '').slice(-10);
        const matched = allOrders.filter((o) => {
          const orderPhone = (o.shipping_phone || '').replace(/\D/g, '').slice(-10);
          return (
            (cleanPhone && orderPhone === cleanPhone) ||
            o.shipping_name.toLowerCase() === customer.name.toLowerCase()
          );
        });
        setCustomerOrders(matched);
      } else {
        setCustomerOrders([]);
      }
    } catch {
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSendVipWhatsApp = (c: CustomerProfile) => {
    const cleanPhone = (c.phone || '').replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `Namaskara ${c.name}! 🙏\nThank you for being a valued patron of *Vishnu Home Products* (${c.total_orders} orders placed!).\nWe have freshly prepared a new batch of our coastal Pickles, Thokkus & Sun-Dried Delicacies today.\n🎁 Use VIP code *VISHNU10* for *10% OFF* your next order at: ${window.location.origin}/shop`;
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'City', 'State', 'Orders', 'Total Spent', 'Tags'];
    const rows = customers.map((c) => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.city}"`,
      `"${c.state}"`,
      c.total_orders,
      c.total_spent,
      `"${c.tags?.join(', ') || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vishnu_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics: Clay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Registered Customers
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandText mt-1">
            {customers.length} Profiles
          </div>
          <div className="text-[11px] text-brandGreen font-medium mt-1">● Active food lovers</div>
        </div>

        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Order Value (AOV)
          </div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandRed mt-1">
            {formatINR(avgOrderValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Per transaction</div>
        </div>

        <div className="clay-card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Customer Data Export
            </div>
            <div className="text-xs text-brandText2 mt-1">Download CSV for outreach</div>
          </div>
          <button
            onClick={exportCSV}
            className="px-4 py-2 clay-btn-red text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Customer Table: Clay Card */}
      <div className="clay-card overflow-hidden">
        <div className="p-4 border-b border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brandRed" />
            <h3 className="font-bold text-sm text-brandText">Customer Directory &amp; 360° CRM</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, city..."
              className="w-full text-xs pl-8 pr-3 py-2 clay-inset text-brandText placeholder-slate-400 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#e4e8ee]/80 text-slate-600 uppercase font-bold text-[10px] border-b border-white/60">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Customer Tags</th>
                <th className="py-3 px-4 text-right">360° &amp; Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleOpenCustomer360(c)}
                      className="font-bold text-brandText hover:text-brandRed transition-colors text-left"
                    >
                      {c.name}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-brandText font-medium">{c.phone}</div>
                    <div className="text-slate-500 text-[11px]">{c.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-brandText">{c.city}</div>
                    <div className="text-slate-400 text-[11px]">{c.state}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-brandText">
                    {c.total_orders} {c.total_orders === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="py-3 px-4 font-price font-bold text-brandRed text-sm tracking-tight">
                    {formatINR(c.total_spent)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {c.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-brandRed border border-red-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenCustomer360(c)}
                        className="px-2.5 py-1.5 rounded-lg clay-btn-light text-brandText font-semibold inline-flex items-center gap-1 text-[11px]"
                        title="View Customer 360° Order History"
                      >
                        <Eye className="w-3.5 h-3.5 text-brandRed" />
                        <span>History</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendVipWhatsApp(c)}
                        className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                        title="Send WhatsApp VIP Re-Order Offer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                      {c.email && (
                        <a
                          href={`mailto:${c.email}`}
                          className="p-1.5 rounded-lg clay-btn-light text-slate-600 hover:text-brandText"
                          title="Email Customer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360° Profile & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="clay-card max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-white/60 flex items-center justify-between sticky top-0 clay-bg z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl clay-btn-red flex items-center justify-center text-white font-bold text-sm">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-brandText">
                    {selectedCustomer.name} — 360° Customer Profile
                  </h3>
                  <p className="text-xs text-brandText2">
                    {selectedCustomer.phone} • {selectedCustomer.city}, {selectedCustomer.state}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-xl clay-btn-light text-slate-500 hover:text-brandText"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              {/* Lifetime Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 clay-card-flat">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Lifetime Orders</div>
                  <div className="text-xl font-bold font-price text-brandText mt-0.5">
                    {selectedCustomer.total_orders}
                  </div>
                </div>
                <div className="p-3.5 clay-card-flat">
                  <div className="text-[10px] font-bold uppercase text-slate-500">Lifetime Spent</div>
                  <div className="text-xl font-bold font-price text-brandRed mt-0.5">
                    {formatINR(selectedCustomer.total_spent)}
                  </div>
                </div>
                <div className="p-3.5 clay-card-flat">
                  <div className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>Loyalty Tier</span>
                  </div>
                  <div className="text-sm font-bold text-brandText mt-1">
                    {selectedCustomer.total_spent >= 1500 ? 'VIP Patron' : 'Regular Buyer'}
                  </div>
                </div>
              </div>

              {/* Order History List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-brandRed" />
                    <span>Past Orders ({customerOrders.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSendVipWhatsApp(selectedCustomer)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send WhatsApp VIP Offer</span>
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="py-8 text-center text-xs text-slate-500 clay-inset">
                    Loading customer order history...
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 clay-inset">
                    No matching live orders found in current session store.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {customerOrders.map((ord) => (
                      <div key={ord.id} className="p-3.5 clay-card-flat space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-brandRed">{ord.order_number}</span>
                            <span className="text-[11px] text-slate-500">
                              {new Date(ord.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white text-brandText">
                              {ord.status}
                            </span>
                            <span className="font-price font-bold text-brandRed text-sm">
                              {formatINR(ord.total)}
                            </span>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-600 flex flex-wrap gap-1.5">
                          {ord.items.map((it, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-white/70">
                              {it.emoji} {it.name} ({it.size}) × {it.qty}
                            </span>
                          ))}
                        </div>
                        {ord.shipping_address && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>
                              {ord.shipping_address.line1}, {ord.shipping_address.city} -{' '}
                              {ord.shipping_address.pincode}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
