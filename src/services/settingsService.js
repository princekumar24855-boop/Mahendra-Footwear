import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { INITIAL_SHOP_SETTINGS } from './seedData';
import { sanitizeWhatsAppNumber } from '../utils/whatsapp';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'shop_config';
const LOCAL_SETTINGS_KEY = 'mahendra_footwear_settings_fallback';
const SETTINGS_EVENT = 'mahendra_settings_updated';

function getLocalSettings() {
  try {
    const saved = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-migrate if holding old default placeholders
      if (parsed.whatsappNumber === '919876543210' || parsed.shopAddress?.includes('Main Market Road')) {
        const updated = {
          ...parsed,
          whatsappNumber: INITIAL_SHOP_SETTINGS.whatsappNumber,
          shopAddress: INITIAL_SHOP_SETTINGS.shopAddress,
        };
        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
        return updated;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading local settings:', e);
  }
  return { ...INITIAL_SHOP_SETTINGS };
}

function saveLocalSettings(settings) {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: settings }));
  } catch (e) {
    console.error('Error saving local settings:', e);
  }
}

/**
 * Real-time subscription to shop settings
 */
export function subscribeToShopSettings(onData, onError) {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            onData({ ...INITIAL_SHOP_SETTINGS, ...snap.data() });
          } else {
            // First time - write defaults
            setDoc(docRef, INITIAL_SHOP_SETTINGS, { merge: true }).catch(console.error);
            onData(INITIAL_SHOP_SETTINGS);
          }
        },
        (err) => {
          console.error('Settings snapshot error:', err);
          if (onError) onError(err);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('Falling back to local settings subscription:', err);
    }
  }

  // Local fallback
  onData(getLocalSettings());

  const handleUpdate = (e) => {
    onData(e.detail || getLocalSettings());
  };

  const handleStorage = (e) => {
    if (e.key === LOCAL_SETTINGS_KEY) {
      onData(getLocalSettings());
    }
  };

  window.addEventListener(SETTINGS_EVENT, handleUpdate);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(SETTINGS_EVENT, handleUpdate);
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Update shop settings
 */
export async function updateShopSettings(newSettings) {
  const sanitized = {
    ...newSettings,
    whatsappNumber: sanitizeWhatsAppNumber(newSettings.whatsappNumber),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured() && db) {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, sanitized, { merge: true });
    return sanitized;
  }

  const current = getLocalSettings();
  const merged = { ...current, ...sanitized };
  saveLocalSettings(merged);
  return merged;
}
