import React, { useState } from 'react';
import {
  MessageCircle,
  Heart,
  Eye,
  ShoppingBag,
  Check,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, getStockStatus } from '../../utils/formatters';
import { generateProductWhatsAppLink } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onViewDetails, onDirectOrderAlert }) {
  const { settings } = useSettings();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(() => {
    return product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
  });

  const [addedAnimation, setAddedAnimation] = useState(false);

  const stockInfo = getStockStatus(product.stockQuantity);
  const isWishlisted = isInWishlist(product.id);

  const handleWhatsAppOrder = (e) => {
    e.stopPropagation();
    if (!stockInfo.isAvailable) return;

    const linkData = generateProductWhatsAppLink({
      whatsappNumber: settings.whatsappNumber,
      product,
      size: selectedSize,
      quantity: 1,
    });

    if (linkData.isValid) {
      window.open(linkData.url, '_blank', 'noopener,noreferrer');
    } else {
      if (onDirectOrderAlert) {
        onDirectOrderAlert(linkData.message);
      } else {
        alert(linkData.message);
      }
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!stockInfo.isAvailable) return;

    addToCart(product, selectedSize, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={product.imageUrl || '/placeholder-shoe.svg'}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            !stockInfo.isAvailable ? 'grayscale opacity-60' : ''
          }`}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Top Badges (Discount, Featured, Out of Stock) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {!stockInfo.isAvailable && (
            <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
              Out of Stock
            </span>
          )}

          {stockInfo.isAvailable && product.hasDiscount && (
            <span className="bg-brand-600 text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded shadow">
              {product.discountPercentage}% OFF
            </span>
          )}

          {stockInfo.isAvailable && product.isFeatured && (
            <span className="bg-stone-900 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded shadow">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:text-rose-500 shadow-sm transition-all hover:scale-110 z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Stock Status Badge */}
        <div className="absolute bottom-2.5 left-2.5">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${stockInfo.badgeClass}`}
          >
            {stockInfo.label}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category */}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="font-display font-bold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors mt-0.5">
            {product.name}
          </h3>

          {/* Price Breakdown */}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-extrabold text-stone-900">
              {formatCurrency(product.finalPrice)}
            </span>

            {product.hasDiscount && (
              <>
                <span className="text-xs text-stone-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  Save {formatCurrency(product.savings)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Available Sizes selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="space-y-1 pt-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span>Size (UK/IND):</span>
              <span className="font-medium text-stone-700">{selectedSize || 'Choose'}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`w-7 h-7 text-xs font-semibold rounded-md border transition-all ${
                    selectedSize === size
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons: WhatsApp & Details / Cart */}
        <div className="pt-2 flex flex-col gap-2">
          {stockInfo.isAvailable ? (
            <div className="grid grid-cols-2 gap-2">
              {/* Order on WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-emerald-300"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span className="truncate">WhatsApp</span>
              </button>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-stone-300"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="truncate">Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full py-2 px-3 bg-stone-150 text-stone-400 text-xs font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Unavailable / Sold Out</span>
            </button>
          )}

          {/* View Details link */}
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="w-full text-center text-[11px] font-semibold text-stone-500 hover:text-stone-900 transition-colors py-1 flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span>View Full Details & Photos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
