import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Vishnu Home Products — Authentic Homemade Flavours from Mangalore',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
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
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Vishnu Home Products',
    url: 'https://vishnuhomeproducts.in',
    logo: 'https://vishnuhomeproducts.in/logo.png',
    description:
      'Authentic homemade Mangalorean pickles, thokkus, coastal spices, sun-dried fish, and Ayurvedic wellness products. FSSAI License: 21223181000014.',
    telephone: '+91-98450-12345',
    email: 'support@vishnuhomeproducts.in',
    priceRange: '₹120 - ₹999',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kadri Temple Road',
      addressLocality: 'Mangaluru',
      addressRegion: 'Karnataka',
      postalCode: '575002',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98450-12345',
      contactType: 'customer service',
      email: 'support@vishnuhomeproducts.in',
      areaServed: 'IN',
      availableLanguage: ['English', 'Kannada', 'Hindi', 'Tulu'],
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'IN',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brandBg text-brandText antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
