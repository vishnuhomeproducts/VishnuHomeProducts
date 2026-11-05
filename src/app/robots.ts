import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vishnuhomeproducts.in';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/lucky', '/admin', '/api/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

