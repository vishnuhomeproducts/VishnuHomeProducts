'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';

let cachedLiveProducts: Product[] | null = null;
let lastFetchTimestamp = 0;
let inflightPromise: Promise<Product[] | null> | null = null;
const CLIENT_CACHE_TTL_MS = 60 * 1000; // 60 seconds client-side cache

async function fetchProductsDeduped(force = false): Promise<Product[] | null> {
  const now = Date.now();
  if (!force && cachedLiveProducts && now - lastFetchTimestamp < CLIENT_CACHE_TTL_MS) {
    return cachedLiveProducts;
  }

  if (inflightPromise) {
    return inflightPromise;
  }

  inflightPromise = fetch('/api/admin/products')
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        cachedLiveProducts = data.products;
        lastFetchTimestamp = Date.now();
        return data.products as Product[];
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cachedLiveProducts || SAMPLE_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshProducts = useCallback(async (force = false) => {
    const live = await fetchProductsDeduped(force);
    if (live) {
      setProducts(live);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshProducts(false);
  }, [refreshProducts]);

  return {
    products,
    isLoading,
    refreshProducts: () => refreshProducts(true),
  };
}
