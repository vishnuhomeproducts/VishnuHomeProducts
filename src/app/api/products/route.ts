import { NextResponse } from 'next/server';
import { getAllProducts, getCachedProducts, setCachedProducts } from '@/lib/productsStore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('q') || '';
    const cacheKey = `${category.toLowerCase()}:${query.toLowerCase()}`;

    // Check memory cache first
    const cachedData = getCachedProducts(cacheKey);
    if (cachedData) {
      return NextResponse.json(
        { products: cachedData, cached: true },
        { headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
      );
    }

    // Fetch from resilient product store (Supabase or persisted memory fallback)
    const all = await getAllProducts();

    let filtered = [...all];
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (query) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Save to memory cache
    setCachedProducts(cacheKey, filtered);

    return NextResponse.json(
      { products: filtered, cached: false },
      { headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
