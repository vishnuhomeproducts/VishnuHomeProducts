'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Filter } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/data/sampleProducts';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown, SortOption } from '@/components/shop/SortDropdown';
import { ProductGrid } from '@/components/shop/ProductGrid';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const itemsPerPage = 8;

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((product) => {
      // Category check
      if (
        selectedCategory !== 'all' &&
        product.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Search query check
      if (searchQuery) {
        const matchName = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDesc = product.description.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchName && !matchDesc) return false;
      }

      // Price check (based on the primary size price)
      const lowestPrice = product.sizes?.[0]?.price || 0;
      if (lowestPrice > maxPrice) {
        return false;
      }

      // In stock check
      if (inStockOnly && !product.in_stock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.sizes?.[0]?.price || 0;
      const priceB = b.sizes?.[0]?.price || 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return (b.sort_order || 0) - (a.sort_order || 0);
      return (a.sort_order || 0) - (b.sort_order || 0); // popular default
    });
  }, [selectedCategory, searchQuery, maxPrice, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isFiltersActive =
    selectedCategory !== 'all' || maxPrice < 600 || inStockOnly || !!searchQuery;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(600);
    setInStockOnly(false);
    setSortBy('popular');
    setCurrentPage(1);
  };

  return (
    <div className="py-8 bg-brandBg min-h-screen">
      <div className="max-w-site mx-auto px-4 space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-brandText3">
          <Link href="/" className="hover:text-brandAccent transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brandText font-semibold">Shop</span>
          {selectedCategory !== 'all' && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-brandAccent font-semibold">{selectedCategory}</span>
            </>
          )}
          {searchQuery && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-brandText2">Search: "{searchQuery}"</span>
            </>
          )}
        </nav>

        {/* Page Title & Mobile Filter Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brandBorder">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-brandText">
              {selectedCategory === 'all' ? 'All Products' : selectedCategory}
            </h1>
            <p className="text-xs text-brandText2 mt-1">
              Showing {filteredProducts.length} authentic homemade items from Mangalore
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brandBorder rounded-button text-xs font-semibold text-brandText"
            >
              <Filter className="w-3.5 h-3.5 text-brandAccent" />
              <span>Filters {isFiltersActive && '•'}</span>
            </button>

            {/* Sort Dropdown */}
            <SortDropdown sortBy={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Mobile Filter Drawer / Collapsible */}
        {mobileFilterOpen && (
          <div className="lg:hidden pb-4">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setMobileFilterOpen(false);
              }}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onResetFilters={handleResetFilters}
              isFiltersActive={isFiltersActive}
            />
          </div>
        )}

        {/* 2-Column Main Layout: Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onResetFilters={handleResetFilters}
              isFiltersActive={isFiltersActive}
            />
          </div>

          {/* Product Grid & Pagination */}
          <div className="flex-1 w-full space-y-8">
            <ProductGrid
              products={paginatedProducts}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 border-t border-brandBorder flex items-center justify-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-button text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brandAccent text-white shadow-sm'
                          : 'bg-white border border-brandBorder text-brandText hover:border-brandAccent'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-brandText3">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
