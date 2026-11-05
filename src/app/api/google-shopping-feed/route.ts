import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/productsStore';

function escapeXml(unsafe: string): string {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getGoogleProductCategory(category: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('pickle') || cat.includes('thokku')) {
    return 'Food, Beverages & Tobacco > Food Items > Fruits & Vegetables > Pickled Fruits & Vegetables';
  }
  if (cat.includes('spice') || cat.includes('masala')) {
    return 'Food, Beverages & Tobacco > Food Items > Seasonings & Spices > Herbs & Spices';
  }
  if (cat.includes('fish') || cat.includes('seafood')) {
    return 'Food, Beverages & Tobacco > Food Items > Meat, Seafood & Eggs > Seafood';
  }
  if (cat.includes('sweet') || cat.includes('festive')) {
    return 'Food, Beverages & Tobacco > Food Items > Snack Foods';
  }
  if (cat.includes('rice') || cat.includes('grain') || cat.includes('poha')) {
    return 'Food, Beverages & Tobacco > Food Items > Grains, Rice & Cereal';
  }
  if (cat.includes('wellness') || cat.includes('oil')) {
    return 'Health & Beauty > Personal Care > Hair Care';
  }
  return 'Food, Beverages & Tobacco > Food Items';
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'xml';
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://vishnuhomeproducts.in').replace(/\/$/, '');

  const products = await getAllProducts();

  const feedItems: Array<{
    id: string;
    item_group_id: string;
    title: string;
    description: string;
    link: string;
    image_link: string;
    availability: string;
    price: string;
    sale_price: string;
    brand: string;
    condition: string;
    google_product_category: string;
    product_type: string;
    mpn: string;
    unit_pricing_measure: string;
    shipping_price: string;
  }> = [];

  for (const product of products) {
    const sizes =
      product.sizes && product.sizes.length > 0
        ? product.sizes
        : [{ label: '300g', price: 120, mrp: 145 }];

    const rawImg = product.images?.[0] || '/logo.png';
    const imageLink = rawImg.startsWith('http') ? rawImg : `${baseUrl}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;

    for (const sz of sizes) {
      const cleanSize = sz.label.replace(/\s+/g, '').toUpperCase();
      const variantId = `VHP-${product.id.toUpperCase()}-${cleanSize}`;
      const mpn = `VHP-${product.slug.toUpperCase().slice(0, 12)}-${cleanSize}`;
      const sellingPrice = Number(sz.price || 120);
      const mrpPrice = Math.max(sellingPrice, Number(sz.mrp || sellingPrice));
      const shippingFee = sellingPrice >= 499 ? '0.00 INR' : '50.00 INR';

      feedItems.push({
        id: variantId,
        item_group_id: `VHP-GROUP-${product.id.toUpperCase()}`,
        title: `${product.name} (${sz.label}) — Authentic Mangalore Homemade | Vishnu Home Products`,
        description: `${product.description} Ingredients: ${product.ingredients || '100% Natural Homemade Ingredients, Zero Preservatives'}. FSSAI Certified (Lic: 21223181000014).`,
        link: `${baseUrl}/product/${product.slug}?size=${encodeURIComponent(sz.label)}`,
        image_link: imageLink,
        availability: product.in_stock ? 'in_stock' : 'out_of_stock',
        price: `${mrpPrice.toFixed(2)} INR`,
        sale_price: `${sellingPrice.toFixed(2)} INR`,
        brand: product.brand || 'Vishnu Home Products',
        condition: 'new',
        google_product_category: getGoogleProductCategory(product.category),
        product_type: `Home > ${product.category} > ${product.name}`,
        mpn,
        unit_pricing_measure: sz.label.replace(/([0-9]+)([a-zA-Z]+)/, '$1 $2'),
        shipping_price: shippingFee,
      });
    }
  }

  if (format === 'json') {
    return NextResponse.json({
      channel: 'Vishnu Home Products — Google Merchant Center Feed',
      link: baseUrl,
      total_variants: feedItems.length,
      generated_at: new Date().toISOString(),
      items: feedItems,
    });
  }

  const xmlItems = feedItems
    .map(
      (item) => `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:item_group_id>${escapeXml(item.item_group_id)}</g:item_group_id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.image_link)}</g:image_link>
      <g:availability>${escapeXml(item.availability)}</g:availability>
      <g:price>${escapeXml(item.price)}</g:price>
      <g:sale_price>${escapeXml(item.sale_price)}</g:sale_price>
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:condition>${escapeXml(item.condition)}</g:condition>
      <g:google_product_category>${escapeXml(item.google_product_category)}</g:google_product_category>
      <g:product_type>${escapeXml(item.product_type)}</g:product_type>
      <g:mpn>${escapeXml(item.mpn)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:unit_pricing_measure>${escapeXml(item.unit_pricing_measure)}</g:unit_pricing_measure>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Pan-India Express</g:service>
        <g:price>${escapeXml(item.shipping_price)}</g:price>
        <g:min_handling_time>1</g:min_handling_time>
        <g:max_handling_time>2</g:max_handling_time>
        <g:min_transit_time>2</g:min_transit_time>
        <g:max_transit_time>5</g:max_transit_time>
      </g:shipping>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Vishnu Home Products — Official Google Shopping Feed</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Authentic Mangalorean Homemade Pickles, Thokkus, Spices, Dry Fish &amp; Ayurvedic Wellness. FSSAI Lic: 21223181000014.</description>
${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

