import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under_500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500_1000', label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { id: '1000_2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { id: 'above_2000', label: 'Above ₹2,000', min: 2000, max: Infinity },
];

const AVAILABLE_SIZES = ['4', '5', '6', '7', '8', '9', '10', '11'];

export default function ProductFilters({
  activeCategory,
  onSelectCategory,
  selectedPriceRange,
  onSelectPriceRange,
  selectedSize,
  onSelectSize,
  onlyDiscounted,
  onToggleDiscounted,
  onlyInStock,
  onToggleInStock,
  sortBy,
  onSortChange,
  onResetFilters,
  totalResults,
}) {
  const hasActiveFilters =
    activeCategory !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedSize !== 'all' ||
    onlyDiscounted ||
    onlyInStock;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-soft mb-8 space-y-4">
      {/* Top Filter Bar: Category Tabs & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-150">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Collections
          </button>
          <button
            onClick={() => onSelectCategory("Men's Shoes")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === "Men's Shoes"
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Men&apos;s Shoes
          </button>
          <button
            onClick={() => onSelectCategory("Men's Slippers")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === "Men's Slippers"
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Men&apos;s Slippers
          </button>
          <button
            onClick={() => onSelectCategory("Ladies' Sandals")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === "Ladies' Sandals"
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Ladies&apos; Sandals
          </button>
          <button
            onClick={() => onSelectCategory("Ladies' Slippers")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === "Ladies' Slippers"
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Ladies&apos; Slippers
          </button>
          <button
            onClick={() => onSelectCategory('offers')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
              activeCategory === 'offers'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Discounts</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          <label htmlFor="sort-select" className="text-xs text-stone-500 font-medium">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs font-semibold bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-stone-900"
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="discount_desc">Highest Discount</option>
          </select>
        </div>
      </div>

      {/* Secondary Filter Row: Price Range, Sizes, Toggles, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap items-center gap-3">
          {/* Price Range Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Price:</span>
            <select
              value={selectedPriceRange}
              onChange={(e) => onSelectPriceRange(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              {PRICE_RANGES.map((pr) => (
                <option key={pr.id} value={pr.id}>
                  {pr.label}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Size:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSelectSize('all')}
                className={`w-6 h-6 text-[10px] font-bold rounded ${
                  selectedSize === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All
              </button>
              {AVAILABLE_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => onSelectSize(selectedSize === s ? 'all' : s)}
                  className={`w-6 h-6 text-[10px] font-bold rounded ${
                    selectedSize === s
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Toggles */}
          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyDiscounted}
              onChange={(e) => onToggleDiscounted(e.target.checked)}
              className="rounded border-stone-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
            />
            <span>On Discount</span>
          </label>

          <label className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => onToggleInStock(e.target.checked)}
              className="rounded border-stone-300 text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
            />
            <span>In-Stock Only</span>
          </label>
        </div>

        {/* Results Count & Reset Button */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-stone-500">
            Showing <strong className="text-stone-900">{totalResults}</strong> {totalResults === 1 ? 'footwear' : 'footwears'}
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
