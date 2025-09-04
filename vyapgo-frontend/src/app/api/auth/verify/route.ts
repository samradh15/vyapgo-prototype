import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token =
      authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 401 });
    }

    const decoded = await verifyIdToken(token);
    return NextResponse.json({ ok: true, uid: decoded.uid, decoded });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 });
  }
}