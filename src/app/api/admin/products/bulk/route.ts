import { NextResponse } from 'next/server';
import { bulkImportProducts, invalidateProductsCache } from '@/lib/productsStore';

export async function POST(req: Request) {
  try {
    const { products } = await req.json();
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'Payload must contain a non-empty array of products' }, { status: 400 });
    }

    const result = await bulkImportProducts(products);
    invalidateProductsCache();

    return NextResponse.json({
      success: true,
      importedCount: result.importedCount,
      totalCatalogCount: result.products.length,
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error.message || 'Bulk import failed' }, { status: 500 });
  }
}
