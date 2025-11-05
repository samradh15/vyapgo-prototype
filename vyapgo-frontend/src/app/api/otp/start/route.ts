import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import crypto from 'crypto';
import { adminAuth } from '@/lib/firebase-admin';

const db = getFirestore();
const hash = (s: string) => crypto.createHash('sha256').update(s).digest('hex');
const randomCode = () => (Math.floor(100000 + Math.random() * 900000)).toString();

async function sendSms(to: string, text: string) {
  const provider = process.env.SMS_PROVIDER || 'console';

  if (provider === 'twilio') {
    const sid = process.env.TWILIO_SID!;
    const token = process.env.TWILIO_AUTH_TOKEN!;
    const from = process.env.TWILIO_FROM!;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const body = new URLSearchParams({ To: to, From: from, Body: text }).toString();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    if (!res.ok) throw new Error('Twilio SMS failed');
    return;
  }

  if (provider === 'msg91') {
    const authKey = process.env.MSG91_AUTHKEY!;
    const flowId = process.env.MSG91_TEMPLATE_ID!; // DLT/template id
    const sender = process.env.MSG91_SENDER_ID!;
    const payload = {
      template_id: flowId,
      sender,
      short_url: '1',
      recipients: [{ mobiles: to.replace(/^\+/, ''), VAR1: text }],
    };
    const res = await fetch('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: { authkey: authKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('MSG91 SMS failed');
    return;
  }

  // fallback for dev
  console.log('[SMS:DEV]', to, text);
}

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (!phone || !/^\+\d{6,15}$/.test(phone)) {
      return NextResponse.json({ ok: false, message: 'Invalid phone' }, { status: 400 });
    }

    // basic throttle: one active challenge per phone
    const ref = db.collection('otpChallenges').doc(phone);
    const existing = await ref.get();
    if (existing.exists) {
      const d = existing.data()!;
      if (Date.now() < (d.expiresAt ?? 0)) {
        return NextResponse.json({ ok: true }); // silently accept to avoid abuse
      }
    }

    const code = randomCode();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await ref.set({ codeHash: hash(code), expiresAt, attempts: 0, createdAt: Date.now() });

    await sendSms(phone, `Your VyapGO code is ${code}`);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Failed to start OTP' }, { status: 500 });
  }
}