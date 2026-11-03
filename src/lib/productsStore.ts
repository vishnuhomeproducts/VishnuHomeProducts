import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { createAdminClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

// Global cache for hot-reload persistence
declare global {
  var __vishnu_products_catalog: Product[] | undefined;
}

// In-Memory TTL Cache to eliminate 95%+ of repeated database hits and prevent limit exhaustion
interface CacheEntry {
  timestamp: number;
  data: any[];
}
const MEMORY_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function getCachedProducts(cacheKey: string): any[] | null {
  const cached = MEMORY_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

export function setCachedProducts(cacheKey: string, data: any[]): void {
  MEMORY_CACHE.set(cacheKey, { timestamp: Date.now(), data });
}

export function invalidateProductsCache(): void {
  MEMORY_CACHE.clear();
}

const DATA_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'vishnu_products_catalog.json')
  : path.join(process.cwd(), '.next', 'vishnu_products_catalog.json');

function loadPersistedProducts(): Product[] {
  if (global.__vishnu_products_catalog && global.__vishnu_products_catalog.length > 0) {
    return global.__vishnu_products_catalog;
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__vishnu_products_catalog = parsed;
        return parsed;
      }
    }
  } catch (e) {
    // Ignore filesystem read errors
  }

  global.__vishnu_products_catalog = [...SAMPLE_PRODUCTS];
  return global.__vishnu_products_catalog;
}

function persistProducts(products: Product[]) {
  global.__vishnu_products_catalog = products;
  invalidateProductsCache();
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
  } catch (e) {
    // Ignore filesystem write errors
  }
}

export async function getAllProducts(): Promise<Product[]> {
  // 1. Try reading from Supabase if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        // Map database records to Product type
        const dbProducts: Product[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: row.description || '',
          ingredients: row.ingredients || '',
          storage: row.storage || '',
          category: row.category || 'Pickles & Thokkus',
          brand: row.brand || 'Vishnu Home Products',
          emoji: row.emoji || '🥣',
          images: Array.isArray(row.images) ? row.images : [row.image_url || '/images/products/placeholder.jpg'],
          sizes: Array.isArray(row.sizes) ? row.sizes : [
            { label: '500g', price: Number(row.price) || 190, mrp: Number(row.mrp) || 230 }
          ],
          badge: row.badge,
          is_featured: Boolean(row.is_featured),
          in_stock: row.in_stock !== false,
          sort_order: Number(row.sort_order) || 99,
          rating: Number(row.rating) || 4.9,
          review_count: Number(row.review_count) || 20,
        }));

        persistProducts(dbProducts);
        return dbProducts;
      }
    } catch (e) {
      // Fallback gracefully to memory
    }
  }

  // 2. Return cached or seeded products
  return loadPersistedProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find(p => p.slug === slug || p.id === slug);
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const products = await getAllProducts();
  const name = productData.name?.trim() || 'New Homemade Product';
  const slug = productData.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const id = productData.id || `prod-${Date.now().toString().slice(-6)}`;

  const newProduct: Product = {
    id,
    name,
    slug,
    description: productData.description || 'Authentic Mangalorean homemade recipe prepared with cold-pressed oils and traditional spices.',
    ingredients: productData.ingredients || 'Hand-selected spices, Rock Salt, Cold-Pressed Oil.',
    storage: productData.storage || 'Store in a cool dry place away from direct sunlight.',
    category: productData.category || 'Pickles & Thokkus',
    brand: productData.brand || 'Vishnu Home Products',
    emoji: productData.emoji || '🥣',
    images: productData.images && productData.images.length > 0 ? productData.images : ['/images/products/placeholder.jpg'],
    sizes: productData.sizes && productData.sizes.length > 0 ? productData.sizes : [
      { label: '300g', price: 120, mrp: 145 },
      { label: '500g', price: 190, mrp: 230 },
    ],
    badge: productData.badge || undefined,
    is_featured: productData.is_featured ?? false,
    in_stock: productData.in_stock ?? true,
    sort_order: productData.sort_order || products.length + 1,
    rating: productData.rating || 4.9,
    review_count: productData.review_count || 12,
  };

  const updatedList = [newProduct, ...products.filter(p => p.id !== id && p.slug !== slug)];
  persistProducts(updatedList);

  // Attempt to write to Supabase
  try {
    const supabase = createAdminClient();
    await supabase.from('products').upsert({
      id: newProduct.id,
      name: newProduct.name,
      slug: newProduct.slug,
      description: newProduct.description,
      ingredients: newProduct.ingredients,
      storage: newProduct.storage,
      category: newProduct.category,
      sizes: newProduct.sizes,
      in_stock: newProduct.in_stock,
      images: newProduct.images,
      badge: newProduct.badge,
    });
  } catch (e) {
    // Non-fatal fallback
  }

  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getAllProducts();
  const index = products.findIndex(p => p.id === id || p.slug === id);
  if (index === -1) return null;

  const updatedProduct = {
    ...products[index],
    ...updates,
  };

  products[index] = updatedProduct;
  persistProducts([...products]);

  // Sync to Supabase
  try {
    const supabase = createAdminClient();
    await supabase.from('products').update({
      ...updates,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
  } catch (e) {
    // Non-fatal
  }

  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getAllProducts();
  const filtered = products.filter(p => p.id !== id && p.slug !== id);
  persistProducts(filtered);

  try {
    const supabase = createAdminClient();
    await supabase.from('products').delete().eq('id', id);
  } catch (e) {
    // Non-fatal
  }

  return true;
}

export async function bulkImportProducts(rawList: Array<Partial<Product>>): Promise<{ importedCount: number; products: Product[] }> {
  const existing = await getAllProducts();
  const existingBySlug = new Map(existing.map(p => [p.slug, p]));
  const existingByName = new Map(existing.map(p => [p.name.toLowerCase().trim(), p]));

  let count = 0;
  for (const item of rawList) {
    if (!item.name || !item.name.trim()) continue;
    
    const name = item.name.trim();
    const slug = item.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const match = existingBySlug.get(slug) || existingByName.get(name.toLowerCase());
    const id = match ? match.id : (item.id || `prod-bulk-${Date.now().toString().slice(-4)}-${count}`);

    const resolvedProduct: Product = {
      id,
      name,
      slug,
      description: item.description?.trim() || match?.description || 'Authentic Mangalore homemade delicacy prepared with traditional spices.',
      ingredients: item.ingredients?.trim() || match?.ingredients || 'Natural spices, Rock Salt, Cold-Pressed Oil.',
      storage: item.storage?.trim() || match?.storage || 'Store in a cool dry place.',
      category: item.category?.trim() || match?.category || 'Pickles & Thokkus',
      brand: 'Vishnu Home Products',
      emoji: item.emoji || match?.emoji || '🥣',
      images: item.images && item.images.length > 0 ? item.images : (match?.images || ['/images/products/placeholder.jpg']),
      sizes: item.sizes && item.sizes.length > 0 ? item.sizes : (match?.sizes || [
        { label: '300g', price: 120, mrp: 145 },
        { label: '500g', price: 190, mrp: 230 },
      ]),
      badge: item.badge || match?.badge || undefined,
      is_featured: item.is_featured ?? match?.is_featured ?? false,
      in_stock: item.in_stock ?? match?.in_stock ?? true,
      sort_order: item.sort_order || existing.length + count + 1,
      rating: match?.rating || 4.9,
      review_count: match?.review_count || 15,
    };

    existingBySlug.set(slug, resolvedProduct);
    count++;
  }

  const merged = Array.from(existingBySlug.values());
  persistProducts(merged);

  return { importedCount: count, products: merged };
}
