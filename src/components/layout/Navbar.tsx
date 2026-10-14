'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

const QUICK_LINKS = [
  { name: 'All', href: '/shop' },
  { name: 'Pickles', href: '/shop?category=Pickles+%26+Thokkus' },
  { name: 'Spices', href: '/shop?category=Spices+%26+Masalas' },
  { name: 'Dry Fish', href: '/shop?category=Dry+Fish' },
  { name: 'Wellness', href: '/shop?category=Wellness' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount, openDrawer } = useCart();
  const { productIds } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? productIds.length : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brandBorder shadow-sm">
      <div className="max-w-site mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <div className="bg-brandRed text-white font-black text-base md:text-lg px-2.5 py-0.5 rounded tracking-tighter shadow-sm transition-transform group-hover:scale-105">
            VISHNU
          </div>
          <div className="border border-brandText text-brandText font-bold text-[10px] md:text-xs px-2 py-0.5 rounded uppercase tracking-wider">
            Home Products
          </div>
        </Link>

        {/* Center: Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-2">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pickles, thokkus, dry fish..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-brandBg border border-brandBorder rounded-full focus:outline-none focus:border-brandAccent focus:bg-white transition-all text-brandText placeholder-brandText3"
            />
            <Search className="w-4 h-4 text-brandText3 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Category Quick Links (Pills) */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
          {QUICK_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/shop' && pathname.includes(link.href));
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
              <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-brandAccent text-white text-[10px] font-bold flex items-center justify-center">
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
              <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-brandRed text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
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
              Shop Categories
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
