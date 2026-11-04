'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Download,
  Upload,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { formatINR } from '@/lib/utils';
import { Product, ProductSize } from '@/types';

export const InventoryView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add/Edit Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Pickles & Thokkus');
  const [formDescription, setFormDescription] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formStorage, setFormStorage] = useState('');
  const [formEmoji, setFormEmoji] = useState('🥣');
  const [formBadge, setFormBadge] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSizes, setFormSizes] = useState<ProductSize[]>([
    { label: '300g', price: 120, mrp: 145 },
    { label: '500g', price: 190, mrp: 230 },
  ]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Bulk Upload State
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [parsedBulkProducts, setParsedBulkProducts] = useState<Array<Partial<Product>>>([]);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  // Fetch live products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (e) {
      console.warn('Could not fetch admin products, using fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  // Open Add Product Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Pickles & Thokkus');
    setFormDescription('Authentic Mangalorean home recipe slow-cooked with pure cold-pressed oil and spices.');
    setFormIngredients('Fresh spices, Rock Salt, Cold-Pressed Oil, Curry Leaves.');
    setFormStorage('Store in a cool dry place away from moisture.');
    setFormEmoji('🥣');
    setFormBadge('');
    setFormInStock(true);
    setFormImageUrl('/images/products/placeholder.jpg');
    setFormSizes([
      { label: '300g', price: 120, mrp: 145 },
      { label: '500g', price: 190, mrp: 230 },
    ]);
    setFormError('');
    setIsAddEditOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormDescription(p.description || '');
    setFormIngredients(p.ingredients || '');
    setFormStorage(p.storage || '');
    setFormEmoji(p.emoji || '🥣');
    setFormBadge(p.badge || '');
    setFormInStock(p.in_stock);
    setFormImageUrl(p.images && p.images[0] ? p.images[0] : '/images/products/placeholder.jpg');
    setFormSizes(p.sizes && p.sizes.length > 0 ? p.sizes : [{ label: '500g', price: 190, mrp: 230 }]);
    setFormError('');
    setIsAddEditOpen(true);
  };

  // Close modals on Escape key
  useEffect(() => {
    if (!isAddEditOpen && !isBulkOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAddEditOpen) setIsAddEditOpen(false);
        if (isBulkOpen) setIsBulkOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddEditOpen, isBulkOpen]);

  // Handle Image Upload (via Cloudinary auto-compress or local bridge)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        setFormImageUrl(json.url);
      } else {
        alert(json.error || 'Failed to upload image');
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add/Edit Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (formSizes.length === 0 || formSizes.some(s => !s.label || s.price <= 0)) {
      setFormError('Please configure at least one valid size label and price.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      const payload: Partial<Product> = {
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim(),
        ingredients: formIngredients.trim(),
        storage: formStorage.trim(),
        emoji: formEmoji,
        badge: formBadge ? (formBadge.toUpperCase() as any) : undefined,
        in_stock: formInStock,
        images: [formImageUrl || '/images/products/placeholder.jpg'],
        sizes: formSizes,
      };

      if (editingProduct) {
        payload.id = editingProduct.id;
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to create');
      }

      await fetchProducts();
      setIsAddEditOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Error saving product');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Quick Stock Toggle
  const toggleStock = async (productId: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const newStock = !target.in_stock;

    // Optimistic UI update
    setProducts(products.map(p => (p.id === productId ? { ...p, in_stock: newStock } : p)));

    try {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, in_stock: newStock }),
      });
    } catch (e) {
      console.warn('Failed to toggle stock on server:', e);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) return;

    setProducts(products.filter(p => p.id !== productId));
    try {
      await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to delete on server:', e);
    }
  };

  // Parse CSV function
  const parseCSV = (text: string): Array<Partial<Product>> => {
    const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];

    const parsed: Array<Partial<Product>> = [];

    // Helper to parse CSV row handling quotes
    const parseRow = (rowStr: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < rowStr.length; i++) {
        const char = rowStr[i];
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result.map(s => s.replace(/^["']|["']$/g, '').trim());
    };

    // Header line
    for (let i = 1; i < lines.length; i++) {
      const cols = parseRow(lines[i]);
      if (!cols[0]) continue;

      const name = cols[0];
      const category = cols[1] || 'Pickles & Thokkus';
      const description = cols[2] || '';
      const ingredients = cols[3] || '';
      const storage = cols[4] || '';
      const rawSizes = cols[5] || '';
      const singlePrice = Number(cols[6]) || 0;
      const singleMrp = Number(cols[7]) || singlePrice;
      const badge = cols[8] || '';
      const inStock = cols[9] ? cols[9].toLowerCase() !== 'false' : true;
      const emoji = cols[10] || '🥣';

      // Parse sizes: e.g. "300g:120:145 | 500g:190:230"
      let sizes: ProductSize[] = [];
      if (rawSizes && rawSizes.includes(':')) {
        sizes = rawSizes.split('|').map(part => {
          const [label, price, mrp] = part.split(':').map(s => s.trim());
          return {
            label: label || 'Standard',
            price: Number(price) || 190,
            mrp: mrp ? Number(mrp) : (Number(price) || 190) + 30,
          };
        }).filter(s => s.price > 0);
      }

      if (sizes.length === 0) {
        sizes = [
          {
            label: '500g',
            price: singlePrice > 0 ? singlePrice : 190,
            mrp: singleMrp > 0 ? singleMrp : 230,
          },
        ];
      }

      parsed.push({
        name,
        category,
        description,
        ingredients,
        storage,
        sizes,
        badge: badge ? (badge.toUpperCase() as any) : undefined,
        in_stock: inStock,
        emoji,
      });
    }

    return parsed;
  };

  // Handle Bulk File Select
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length === 0) {
          setBulkMessage({ type: 'error', text: 'No valid product rows found in the CSV. Please use the template format.' });
          setParsedBulkProducts([]);
        } else {
          setParsedBulkProducts(rows);
          setBulkMessage({ type: 'success', text: `Parsed ${rows.length} product(s) successfully! Review the preview below and click Import.` });
        }
      } catch (err: any) {
        setBulkMessage({ type: 'error', text: 'CSV parsing error: ' + err.message });
      }
    };
    reader.readAsText(file);
  };

  // Submit Bulk Import
  const handleConfirmBulkImport = async () => {
    if (parsedBulkProducts.length === 0) return;

    setBulkImporting(true);
    setBulkMessage(null);

    try {
      const res = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: parsedBulkProducts }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bulk import failed');

      await fetchProducts();
      setBulkMessage({
        type: 'success',
        text: `🎉 Successfully imported ${data.importedCount} products into the catalog! Total active catalog: ${data.totalCatalogCount} SKUs.`,
      });
      setParsedBulkProducts([]);
      setBulkFile(null);
      setTimeout(() => {
        setIsBulkOpen(false);
      }, 1500);
    } catch (err: any) {
      setBulkMessage({ type: 'error', text: err.message || 'Import failed' });
    } finally {
      setBulkImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics: Clay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Catalog SKUs</div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandText mt-1">
            {products.length} Products
          </div>
          <div className="text-[11px] text-brandGreen font-medium mt-1">● Authentic Home Recipes & Pickles</div>
        </div>

        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available in Stock</div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandGreen mt-1">
            {products.filter((p) => p.in_stock).length} In Stock
          </div>
          <div className="text-[11px] text-brandText2 mt-1">Active on customer storefront</div>
        </div>

        <div className="clay-card p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Out of Stock Alerts</div>
          <div className="text-2xl font-bold font-price tracking-tight text-brandRed mt-1">
            {products.filter((p) => !p.in_stock).length} Items
          </div>
          <div className="text-[11px] text-brandText2 mt-1">Requires kitchen preparation</div>
        </div>
      </div>

      {/* Action Toolbar & Filters */}
      <div className="clay-card overflow-hidden">
        <div className="p-4 border-b border-white/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-brandRed" />
            <div>
              <h3 className="font-bold text-sm text-brandText">Store Catalog & Inventory Hub</h3>
              <p className="text-[11px] text-slate-500">Manage individual products, jar pricing, or bulk upload via Excel</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Download Excel Template */}
            <a
              href="/api/admin/products/template"
              download
              className="clay-btn-light px-3 py-1.5 text-xs font-semibold text-brandText inline-flex items-center gap-1.5"
              title="Download pre-filled CSV / Excel Template"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Excel Template</span>
            </a>

            {/* Bulk Upload Excel / CSV */}
            <button
              onClick={() => {
                setBulkMessage(null);
                setParsedBulkProducts([]);
                setBulkFile(null);
                setIsBulkOpen(true);
              }}
              className="clay-btn-light px-3 py-1.5 text-xs font-semibold text-brandText inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-brandAccent" />
              <span>Bulk Import CSV</span>
            </button>

            {/* Add New Product Button */}
            <button
              onClick={handleOpenAdd}
              className="clay-btn-red px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="p-3 bg-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/60">
          <div className="flex items-center gap-2.5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-1.5 clay-card-flat border-none text-brandText focus:outline-none"
            >
              <option value="all">All Categories ({products.length})</option>
              <option value="pickles">Pickles & Thokkus</option>
              <option value="spices">Spices & Masalas</option>
              <option value="dry fish">Dry Fish</option>
              <option value="sweets">Traditional Sweets</option>
              <option value="wellness">Wellness & Oils</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name or slug..."
              className="text-xs pl-8 pr-3 py-1.5 clay-inset text-brandText focus:outline-none w-64"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
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
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    No products found matching &ldquo;{searchTerm}&rdquo;. Click &ldquo;Add Product&rdquo; or &ldquo;Bulk Import CSV&rdquo; to add items.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{prod.emoji || '🥣'}</span>
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
                            {s.mrp && s.mrp > s.price && (
                              <span className="text-[10px] text-slate-400 line-through ml-1 font-price">
                                {formatINR(s.mrp)}
                              </span>
                            )}
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          title="Edit Product Details & Pricing"
                          className="p-1.5 rounded-lg clay-card-flat text-slate-700 hover:text-brandAccent"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          title="Remove from Catalog"
                          className="p-1.5 rounded-lg clay-card-flat text-slate-500 hover:text-brandRed"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View on Live Storefront"
                          className="p-1.5 rounded-lg clay-card-flat text-slate-700 hover:text-brandAccent inline-block"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT PRODUCT MODAL                        */}
      {/* ======================================================== */}
      {isAddEditOpen && (
        <div
          onClick={() => setIsAddEditOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="clay-card w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 cursor-default"
          >
            <div className="p-4 border-b border-white/60 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-brandRed" />
                <h3 className="font-bold text-sm text-brandText">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Homemade Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-brandRed font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-brandText">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Tomato Thokku"
                    className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brandText">Emoji Icon</label>
                  <input
                    type="text"
                    value={formEmoji}
                    onChange={(e) => setFormEmoji(e.target.value)}
                    placeholder="e.g. 🍅"
                    className="w-full px-3 py-2 clay-inset text-brandText text-center text-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brandText">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                  >
                    <option value="Pickles & Thokkus">Pickles & Thokkus</option>
                    <option value="Spices & Masalas">Spices & Masalas</option>
                    <option value="Dry Fish">Dry Fish</option>
                    <option value="Traditional Sweets">Traditional Sweets</option>
                    <option value="Wellness & Oils">Wellness & Oils</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brandText">Promotional Badge</label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                  >
                    <option value="">No Badge</option>
                    <option value="SALE">SALE</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="NEW">NEW</option>
                    <option value="POPULAR">POPULAR</option>
                  </select>
                </div>
              </div>

              {/* Description & Ingredients */}
              <div className="space-y-1">
                <label className="font-bold text-brandText">Short Story / Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Traditional Mangalorean recipe..."
                  className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brandText">Ingredients</label>
                  <input
                    type="text"
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    placeholder="Tomatoes, Gingelly Oil, Mustard..."
                    className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-brandText">Storage Instructions</label>
                  <input
                    type="text"
                    value={formStorage}
                    onChange={(e) => setFormStorage(e.target.value)}
                    placeholder="Store in cool dry place..."
                    className="w-full px-3 py-2 clay-inset text-brandText focus:outline-none"
                  />
                </div>
              </div>

              {/* Jar Sizes and Pricing */}
              <div className="space-y-2 pt-2 border-t border-white/60">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-brandText">Jar Sizes & Pricing (In-Store)</label>
                  <button
                    type="button"
                    onClick={() => setFormSizes([...formSizes, { label: '1kg', price: 360, mrp: 440 }])}
                    className="text-[11px] font-bold text-brandAccent hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Size Option
                  </button>
                </div>

                <div className="space-y-2">
                  {formSizes.map((size, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. 500g)"
                        value={size.label}
                        onChange={(e) => {
                          const updated = [...formSizes];
                          updated[idx].label = e.target.value;
                          setFormSizes(updated);
                        }}
                        className="w-24 px-2.5 py-1.5 clay-inset font-medium focus:outline-none"
                      />
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-price">₹</span>
                        <input
                          type="number"
                          placeholder="Selling Price"
                          value={size.price}
                          onChange={(e) => {
                            const updated = [...formSizes];
                            updated[idx].price = Number(e.target.value);
                            setFormSizes(updated);
                          }}
                          className="w-full pl-6 pr-2 py-1.5 clay-inset font-price font-bold focus:outline-none"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-price">MRP ₹</span>
                        <input
                          type="number"
                          placeholder="MRP"
                          value={size.mrp || ''}
                          onChange={(e) => {
                            const updated = [...formSizes];
                            updated[idx].mrp = Number(e.target.value);
                            setFormSizes(updated);
                          }}
                          className="w-full pl-10 pr-2 py-1.5 clay-inset font-price focus:outline-none"
                        />
                      </div>
                      {formSizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormSizes(formSizes.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-400 hover:text-brandRed"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Image & Cloudinary Auto-Compression */}
              <div className="space-y-1 pt-2 border-t border-white/60">
                <label className="font-bold text-brandText flex items-center justify-between">
                  <span>Product Image (Cloudinary Auto-WebP Compression)</span>
                  {isUploadingImage && (
                    <span className="text-[11px] text-brandAccent flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Compressing & Uploading...
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    placeholder="/images/products/tomato-thokku.jpg or CDN URL"
                    className="flex-1 px-3 py-2 clay-inset text-brandText focus:outline-none font-mono text-[11px]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageUploadRef}
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageUploadRef.current?.click()}
                    disabled={isUploadingImage}
                    className="clay-btn-light px-3 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Images uploaded are automatically compressed with WebP format (<code className="font-mono">f_auto, q_auto:good</code>) to ensure zero database bandwidth exhaustion.
                </p>
              </div>

              {/* Stock Status Toggle */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-brandText">Availability</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 accent-brandRed"
                  />
                  <span className="font-semibold text-brandText">In Stock (Available for ordering)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="clay-btn-light px-4 py-2 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="clay-btn-red px-5 py-2 font-bold inline-flex items-center gap-1.5"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: BULK EXCEL / CSV IMPORT MODAL                   */}
      {/* ======================================================== */}
      {isBulkOpen && (
        <div
          onClick={() => setIsBulkOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="clay-card w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 cursor-default"
          >
            <div className="p-4 border-b border-white/60 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm text-brandText">Bulk Product Catalog Import (Excel / CSV)</h3>
                  <p className="text-[11px] text-slate-500">Update multiple products at once without manual entry</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkOpen(false)}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Instruction banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>How to use the Excel / CSV Template:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  1. Click <strong>Download Template</strong> to get the standard CSV format.
                  <br />
                  2. Fill in your products, categories, descriptions, ingredients, and jar sizes.
                  <br />
                  3. Multiple jar sizes can be formatted as: <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">300g:120:145 | 500g:190:230 | 1kg:360:440</code>.
                  <br />
                  4. Upload your file below. Images will use safe default placeholders until you choose to upload them later.
                </p>
              </div>

              {/* Download Template button */}
              <div className="flex items-center justify-between p-3 clay-card-flat">
                <div>
                  <div className="font-bold text-brandText">Need the official format?</div>
                  <div className="text-[11px] text-slate-500">Download our pre-formatted CSV template ready for Excel or Google Sheets.</div>
                </div>
                <a
                  href="/api/admin/products/template"
                  download
                  className="clay-btn-light px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 text-brandText shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download Template</span>
                </a>
              </div>

              {/* File upload drop area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-brandAccent rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/30"
              >
                <input
                  type="file"
                  accept=".csv,text/csv"
                  ref={fileInputRef}
                  onChange={handleBulkFileChange}
                  className="hidden"
                />
                <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="font-bold text-brandText text-sm">
                  {bulkFile ? bulkFile.name : 'Click to select or drop CSV file here'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Supports standard CSV exported from Excel, LibreOffice, or Google Sheets
                </div>
              </div>

              {/* Status Message */}
              {bulkMessage && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    bulkMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border border-red-200 text-brandRed'
                  }`}
                >
                  {bulkMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-brandRed" />
                  )}
                  <span className="font-medium">{bulkMessage.text}</span>
                </div>
              )}

              {/* Parsed Preview Table */}
              {parsedBulkProducts.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/60">
                  <div className="font-bold text-brandText flex items-center justify-between">
                    <span>Parsed Product Preview ({parsedBulkProducts.length} items ready to import)</span>
                  </div>

                  <div className="overflow-x-auto max-h-56 rounded-xl border border-white/60">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#e4e8ee] text-slate-600 uppercase font-bold text-[9px] sticky top-0">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Configured Sizes & Prices</th>
                          <th className="p-2">Badge</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/60 bg-white/50">
                        {parsedBulkProducts.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-bold text-brandText">
                              {item.emoji} {item.name}
                            </td>
                            <td className="p-2 text-slate-600">{item.category}</td>
                            <td className="p-2 font-mono">
                              {item.sizes?.map(s => `${s.label}: ₹${s.price}`).join(', ') || 'Standard'}
                            </td>
                            <td className="p-2">
                              {item.badge ? (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                                  {item.badge}
                                </span>
                              ) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-4 border-t border-white/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBulkOpen(false)}
                  className="clay-btn-light px-4 py-2 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBulkImport}
                  disabled={parsedBulkProducts.length === 0 || bulkImporting}
                  className="clay-btn-red px-5 py-2 font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {bulkImporting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Import {parsedBulkProducts.length} Products to Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
