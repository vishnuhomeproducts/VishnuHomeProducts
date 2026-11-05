'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Filter } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SortDropdown, SortOption } from '@/components/shop/SortDropdown';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { getProductCulinaryProfile } from '@/lib/utils';

type DietaryFilter = 'all' | 'veg' | 'no-onion-garlic' | 'fiery' | 'mild-tangy' | 'seafood';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const { products } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync category when URL param changes (e.g. clicking Navbar quick links)
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setCurrentPage(1);
  }, [initialCategory]);

  const itemsPerPage = 8;

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category check
      if (
        selectedCategory !== 'all' &&
        !product.category.toLowerCase().includes(selectedCategory.toLowerCase()) &&
        !selectedCategory.toLowerCase().includes(product.category.toLowerCase())
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

      // Culinary / Dietary / Spice-O-Meter filter check
      if (dietaryFilter !== 'all') {
        const profile = getProductCulinaryProfile(product);
        if (dietaryFilter === 'veg' && profile.dietary !== '100% Veg') return false;
        if (dietaryFilter === 'no-onion-garlic' && !profile.noOnionGarlic) return false;
        if (dietaryFilter === 'fiery' && profile.chilies < 3) return false;
        if (dietaryFilter === 'mild-tangy' && profile.chilies >= 3) return false;
        if (dietaryFilter === 'seafood' && profile.dietary !== 'Coastal Seafood') return false;
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
  }, [products, selectedCategory, dietaryFilter, searchQuery, maxPrice, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isFiltersActive =
    selectedCategory !== 'all' || dietaryFilter !== 'all' || maxPrice < 600 || inStockOnly || !!searchQuery;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setDietaryFilter('all');
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

        {/* Interactive Spice-O-Meter & Dietary Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: '✨ All Flavours' },
            { id: 'veg', label: '🌱 100% Pure Veg' },
            { id: 'no-onion-garlic', label: '🪔 No Onion / No Garlic' },
            { id: 'fiery', label: '🌶️🌶️🌶️ Fiery Coastal' },
            { id: 'mild-tangy', label: '🥣 Mild & Tangy' },
            { id: 'seafood', label: '🐟 Coastal Dry Fish' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                setDietaryFilter(pill.id as DietaryFilter);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                dietaryFilter === pill.id
                  ? 'bg-brandRed text-white border-brandRed shadow-xs'
                  : 'bg-white text-brandText2 border-brandBorder hover:border-brandRed/50'
              }`}
            >
              {pill.label}
            </button>
          ))}
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
