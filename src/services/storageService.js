import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

/**
 * Upload an image file to Firebase Storage with progress tracking
 */
export async function uploadProductImage(file, onProgress) {
  if (!file) throw new Error('No file provided');

  // If Firebase Storage is configured, upload to Firebase
  if (isFirebaseConfigured() && storage) {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storagePath = `products/${timestamp}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  // Fallback: Read as Data URL for local preview/demo mode
  return new Promise((resolve, reject) => {
    if (onProgress) onProgress(50);
    const reader = new FileReader();
    reader.onload = () => {
      if (onProgress) onProgress(100);
      resolve(reader.result);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
