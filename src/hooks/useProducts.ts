'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';

let cachedLiveProducts: Product[] | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cachedLiveProducts || SAMPLE_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedLiveProducts);

  const refreshProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          cachedLiveProducts = data.products;
          setProducts(data.products);
        }
      }
    } catch (e) {
      // Keep fallback SAMPLE_PRODUCTS on network error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return {
    products,
    isLoading,
    refreshProducts,
  };
}

