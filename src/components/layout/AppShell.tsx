'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TopBar } from './TopBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/lucky');

  // Track storefront visitor activity for the Operations Radar (Excludes admin pages)
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
        sessionData.pageTitle = document.title?.replace(' — Authentic Homemade Flavours from Mangalore', '') || 'Storefront';
        sessionData.lastPing = now;
        localStorage.setItem('vh_live_storefront_session', JSON.stringify(sessionData));
      } catch (e) {
        // Ignore localStorage quota or privacy mode errors
      }
    };

    recordVisit();
    const interval = setInterval(recordVisit, 4000);
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
    </>
  );
};
