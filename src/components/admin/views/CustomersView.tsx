'use client';

import React, { useState } from 'react';
import { Users, Search, Download, Mail } from 'lucide-react';
import { CustomerProfile } from '@/types/admin';
import { formatINR } from '@/lib/utils';

interface CustomersViewProps {
  customers: CustomerProfile[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSpentAll = customers.reduce((sum, c) => sum + c.total_spent, 0);
  const avgOrderValue = customers.length > 0 ? Math.round(totalSpentAll / customers.reduce((sum, c) => sum + c.total_orders, 0)) : 0;

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
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
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
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered Customers</div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandText mt-1">{customers.length} Profiles</div>
          <div className="text-[11px] text-brandGreen font-medium mt-1">● Active food lovers</div>
        </div>

        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Order Value (AOV)</div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandRed mt-1">{formatINR(avgOrderValue)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Per transaction</div>
        </div>

        <div className="clay-card p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Data Export</div>
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
            <h3 className="font-bold text-sm text-brandText">Customer Directory</h3>
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
                <th className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-brandText">{c.name}</td>
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
    </div>
  );
};
