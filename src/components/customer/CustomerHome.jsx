import React, { useState, useMemo } from 'react';
import HeroBanner from './HeroBanner';
import CategoryCards from './CategoryCards';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import { useProducts } from '../../context/ProductContext';
import { Sparkles, TrendingUp, Tag, AlertCircle } from 'lucide-react';

const PRICE_MAP = {
  all: { min: 0, max: Infinity },
  under_500: { min: 0, max: 500 },
  '500_1000': { min: 500, max: 1000 },
  '1000_2000': { min: 1000, max: 2000 },
  above_2000: { min: 2000, max: Infinity },
};

export default function CustomerHome({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onViewProductDetails,
}) {
  const { activeProducts, loading } = useProducts();

  const [priceRange, setPriceRange] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...activeProducts];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category / Offers filter
    if (activeCategory === 'offers') {
      list = list.filter((p) => (Number(p.discountPercentage) || 0) > 0);
    } else if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Price range
    const range = PRICE_MAP[priceRange] || PRICE_MAP.all;
    list = list.filter((p) => p.finalPrice >= range.min && p.finalPrice <= range.max);

    // Size filter
    if (selectedSize !== 'all') {
      list = list.filter((p) => Array.isArray(p.sizes) && p.sizes.includes(selectedSize));
    }

    // Only discounted
    if (onlyDiscounted) {
      list = list.filter((p) => (Number(p.discountPercentage) || 0) > 0);
    }

    // Only in stock
    if (onlyInStock) {
      list = list.filter((p) => (Number(p.stockQuantity) || 0) > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case 'price_desc':
        list.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'discount_desc':
        list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [
    activeProducts,
    searchQuery,
    activeCategory,
    priceRange,
    selectedSize,
    onlyDiscounted,
    onlyInStock,
    sortBy,
  ]);

  const handleResetFilters = () => {
    onSelectCategory('all');
    onSearchChange('');
    setPriceRange('all');
    setSelectedSize('all');
    setOnlyDiscounted(false);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  return (
    <div className="space-y-6">
      {/* Hero Showcase Banner */}
      <HeroBanner onSelectCategory={onSelectCategory} />

      {/* 4 Core Footwear Categories Highlight */}
      <CategoryCards
        activeCategory={activeCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Main Product Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              {activeCategory === 'all'
                ? 'Complete Footwear Collection'
                : activeCategory === 'offers'
                ? 'Discounted Deals'
                : activeCategory}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {activeCategory === 'all'
                ? 'All Shoes, Sandals & Slippers'
                : activeCategory === 'offers'
                ? 'Special Offers & Clearance Deals'
                : activeCategory}
            </h2>
          </div>

          <p className="text-xs text-stone-500 mt-1 sm:mt-0">
            Real-time stock sync with store inventory
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <ProductFilters
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          selectedPriceRange={priceRange}
          onSelectPriceRange={setPriceRange}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onlyDiscounted={onlyDiscounted}
          onToggleDiscounted={setOnlyDiscounted}
          onlyInStock={onlyInStock}
          onToggleInStock={setOnlyInStock}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          totalResults={filteredProducts.length}
        />

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 aspect-[4/5] animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="aspect-square bg-stone-150 rounded-xl mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                No Footwear Found
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                We couldn&apos;t find any products matching your selected category, size, or price range.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewDetails={onViewProductDetails}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
