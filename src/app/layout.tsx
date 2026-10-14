import type { Metadata } from 'next';
import './globals.css';
import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';

export const metadata: Metadata = {
  title: 'Vishnu Home Products — Authentic Homemade Flavours from Mangalore',
  description:
    'Buy authentic homemade Mangalorean thokkus, raw mango pickles, country garlic thokku, sun-dried fish, avalakki, and pure herbal hair oil. 100% natural with no preservatives. FSSAI Certified.',
  keywords: [
    'Vishnu Home Products',
    'Mangalore Pickles',
    'Tomato Thokku',
    'Garlic Thokku',
    'Dry Fish Mangalore',
    'Homemade Pickles India',
    'FSSAI Certified Food',
    'Coastal Spices',
  ],
  openGraph: {
    title: 'Vishnu Home Products — Mangalore Homemade Pickles & Spices',
    description: 'Authentic homemade thokkus, pickles, and coastal dry fish delivered across India.',
    url: 'https://vishnuhomeproducts.in',
    siteName: 'Vishnu Home Products',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brandBg text-brandText antialiased">
        <TopBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
