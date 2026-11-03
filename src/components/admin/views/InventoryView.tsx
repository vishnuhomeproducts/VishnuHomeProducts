'use client';

import React, { useState } from 'react';
import { Boxes, Search } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { formatINR } from '@/lib/utils';
import { Product } from '@/types';

export const InventoryView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const toggleStock = (productId: string) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, in_stock: !p.in_stock } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics: Clay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Catalog SKUs</div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandText mt-1">{products.length} Products</div>
          <div className="text-[11px] text-brandGreen font-medium mt-1">● Authentic Mangalore Recipes</div>
        </div>

        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available in Stock</div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandGreen mt-1">
            {products.filter((p) => p.in_stock).length} In Stock
          </div>
          <div className="text-[11px] text-brandText2 mt-1">Ready for packaging</div>
        </div>

        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Out of Stock Alerts</div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandRed mt-1">
            {products.filter((p) => !p.in_stock).length} Items
          </div>
          <div className="text-[11px] text-brandText2 mt-1">Requires kitchen preparation</div>
        </div>
      </div>

      {/* Filter and Search: Clay Card */}
      <div className="clay-card overflow-hidden">
        <div className="p-4 border-b border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-brandRed" />
            <h3 className="font-bold text-sm text-brandText">Inventory & Pricing Manager</h3>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3.5 py-2 clay-card-flat border-none text-brandText focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="pickles">Pickles & Thokkus</option>
              <option value="spices">Spices & Masalas</option>
              <option value="dry fish">Dry Fish</option>
              <option value="wellness">Wellness & Oils</option>
            </select>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="text-xs pl-8 pr-3 py-2 clay-inset text-brandText focus:outline-none w-48"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#e4e8ee]/80 text-slate-600 uppercase font-bold text-[10px] border-b border-white/60">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Available Jar Sizes & Prices</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-center">Stock Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{prod.emoji || '🥫'}</span>
                      <div>
                        <div className="font-bold text-brandText">{prod.name}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{prod.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full clay-card-flat font-semibold text-[10px] text-brandText">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {prod.sizes.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg clay-card-flat font-mono text-[11px] text-brandText"
                        >
                          {s.label}: <strong className="font-price font-bold">{formatINR(s.price)}</strong>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {prod.badge ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase clay-btn-red">
                        {prod.badge}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleStock(prod.id)}
                      className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all shadow-xs ${
                        prod.in_stock
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-brandRed'
                      }`}
                    >
                      {prod.in_stock ? '✓ In Stock' : '✕ Out of Stock'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/product/${prod.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 text-xs font-semibold text-brandText clay-btn-light inline-block"
                    >
                      View Live
                    </a>
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
