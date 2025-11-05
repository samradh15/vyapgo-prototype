'use client';

import { useEffect, useState } from 'react';
import {
  auth,
  getProviderIds,
  linkGoogleToCurrent,
  startLinkPhone,
  verifyLinkPhone,
  unlinkProviderSafe,
  ensureRecaptcha,
} from '@/lib/auth-client';
import { onAuthStateChanged } from 'firebase/auth';

const BRAND = 'linear-gradient(90deg, #f97316, #f59e0b, #10b981)';

export default function SignInMethods() {
  const [providers, setProviders] = useState<string[]>([]);
  const [phoneLinked, setPhoneLinked] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);

  // phone linking UI
  const [dial, setDial] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStage, setOtpStage] = useState<'idle' | 'sent'>('idle');

  const [busy, setBusy] = useState<null | 'google' | 'send' | 'verify' | 'unlink-google' | 'unlink-phone'>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const ids = getProviderIds();
      setProviders(ids);
      setGoogleLinked(ids.includes('google.com'));
      setPhoneLinked(ids.includes('phone'));
    });
    // instantiate a recaptcha anchor for phone link
    ensureRecaptcha('recaptcha-link-anchor');
    return () => unsub();
  }, []);

  const fullPhone = `${dial}${phone.replace(/\D/g, '')}`;

  async function handleLinkGoogle() {
    setError(null); setInfo(null);
    setBusy('google');
    try {
      await linkGoogleToCurrent();
      const ids = getProviderIds();
      setProviders(ids);
      setGoogleLinked(ids.includes('google.com'));
      setInfo('Google linked to your account.');
    } catch (e: any) {
      setError(e?.message || 'Failed to link Google.');
    } finally {
      setBusy(null);
    }
  }

  async function handleSendPhone() {
    setError(null); setInfo(null);
    if (!/^\+\d{6,15}$/.test(fullPhone)) {
      setError('Enter a valid phone number');
      return;
    }
    setBusy('send');
    try {
      await startLinkPhone(fullPhone);
      setOtpStage('sent');
      setInfo('OTP sent to your phone.');
    } catch (e: any) {
      setError(e?.message || 'Failed to send OTP.');
    } finally {
      setBusy(null);
    }
  }

  async function handleVerifyPhone() {
    setError(null); setInfo(null);
    if (!/^\d{4,8}$/.test(otp)) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setBusy('verify');
    try {
      await verifyLinkPhone(otp);
      const ids = getProviderIds();
      setProviders(ids);
      setPhoneLinked(ids.includes('phone'));
      setOtpStage('idle');
      setPhone(''); setOtp('');
      setInfo('Phone linked to your account.');
    } catch (e: any) {
      setError(e?.message || 'Invalid OTP.');
    } finally {
      setBusy(null);
    }
  }

  async function handleUnlink(providerId: 'google.com' | 'phone') {
    setError(null); setInfo(null);
    setBusy(providerId === 'google.com' ? 'unlink-google' : 'unlink-phone');
    try {
      await unlinkProviderSafe(providerId);
      const ids = getProviderIds();
      setProviders(ids);
      setGoogleLinked(ids.includes('google.com'));
      setPhoneLinked(ids.includes('phone'));
      setInfo('Sign-in method removed.');
    } catch (e: any) {
      setError(e?.message || 'Could not unlink. Ensure you have another sign-in method.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-amber-200/50 shadow-sm">
      <div className="px-6 py-4 border-b border-amber-100/60 font-semibold text-gray-900">
        Sign-in methods
      </div>

      {/* status */}
      {(error || info) && (
        <div className="px-6 pt-4">
          {error && <div className="text-sm text-red-600">{error}</div>}
          {info && <div className="text-sm text-emerald-700">{info}</div>}
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {/* Google */}
        <MethodRow
          label="Google"
          status={googleLinked ? 'Linked' : 'Not linked'}
          action={
            googleLinked ? (
              <button
                onClick={() => handleUnlink('google.com')}
                disabled={busy !== null}
                className="px-3 h-9 rounded-lg border border-gray-300 text-sm"
              >
                {busy === 'unlink-google' ? 'Removing…' : 'Unlink'}
              </button>
            ) : (
              <button
                onClick={handleLinkGoogle}
                disabled={busy !== null}
                className="px-3 h-9 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                style={{ background: BRAND }}
              >
                {busy === 'google' ? 'Linking…' : 'Link Google'}
              </button>
            )
          }
        />

        {/* Phone */}
        <MethodRow
          label="Phone"
          status={phoneLinked ? 'Linked' : 'Not linked'}
          action={
            phoneLinked ? (
              <button
                onClick={() => handleUnlink('phone')}
                disabled={busy !== null}
                className="px-3 h-9 rounded-lg border border-gray-300 text-sm"
              >
                {busy === 'unlink-phone' ? 'Removing…' : 'Unlink'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {otpStage === 'idle' ? (
                  <>
                    <select
                      className="h-9 rounded-lg border border-gray-300 px-2 text-sm"
                      value={dial}
                      onChange={(e) => setDial(e.target.value)}
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      className="h-9 rounded-lg border border-gray-300 px-2 text-sm"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                      onClick={handleSendPhone}
                      disabled={busy !== null}
                      className="px-3 h-9 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                      style={{ background: BRAND }}
                    >
                      {busy === 'send' ? 'Sending…' : 'Send OTP'}
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      className="h-9 rounded-lg border border-gray-300 px-2 text-sm"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      inputMode="numeric"
                    />
                    <button
                      onClick={handleVerifyPhone}
                      disabled={busy !== null}
                      className="px-3 h-9 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                      style={{ background: BRAND }}
                    >
                      {busy === 'verify' ? 'Verifying…' : 'Verify & Link'}
                    </button>
                  </>
                )}
              </div>
            )
          }
        />
      </div>

      {/* Invisible reCAPTCHA anchor for linking */}
      <div id="recaptcha-link-anchor" className="hidden" />
    </div>
  );
}

function MethodRow({
  label,
  status,
  action,
}: {
  label: string;
  status: string;
  action: React.ReactNode;
}) {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-sm font-medium text-gray-900">{status}</div>
      </div>
      <div className="flex items-center gap-2">{action}</div>
    </div>
  );
}