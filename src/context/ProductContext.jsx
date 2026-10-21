import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  subscribeToProducts,
  addProduct as apiAddProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  updateProductStock as apiUpdateStock,
  seedProductsToFirestore,
} from '../services/productService';
import { CATEGORIES } from '../utils/formatters';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToProducts(
      (data) => {
        setProducts(data || []);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Filtered public products (only active items are visible to customers)
  const activeProducts = useMemo(() => {
    return products.filter((p) => p.isActive !== false);
  }, [products]);

  // Key Dashboard Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive !== false).length;
    const outOfStock = products.filter((p) => (Number(p.stockQuantity) || 0) <= 0).length;
    const lowStock = products.filter((p) => {
      const stock = Number(p.stockQuantity) || 0;
      return stock > 0 && stock <= 5;
    });
    const discounted = products.filter((p) => (Number(p.discountPercentage) || 0) > 0).length;
    const featured = products.filter((p) => Boolean(p.isFeatured) && p.isActive !== false).length;

    const byCategory = {};
    CATEGORIES.forEach((cat) => {
      byCategory[cat.id] = products.filter((p) => p.category === cat.id).length;
    });

    return {
      total,
      active,
      outOfStock,
      lowStock,
      discounted,
      featured,
      byCategory,
    };
  }, [products]);

  const addProduct = async (data) => {
    return await apiAddProduct(data);
  };

  const updateProduct = async (id, updates) => {
    return await apiUpdateProduct(id, updates);
  };

  const deleteProduct = async (id) => {
    return await apiDeleteProduct(id);
  };

  const updateStock = async (id, newQuantity) => {
    return await apiUpdateStock(id, newQuantity);
  };

  const seedCatalog = async () => {
    return await seedProductsToFirestore();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        activeProducts,
        loading,
        error,
        stats,
        categories: CATEGORIES,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        seedCatalog,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
}
