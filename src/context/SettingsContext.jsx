import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToShopSettings, updateShopSettings } from '../services/settingsService';
import { INITIAL_SHOP_SETTINGS } from '../services/seedData';
import { isFirebaseConfigured } from '../services/firebase';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(INITIAL_SHOP_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToShopSettings(
      (newSettings) => {
        setSettings(newSettings);
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

  const handleUpdate = async (newSettings) => {
    const updated = await updateShopSettings(newSettings);
    setSettings(updated);
    return updated;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateSettings: handleUpdate,
        isFirebase: isFirebaseConfigured(),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
