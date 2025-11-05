import { NextResponse } from 'next/server';
import twilio from 'twilio';

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

    const { phone } = await req.json();
    if (!phone || !/^\+\d{6,15}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);

    const res = await client.verify.v2.services(verifySid).verifications.create({
      to: phone,
      channel: 'sms',
    });

    if (res.status === 'pending') {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Could not start verification' }, { status: 500 });
  } catch (e: any) {
    // Bubble up useful Twilio details if present
    const more = e?.moreInfo ? ` (${e.moreInfo})` : '';
    return NextResponse.json(
      { error: e?.message ? `Twilio: ${e.message}${more}` : 'Failed to send OTP' },
      { status: 500 }
    );
  }
}