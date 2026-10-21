import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { formatCurrency, getStockStatus } from '../../utils/formatters';
import { generateProductWhatsAppLink } from '../../utils/whatsapp';
import { useSettings } from '../../context/SettingsContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';

export default function ProductDetailModal({ product, onClose, onSelectRelatedProduct }) {
  const { settings } = useSettings();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { activeProducts } = useProducts();

  const [activeImage, setActiveImage] = useState(product?.imageUrl || '');
  const [selectedSize, setSelectedSize] = useState(() => {
    return product?.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
  });
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.imageUrl || '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const stockInfo = getStockStatus(product.stockQuantity);
  const isWishlisted = isInWishlist(product.id);
  const maxStock = Number(product.stockQuantity) || 0;

  // Additional images list
  const allImages = [
    product.imageUrl,
    ...(Array.isArray(product.additionalImageUrls) ? product.additionalImageUrls : []),
  ].filter(Boolean);

  // Related products in same category
  const related = activeProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleWhatsAppOrder = () => {
    if (!stockInfo.isAvailable) return;

    const linkData = generateProductWhatsAppLink({
      whatsappNumber: settings.whatsappNumber,
      product,
      size: selectedSize,
      quantity,
    });

    if (linkData.isValid) {
      window.open(linkData.url, '_blank', 'noopener,noreferrer');
    } else {
      alert(linkData.message);
    }
  };

  const handleAddToCart = () => {
    if (!stockInfo.isAvailable) return;
    addToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-stone-50 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-stone-200">
            {/* Main Active Image */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200/80 relative shadow-soft">
              <img
                src={activeImage || '/placeholder-shoe.svg'}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.hasDiscount && (
                <span className="absolute top-3 left-3 bg-brand-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="w-full flex items-center gap-2 pt-4 overflow-x-auto">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img ? 'border-brand-600 ring-2 ring-brand-100' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Note */}
            <div className="w-full pt-6 flex items-center justify-around text-xs text-stone-500 font-medium border-t border-stone-200/60 mt-4">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Original Product
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-stone-600" />
                Quick Delivery
              </span>
            </div>
          </div>

          {/* Right Column: Product Details & Purchase Form */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Wishlist */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                  <span>{isWishlisted ? 'In Wishlist' : 'Save to Wishlist'}</span>
                </button>
              </div>

              {/* Product Title */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                {product.name}
              </h2>

              {/* Price Block */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-stone-900">
                    {formatCurrency(product.finalPrice)}
                  </span>
                  {product.hasDiscount && (
                    <span className="text-base text-stone-400 line-through font-normal">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                {product.hasDiscount && (
                  <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-1">
                    <span>You save {formatCurrency(product.savings)} ({product.discountPercentage}% discount)</span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${stockInfo.badgeClass}`}>
                  {stockInfo.label}
                </span>
                <span className="text-xs text-stone-500">
                  {product.stockQuantity > 0 ? `${product.stockQuantity} pairs remaining in store` : 'Currently unavailable'}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Description</h4>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {product.description || 'Premium Indian footwear crafted for long-lasting durability and comfortable walking.'}
                </p>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 uppercase tracking-wider">Select Size (UK/IND)</span>
                    <span className="text-stone-500">Standard Indian sizing</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 h-10 px-3 text-xs font-bold rounded-xl border transition-all ${
                          selectedSize === size
                            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                            : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {stockInfo.isAvailable && (
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">Quantity:</span>
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-stone-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                      disabled={quantity >= maxStock}
                      className="p-2 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              {stockInfo.isAvailable ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all focus:ring-4 focus:ring-emerald-200"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Order on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-xl shadow-md transition-all focus:ring-4 focus:ring-stone-300"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>This item is currently sold out. Please contact the shopkeeper for upcoming stock arrival.</span>
                </div>
              )}

              <p className="text-[11px] text-stone-400 text-center">
                WhatsApp orders require confirmation from the store keeper before dispatch.
              </p>
            </div>

            {/* Related Footwear section */}
            {related.length > 0 && (
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  You Might Also Like
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {related.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectRelatedProduct(rel)}
                      className="group/rel text-left p-1.5 rounded-xl border border-stone-200 hover:border-brand-600 transition-all bg-stone-50"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                        <img
                          src={rel.imageUrl}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover/rel:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-[11px] font-bold text-stone-900 truncate">
                        {rel.name}
                      </div>
                      <div className="text-[11px] font-semibold text-brand-600">
                        {formatCurrency(rel.finalPrice)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
