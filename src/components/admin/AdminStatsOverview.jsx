import React from 'react';
import {
  Package,
  AlertOctagon,
  Sparkles,
  Layers,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency, getStockStatus } from '../../utils/formatters';

export default function AdminStatsOverview({ onSelectTab, onEditProduct }) {
  const { products, stats, updateStock } = useProducts();

  const handleQuickAddStock = async (e, productId, currentStock) => {
    e.stopPropagation();
    await updateStock(productId, currentStock + 5);
  };

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Products */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Active Inventory
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{stats.active}</span>
            <span className="text-xs text-stone-400">/ {stats.total} total</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Live & visible to customers</p>
        </div>

        {/* Out of Stock Alert */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black ${stats.outOfStock > 0 ? 'text-rose-600' : 'text-stone-900'}`}>
              {stats.outOfStock}
            </span>
            <span className="text-xs text-stone-400">products</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Ordering automatically blocked</p>
        </div>

        {/* Discounted Offers */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Active Discounts
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{stats.discounted}</span>
            <span className="text-xs text-stone-400">discounted</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Promotional discount badges</p>
        </div>

        {/* Categories Count */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Categories
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">4</span>
            <span className="text-xs text-stone-400">departments</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Men & Ladies categories</p>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-soft">
        <h3 className="font-display font-bold text-base text-stone-900 mb-4">
          Inventory Distribution By Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.byCategory).map(([catName, count]) => (
            <div
              key={catName}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between"
            >
              <span className="text-xs font-semibold text-stone-600">{catName}</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-black text-stone-900">{count}</span>
                <span className="text-xs text-stone-400">items</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Warning Section (≤ 5 pairs) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  Low Stock Alert ({stats.lowStock.length})
                </h3>
                <p className="text-xs text-stone-500">Products with 5 or fewer items remaining</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('products')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.lowStock.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl text-stone-500 text-xs">
              All active footwear items have adequate stock levels!
            </div>
          ) : (
            <div className="divide-y divide-stone-150">
              {stats.lowStock.map((prod) => (
                <div
                  key={prod.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/50 rounded-lg px-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-stone-900 truncate">{prod.name}</h4>
                      <div className="text-[11px] text-stone-500">{prod.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      {prod.stockQuantity} left
                    </span>
                    <button
                      onClick={(e) => handleQuickAddStock(e, prod.id, prod.stockQuantity)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
                      title="Quick add +5 pairs to stock"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+5</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Products */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-stone-900">
              Recently Added Products
            </h3>
            <button
              onClick={() => onSelectTab('products')}
              className="text-xs font-bold text-stone-600 hover:text-stone-900"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onEditProduct(prod)}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer border border-transparent hover:border-stone-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 truncate">{prod.name}</h4>
                    <span className="text-[11px] font-semibold text-brand-600">
                      {formatCurrency(prod.finalPrice)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      prod.isActive !== false ? 'bg-emerald-500' : 'bg-stone-300'
                    }`}
                  />
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
