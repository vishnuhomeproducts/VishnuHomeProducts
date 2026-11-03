import { NextResponse } from 'next/server';
import { isCloudinaryConfigured, uploadImageToCloudinary } from '@/lib/cloudinary';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Cloudinary is configured, upload for auto-WebP compression and CDN delivery
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadImageToCloudinary(buffer, file.name);
        return NextResponse.json({
          success: true,
          url: result.url,
          provider: 'cloudinary',
          format: result.format,
          bytes: result.bytes,
        });
      } catch (cloudErr: any) {
        console.warn('Cloudinary upload error, falling back:', cloudErr.message);
      }
    }

    // 2. Fallback: Save to public uploads or return optimized base64
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${safeName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/images/products/${fileName}`,
        provider: 'local',
        bytes: buffer.length,
      });
    } catch (fsErr) {
      // In serverless read-only environment without Cloudinary, return data URL
      const base64 = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      return NextResponse.json({
        success: true,
        url: `data:${mimeType};base64,${base64}`,
        provider: 'data-url',
        bytes: buffer.length,
      });
    }
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: error.message || 'Image upload failed' }, { status: 500 });
  }
}
