'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/shop/ProductCard';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onResetFilters }) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-card border border-brandBorder p-12 text-center space-y-4">
        <div className="text-4xl">🔍</div>
        <h3 className="font-semibold text-brandText text-base">No products match your filters</h3>
        <p className="text-xs text-brandText2 max-w-sm mx-auto">
          Try clearing some filters or changing the price range to explore more homemade treats.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-semibold bg-brandAccent text-white rounded-button hover:bg-brandAccent-mid transition-colors shadow-sm"
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
