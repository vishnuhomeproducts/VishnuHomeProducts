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
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>(
    (initialTab as any) || 'orders'
  );

  const { user, logout, isAuthenticated } = useAuth();
  const { productIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const [orders, setOrders] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([
    {
      id: 'addr-1',
      title: 'Home',
      name: 'Pooja Hegde',
      phone: '9845012345',
      address: 'Flat 302, Sagar View Apts, Kadri Temple Road, Mangaluru, Karnataka - 575002',
      isDefault: true,
    },
  ]);

  const [newAddressOpen, setNewAddressOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    title: 'Home',
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('vishnu-orders') || '[]');
      if (storedOrders.length > 0) {
        setOrders(storedOrders);
      } else {
        // Fallback demo order
        setOrders([
          {
            id: 'VHP-MG7842',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            items: [
              { name: 'Tomato Thokku', size: '300g', qty: 2, price: 120, emoji: '🍅' },
              { name: 'Avakaya Mango Pickle', size: '300g', qty: 1, price: 120, emoji: '🥭' },
            ],
            total: 360,
            status: 'delivered',
            payment_status: 'paid',
          },
        ]);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const wishlistedProducts = SAMPLE_PRODUCTS.filter((p) => productIds.includes(p.id));

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.name || !newAddressForm.address) return;

    setSavedAddresses([
      ...savedAddresses,
      {
        id: 'addr-' + Date.now(),
        ...newAddressForm,
        isDefault: false,
      },
    ]);
    setNewAddressForm({ title: 'Home', name: '', phone: '', address: '' });
    setNewAddressOpen(false);
  };

  return (
    <div className="py-10 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-8">
        
        {/* Header with User Info */}
        <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brandAccent-light text-brandAccent font-bold text-xl flex items-center justify-center border border-brandAccent/30 shadow-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-brandText">
                {user?.name || 'Coastal Food Lover'}
              </h1>
              <p className="text-xs text-brandText3">{user?.email || 'customer@vishnuhomeproducts.in'}</p>
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
            {orders.length === 0 ? (
              <div className="bg-white p-10 rounded-card border border-brandBorder text-center space-y-3">
                <Package className="w-10 h-10 text-brandText3 mx-auto" />
                <h3 className="font-semibold text-sm text-brandText">No orders yet</h3>
                <p className="text-xs text-brandText2">Once you place an order, it will show up here.</p>
                <Link
                  href="/shop"
                  className="inline-block px-4 py-2 bg-brandAccent text-white text-xs font-semibold rounded-button"
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
                      <strong className="font-mono text-brandText ml-1">{ord.id}</strong>
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

                  <div className="pt-3 border-t border-brandBorder flex items-center justify-between text-xs">
                    <div className="text-brandText3">
                      Payment: <span className="text-brandGreen font-medium uppercase">{ord.payment_status}</span>
                    </div>
                    <div className="text-sm font-bold text-brandText">
                      Total: <span className="text-brandAccent">{formatINR(ord.total)}</span>
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
                <p className="text-xs text-brandText2">Explore our thokkus and tap the heart icon to save your favourites.</p>
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
                <h3 className="text-xs font-bold text-brandText uppercase tracking-wider">New Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Contact Name"
                    placeholder="Full name"
                    value={newAddressForm.name}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    placeholder="10-digit mobile"
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Full Address (Street, City, State, PIN)"
                      placeholder="Address line"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div key={addr.id} className="bg-white p-5 rounded-card border border-brandBorder shadow-sm space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brandAccent bg-brandAccent-light px-2 py-0.5 rounded">
                      {addr.title}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-semibold text-brandGreen">Default</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-brandText">{addr.name} ({addr.phone})</div>
                  <p className="text-xs text-brandText2 leading-relaxed">{addr.address}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Profile Details */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-card border border-brandBorder shadow-sm space-y-4 max-w-lg">
            <h2 className="font-bold text-sm text-brandText pb-2 border-b border-brandBorder">
              Personal Information
            </h2>
            <div className="space-y-3">
              <Input label="Name" defaultValue={user?.name || 'Pooja Hegde'} />
              <Input label="Email Address" defaultValue={user?.email || 'pooja@example.com'} disabled />
              <Input label="Mobile Number" defaultValue={user?.phone || '9845012345'} />
              <div className="pt-2">
                <Button size="sm">Save Profile Changes</Button>
              </div>
            </div>
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
