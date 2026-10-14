import { NextResponse } from 'next/server';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    // Try fetching from Supabase
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
        return NextResponse.json({ products: data });
      }
    } catch (e) {
      // Fallback to sample static data
    }

    // Filter sample products
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

    return NextResponse.json({ products: filtered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
