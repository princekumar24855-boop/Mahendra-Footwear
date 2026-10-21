import React from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency } from '../../utils/formatters';
import { generateCartWhatsAppLink } from '../../utils/whatsapp';

export default function CartDrawer({ onSelectCategory }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    originalTotal,
    totalSavings,
    cartCount,
  } = useCart();

  const { settings } = useSettings();

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    const linkData = generateCartWhatsAppLink({
      whatsappNumber: settings.whatsappNumber,
      cartItems,
      grandTotal: cartTotal,
    });

    if (linkData.isValid) {
      window.open(linkData.url, '_blank', 'noopener,noreferrer');
    } else {
      alert(linkData.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-stone-900">Shopping Cart</h2>
                <span className="text-xs text-stone-500">{cartCount} items selected</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-stone-900 text-lg">Your cart is empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Browse our Men&apos;s and Ladies&apos; collections and add your favourite shoes, sandals, or slippers!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onSelectCategory('all');
                  }}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const maxStock = Number(item.product.stockQuantity) || 1;
                const itemTotal = item.product.finalPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 transition-colors relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
                      <img
                        src={item.product.imageUrl || '/placeholder-shoe.svg'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-bold text-stone-900 text-sm line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-stone-500">
                            Size: <strong className="text-stone-800">{item.selectedSize}</strong>
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-[11px] font-bold text-stone-900">
                            {formatCurrency(item.product.finalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-stone-900 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 disabled:opacity-30"
                            disabled={item.quantity >= maxStock}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-stone-900">
                          {formatCurrency(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & WhatsApp Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
              {/* Savings callout */}
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Special Discount Savings
                  </span>
                  <span className="font-extrabold">-{formatCurrency(totalSavings)}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                {totalSavings > 0 && (
                  <div className="flex justify-between text-stone-500">
                    <span>Original Subtotal:</span>
                    <span className="line-through">{formatCurrency(originalTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1">
                  <span>Grand Total:</span>
                  <span className="text-lg font-black text-brand-600">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              {/* Order on WhatsApp */}
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-emerald-200"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Order Cart on WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={clearCart}
                  className="text-stone-400 hover:text-rose-600 transition-colors"
                >
                  Clear Cart
                </button>
                <span className="text-stone-400">Order confirmed by shopkeeper</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
