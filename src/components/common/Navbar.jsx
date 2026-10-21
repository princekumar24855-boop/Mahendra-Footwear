import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../utils/formatters';

export default function Navbar({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
}) {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleCategoryClick = (category) => {
    onSelectCategory(category);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCategoryClick('all')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-md group-hover:bg-brand-600 transition-colors">
                <span className="font-display font-extrabold text-xl tracking-tighter">MF</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-stone-900 uppercase group-hover:text-brand-600 transition-colors leading-none">
                  {settings.shopName || 'Mahendra Footwear'}
                </span>
                <span className="text-[11px] font-medium tracking-widest text-stone-500 uppercase mt-1">
                  Quality • Comfort • Trust
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeCategory === 'all'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              All Shoes
            </button>

            {/* Men's dropdown / links */}
            <div className="relative group">
              <button
                className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                  activeCategory === "Men's Shoes" || activeCategory === "Men's Slippers"
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50'
                }`}
              >
                <span>Men</span>
                <ChevronDown className="w-4 h-4 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 w-48 bg-white border border-stone-200 rounded-xl shadow-card py-2 hidden group-hover:block transition-all animate-fadeIn">
                <button
                  onClick={() => handleCategoryClick("Men's Shoes")}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors ${
                    activeCategory === "Men's Shoes" ? 'text-brand-600 font-semibold bg-brand-50/50' : 'text-stone-700'
                  }`}
                >
                  Men's Shoes
                </button>
                <button
                  onClick={() => handleCategoryClick("Men's Slippers")}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors ${
                    activeCategory === "Men's Slippers" ? 'text-brand-600 font-semibold bg-brand-50/50' : 'text-stone-700'
                  }`}
                >
                  Men's Slippers
                </button>
              </div>
            </div>

            {/* Ladies' dropdown / links */}
            <div className="relative group">
              <button
                className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                  activeCategory === "Ladies' Sandals" || activeCategory === "Ladies' Slippers"
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50'
                }`}
              >
                <span>Ladies</span>
                <ChevronDown className="w-4 h-4 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 w-52 bg-white border border-stone-200 rounded-xl shadow-card py-2 hidden group-hover:block transition-all animate-fadeIn">
                <button
                  onClick={() => handleCategoryClick("Ladies' Sandals")}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors ${
                    activeCategory === "Ladies' Sandals" ? 'text-brand-600 font-semibold bg-brand-50/50' : 'text-stone-700'
                  }`}
                >
                  Ladies' Sandals
                </button>
                <button
                  onClick={() => handleCategoryClick("Ladies' Slippers")}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors ${
                    activeCategory === "Ladies' Slippers" ? 'text-brand-600 font-semibold bg-brand-50/50' : 'text-stone-700'
                  }`}
                >
                  Ladies' Slippers
                </button>
              </div>
            </div>

            {/* Offers Filter */}
            <button
              onClick={() => handleCategoryClick('offers')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                activeCategory === 'offers'
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Special Offers</span>
            </button>
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search shoes, sandals, slippers..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 hover:bg-stone-150 focus:bg-white border border-stone-200 focus:border-stone-900 rounded-full focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 relative transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100 relative transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Entry Button */}
            <button
              onClick={onOpenAdmin}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                isAuthenticated
                  ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-stone-900 hover:text-stone-950'
              }`}
              title="Admin Panel"
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>{isAuthenticated ? 'Admin Panel' : 'Staff Login'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-stone-100 animate-fadeIn">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search footwear..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <div className="font-semibold text-xs text-stone-400 uppercase tracking-wider px-2 pt-2">
            Categories
          </div>
          <button
            onClick={() => handleCategoryClick('all')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              activeCategory === 'all' ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-stone-800'
            }`}
          >
            All Footwear
          </button>
          <button
            onClick={() => handleCategoryClick("Men's Shoes")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              activeCategory === "Men's Shoes" ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-stone-800'
            }`}
          >
            Men's Shoes
          </button>
          <button
            onClick={() => handleCategoryClick("Men's Slippers")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              activeCategory === "Men's Slippers" ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-stone-800'
            }`}
          >
            Men's Slippers
          </button>
          <button
            onClick={() => handleCategoryClick("Ladies' Sandals")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              activeCategory === "Ladies' Sandals" ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-stone-800'
            }`}
          >
            Ladies' Sandals
          </button>
          <button
            onClick={() => handleCategoryClick("Ladies' Slippers")}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
              activeCategory === "Ladies' Slippers" ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-stone-800'
            }`}
          >
            Ladies' Slippers
          </button>
          <button
            onClick={() => handleCategoryClick('offers')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
              activeCategory === 'offers' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-rose-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Special Offers & Discounts
          </button>

          <div className="pt-3 border-t border-stone-150">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 text-white font-semibold text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Staff Admin Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
