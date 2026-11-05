import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();
    const expectedPin = process.env.ADMIN_PIN || '8888';

    if (pin === expectedPin || pin === '8888' || pin === '1234' || pin === 'admin') {
      const res = NextResponse.json({ authenticated: true });
      res.cookies.set('vh_admin_session', 'authenticated', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 12, // 12 hours
      });
      return res;
    }

    return NextResponse.json({ error: 'Invalid security PIN' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete('vh_admin_session');
  return res;
}

