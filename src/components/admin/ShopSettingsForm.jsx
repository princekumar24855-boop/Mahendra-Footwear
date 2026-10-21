import React, { useState, useEffect } from 'react';
import {
  Save,
  MessageCircle,
  Store,
  MapPin,
  Mail,
  Clock,
  Sparkles,
  Database,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useProducts } from '../../context/ProductContext';
import { sanitizeWhatsAppNumber } from '../../utils/whatsapp';

export default function ShopSettingsForm() {
  const { settings, updateSettings, isFirebase } = useSettings();
  const { seedCatalog } = useProducts();

  const [formData, setFormData] = useState({
    shopName: '',
    tagline: '',
    whatsappNumber: '',
    shopAddress: '',
    contactEmail: '',
    openingHours: '',
    announcementBanner: '',
    currency: '₹',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [seedingSuccess, setSeedingSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        shopName: settings.shopName || '',
        tagline: settings.tagline || '',
        whatsappNumber: settings.whatsappNumber || '',
        shopAddress: settings.shopAddress || '',
        contactEmail: settings.contactEmail || '',
        openingHours: settings.openingHours || '',
        announcementBanner: settings.announcementBanner || '',
        currency: settings.currency || '₹',
      });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedCatalog = async () => {
    const ok = window.confirm(
      'Are you sure you want to load the default footwear catalog? This will add or reset sample products for Men\'s Shoes, Slippers, Ladies\' Sandals and Slippers.'
    );
    if (!ok) return;

    try {
      await seedCatalog();
      setSeedingSuccess(true);
      setTimeout(() => setSeedingSuccess(false), 3000);
    } catch (err) {
      alert('Failed to seed catalog: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Settings Form */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h2 className="font-display font-bold text-2xl text-stone-900">
              Shop Information & WhatsApp Configuration
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Changes update immediately on the customer-facing header, footer, and WhatsApp order links
            </p>
          </div>

          {savedSuccess && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Check className="w-4 h-4" />
              <span>Settings Saved & Live!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                Shop Name *
              </label>
              <div className="relative">
                <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={(e) => handleChange('shopName', e.target.value)}
                  placeholder="Mahendra Footwear"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Quality Footwear for the Entire Family"
                className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* WhatsApp Number (Crucial Configuration) */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
              <span>Shop WhatsApp Ordering Number *</span>
            </div>
            <p className="text-xs text-emerald-700">
              All customer product orders and cart enquiries will be directed to this WhatsApp number.
              Enter with international country code (e.g., for India: <strong>917061182887</strong> or <strong>7061182887</strong>).
            </p>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="917061182887"
                className="w-full px-4 py-2.5 text-sm bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-stone-900"
              />
            </div>
            <div className="text-[11px] text-emerald-800 flex items-center gap-1">
              <span>Formatted preview: </span>
              <strong className="font-mono">+{sanitizeWhatsAppNumber(formData.whatsappNumber) || 'None'}</strong>
            </div>
          </div>

          {/* Announcement Banner */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              Top Announcement Banner Message
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 absolute left-3.5 top-3 text-amber-500" />
              <input
                type="text"
                value={formData.announcementBanner}
                onChange={(e) => handleChange('announcementBanner', e.target.value)}
                placeholder="Festive Offer: Up to 35% OFF on New Arrivals! Order directly on WhatsApp."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <span className="text-[11px] text-stone-400">Displayed at the very top of all customer pages</span>
          </div>

          {/* Shop Physical Address */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              Physical Shop Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <textarea
                rows={2}
                value={formData.shopAddress}
                onChange={(e) => handleChange('shopAddress', e.target.value)}
                placeholder="Badi Bazar, Nasriganj"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Email & Opening Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="contact@mahendrafootwear.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                Shop Opening Hours
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => handleChange('openingHours', e.target.value)}
                  placeholder="Monday – Sunday: 10:00 AM – 9:30 PM"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save & Publish Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Catalog Bootstrapper / Seed Section */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-soft p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900">
              Initial Catalog Seeder
            </h3>
            <p className="text-xs text-stone-500">
              Populate database with verified high-resolution footwear for Men&apos;s Shoes, Slippers, Ladies&apos; Sandals, and Slippers.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-stone-600 max-w-xl">
            Useful for initial bootstrapping or resetting after testing. Includes calculated discounts, real stock limits, and standard Indian sizes.
          </p>

          <button
            onClick={handleSeedCatalog}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition-all shrink-0 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Load Default Catalog</span>
          </button>
        </div>

        {seedingSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Footwear catalog successfully loaded and synchronized!</span>
          </div>
        )}
      </div>
    </div>
  );
}
