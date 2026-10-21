import React from 'react';
import {
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminLayout({
  activeTab,
  onSelectTab,
  onCloseAdmin,
  children,
}) {
  const { adminUser, logout } = useAuth();
  const { settings, isFirebase } = useSettings();

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-bold text-white shadow">
              MF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base tracking-tight text-white uppercase">
                  {settings.shopName || 'Mahendra Footwear'}
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <span className="text-[11px] text-stone-400">Inventory & Live Store Management</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Database indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700">
              <Database className={`w-3.5 h-3.5 ${isFirebase ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-stone-300">
                {isFirebase ? 'Firebase Firestore Live' : 'Interactive Demo Mode'}
              </span>
            </div>

            {/* Back to Customer Store */}
            <button
              onClick={onCloseAdmin}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Store</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-200 transition-colors border border-rose-800"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 border-t border-stone-800 overflow-x-auto">
          <button
            onClick={() => onSelectTab('overview')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-brand-500 text-white bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => onSelectTab('products')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-brand-500 text-white bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-brand-500 text-white bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Shop & WhatsApp Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!isFirebase && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="font-bold">Operating in Live-Sync Demo Mode: </strong>
                All additions, price edits, stock updates, and WhatsApp links work in real time. To connect your live Firebase project, simply add your credentials to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code>.
              </div>
            </div>
            <button
              onClick={() => onSelectTab('settings')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs shrink-0 hover:bg-amber-700"
            >
              View Settings
            </button>
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
