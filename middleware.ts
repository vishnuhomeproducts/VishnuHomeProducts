import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const path = request.nextUrl.pathname;

  // Rate limit: checkout and API routes
  if (path.startsWith('/api/razorpay') || path.startsWith('/api/auth')) {
    const key = `${ip}:${path}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 30;

    const record = rateLimitMap.get(key) ?? { count: 0, start: now };
    if (now - record.start > windowMs) {
      record.count = 0;
      record.start = now;
    }
    record.count++;
    rateLimitMap.set(key, record);

    if (record.count > limit) {
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/razorpay/:path*', '/api/auth/:path*'],
};
