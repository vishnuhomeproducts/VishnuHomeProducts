'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShoppingBag, User, MapPin } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { formatINR } from '@/lib/utils';
import { OrderItem } from '@/types';

interface CreateManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

export const CreateManualOrderModal: React.FC<CreateManualOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Mangaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('575001');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | 'upi_direct'>('cod');
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid'>('unpaid');
  const [adminNotes, setAdminNotes] = useState('Phone / Direct manual order');

  // Selected items in manual order
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([
    {
      product_id: SAMPLE_PRODUCTS[0]?.id || '1',
      name: SAMPLE_PRODUCTS[0]?.name || 'Avakaya Mango Pickle',
      slug: SAMPLE_PRODUCTS[0]?.slug || 'avakaya-mango-pickle',
      size: '500g',
      qty: 1,
      unit_price: SAMPLE_PRODUCTS[0]?.sizes[1]?.price || 180,
      emoji: '🥭',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const prod = SAMPLE_PRODUCTS[0];
    setSelectedItems([
      ...selectedItems,
      {
        product_id: prod.id,
        name: prod.name,
        slug: prod.slug,
        size: prod.sizes[0]?.label || '300g',
        qty: 1,
        unit_price: prod.sizes[0]?.price || 120,
        emoji: prod.emoji,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, productId: string) => {
    const prod = SAMPLE_PRODUCTS.find((p) => p.id === productId);
    if (!prod) return;

    const newItems = [...selectedItems];
    newItems[index] = {
      ...newItems[index],
      product_id: prod.id,
      name: prod.name,
      slug: prod.slug,
      size: prod.sizes[0]?.label || '300g',
      unit_price: prod.sizes[0]?.price || 120,
      emoji: prod.emoji,
    };
    setSelectedItems(newItems);
  };

  const handleSizeChange = (index: number, sizeLabel: string) => {
    const item = selectedItems[index];
    const prod = SAMPLE_PRODUCTS.find((p) => p.id === item.product_id);
    const sizeObj = prod?.sizes.find((s) => s.label === sizeLabel);

    const newItems = [...selectedItems];
    newItems[index] = {
      ...newItems[index],
      size: sizeLabel,
      unit_price: sizeObj ? sizeObj.price : newItems[index].unit_price,
    };
    setSelectedItems(newItems);
  };

  const handleQtyChange = (index: number, qty: number) => {
    if (qty < 1) return;
    const newItems = [...selectedItems];
    newItems[index].qty = qty;
    setSelectedItems(newItems);
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.unit_price * item.qty, 0);
  const deliveryFee = subtotal > 499 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !line1.trim()) {
      setErrorMessage('Please fill customer name, phone number, and address.');
      return;
    }

    if (selectedItems.length === 0) {
      setErrorMessage('Please add at least one product.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        shipping_name: customerName,
        shipping_phone: customerPhone,
        shipping_email: customerEmail || `${customerPhone}@vishnucustomer.in`,
        shipping_address: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          line1,
          city,
          state,
          pincode,
        },
        items: selectedItems,
        subtotal,
        delivery_fee: deliveryFee,
        discount: 0,
        total,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        status: paymentStatus === 'paid' ? 'processing' : 'pending',
        admin_notes: adminNotes,
      };

      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error('Failed to create manual order');
      }

      onOrderCreated();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="clay-card max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl cursor-default"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/60 flex items-center justify-between sticky top-0 clay-bg z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl clay-btn-red flex items-center justify-center font-bold text-sm">
              +
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brandText">Create Manual Order</h3>
              <p className="text-xs text-brandText2">Record a phone, in-person, or local order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl clay-btn-light text-slate-500 hover:text-brandText"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-100 text-brandRed text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brandRed" />
              <span>Customer Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Santosh Prabhu"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9845012345"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="customer@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brandRed" />
              <span>Shipping Address</span>
            </h4>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                House / Street / Flat / Landmark *
              </label>
              <input
                type="text"
                required
                placeholder="House #12, Temple Road, Kodialbail"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Items Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-brandRed" />
                <span>Selected Products</span>
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-brandRed hover:text-red-700 inline-flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="space-y-2">
              {selectedItems.map((item, idx) => {
                const prod = SAMPLE_PRODUCTS.find((p) => p.id === item.product_id);
                return (
                  <div
                    key={idx}
                    className="p-3 clay-card-flat flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white/80 border-none rounded-xl text-brandText focus:outline-none"
                      >
                        {SAMPLE_PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.emoji || '📦'} {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={item.size}
                        onChange={(e) => handleSizeChange(idx, e.target.value)}
                        className="text-xs px-3 py-2 bg-white/80 border-none rounded-xl text-brandText focus:outline-none"
                      >
                        {prod?.sizes.map((s) => (
                          <option key={s.label} value={s.label}>
                            {s.label} ({formatINR(s.price)})
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center rounded-xl bg-white/80 px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, item.qty - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-brandText">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(idx, item.qty + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-16 text-right font-bold text-xs text-brandText">
                        {formatINR(item.unit_price * item.qty)}
                      </div>

                      {selectedItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-400 hover:text-brandRed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 clay-card-flat">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  const m = e.target.value as any;
                  setPaymentMethod(m);
                  if (m === 'cod') setPaymentStatus('unpaid');
                  else setPaymentStatus('paid');
                }}
                className="w-full text-xs px-3 py-2 bg-white/80 border-none rounded-xl text-brandText focus:outline-none"
              >
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="upi_direct">UPI Direct / QR Code</option>
                <option value="razorpay">Online Razorpay / Card</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-white/80 border-none rounded-xl text-brandText focus:outline-none"
              >
                <option value="unpaid">Unpaid (Collect on delivery)</option>
                <option value="paid">Paid & Verified</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Admin / Dispatch Notes
              </label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Extra bubble wrap, deliver before 5 PM"
                className="w-full text-xs px-3.5 py-2 clay-inset text-brandText focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 clay-card-flat flex items-center justify-between text-xs border-l-4 border-l-brandRed">
            <div>
              <div className="text-slate-600">Items Subtotal: <span className="font-price font-semibold">{formatINR(subtotal)}</span></div>
              <div className="text-slate-600">Delivery Fee: <span className="font-price font-semibold">{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span></div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Total Bill</div>
              <div className="text-xl font-price font-extrabold text-brandRed tracking-tight">{formatINR(total)}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 clay-btn-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold clay-btn-red"
            >
              {isSubmitting ? 'Creating Order...' : 'Create & Dispatch Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
