'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ensureRecaptcha,
  sendOtp,
  // old simple helpers still exist, but we’ll use the detailed ones below:
  signInWithGoogleDetailed,
  signInWithAppleDetailed,
  verifyOtpDetailed,
} from '@/lib/auth-client';

/** ---------- Theme tokens ---------- */
const BG = '#F6F0E6';
const OUTER_BORDER = 'rgba(251,191,36,0.35)'; // Amber
const BRAND_GRADIENT = 'linear-gradient(90deg, #f97316, #f59e0b, #10b981)';
const OTP_LEN = 6;

/** ---------- Small helpers ---------- */
function BrandRow({ label = 'VyapGO App' }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-md overflow-hidden">
        <Image src="/images/logo.png" alt="VyapGO" fill className="object-contain" priority />
      </span>
      <span
        className="font-semibold tracking-tight"
        style={{
          background: BRAND_GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {label}
      </span>
    </div>
  );
}

/** ---------- Auto-running mobile preview (left) ---------- */
function AutoPreview() {
  type Tab = 'inventory' | 'sales' | 'staff';
  const [tab, setTab] = useState<Tab>('inventory');
  const [pulse, setPulse] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      setTab((t) => (t === 'inventory' ? 'sales' : t === 'sales' ? 'staff' : 'inventory'));
      setPulse((p) => p + 1);
      timer.current = window.setTimeout(loop, 2200);
    };
    timer.current = window.setTimeout(loop, 1200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      {/* Device frame */}
      <div
        className="relative rounded-[28px]"
        style={{
          width: 340,
          height: 680,
          background: 'linear-gradient(180deg, #101828, #0D152A 65%, #0B1224)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow:
            '0 30px 80px rgba(16,24,40,0.45), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(15,23,42,0.35)',
        }}
      >
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 top-3 w-44 h-6 rounded-full bg-black/70" />

        {/* Top bar */}
        <div className="px-5 pt-8 pb-3 flex items-center justify-between">
          <span className="text-white/90 font-medium">VyapYantra</span>
          <span className="inline-flex items-center gap-2 text-xs text-emerald-300/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Ready
          </span>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-1 flex items-center gap-8 text-sm">
          {(['inventory', 'sales', 'staff'] as Tab[]).map((t) => (
            <button
              key={t}
              className={`pb-2 capitalize ${
                tab === t ? 'text-white' : 'text-white/55'
              } relative transition-colors`}
              onClick={() => setTab(t)}
              aria-label={`Open ${t}`}
            >
              {t === 'inventory' ? 'Inventory' : t === 'sales' ? 'Sales' : 'Staff'}
              {tab === t && (
                <span className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-amber-300/90 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-4 pt-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-white/90 font-semibold">
              {tab === 'inventory'
                ? 'Inventory Management'
                : tab === 'sales'
                ? 'Sales Overview'
                : 'Staff'}
            </div>

            {tab === 'inventory' && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-white text-2xl font-bold">250</div>
                  <div className="text-white/60 text-xs mt-1">Total Items</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-white text-2xl font-bold">₹45,000</div>
                  <div className="text-white/60 text-xs mt-1">Stock Value</div>
                </div>
                {['Fresh Apples', 'Bananas', 'Milk (1L)'].map((name, i) => (
                  <div
                    key={name}
                    className="col-span-2 mt-2 rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white/90 text-sm font-medium">{name}</div>
                      <div className="text-white/55 text-xs">
                        Stock: {i === 0 ? '100' : i === 1 ? '150' : '75'}
                      </div>
                    </div>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        pulse % 3 === 0 && i === 0
                          ? 'border-amber-300 bg-amber-300/10 text-amber-200'
                          : 'border-white/15 text-white/80'
                      }`}
                    >
                      Update
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'sales' && (
              <div className="mt-4 space-y-3">
                {[
                  { id: 'INV-001', amt: '₹850', mode: 'Cash' },
                  { id: 'INV-002', amt: '₹1,200', mode: 'UPI' },
                  { id: 'INV-003', amt: '₹650', mode: 'Card' },
                ].map((s, i) => (
                  <div
                    key={s.id}
                    className="rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between"
                  >
                    <div className="text-white/85">
                      <div className="text-sm font-medium">{s.id}</div>
                      <div className="text-xs text-white/60">
                        {s.amt} • {s.mode}
                      </div>
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-full border ${
                        pulse % 3 === 1 && i === 1
                          ? 'border-emerald-300 text-emerald-200 bg-emerald-300/10'
                          : 'border-white/15 text-white/75'
                      }`}
                    >
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'staff' && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-white text-2xl font-bold">5</div>
                    <div className="text-white/60 text-xs mt-1">Total Staff</div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-white text-2xl font-bold">₹25,000</div>
                    <div className="text-white/60 text-xs mt-1">Monthly Payroll</div>
                  </div>
                </div>
                {['Rajesh • Manager', 'Priya • Cashier', 'Suresh • Helper'].map((n, i) => (
                  <div
                    key={n}
                    className="mt-2 rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between"
                  >
                    <div className="text-white/85 text-sm">{n}</div>
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        pulse % 3 === 2 && i === 2
                          ? 'border-amber-300 bg-amber-300/10 text-amber-200'
                          : 'border-white/15 text-white/80'
                      }`}
                    >
                      Details
                    </button>
                  </div>
                ))}
                <button className="mt-3 w-full rounded-lg bg-amber-400/20 border border-amber-300/40 text-amber-100 text-sm py-2.5 font-medium">
                  Add Employee
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tap ripple to fake interaction */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: tab === 'inventory' ? 280 : tab === 'sales' ? 240 : 280,
            top: tab === 'inventory' ? 410 : tab === 'sales' ? 340 : 552,
          }}
        >
          <span className="absolute -translate-x-1/2 -translate-y-1/2 inline-flex h-10 w-10 rounded-full bg-emerald-400/30 animate-ping" />
          <span className="absolute -translate-x-1/2 -translate-y-1/2 inline-flex h-3 w-3 rounded-full bg-emerald-300" />
        </div>
      </div>
    </div>
  );
}

/** ---------- Right-side signup panel (wired, new-user only popup) ---------- */
function SignupPanel() {
  const router = useRouter();
  const [dial, setDial] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] =
    useState<null | 'google' | 'apple' | 'otp-send' | 'otp-verify'>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ensureRecaptcha('recaptcha-container');
  }, []);

  const fullPhone = `${dial}${phone.replace(/\D/g, '')}`;

  // Redirect helper: mark onboarding only if new
  function afterAuth(isNewUser: boolean) {
    try {
      if (isNewUser) {
        localStorage.setItem('vyap:onboarding:pending', '1');
      }
    } catch {}
    router.push('/');
  }

  async function handleGoogle() {
    setError(null);
    if (!agree) {
      setError('Please agree to the Terms & Privacy to continue');
      return;
    }
    setLoading('google');
    try {
      const { isNewUser } = await signInWithGoogleDetailed();
      afterAuth(isNewUser);
    } catch (e: any) {
      setError(e?.message || 'Google sign-up failed');
    } finally {
      setLoading(null);
    }
  }

  async function handleApple() {
    setError(null);
    if (!agree) {
      setError('Please agree to the Terms & Privacy to continue');
      return;
    }
    setLoading('apple');
    try {
      const { isNewUser } = await signInWithAppleDetailed();
      afterAuth(isNewUser);
    } catch (e: any) {
      setError(e?.message || 'Apple sign-up failed');
    } finally {
      setLoading(null);
    }
  }

  async function handleSendOtp() {
    setError(null);
    if (!agree) {
      setError('Please agree to the Terms & Privacy to continue');
      return;
    }
    if (!/^\+\d{6,15}$/.test(fullPhone)) {
      setError('Enter a valid phone number');
      return;
    }
    setLoading('otp-send');
    try {
      await sendOtp(fullPhone);
      setOtpSent(true);
    } catch (e: any) {
      setError(e?.message || 'Failed to send OTP');
    } finally {
      setLoading(null);
    }
  }

  async function handleVerifyOtp() {
    setError(null);
    if (!/^\d{6}$/.test(code)) {
      setError(`Enter the ${OTP_LEN}-digit OTP`);
      return;
    }
    setLoading('otp-verify');
    try {
      const { isNewUser } = await verifyOtpDetailed(code);
      afterAuth(isNewUser);
    } catch (e: any) {
      setError(e?.message || 'Invalid OTP');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="w-full">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span className="relative w-9 h-9">
          <Image src="/images/logo.png" alt="VyapGO" fill className="object-contain" priority />
        </span>
        <span
          className="font-semibold text-lg"
          style={{
            background: BRAND_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          VyapGO
        </span>
      </div>

      <h1 className="mt-4 text-xl font-semibold text-gray-900">Create your account</h1>
      <p className="text-sm text-gray-600 mt-1">Sign up with your phone, Google, or Apple ID.</p>

      {/* SSO */}
      <div className="mt-5 space-y-3">
        <button
          onClick={handleGoogle}
          disabled={loading !== null}
          className="w-full h-11 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-800 font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          <span className="relative w-5 h-5">
            <Image src="/images/google.png" alt="Google" fill className="object-contain" />
          </span>
          {loading === 'google' ? 'Connecting…' : 'Continue with Google'}
        </button>
        <button
          onClick={handleApple}
          disabled={loading !== null}
          className="w-full h-11 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-800 font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          <span className="relative w-5 h-5">
            <Image src="/images/apple.png" alt="Apple" fill className="object-contain" />
          </span>
          {loading === 'apple' ? 'Connecting…' : 'Continue with Apple'}
        </button>
      </div>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-xs text-gray-500">or</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Phone */}
      <label className="text-xs font-medium text-gray-700">Phone number</label>
      <div className="mt-1.5 flex gap-2">
        <select
          className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-gray-800 text-sm"
          value={dial}
          onChange={(e) => setDial(e.target.value)}
        >
          <option value="+91">+91</option>
          <option value="+1">+1</option>
          <option value="+44">+44</option>
        </select>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="98765 43210"
          className="h-11 flex-1 rounded-xl border border-amber-300/60 bg-white px-3 text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-amber-300/60"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Terms */}
      <label className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        <input
          type="checkbox"
          className="h-4 w-4 accent-amber-500"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        I agree to the{' '}
        <a className="underline hover:text-gray-900" href="#">
          Terms
        </a>{' '}
        &{' '}
        <a className="underline hover:text-gray-900" href="#">
          Privacy Policy
        </a>
        .
      </label>

      {!otpSent ? (
        <button
          onClick={handleSendOtp}
          disabled={loading !== null}
          className="mt-4 w-full h-11 rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-[0.99] disabled:opacity-60"
          style={{ background: BRAND_GRADIENT }}
        >
          {loading === 'otp-send' ? 'Sending OTP…' : 'Create account with phone'}
        </button>
      ) : (
        <>
          <label className="mt-4 block text-xs font-medium text-gray-700">Enter OTP</label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder={`${OTP_LEN}-digit code`}
            maxLength={OTP_LEN}
            className="mt-1.5 h-11 w-full rounded-xl border border-amber-300/60 bg-white px-3 text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-amber-300/60"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, OTP_LEN))}
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading !== null}
            className="mt-3 w-full h-11 rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-[0.99] disabled:opacity-60"
            style={{ background: BRAND_GRADIENT }}
          >
            {loading === 'otp-verify' ? 'Verifying…' : 'Verify & continue'}
          </button>
        </>
      )}

      {/* Error */}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between text-sm text-gray-600">
        <div>
          Already have an account?{' '}
          <Link href="/login" className="text-orange-700 font-medium hover:underline">
            Log in
          </Link>
        </div>
        <Link href="/" className="hover:text-gray-900">
          Back to home
        </Link>
      </div>

      {/* Invisible reCAPTCHA anchor */}
      <div id="recaptcha-container" className="hidden" />
    </div>
  );
}

/** ---------- Page ---------- */
export default function SignupUnified() {
  return (
    <div
      style={{ minHeight: '100vh', background: BG }}
      className="flex items-center justify-center p-6"
    >
      {/* Unified outer card */}
      <div
        className="relative w-full max-w-6xl rounded-[28px] overflow-hidden lg:flex lg:items-stretch"
        style={{
          background: 'white',
          border: `1px solid ${OUTER_BORDER}`,
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.6) inset, 0 0 0 1px rgba(255,255,255,0.6) inset',
        }}
      >
        {/* Absolute vertical divider (keeps it one object) */}
        <div
          className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px"
          style={{
            background:
              'linear-gradient(to bottom, transparent, #F1E6D6 18%, #F1E6D6 82%, transparent)',
          }}
        />

        {/* Left (preview) */}
        <section
          className="relative p-6 lg:p-8 lg:w-1/2"
          style={{
            background:
              'radial-gradient(1200px 300px at -10% -30%, rgba(249,115,22,0.10), transparent), radial-gradient(1200px 300px at 110% 130%, rgba(16,185,129,0.10), transparent), #FFFDF9',
          }}
        >
          <div className="flex items-center justify-between">
            <BrandRow label="VyapGO App" />
            <Link
              href="/"
              className="text-[13px] text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
            >
              ← Back to website
            </Link>
          </div>

          {/* Subtle dots */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              maskImage: 'linear-gradient(white, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(white, transparent 85%)',
            }}
          />

          <div className="relative mt-6 lg:mt-8">
            <AutoPreview />
          </div>
        </section>

        {/* Right (signup) */}
        <section className="p-6 lg:p-8 lg:w-1/2">
          <SignupPanel />
        </section>
      </div>
    </div>
  );
}