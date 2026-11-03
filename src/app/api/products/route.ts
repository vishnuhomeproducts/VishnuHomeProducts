import { NextResponse } from 'next/server';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { createClient } from '@/lib/supabase/server';

// In-Memory TTL Cache to eliminate 95%+ of repeated Supabase hits and prevent limit exhaustion
interface CacheEntry {
  timestamp: number;
  data: any[];
}
const MEMORY_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('q') || '';
    const cacheKey = `${category.toLowerCase()}:${query.toLowerCase()}`;

    // Check memory cache first
    const cached = MEMORY_CACHE.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(
        { products: cached.data, cached: true },
        { headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
      );
    }

    // Try fetching from Supabase if configured
    let products: any[] | null = null;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createClient();
        let queryBuilder = supabase.from('products').select('*');

        if (category && category !== 'all') {
          queryBuilder = queryBuilder.eq('category', category);
        }
        if (query) {
          queryBuilder = queryBuilder.ilike('name', `%${query}%`);
        }

        const { data, error } = await queryBuilder;
        if (data && data.length > 0 && !error) {
          products = data;
        }
      } catch (e) {
        // Fallback gracefully without throwing
      }
    }

    // Resilient Fallback to sample static data if database is not configured, sleeping or limit reached
    if (!products) {
      let filtered = [...SAMPLE_PRODUCTS];
      if (category && category !== 'all') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }
      if (query) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      products = filtered;
    }

    // Save to memory cache
    MEMORY_CACHE.set(cacheKey, { timestamp: now, data: products });

    return NextResponse.json(
      { products, cached: false },
      { headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
