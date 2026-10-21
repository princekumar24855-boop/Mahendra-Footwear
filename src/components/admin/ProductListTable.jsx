import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency, getStockStatus, CATEGORIES } from '../../utils/formatters';

export default function ProductListTable({
  onAddNewProduct,
  onEditProduct,
  onDeleteRequest,
}) {
  const { products, updateProduct, updateStock } = useProducts();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = (p.description || '').toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // Category
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false;
      }

      // Stock filter
      const stock = Number(p.stockQuantity) || 0;
      if (stockFilter === 'out_of_stock' && stock > 0) return false;
      if (stockFilter === 'low_stock' && (stock <= 0 || stock > 5)) return false;
      if (stockFilter === 'in_stock' && stock <= 0) return false;
      if (stockFilter === 'inactive' && p.isActive !== false) return false;

      return true;
    });
  }, [products, search, categoryFilter, stockFilter]);

  const handleToggleActive = async (product) => {
    await updateProduct(product.id, { isActive: !product.isActive });
  };

  const handleToggleFeatured = async (product) => {
    await updateProduct(product.id, { isFeatured: !product.isFeatured });
  };

  const handleStockAdjust = async (product, delta) => {
    const current = Number(product.stockQuantity) || 0;
    const updated = Math.max(0, current + delta);
    await updateStock(product.id, updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-soft overflow-hidden animate-fadeIn space-y-4">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-stone-150 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-stone-900">
            Product Inventory Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Total {products.length} footwear items registered in database
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-5 pb-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by footwear name, brand or keywords..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Stock Status Dropdown */}
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none"
        >
          <option value="all">All Inventory Status</option>
          <option value="in_stock">In Stock (&gt; 0)</option>
          <option value="low_stock">Low Stock (1 – 5)</option>
          <option value="out_of_stock">Out of Stock (0)</option>
          <option value="inactive">Inactive / Hidden</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-stone-50 border-y border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Product Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Pricing & Discount</th>
              <th className="py-3 px-4">Stock & Sizing</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-150">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-stone-500">
                  No footwear found matching the current search or filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const stock = getStockStatus(p.stockQuantity);

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-stone-50/70 transition-colors ${
                      p.isActive === false ? 'opacity-60 bg-stone-50/30' : ''
                    }`}
                  >
                    {/* Product Name & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl || '/placeholder-shoe.svg'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                        />
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-bold text-stone-900 text-sm truncate">{p.name}</h4>
                          <span className="text-[11px] text-stone-400 font-mono">ID: {p.id.slice(0, 10)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-semibold text-stone-700 whitespace-nowrap">
                      {p.category}
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-stone-900 text-sm">
                            {formatCurrency(p.finalPrice)}
                          </span>
                          {p.hasDiscount && (
                            <span className="text-stone-400 line-through text-[11px]">
                              {formatCurrency(p.originalPrice)}
                            </span>
                          )}
                        </div>

                        {p.hasDiscount ? (
                          <span className="inline-block bg-brand-50 text-brand-700 font-bold text-[10px] px-1.5 py-0.5 rounded border border-brand-200">
                            {p.discountPercentage}% OFF (Save {formatCurrency(p.savings)})
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[10px]">No discount</span>
                        )}
                      </div>
                    </td>

                    {/* Stock & Quick Adjust */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${stock.badgeClass}`}>
                            {p.stockQuantity} pairs
                          </span>

                          {/* Quick Inc / Dec */}
                          <button
                            onClick={() => handleStockAdjust(p, -1)}
                            disabled={p.stockQuantity <= 0}
                            className="text-stone-400 hover:text-stone-900 disabled:opacity-30"
                            title="Decrease stock by 1"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p, 1)}
                            className="text-stone-400 hover:text-stone-900"
                            title="Increase stock by 1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Sizes */}
                        <div className="text-[10px] text-stone-500">
                          Sizes: {p.sizes && p.sizes.length > 0 ? p.sizes.join(', ') : 'None specified'}
                        </div>
                      </div>
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          p.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                        }`}
                        title="Toggle customer visibility"
                      >
                        {p.isActive !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{p.isActive !== false ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-stone-300 hover:text-stone-500'
                        }`}
                        title="Toggle homepage featured status"
                      >
                        <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors"
                          title="Edit product details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRequest(p)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-stone-400 hover:text-rose-600 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
