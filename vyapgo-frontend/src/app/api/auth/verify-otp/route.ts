import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { adminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const verifySid = process.env.TWILIO_VERIFY_SID || '';

function assertTwilioEnv() {
  if (!/^AC[a-f0-9]{32}$/i.test(accountSid)) {
    throw new Error('TWILIO_ACCOUNT_SID must look like ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  }
  if (!authToken) {
    throw new Error('TWILIO_AUTH_TOKEN is missing');
  }
  if (!/^VA[a-f0-9]{32}$/i.test(verifySid)) {
    throw new Error('TWILIO_VERIFY_SID must look like VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  }
}

export async function POST(req: Request) {
  try {
    assertTwilioEnv();

    const { phone, code } = await req.json();
    if (!/^\+\d{6,15}$/.test(phone) || !/^\d{4,8}$/.test(code)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);

    const check = await client.verify.v2.services(verifySid).verificationChecks.create({
      to: phone,
      code,
    });

    if (check.status !== 'approved') {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Create or get Firebase user by phone
    let uid: string;
    let isNewUser = false;
    try {
      const existing = await adminAuth.getUserByPhoneNumber(phone);
      uid = existing.uid;
    } catch (err: any) {
      if (err?.code === 'auth/user-not-found' || err?.errorInfo?.code === 'auth/user-not-found') {
        const created = await adminAuth.createUser({ phoneNumber: phone });
        uid = created.uid;
        isNewUser = true;
      } else {
        throw err;
      }
    }

    const customToken = await adminAuth.createCustomToken(uid, { phoneVerified: true });
    return NextResponse.json({ customToken, isNewUser });
  } catch (e: any) {
    const more = e?.moreInfo ? ` (${e.moreInfo})` : '';
    return NextResponse.json(
      { error: e?.message ? `Twilio: ${e.message}${more}` : 'Verification failed' },
      { status: 500 }
    );
  }
}