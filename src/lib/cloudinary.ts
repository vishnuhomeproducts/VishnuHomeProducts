import crypto from 'crypto';

/**
 * Cloudinary Image Upload & Auto-WebP Compression Helper
 * Uses Cloudinary REST API directly with native fetch (zero bulky SDK overhead)
 */

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadImageToCloudinary(
  base64OrBuffer: Buffer | string,
  fileName: string = 'product_image'
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured.');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'vishnu_products';
  const eager = 'f_auto,q_auto:good';

  // Signature calculation: sorted params + apiSecret
  const paramsToSign = `eager=${eager}&folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const formData = new FormData();
  if (typeof base64OrBuffer === 'string') {
    formData.append('file', base64OrBuffer);
  } else {
    const blob = new Blob([new Uint8Array(base64OrBuffer)], { type: 'image/jpeg' });
    formData.append('file', blob, fileName);
  }

  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('eager', eager);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    url: data.secure_url || data.url,
    public_id: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  };
}

/**
 * Ensures any Cloudinary URL automatically receives WebP format conversion and optimal compression
 */
export function getOptimizedImageUrl(url: string, maxWidth: number = 800): string {
  if (!url) return '/images/products/placeholder.jpg';
  if (!url.includes('res.cloudinary.com')) return url;

  // Insert f_auto,q_auto:good,w_{width} after /upload/
  if (url.includes('/upload/') && !url.includes('/upload/f_auto')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto:good,w_${maxWidth},c_limit/`);
  }

  return url;
}

