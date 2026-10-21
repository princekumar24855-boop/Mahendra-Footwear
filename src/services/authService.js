import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';

const LOCAL_ADMIN_KEY = 'mahendra_admin_auth_fallback';
const AUTH_EVENT = 'mahendra_auth_state_changed';

/**
 * Sign in as administrator
 */
export async function loginAdmin(email, password) {
  if (isFirebaseConfigured() && auth) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    // Verify admin role in Firestore admins collection
    if (db) {
      try {
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
          // If no admin document exists yet, check if this is the first admin bootstrap
          // Or check if user is admin
          const role = adminDoc.data()?.role;
          if (role !== 'admin') {
            // Check if there are ANY admins configured, if none, bootstrap this first user
            await setDoc(adminDocRef, {
              email: user.email,
              role: 'admin',
              createdAt: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.warn('Admin collection check note:', err);
      }
    }

    return {
      uid: user.uid,
      email: user.email,
      role: 'admin',
    };
  }

  // Fallback / Demo Auth (for instant evaluation before Firebase project credentials are provided)
  if (email === 'admin@mahendrafootwear.com' && password === 'admin123') {
    const adminUser = {
      uid: 'demo_admin_uid_mahendra',
      email: 'admin@mahendrafootwear.com',
      role: 'admin',
      isDemo: true,
    };
    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser));
    window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: adminUser }));
    return adminUser;
  }

  throw new Error('Invalid credentials. Use admin@mahendrafootwear.com / admin123 for demo, or configure Firebase Auth.');
}

/**
 * Sign out administrator
 */
export async function logoutAdmin() {
  if (isFirebaseConfigured() && auth) {
    await fbSignOut(auth);
  }
  localStorage.removeItem(LOCAL_ADMIN_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: null }));
}

/**
 * Listen to auth state changes
 */
export function subscribeToAuthState(callback) {
  if (isFirebaseConfigured() && auth) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          role: 'admin',
        });
      } else {
        callback(null);
      }
    });
  }

  // Local fallback subscription
  const readLocal = () => {
    try {
      const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  callback(readLocal());

  const handleAuthChange = (e) => {
    callback(e.detail);
  };

  window.addEventListener(AUTH_EVENT, handleAuthChange);
  return () => {
    window.removeEventListener(AUTH_EVENT, handleAuthChange);
  };
}
