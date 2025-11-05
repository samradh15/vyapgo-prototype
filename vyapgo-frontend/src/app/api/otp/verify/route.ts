import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';
import { adminAuth } from '@/lib/firebase-admin';

const db = getFirestore();
const hash = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !/^\+\d{6,15}$/.test(phone) || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
    }

    const ref = db.collection('otpChallenges').doc(phone);
    const snap = await ref.get();
    const data = snap.data() as any;
    if (!data) return NextResponse.json({ ok: false, message: 'No OTP pending' }, { status: 400 });
    if (Date.now() > data.expiresAt) return NextResponse.json({ ok: false, message: 'OTP expired' }, { status: 400 });
    if ((data.attempts ?? 0) >= 5) return NextResponse.json({ ok: false, message: 'Too many attempts' }, { status: 429 });

    if (data.codeHash !== hash(code)) {
      await ref.update({ attempts: (data.attempts ?? 0) + 1 });
      return NextResponse.json({ ok: false, message: 'Invalid OTP' }, { status: 400 });
    }

    // success → consume
    await ref.delete();

    // find or create Firebase user for this phone
    let user;
    try {
      user = await adminAuth.getUserByPhoneNumber(phone);
    } catch {
      user = await adminAuth.createUser({ phoneNumber: phone });
    }

    const customToken = await adminAuth.createCustomToken(user.uid);
    const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

    return NextResponse.json({ ok: true, customToken, isNewUser });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'OTP verify failed' }, { status: 500 });
  }
}