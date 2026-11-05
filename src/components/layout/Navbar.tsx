'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, Plus, Gift } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { formatINR } from '@/lib/utils';

const QUICK_LINKS = [
  { name: 'All', href: '/shop' },
  { name: 'Pickles', href: '/shop?category=Pickles+%26+Thokkus' },
  { name: 'Spices', href: '/shop?category=Spices+%26+Masalas' },
  { name: 'Dry Fish', href: '/shop?category=Dry+Fish' },
  { name: 'Combos 🎁', href: '/combos' },
  { name: 'Recipes 👩‍🍳', href: '/recipes' },
  { name: 'Track Order', href: '/track-order' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount, openDrawer, addItem } = useCart();
  const { productIds } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { products } = useProducts();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? productIds.length : 0;

  const matchingProducts = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brandBorder shadow-sm">
      <div className="max-w-site mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <img
            src="/logo.png"
            alt="VISHNU"
            className="h-7 md:h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="border border-brandText text-brandText font-bold text-[10px] md:text-xs px-2 py-0.5 rounded uppercase tracking-wider">
            Home Products
          </div>
        </Link>

        {/* Center: Live Instant Search Bar */}
        <div ref={searchRef} className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-2 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Search pickles, thokkus, dry fish..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-brandBg border border-brandBorder rounded-full focus:outline-none focus:border-brandAccent focus:bg-white transition-all text-brandText placeholder-brandText3"
            />
            <Search className="w-4 h-4 text-brandText3 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Instant Search Dropdown */}
          {showSuggestions && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-brandBorder rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-brandBorder">
              {matchingProducts.length === 0 ? (
                <div className="p-4 text-xs text-brandText3 text-center">
                  No products matching "{searchQuery}"
                </div>
              ) : (
                <>
                  {matchingProducts.map((p) => {
                    const sz = p.sizes?.[0] || { label: '250g', price: 120, mrp: 150 };
                    return (
                      <div
                        key={p.id}
                        className="p-2.5 hover:bg-brandBg flex items-center justify-between gap-2 text-xs transition-colors"
                      >
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-2.5 min-w-0 flex-1"
                        >
                          <span className="w-9 h-9 rounded-lg bg-brandAccent-light flex items-center justify-center text-lg shrink-0">
                            {p.emoji || '🫙'}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-brandText truncate">{p.name}</div>
                            <div className="text-[10px] text-brandText3">
                              {p.category} • <strong>{formatINR(sz.price)}</strong> ({sz.label})
                            </div>
                          </div>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            addItem({
                              product_id: p.id,
                              name: p.name,
                              slug: p.slug,
                              size: sz.label,
                              price: sz.price,
                              mrp: sz.mrp,
                              emoji: p.emoji || '🫙',
                              qty: 1,
                            });
                            setShowSuggestions(false);
                          }}
                          className="px-2.5 py-1 bg-brandAccent hover:bg-brandAccent-mid text-white font-bold text-[10px] rounded-lg shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full py-2 text-center text-[11px] font-bold text-brandAccent bg-brandBg hover:underline"
                  >
                    See all results for "{searchQuery}" →
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Category Quick Links (Pills) */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
          {QUICK_LINKS.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/shop' && pathname.includes(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-brandAccent text-white shadow-sm'
                    : 'bg-brandBg hover:bg-brandAccent-light text-brandText hover:text-brandAccent border border-brandBorder'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Wishlist, Cart, User / Login */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Wishlist Link */}
          <Link
            href="/account?tab=wishlist"
            className="relative p-2 text-brandText hover:text-brandAccent hover:bg-brandBg rounded-full transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-brandAccent text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <button
            onClick={openDrawer}
            className="relative p-2 text-brandText hover:text-brandAccent hover:bg-brandBg rounded-full transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-brandRed text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account / Sign In */}
          {isAuthenticated ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 text-xs font-medium text-brandText bg-brandBg border border-brandBorder rounded-full hover:border-brandAccent transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-brandAccent text-white flex items-center justify-center text-[10px] font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline max-w-[80px] truncate">{user?.name}</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-brandAccent text-white rounded-button hover:bg-brandAccent-mid transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-brandText hover:bg-brandBg rounded-button"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Search Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brandBorder bg-white p-4 space-y-4 shadow-lg animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pickles, thokkus, dry fish..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-brandBg border border-brandBorder rounded-full focus:outline-none focus:border-brandAccent text-brandText"
            />
            <Search className="w-4 h-4 text-brandText3 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-brandText3 uppercase tracking-wider px-2 mb-1">
              Shop & Explore
            </div>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium text-brandText hover:bg-brandAccent-light hover:text-brandAccent rounded-button transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-brandBorder pt-3 flex gap-2">
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-semibold bg-brandBg border border-brandBorder rounded-button text-brandText"
            >
              View Cart ({cartCount})
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs font-semibold bg-brandAccent text-white rounded-button"
            >
              My Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
