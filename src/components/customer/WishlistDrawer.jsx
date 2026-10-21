import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getStockStatus } from '../../utils/formatters';

export default function WishlistDrawer({ onViewDetails }) {
  const { wishlistItems, isWishlistOpen, setIsWishlistOpen, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-stone-900">Saved Wishlist</h2>
                <span className="text-xs text-stone-500">{wishlistItems.length} footwear saved</span>
              </div>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-stone-900 text-lg">No saved items</h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Tap the heart icon on any shoe, slipper, or sandal to save it here for later.
                </p>
              </div>
            ) : (
              wishlistItems.map((prod) => {
                const stock = getStockStatus(prod.stockQuantity);

                return (
                  <div
                    key={prod.id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                  >
                    <div
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onViewDetails(prod);
                      }}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 cursor-pointer"
                    >
                      <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4
                            onClick={() => {
                              setIsWishlistOpen(false);
                              onViewDetails(prod);
                            }}
                            className="font-display font-bold text-stone-900 text-sm line-clamp-1 cursor-pointer hover:text-brand-600"
                          >
                            {prod.name}
                          </h4>
                          <button
                            onClick={() => removeFromWishlist(prod.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-stone-900 mt-1">
                          {formatCurrency(prod.finalPrice)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stock.badgeClass}`}>
                          {stock.label}
                        </span>

                        {stock.isAvailable && (
                          <button
                            onClick={() => {
                              addToCart(prod, prod.sizes?.[0] || '', 1);
                              removeFromWishlist(prod.id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Move to Cart</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
