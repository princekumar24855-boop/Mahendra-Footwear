import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CART_STORAGE_KEY = 'mahendra_footwear_cart_v1';
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  const addToCart = (product, selectedSize, quantity = 1) => {
    if (!product || (Number(product.stockQuantity) || 0) <= 0) return false;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      const maxStock = Number(product.stockQuantity) || 1;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(maxStock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          product, // keep updated product pricing & details
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: `${product.id}_${selectedSize || 'std'}_${Date.now()}`,
          product,
          selectedSize: selectedSize || (product.sizes?.[0] || ''),
          quantity: Math.min(maxStock, quantity),
        },
      ];
    });

    setIsCartOpen(true);
    return true;
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const maxStock = Number(item.product.stockQuantity) || 1;
            const validQty = Math.max(1, Math.min(maxStock, newQuantity));
            return { ...item, quantity: validQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number(item.product.finalPrice) || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const originalTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number(item.product.originalPrice) || Number(item.product.finalPrice) || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const totalSavings = Math.max(0, originalTotal - cartTotal);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        originalTotal,
        totalSavings,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
