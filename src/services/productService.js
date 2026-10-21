import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { calculatePricing } from '../utils/pricing';
import { INITIAL_PRODUCTS } from './seedData';

const LOCAL_STORAGE_KEY = 'mahendra_footwear_products_fallback';
const SYNC_EVENT_NAME = 'mahendra_products_updated';

// Helper for local reactive fallback
function getLocalProducts() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read local fallback products:', e);
  }
  // Initialize with seed data if not present
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  } catch (e) {}
  return [...INITIAL_PRODUCTS];
}

function saveLocalProducts(products) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: products }));
  } catch (e) {
    console.error('Failed to save local products:', e);
  }
}

/**
 * Real-time subscription to products collection.
 * Works seamlessly with Firestore onSnapshot, with automatic reactive fallback.
 */
export function subscribeToProducts(onData, onError) {
  if (isFirebaseConfigured() && db) {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const products = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          onData(products);
        },
        (err) => {
          console.error('Firestore products onSnapshot error:', err);
          if (onError) onError(err);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('Falling back to local reactive store:', err);
    }
  }

  // Reactive Local/Demo Fallback
  let currentProducts = getLocalProducts();
  onData(currentProducts);

  const handleUpdate = (e) => {
    onData(e.detail || getLocalProducts());
  };

  const handleStorage = (e) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      onData(getLocalProducts());
    }
  };

  window.addEventListener(SYNC_EVENT_NAME, handleUpdate);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(SYNC_EVENT_NAME, handleUpdate);
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Add a new product
 */
export async function addProduct(productData) {
  const pricing = calculatePricing(productData.originalPrice, productData.discountPercentage);
  const stock = Math.max(0, parseInt(productData.stockQuantity, 10) || 0);

  const newProduct = {
    name: productData.name.trim(),
    description: productData.description?.trim() || '',
    category: productData.category,
    originalPrice: pricing.originalPrice,
    discountPercentage: pricing.discountPercentage,
    finalPrice: pricing.finalPrice,
    discountAmount: pricing.discountAmount,
    savings: pricing.savings,
    stockQuantity: stock,
    sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
    imageUrl: productData.imageUrl || '',
    additionalImageUrls: Array.isArray(productData.additionalImageUrls) ? productData.additionalImageUrls : [],
    isActive: productData.isActive !== false,
    isFeatured: Boolean(productData.isFeatured),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      ...newProduct,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...newProduct };
  }

  // Local fallback
  const id = 'prod_' + Date.now();
  const created = { id, ...newProduct, createdAt: new Date().toISOString() };
  const products = [created, ...getLocalProducts()];
  saveLocalProducts(products);
  return created;
}

/**
 * Update an existing product
 */
export async function updateProduct(id, updates) {
  const existingList = getLocalProducts();
  const current = existingList.find(p => p.id === id) || {};

  const originalPrice = updates.originalPrice !== undefined ? updates.originalPrice : current.originalPrice;
  const discountPercentage = updates.discountPercentage !== undefined ? updates.discountPercentage : current.discountPercentage;
  const pricing = calculatePricing(originalPrice, discountPercentage);

  const cleanedUpdates = {
    ...updates,
    originalPrice: pricing.originalPrice,
    discountPercentage: pricing.discountPercentage,
    finalPrice: pricing.finalPrice,
    discountAmount: pricing.discountAmount,
    savings: pricing.savings,
    updatedAt: new Date().toISOString(),
  };

  if (updates.stockQuantity !== undefined) {
    cleanedUpdates.stockQuantity = Math.max(0, parseInt(updates.stockQuantity, 10) || 0);
  }

  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, cleanedUpdates);
    return { id, ...cleanedUpdates };
  }

  // Local fallback
  const updatedList = existingList.map((item) =>
    item.id === id ? { ...item, ...cleanedUpdates } : item
  );
  saveLocalProducts(updatedList);
  return { id, ...cleanedUpdates };
}

/**
 * Update stock quantity directly (fast inventory adjust)
 */
export async function updateProductStock(id, newStockQuantity) {
  const stock = Math.max(0, parseInt(newStockQuantity, 10) || 0);
  return updateProduct(id, { stockQuantity: stock });
}

/**
 * Delete a product
 */
export async function deleteProduct(id) {
  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return true;
  }

  const existingList = getLocalProducts();
  const filtered = existingList.filter(item => item.id !== id);
  saveLocalProducts(filtered);
  return true;
}

/**
 * Seed initial catalog to Firestore (or reset local demo)
 */
export async function seedProductsToFirestore() {
  if (isFirebaseConfigured() && db) {
    const batch = writeBatch(db);
    INITIAL_PRODUCTS.forEach((prod) => {
      const docRef = doc(collection(db, 'products'));
      const pricing = calculatePricing(prod.originalPrice, prod.discountPercentage);
      batch.set(docRef, {
        ...prod,
        originalPrice: pricing.originalPrice,
        discountPercentage: pricing.discountPercentage,
        finalPrice: pricing.finalPrice,
        discountAmount: pricing.discountAmount,
        savings: pricing.savings,
        createdAt: serverTimestamp(),
        updatedAt: new Date().toISOString(),
      });
    });
    await batch.commit();
    return true;
  }

  saveLocalProducts([...INITIAL_PRODUCTS]);
  return true;
}
