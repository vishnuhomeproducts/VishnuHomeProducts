'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { TopBar } from './TopBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useCart } from '@/hooks/useCart';

// Lazy-load off-screen interactive overlays to keep First Contentful Paint ultra-lightweight
const CartDrawer = dynamic(
  () => import('./CartDrawer').then((mod) => mod.CartDrawer),
  { ssr: false }
);
const WhatsAppFloat = dynamic(
  () => import('./WhatsAppFloat').then((mod) => mod.WhatsAppFloat),
  { ssr: false }
);
const RecentOrderToast = dynamic(
  () => import('./RecentOrderToast').then((mod) => mod.RecentOrderToast),
  { ssr: false }
);

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/lucky');
  const { items, getTotal } = useCart();

  // Sync live customer cart to Admin Live Radar when items change (debounced)
  useEffect(() => {
    if (isAdmin || typeof window === 'undefined' || items.length === 0) return;

    const timer = setTimeout(() => {
      try {
        let sessionId = localStorage.getItem('vh_cart_session_id');
        if (!sessionId) {
          sessionId = 'cart_live_' + Math.floor(Math.random() * 90000 + 10000);
          localStorage.setItem('vh_cart_session_id', sessionId);
        }

        fetch('/api/admin/carts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: sessionId,
            customer_name: 'Live Storefront Shopper',
            city: 'Mangaluru / Online',
            items: items.map((i) => ({
              product_id: i.product_id,
              name: i.name,
              size: i.size,
              qty: i.qty,
              unit_price: i.price,
              emoji: i.emoji,
            })),
            total: getTotal(),
          }),
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [items, isAdmin, getTotal]);

  // Track storefront visitor activity for the Operations Radar (lightweight 30s interval)
  useEffect(() => {
    if (isAdmin || typeof window === 'undefined') return;

    const recordVisit = () => {
      try {
        const now = Date.now();
        const existing = localStorage.getItem('vh_live_storefront_session');
        let sessionData = existing ? JSON.parse(existing) : null;
        if (!sessionData || now - (sessionData.lastPing || 0) > 20 * 60 * 1000) {
          sessionData = {
            id: 'live_user_' + Math.floor(Math.random() * 9000 + 1000),
            startedAt: now,
          };
        }
        sessionData.page = pathname;
        sessionData.pageTitle =
          document.title?.replace(' — Authentic Homemade Flavours from Mangalore', '') ||
          'Storefront';
        sessionData.lastPing = now;
        localStorage.setItem('vh_live_storefront_session', JSON.stringify(sessionData));
      } catch (e) {
        // Ignore localStorage quota or privacy mode errors
      }
    };

    recordVisit();
    const interval = setInterval(recordVisit, 30000);
    return () => clearInterval(interval);
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <RecentOrderToast />
    </>
  );
};
