/**
 * High-performance, Free Image Uploader for Shop Footwear Photos
 * 
 * Flow:
 * 1. Takes image file from camera/phone/computer
 * 2. Compresses & resizes image (800px max) so it loads super fast on customer mobiles
 * 3. Uploads directly to Free Image CDN with fallback to optimized Base64
 * 4. Works 100% free without requiring credit card or Blaze billing!
 */

// Client-side image compression utility
async function compressImage(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Upload product image with automatic compression
 */
export async function uploadProductImage(file, onProgress) {
  if (!file) throw new Error('No file provided');

  if (onProgress) onProgress(20);

  try {
    // Step 1: Compress image client-side to ensure fast loading on 4G/5G
    if (onProgress) onProgress(40);
    const compressedDataUrl = await compressImage(file, 800, 0.82);

    if (onProgress) onProgress(70);

    // Try uploading to free public image host (ImgBB API)
    try {
      const formData = new FormData();
      // Remove data:image/jpeg;base64, prefix
      const base64Data = compressedDataUrl.split(',')[1];
      formData.append('image', base64Data);

      // Using public free upload endpoint
      const response = await fetch('https://api.imgbb.com/1/upload?key=8cf622617f62b14e391bb3ec5e171cb2', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result && result.data && result.data.url) {
        if (onProgress) onProgress(100);
        return result.data.url;
      }
    } catch (cdnErr) {
      console.warn('CDN upload fallback to compressed data URL:', cdnErr);
    }

    // Step 2: Fallback to ultra-optimized lightweight DataURL stored directly in Firestore
    if (onProgress) onProgress(100);
    return compressedDataUrl;

  } catch (err) {
    console.error('Image compression error:', err);
    // Ultimate fallback
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
