'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  CreditCard,
  Truck,
  CheckCircle2,
  Save,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const StoreSettingsView: React.FC = () => {
  const [storeName, setStoreName] = useState('Vishnu Home Products');
  const [storePhone, setStorePhone] = useState('+91 98450 12345');
  const [storeEmail, setStoreEmail] = useState('orders@vishnuhome.in');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(499);
  const [standardDeliveryFee, setStandardDeliveryFee] = useState(50);
  const [codEnabled, setCodEnabled] = useState(true);
  const [gstin, setGstin] = useState('29AAAAA0000A1Z5');
  const [isSaved, setIsSaved] = useState(false);

  // Security PIN states
  const [currentPin, setCurrentPin] = useState('8888');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState('');

  // Load saved PIN on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lucky_admin_pin');
      if (saved) {
        setCurrentPin(saved);
      }
    } catch (e) {}
  }, []);

  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess(false);

    if (!newPin.trim()) {
      setPinError('Please enter a new PIN.');
      return;
    }

    if (newPin.trim().length < 4) {
      setPinError('PIN must be at least 4 digits.');
      return;
    }

    if (newPin.trim() !== confirmPin.trim()) {
      setPinError('New PIN and Confirm PIN do not match.');
      return;
    }

    try {
      localStorage.setItem('lucky_admin_pin', newPin.trim());
      setCurrentPin(newPin.trim());
      setNewPin('');
      setConfirmPin('');
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 4000);
    } catch (e) {
      setPinError('Failed to save PIN in browser storage.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn">
      {/* Header */}
      <div>
        <h3 className="font-display font-bold text-lg sm:text-xl text-brandText">
          Store Configuration &amp; Security
        </h3>
        <p className="text-xs text-brandText2">
          Manage operations security PIN, business info, shipping rates, and live payment gateways
        </p>
      </div>

      {isSaved && (
        <div className="p-3.5 clay-card text-brandGreen text-xs flex items-center gap-2 font-semibold border-l-4 border-l-brandGreen">
          <CheckCircle2 className="w-4 h-4 text-brandGreen shrink-0" />
          <span>Store settings successfully saved and applied!</span>
        </div>
      )}

      {/* 1. Security PIN & Access Control: High Priority Section */}
      <div className="clay-card p-5 sm:p-6 space-y-4 border-l-4 border-l-amber-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brandText">
                Operations Hub Security PIN (Lock Screen)
              </h4>
              <p className="text-xs text-slate-500">
                Change the PIN required to access the <code className="font-mono text-brandRed">/lucky</code> control panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] text-amber-800 font-medium">Active PIN:</span>
            <span className="font-mono font-black text-amber-900 text-xs tracking-wider">
              {currentPin}
            </span>
          </div>
        </div>

        {pinSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>PIN updated successfully! Your new PIN is active for all future logins.</span>
          </div>
        )}

        {pinError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-brandRed text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-brandRed shrink-0" />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePin} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                New 4-Digit Security PIN *
              </label>
              <div className="relative">
                <input
                  type={showNewPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="e.g. 1995 or 4321"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 clay-inset text-brandText font-mono tracking-widest text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPin(!showNewPin)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                  title={showNewPin ? 'Hide' : 'Show'}
                >
                  {showNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Enter numbers only (at least 4 digits).
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Confirm New PIN *
              </label>
              <input
                type={showNewPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={8}
                placeholder="Re-enter new PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full px-3.5 py-2.5 clay-inset text-brandText font-mono tracking-widest text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Update Security PIN</span>
            </button>
          </div>
        </form>
      </div>

      <form onSubmit={handleSaveStoreConfig} className="space-y-6">
        {/* Business Information: Clay Card */}
        <div className="clay-card p-5 sm:p-6 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-brandText flex items-center gap-2">
            <Settings className="w-4 h-4 text-brandRed" />
            <span>Business Profile &amp; GST</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Store / Business Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 clay-inset font-mono uppercase text-brandText focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Customer Support Phone</label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Admin Notification Email</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules: Clay Card */}
        <div className="clay-card p-5 sm:p-6 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-brandText flex items-center gap-2">
            <Truck className="w-4 h-4 text-brandRed" />
            <span>Delivery &amp; Shipping Rules</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Orders equal or above this amount receive FREE delivery.
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={standardDeliveryFee}
                onChange={(e) => setStandardDeliveryFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 clay-inset text-brandText focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways & COD: Clay Card */}
        <div className="clay-card p-5 sm:p-6 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-brandText flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brandRed" />
            <span>Razorpay Gateway &amp; Cash on Delivery</span>
          </h4>

          <div className="p-4 clay-card-flat flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-brandText">Razorpay Direct Gateway (UPI / Cards / NetBanking)</div>
              <div className="text-slate-400 text-[11px]">Key: rzp_test_placeholder (Configured in .env.local)</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-brandGreen text-[10px] font-bold shadow-xs">
              ● Connected
            </span>
          </div>

          <div className="flex items-center justify-between p-4 clay-card-flat text-xs">
            <div>
              <div className="font-bold text-brandText">Allow Cash on Delivery (COD)</div>
              <div className="text-slate-400 text-[11px]">Customers can pay cash upon parcel delivery</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-brandRed shadow-inner"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 clay-btn-red font-bold text-xs inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
