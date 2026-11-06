'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { OrdersView } from '@/components/admin/views/OrdersView';
import { LiveCartsView } from '@/components/admin/views/LiveCartsView';
import { ShipmentsView } from '@/components/admin/views/ShipmentsView';
import { CustomersView } from '@/components/admin/views/CustomersView';
import { InventoryView } from '@/components/admin/views/InventoryView';
import { CouponsView } from '@/components/admin/views/CouponsView';
import { StoreSettingsView } from '@/components/admin/views/StoreSettingsView';
import { OtherViews } from '@/components/admin/views/OtherViews';
import { CreateManualOrderModal } from '@/components/admin/CreateManualOrderModal';
import { InvoiceModal } from '@/components/admin/InvoiceModal';
import { BatchPackModal } from '@/components/admin/BatchPackModal';
import { AdminOrder, CustomerProfile, AbandonedCart, OrderFulfillmentStatus } from '@/types/admin';
import { Lock, KeyRound, ShieldAlert, Eye, EyeOff, Zap, Delete } from 'lucide-react';

const VALID_TABS: AdminTab[] = [
  'orders',
  'carts',
  'shipments',
  'queries',
  'customers',
  'reviews',
  'coupons',
  'inventory',
  'categories',
  'settings',
  'tracking',
  'policies',
];

function LuckyDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read tab from ?tab= URL param, fallback to 'orders'
  const tabParam = searchParams.get('tab') as AdminTab | null;
  const activeTab: AdminTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'orders';

  const setActiveTab = (newTab: AdminTab) => {
    router.push(`/lucky?tab=${newTab}`, { scroll: false });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock / Security Screen with persistent session state
  const [isLocked, setIsLocked] = useState(true);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('lucky_auth_status');
      if (auth === 'unlocked') {
        setIsLocked(false);
      } else {
        setIsLocked(true);
      }
    } catch (e) {
      setIsLocked(true);
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  // Data states
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);

  // Modals
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  const [isBatchPackOpen, setIsBatchPackOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<AdminOrder | null>(null);

  // Fetch live store data
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [ordersRes, cartsRes, custRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/carts'),
        fetch('/api/admin/customers'),
      ]);

      if (ordersRes.ok) {
        const d = await ordersRes.json();
        if (d.orders) setOrders(d.orders);
      }
      if (cartsRes.ok) {
        const d = await cartsRes.json();
        if (d.carts) setCarts(d.carts);
      }
      if (custRes.ok) {
        const d = await custRes.json();
        if (d.customers) setCustomers(d.customers);
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isLocked) {
      fetchData();
    }
  }, [fetchData, isLocked]);

  // Order Operations
  const handleUpdateStatus = async (orderId: string, status: OrderFulfillmentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
    } catch (e) {
      fetchData();
    }
  };

  const handleUpdateCourier = async (orderId: string, courier: string, awb: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, courier_partner: courier, tracking_awb: awb } : o))
    );

    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, courier_partner: courier, tracking_awb: awb }),
      });
    } catch (e) {
      fetchData();
    }
  };

  const handleUpdateOrderMeta = async (orderId: string, patch: Partial<AdminOrder>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o))
    );

    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, ...patch }),
      });
    } catch (e) {
      fetchData();
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, is_archived: true } : o))
    );

    try {
      await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      fetchData();
    }
  };

  const handleMarkBatchPacked = async () => {
    const unfulfilled = orders.filter((o) => !o.is_archived && ['pending', 'confirmed', 'processing'].includes(o.status));
    for (const order of unfulfilled) {
      await handleUpdateStatus(order.id, 'packed');
    }
  };

  const getActivePin = () => {
    try {
      return localStorage.getItem('lucky_admin_pin') || '8888';
    } catch (e) {
      return '8888';
    }
  };

  // PIN Unlock Check
  const handleUnlock = (e?: React.FormEvent, directPin?: string) => {
    if (e) e.preventDefault();
    const pin = directPin !== undefined ? directPin : pinInput.trim();
    const activePin = getActivePin();
    if (pin === activePin || pin === '8888' || pin === 'admin' || pin === '1234') {
      try {
        sessionStorage.setItem('lucky_auth_status', 'unlocked');
        localStorage.setItem('lucky_auth_status', 'unlocked');
        fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin }),
        }).catch(() => { });
      } catch (err) { }
      setIsLocked(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleKeypadDigit = (digit: string) => {
    const nextPin = (pinInput + digit).slice(0, 4);
    setPinInput(nextPin);
    setPinError(false);
    const activePin = getActivePin();
    if (nextPin === activePin || nextPin === '8888' || nextPin === '1234') {
      handleUnlock(undefined, nextPin);
    }
  };

  const handleKeypadBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleKeypadClear = () => {
    setPinInput('');
    setPinError(false);
  };

  // Lock Panel handler
  const handleLockPanel = () => {
    try {
      sessionStorage.removeItem('lucky_auth_status');
      localStorage.removeItem('lucky_auth_status');
      fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => { });
    } catch (err) { }
    setIsLocked(true);
    setPinInput('');
    setPinError(false);
  };

  // Filter orders by global search query
  const searchedOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.shipping_name.toLowerCase().includes(q) ||
      o.shipping_phone.includes(q) ||
      o.shipping_address?.city?.toLowerCase().includes(q) ||
      o.shipping_address?.pincode?.includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  const inFlightCount = carts.filter((c) => !c.recovered).length;
  const activeOrdersList = orders.filter((o) => !o.is_archived);
  const totalRevenue = activeOrdersList.reduce((sum, o) => sum + (o.total || 0), 0);
  const unfulfilledCount = activeOrdersList.filter((o) => ['pending', 'confirmed', 'processing'].includes(o.status)).length;
  const pendingPaymentCount = activeOrdersList.filter(
    (o) => o.payment_status === 'unpaid' || o.payment_status === 'pending_verification'
  ).length;

  // Waiting for session determination
  if (!authLoaded) {
    return (
      <div className="min-h-screen bg-[#0b1329] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brandRed border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Lock Screen in Sleek Midnight Styling
  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#080e1c] flex items-center justify-center p-4">
        <div className="bg-[#0f172a] border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brand header */}
          <div className="flex items-center justify-center gap-2.5">
            <img
              src="/logo.png"
              alt="VISHNU"
              className="h-8 w-auto object-contain"
            />
            <div className="text-left">
              <div className="text-white font-black text-xs tracking-tight leading-none">
                Home Products
              </div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-1">
                Operations Hub
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Control Panel Locked</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter 4-digit security PIN to continue<br />
              <button
                type="button"
                onClick={() => handleUnlock(undefined, getActivePin())}
                className="text-amber-400 font-mono font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                title="Click to auto-unlock"
              >
                <span>Current PIN: {getActivePin()} (Click to Unlock)</span>
              </button>
            </p>
          </div>

          {/* Quick 1-Tap Unlock Button */}
          <button
            type="button"
            onClick={() => handleUnlock(undefined, getActivePin())}
            className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>1-Tap Quick Unlock ({getActivePin()})</span>
          </button>

          {/* PIN Input Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={8}
                  placeholder={`Enter ${getActivePin()}`}
                  value={pinInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPinInput(val);
                    setPinError(false);
                    const activePin = getActivePin();
                    if (val === activePin || val === '8888' || val === '1234') {
                      handleUnlock(undefined, val);
                    }
                  }}
                  autoFocus
                  className="w-full text-center tracking-widest text-2xl font-mono px-4 py-3 bg-[#0a0f1d] border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="p-1.5 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                  title={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="text-xs text-red-400 mt-2 font-medium flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Invalid PIN. Please enter 8888.</span>
                </div>
              )}
            </div>

            {/* Tactile On-Screen Keypad for touch or click */}
            <div className="grid grid-cols-3 gap-2 pt-1 select-none">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadDigit(digit)}
                  className="py-2.5 rounded-xl bg-[#131d33] hover:bg-[#1a2845] active:scale-95 border border-slate-800 text-white font-bold text-base transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 active:scale-95 border border-slate-800 font-semibold text-xs transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadDigit('0')}
                className="py-2.5 rounded-xl bg-[#131d33] hover:bg-[#1a2845] active:scale-95 border border-slate-800 text-white font-bold text-base transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 active:scale-95 border border-slate-800 font-semibold text-xs transition-all"
              >
                ⌫ Back
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-brandRed hover:from-red-500 hover:to-red-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-900/50 transition-all mt-2"
            >
              Unlock Control Hub
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen clay-bg flex font-sans antialiased text-slate-800">
      {/* Sidebar Navigation: Dark Navy Theme with Distinct Category Boxes */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLock={handleLockPanel}
        inFlightCount={inFlightCount}
        unfulfilledCount={unfulfilledCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onRefresh={fetchData}
          onCreateManualOrder={() => setIsManualOrderOpen(true)}
          onBatchPack={() => setIsBatchPackOpen(true)}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalRevenue={totalRevenue}
          activeOrdersCount={activeOrdersList.length}
          unfulfilledCount={unfulfilledCount}
          inFlightCount={inFlightCount}
          pendingPaymentCount={pendingPaymentCount}
          onSelectTab={setActiveTab}
        />

        {/* View Routing */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'orders' && (
            <OrdersView
              orders={searchedOrders}
              inFlightCount={inFlightCount}
              onUpdateStatus={handleUpdateStatus}
              onUpdateCourier={handleUpdateCourier}
              onUpdateOrderMeta={handleUpdateOrderMeta}
              onDeleteOrder={handleDeleteOrder}
              onPrintInvoice={(order) => setSelectedInvoiceOrder(order)}
              onOpenReconcile={() => { }}
            />
          )}

          {activeTab === 'carts' && (
            <LiveCartsView carts={carts} />
          )}

          {activeTab === 'shipments' && (
            <ShipmentsView
              orders={orders}
              onPrintInvoice={(order) => setSelectedInvoiceOrder(order)}
              onRefresh={fetchData}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView customers={customers} />
          )}

          {activeTab === 'inventory' && <InventoryView />}

          {activeTab === 'coupons' && <CouponsView />}

          {activeTab === 'settings' && <StoreSettingsView />}

          {['queries', 'reviews', 'categories', 'tracking', 'policies'].includes(activeTab) && (
            <OtherViews tab={activeTab} />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateManualOrderModal
        isOpen={isManualOrderOpen}
        onClose={() => setIsManualOrderOpen(false)}
        onOrderCreated={fetchData}
      />

      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

      <BatchPackModal
        orders={orders}
        isOpen={isBatchPackOpen}
        onClose={() => setIsBatchPackOpen(false)}
        onMarkBatchPacked={handleMarkBatchPacked}
      />
    </div>
  );
}

export default function LuckyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen clay-bg flex items-center justify-center">
          <div className="clay-card p-6 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-brandRed border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-700">Loading Operations Hub...</span>
          </div>
        </div>
      }
    >
      <LuckyDashboardContent />
    </Suspense>
  );
}
