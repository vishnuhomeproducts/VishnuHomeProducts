'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  Loader2,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>(
    (initialTab as any) || 'orders'
  );

  const { user, logout, isAuthenticated, loading: authLoading, updateUserProfile } = useAuth();
  const { productIds, toggleWishlist } = useWishlist();
  const { addItem, applyCoupon, openDrawer } = useCart();
  const { products } = useProducts();

  // User-isolated state (starts EMPTY - no dummy data leakage)
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  // Address form state
  const [newAddressOpen, setNewAddressOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    title: 'Home',
    name: '',
    phone: '',
    address: '',
  });

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync profile form when user loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  // Load user-isolated addresses
  useEffect(() => {
    if (!user?.email) {
      setSavedAddresses([]);
      return;
    }

    try {
      const cleanEmail = user.email.toLowerCase();
      const userAddrKey = `vishnu_addresses_${cleanEmail}`;
      const stored = JSON.parse(localStorage.getItem(userAddrKey) || '[]');
      setSavedAddresses(Array.isArray(stored) ? stored : []);
    } catch (e) {
      setSavedAddresses([]);
    }
  }, [user?.email]);

  // Load user-isolated orders (Server API + User-Scoped Local Storage)
  useEffect(() => {
    if (!user?.email) {
      setOrders([]);
      return;
    }

    const fetchUserOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const cleanEmail = user.email.toLowerCase();
        
        // 1. Fetch from server API with strict email query
        let apiOrders: any[] = [];
        try {
          const res = await fetch(`/api/orders/user?email=${encodeURIComponent(cleanEmail)}&userId=${encodeURIComponent(user.id || '')}`);
          if (res.ok) {
            const data = await res.json();
            apiOrders = Array.isArray(data.orders) ? data.orders : [];
          }
        } catch (apiErr) {
          // fallback to client store if offline
        }

        // 2. Read client-side orders scoped strictly to this email
        const userOrdersKey = `vishnu_orders_${cleanEmail}`;
        let localOrders: any[] = [];
        try {
          const localStored = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
          localOrders = Array.isArray(localStored) ? localStored : [];
        } catch (e) {}

        // 3. Strictly enforce tenant isolation: only include orders matching active user's email
        const orderMap = new Map<string, any>();
        [...apiOrders, ...localOrders].forEach((ord) => {
          if (!ord || !ord.id) return;
          const orderEmail = (ord.shipping_email || ord.shipping_address?.email || '').trim().toLowerCase();
          if (orderEmail === cleanEmail || (user.id && ord.user_id === user.id)) {
            if (!orderMap.has(ord.id)) {
              orderMap.set(ord.id, ord);
            }
          }
        });

        const mergedOrders = Array.from(orderMap.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setOrders(mergedOrders);
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [user?.email, user?.id]);

  const wishlistedProducts = products.filter((p) => productIds.includes(p.id));
  const totalLifetimeSpend = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const coastalCoins = 50 + Math.floor(totalLifetimeSpend / 10);
  const referralWaLink = `https://wa.me/?text=${encodeURIComponent(
    'Hey! Try authentic Mangalorean homemade pickles, thokkus & coastal dry fish from Vishnu Home Products (https://vishnuhomeproducts.in). Use code MANGALORE50 for ₹50 OFF + Free Delivery!'
  )}`;

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.name || !newAddressForm.address || !user?.email) return;

    const cleanEmail = user.email.toLowerCase();
    const newAddr = {
      id: 'addr-' + Date.now(),
      ...newAddressForm,
      isDefault: savedAddresses.length === 0,
    };
    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    localStorage.setItem(`vishnu_addresses_${cleanEmail}`, JSON.stringify(updated));
    setNewAddressForm({ title: 'Home', name: '', phone: '', address: '' });
    setNewAddressOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    if (!user?.email) return;
    const cleanEmail = user.email.toLowerCase();
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem(`vishnu_addresses_${cleanEmail}`, JSON.stringify(updated));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // If loading auth state
  if (authLoading) {
    return (
      <div className="py-20 bg-brandBg min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2.5 text-xs text-brandText2">
          <Loader2 className="w-4 h-4 animate-spin text-brandAccent" />
          <span>Loading your account...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated, display standard sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="py-16 bg-brandBg min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-brandBorder shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-brandAccent-light text-brandAccent flex items-center justify-center mx-auto text-2xl font-bold">
            <Lock className="w-6 h-6 text-brandAccent" />
          </div>
          <h2 className="font-display text-xl font-bold text-brandText">Sign In Required</h2>
          <p className="text-xs text-brandText2 leading-relaxed">
            Please sign in to view your orders, saved addresses, and personal profile details.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-brandAccent hover:bg-brandAccent-mid text-white text-xs font-bold rounded-button shadow-xs"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-8">
        
        {/* Header with User Info */}
        <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brandAccent-light text-brandAccent font-bold text-xl flex items-center justify-center border border-brandAccent/30 shadow-sm">
              {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-brandText">
                {user?.name || user?.email?.split('@')[0] || 'My Account'}
              </h1>
              <p className="text-xs text-brandText3 font-mono">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-brandRed border border-brandRed/20 hover:bg-red-50 rounded-button transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Vishnu Coastal Rewards Loyalty Wallet & Referral Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2b090b] via-[#1a0808] to-[#3b120b] text-white border border-amber-400/30 shadow-md flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                🪙 Vishnu Coastal Rewards Wallet
              </div>
              <div className="font-display text-2xl font-bold text-white">
                {coastalCoins} Coastal Coins
              </div>
              <p className="text-[11px] text-white/75">
                Earned from your orders (10 Coins per ₹100 spent + 50 Welcome Bonus).
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                applyCoupon({
                  code: 'VISHNU10',
                  discount_type: 'percent',
                  discount_value: 10,
                  min_order: 0,
                  active: true,
                });
                openDrawer();
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-brandDark font-bold text-xs shrink-0 shadow-sm"
            >
              Redeem 10% OFF →
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#fff5f3] to-[#fffbeb] border border-red-200/80 shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brandRed">
                🎁 Refer Friends &amp; Family
              </div>
              <div className="font-display text-lg font-bold text-brandText">
                Give ₹50 OFF, Get ₹50 OFF
              </div>
              <p className="text-[11px] text-brandText2">
                Share the taste of Mangalore on WhatsApp with code <strong className="font-mono text-brandRed">MANGALORE50</strong>.
              </p>
            </div>
            <a
              href={referralWaLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-xs shrink-0 shadow-sm"
            >
              Share on WhatsApp ↗
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-brandBorder overflow-x-auto pb-px">
          {[
            { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
            { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistedProducts.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: savedAddresses.length },
            { id: 'profile', label: 'Profile Details', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-brandAccent text-brandAccent'
                    : 'border-transparent text-brandText2 hover:text-brandText'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-brandAccent text-white' : 'bg-brandBorder text-brandText3'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {isLoadingOrders ? (
              <div className="bg-white p-10 rounded-card border border-brandBorder text-center space-y-2">
                <Loader2 className="w-6 h-6 text-brandAccent animate-spin mx-auto" />
                <p className="text-xs text-brandText2">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-10 rounded-card border border-brandBorder text-center space-y-3">
                <Package className="w-10 h-10 text-brandText3 mx-auto" />
                <h3 className="font-semibold text-sm text-brandText">No orders placed yet</h3>
                <p className="text-xs text-brandText2">
                  You have not placed any orders with <strong>{user?.email}</strong> yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-4 py-2 bg-brandAccent text-white text-xs font-semibold rounded-button shadow-xs"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-5 rounded-card border border-brandBorder shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-brandBorder text-xs">
                    <div>
                      <span className="text-brandText3">Order #</span>
                      <strong className="font-mono text-brandText ml-1">{ord.order_number || ord.id}</strong>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-brandText3">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 divide-y divide-brandBorder/60">
                    {ord.items.map((item: any, idx: number) => (
                      <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{item.emoji || '🫙'}</span>
                          <div>
                            <span className="font-semibold text-brandText">{item.name}</span>
                            <span className="text-brandText3 ml-1.5">({item.size}) × {item.qty}</span>
                          </div>
                        </div>
                        <div className="font-bold text-brandText">
                          {formatINR((item.price || item.unit_price || 120) * item.qty)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-brandBorder flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-brandText3">
                      Payment: <span className="text-brandGreen font-medium uppercase">{ord.payment_status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-brandText">
                        Total: <span className="text-brandAccent font-black">{formatINR(ord.total)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          (ord.items || []).forEach((item: any) => {
                            addItem({
                              product_id: item.product_id || item.name.toLowerCase().replace(/\s+/g, '-'),
                              name: item.name,
                              slug: item.slug || item.name.toLowerCase().replace(/\s+/g, '-'),
                              size: item.size || '250g',
                              price: item.price || item.unit_price || 120,
                              mrp: item.mrp || (item.price || 120) + 25,
                              emoji: item.emoji || '🫙',
                              qty: item.qty || 1,
                            });
                          });
                        }}
                        className="px-3 py-1.5 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold text-xs rounded-button shadow-2xs transition-colors"
                      >
                        ↻ Buy Again (1-Tap Reorder)
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white p-10 rounded-card border border-brandBorder text-center space-y-3">
                <Heart className="w-10 h-10 text-brandText3 mx-auto" />
                <h3 className="font-semibold text-sm text-brandText">Your wishlist is empty</h3>
                <p className="text-xs text-brandText2">Explore our coastal flavours and tap the heart icon to save favourites.</p>
                <Link
                  href="/shop"
                  className="inline-block px-4 py-2 bg-brandAccent text-white text-xs font-semibold rounded-button"
                >
                  Browse Store
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistedProducts.map((p) => {
                  const size = p.sizes[0];
                  return (
                    <div
                      key={p.id}
                      className="bg-white p-4 rounded-card border border-brandBorder shadow-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-brandAccent-light flex items-center justify-center text-2xl shrink-0">
                          {p.emoji || '🫙'}
                        </div>
                        <div>
                          <Link href={`/product/${p.slug}`} className="font-semibold text-xs text-brandText hover:text-brandAccent line-clamp-1">
                            {p.name}
                          </Link>
                          <div className="text-xs font-bold text-brandAccent mt-0.5">
                            {formatINR(size?.price || 120)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            addItem({
                              product_id: p.id,
                              name: p.name,
                              slug: p.slug,
                              size: size?.label || '300g',
                              price: size?.price || 120,
                              mrp: size?.mrp || 145,
                              emoji: p.emoji,
                              qty: 1,
                            });
                          }}
                          className="p-2 bg-brandAccent hover:bg-brandAccent-mid text-white rounded-button text-xs"
                          title="Add to cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-2 text-brandText3 hover:text-brandRed rounded-button"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-sm text-brandText">Shipping Addresses</h2>
              <button
                onClick={() => setNewAddressOpen(!newAddressOpen)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-brandAccent text-white text-xs font-semibold rounded-button hover:bg-brandAccent-mid"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {newAddressOpen && (
              <form onSubmit={handleAddAddress} className="bg-white p-5 rounded-card border border-brandAccent/40 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-brandText uppercase tracking-wider">New Shipping Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Contact Name"
                    placeholder="Enter recipient full name"
                    value={newAddressForm.name}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    placeholder="10-digit mobile number"
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Full Address (House/Flat, Street, City, State, PIN)"
                      placeholder="e.g. Flat 101, Palm Grove, MG Road, Mangaluru, KA - 575001"
                      value={newAddressForm.address}
                      onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setNewAddressOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Save Address
                  </Button>
                </div>
              </form>
            )}

            {savedAddresses.length === 0 ? (
              <div className="bg-white p-8 rounded-card border border-brandBorder text-center space-y-2">
                <MapPin className="w-8 h-8 text-brandText3 mx-auto" />
                <h3 className="font-semibold text-xs text-brandText">No saved addresses yet</h3>
                <p className="text-xs text-brandText2">
                  Add an address for quick one-click checkout on future orders.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="bg-white p-5 rounded-card border border-brandBorder shadow-sm space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brandAccent bg-brandAccent-light px-2 py-0.5 rounded">
                        {addr.title}
                      </span>
                      <div className="flex items-center gap-2">
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold text-brandGreen">Default</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-brandText3 hover:text-brandRed p-1 rounded transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-brandText">{addr.name} ({addr.phone})</div>
                    <p className="text-xs text-brandText2 leading-relaxed">{addr.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Details */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-4 max-w-lg">
            <h2 className="font-bold text-sm text-brandText pb-2 border-b border-brandBorder">
              Personal Information
            </h2>

            {profileSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
              />
              <Input
                label="Mobile Number"
                placeholder="10-digit mobile number"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
              />
              <div className="pt-2">
                <Button type="submit" size="sm">Save Profile Changes</Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-brandText3">Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
