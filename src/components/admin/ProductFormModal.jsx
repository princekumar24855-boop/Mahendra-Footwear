import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { calculatePricing, validatePricingInputs } from '../../utils/pricing';
import { formatCurrency, CATEGORIES } from '../../utils/formatters';
import { uploadProductImage } from '../../services/storageService';

const ALL_SIZES = ['4', '5', '6', '7', '8', '9', '10', '11'];

export default function ProductFormModal({ product, isOpen, onClose, onSave }) {
  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: "Men's Shoes",
    originalPrice: '',
    discountPercentage: 0,
    stockQuantity: 10,
    sizes: ['6', '7', '8', '9', '10'],
    imageUrl: '',
    additionalImageUrls: [],
    isActive: true,
    isFeatured: false,
  });

  const [uploadProgress, setUploadProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || "Men's Shoes",
        originalPrice: product.originalPrice !== undefined ? product.originalPrice : '',
        discountPercentage: product.discountPercentage !== undefined ? product.discountPercentage : 0,
        stockQuantity: product.stockQuantity !== undefined ? product.stockQuantity : 10,
        sizes: Array.isArray(product.sizes) ? [...product.sizes] : ['6', '7', '8', '9', '10'],
        imageUrl: product.imageUrl || '',
        additionalImageUrls: Array.isArray(product.additionalImageUrls) ? [...product.additionalImageUrls] : [],
        isActive: product.isActive !== false,
        isFeatured: Boolean(product.isFeatured),
      });
    } else {
      // Default new product form
      setFormData({
        name: '',
        description: '',
        category: "Men's Shoes",
        originalPrice: '',
        discountPercentage: 0,
        stockQuantity: 10,
        sizes: ['6', '7', '8', '9', '10'],
        imageUrl: '',
        additionalImageUrls: [],
        isActive: true,
        isFeatured: false,
      });
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Real-time calculated pricing preview
  const pricing = calculatePricing(formData.originalPrice, formData.discountPercentage);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleCategoryChange = (newCat) => {
    const catObj = CATEGORIES.find((c) => c.id === newCat);
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      sizes: catObj ? [...catObj.defaultSizes] : prev.sizes,
    }));
  };

  const handleToggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const updated = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size].sort();
      return { ...prev, sizes: updated };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const url = await uploadProductImage(file, (p) => setUploadProgress(p));
      handleInputChange('imageUrl', url);
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const validation = validatePricingInputs(
      formData.originalPrice,
      formData.discountPercentage,
      formData.stockQuantity
    );

    const validationErrors = { ...validation.errors };
    if (!formData.name.trim()) {
      validationErrors.name = 'Product name is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      await onSave({
        ...formData,
        originalPrice: Number(formData.originalPrice),
        discountPercentage: Number(formData.discountPercentage) || 0,
        stockQuantity: Number(formData.stockQuantity) || 0,
      });
      onClose();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-display font-bold text-xl text-stone-900">
              {isEditing ? 'Edit Footwear Product' : 'Add New Footwear Product'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Updates synchronize directly to customer storefront in real-time
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. Classic Derby Formal Leather Shoes"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              Category (Enforced) *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 font-medium"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.description}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing & Discount Grid with Live Calculator */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Pricing & Discount Calculation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original Price */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Original Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 font-semibold"
                />
                {errors.originalPrice && <p className="text-rose-600 text-xs mt-1">{errors.originalPrice}</p>}
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Discount Percentage (0 – 100%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2 pr-8 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 font-semibold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">%</span>
                </div>
                {errors.discountPercentage && <p className="text-rose-600 text-xs mt-1">{errors.discountPercentage}</p>}
              </div>
            </div>

            {/* Calculated Breakdown Card */}
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs space-y-1.5 shadow-sm">
              <div className="flex justify-between text-stone-600">
                <span>Original Price:</span>
                <span className="font-semibold">{formatCurrency(pricing.originalPrice)}</span>
              </div>
              {pricing.hasDiscount && (
                <>
                  <div className="flex justify-between text-brand-700">
                    <span>Discount Amount ({pricing.discountPercentage}%):</span>
                    <span className="font-semibold">-{formatCurrency(pricing.discountAmount)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Customer Savings:</span>
                    <span className="font-semibold">Save {formatCurrency(pricing.savings)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-1.5 border-t border-stone-100">
                <span>Calculated Selling Price:</span>
                <span className="text-base text-brand-600">{formatCurrency(pricing.finalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Stock Quantity & Sizing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 font-semibold"
              />
              {errors.stockQuantity && <p className="text-rose-600 text-xs mt-1">{errors.stockQuantity}</p>}
              <span className="text-[11px] text-stone-400">Set to 0 to automatically mark Out of Stock</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                Available Sizes (UK/IND)
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ALL_SIZES.map((size) => {
                  const isChecked = formData.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleToggleSize(size)}
                      className={`min-w-8 h-8 px-2 text-xs font-bold rounded-lg border transition-all ${
                        isChecked
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Image Upload / URL */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider">
              Product Main Image
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Preview Thumbnail */}
              <div className="sm:col-span-3 aspect-square rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center relative">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-stone-400" />
                )}
              </div>

              {/* Upload Controls & URL Input */}
              <div className="sm:col-span-9 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl cursor-pointer border border-stone-300 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {isUploading && (
                    <span className="text-xs text-brand-600 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Uploading ({uploadProgress}%)...
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="Or enter direct image URL (e.g. Unsplash or CDN)"
                    className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Comfortable full-grain leather, padded arch support, lightweight sole..."
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Visibility and Featured Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-stone-150">
            <label className="flex items-center gap-2 text-xs font-bold text-stone-900 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Active (Visible on Customer Website)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-stone-900 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Product Changes' : 'Create Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
