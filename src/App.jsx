import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import AnnouncementBar from './components/common/AnnouncementBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppFloatingButton from './components/common/WhatsAppFloatingButton';
import ConfirmationModal from './components/common/ConfirmationModal';

import CustomerHome from './components/customer/CustomerHome';
import ProductDetailModal from './components/customer/ProductDetailModal';
import CartDrawer from './components/customer/CartDrawer';
import WishlistDrawer from './components/customer/WishlistDrawer';

import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminStatsOverview from './components/admin/AdminStatsOverview';
import ProductListTable from './components/admin/ProductListTable';
import ProductFormModal from './components/admin/ProductFormModal';
import ShopSettingsForm from './components/admin/ShopSettingsForm';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const { addProduct, updateProduct, deleteProduct } = useProducts();

  // Navigation State
  // Default is always Customer Portal unless URL explicitly has /admin or #admin
  const checkIsAdminPath = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash.startsWith('#admin/');
  };

  const [isAdminView, setIsAdminView] = useState(checkIsAdminPath);

  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'products' | 'settings'

  // Customer Filter / View State
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  // Admin Modal States
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handle browser popstate / URL updates
  useEffect(() => {
    const handlePopState = () => {
      setIsAdminView(checkIsAdminPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAdmin = () => {
    window.history.pushState(null, '', '/admin');
    setIsAdminView(true);
  };

  const closeAdmin = () => {
    window.history.pushState(null, '', '/');
    setIsAdminView(false);
  };

  // Product CRUD handlers
  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (editingProduct && editingProduct.id) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await addProduct(formData);
    }
  };

  const handleDeleteRequest = (product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {isAdminView ? (
        // Admin View
        !isAuthenticated ? (
          <AdminLoginPage
            onClose={closeAdmin}
            onLoginSuccess={() => setAdminTab('overview')}
          />
        ) : (
          <AdminLayout
            activeTab={adminTab}
            onSelectTab={setAdminTab}
            onCloseAdmin={closeAdmin}
          >
            {adminTab === 'overview' && (
              <AdminStatsOverview
                onSelectTab={setAdminTab}
                onEditProduct={(prod) => {
                  setAdminTab('products');
                  handleEditProduct(prod);
                }}
              />
            )}

            {adminTab === 'products' && (
              <ProductListTable
                onAddNewProduct={handleAddNewProduct}
                onEditProduct={handleEditProduct}
                onDeleteRequest={handleDeleteRequest}
              />
            )}

            {adminTab === 'settings' && <ShopSettingsForm />}
          </AdminLayout>
        )
      ) : (
        // Customer Shopping Portal
        <>
          <AnnouncementBar />

          <Navbar
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              const catalogElement = document.getElementById('catalog');
              if (catalogElement) {
                catalogElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenAdmin={openAdmin}
          />

          <main className="flex-1">
            <CustomerHome
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onViewProductDetails={setSelectedProductDetails}
            />
          </main>

          <Footer
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            onOpenAdmin={openAdmin}
          />

          <WhatsAppFloatingButton />

          {/* Cart & Wishlist Drawers */}
          <CartDrawer onSelectCategory={setActiveCategory} />
          <WishlistDrawer onViewDetails={setSelectedProductDetails} />

          {/* Product Details Modal */}
          {selectedProductDetails && (
            <ProductDetailModal
              product={selectedProductDetails}
              onClose={() => setSelectedProductDetails(null)}
              onSelectRelatedProduct={(related) => setSelectedProductDetails(related)}
            />
          )}
        </>
      )}

      {/* Shared Modals for Admin */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        product={editingProduct}
        onClose={() => {
          setIsProductFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      <ConfirmationModal
        isOpen={Boolean(productToDelete)}
        title="Delete Footwear Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action will remove it from the store permanently.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <MainApp />
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
