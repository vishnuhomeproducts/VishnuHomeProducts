import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/productsStore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vishnuhomeproducts.in').replace(/\/$/, '');
  const products = await getAllProducts();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const staticRoutes: Array<{ path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '', priority: 1.0, freq: 'daily' },
    { path: '/shop', priority: 0.95, freq: 'daily' },
    { path: '/combos', priority: 0.85, freq: 'weekly' },
    { path: '/recipes', priority: 0.85, freq: 'weekly' },
    { path: '/bulk-orders', priority: 0.8, freq: 'weekly' },
    { path: '/about', priority: 0.8, freq: 'monthly' },
    { path: '/contact', priority: 0.8, freq: 'monthly' },
    { path: '/track-order', priority: 0.75, freq: 'monthly' },
    { path: '/shipping-policy', priority: 0.7, freq: 'monthly' },
    { path: '/return-refund-policy', priority: 0.7, freq: 'monthly' },
    { path: '/privacy-policy', priority: 0.7, freq: 'monthly' },
    { path: '/terms-of-service', priority: 0.7, freq: 'monthly' },
  ];

  return [
    ...staticRoutes.map((r) => ({
      url: `${baseUrl}${r.path}`,
      lastModified: new Date(),
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...productUrls,
  ];
}
