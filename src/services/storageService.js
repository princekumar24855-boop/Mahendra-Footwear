/**
 * Direct, instant image processor for Mahendra Footwear
 * 
 * Compresses client-side directly into high-quality, lightweight image data
 * Instant 100% upload without external network delays or timeouts!
 */

export async function uploadProductImage(file, onProgress) {
  if (!file) throw new Error('No file provided');

  if (onProgress) onProgress(30);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      if (onProgress) onProgress(60);
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxWidth = 800;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // High quality, lightweight JPEG data directly saved into database
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (onProgress) onProgress(100);
        resolve(optimizedDataUrl);
      };

      img.onerror = (err) => {
        // Fallback to original if canvas fails
        if (onProgress) onProgress(100);
        resolve(event.target.result);
      };
    };

    reader.onerror = (err) => reject(err);
  });
}
