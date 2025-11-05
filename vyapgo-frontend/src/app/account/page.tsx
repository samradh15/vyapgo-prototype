'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, linkGoogleToCurrent, startLinkPhone, verifyLinkPhone } from '@/lib/auth-client';
import {
  ensureUserDoc,
  fetchUserDoc,
  updateUser,
  type OnboardingAnswers,
  type UserProfile,
} from '@/lib/firebase-db';

const BRAND = 'linear-gradient(90deg, #f97316, #f59e0b, #10b981)';

type FieldKey =
  | 'shopName'
  | 'businessType'
  | 'locationCity'
  | 'sellingChannels'
  | 'inventorySize'
  | 'primaryGoal';

const BUSINESS_TYPES = ['Kirana / Grocery', 'Restaurant', 'Salon', 'Pharmacy', 'Boutique', 'Other'];
const INVENTORY_SIZES = ['<50', '50-200', '200+'];
const GOALS = ['Faster billing', 'Online orders', 'Analytics & insights', 'Inventory tracking'];

export default function AccountPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile + answers
  const [displayName, setDisplayName] = useState('');
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);

  // which row is in edit mode?
  const [editing, setEditing] = useState<FieldKey | 'displayName' | null>(null);

  // linked providers
  const [providers, setProviders] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login?next=' + encodeURIComponent('/account'));
        return;
      }
      setUid(user.uid);
      setProviders(user.providerData?.map((p) => p.providerId) || []);
      setError(null);
      setLoading(true);
      try {
        await ensureUserDoc(user.uid);
        const data = await fetchUserDoc(user.uid);

        const dn = data?.displayName || data?.onboarding?.shopName || '';
        setDisplayName(dn);

        const a: OnboardingAnswers = {
          shopName: data?.onboarding?.shopName,
          businessType: data?.onboarding?.businessType,
          locationCity: data?.onboarding?.locationCity,
          sellingChannels: data?.onboarding?.sellingChannels || [],
          inventorySize: data?.onboarding?.inventorySize,
          primaryGoal: data?.onboarding?.primaryGoal,
        };
        setAnswers(a);
        setOnboardingComplete(!!data?.onboarding?.complete);
      } catch (e: any) {
        setError(e?.message || 'Failed to load your account.');
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const initials = useMemo(() => {
    const s = (displayName || answers.shopName || 'VyapGO').trim();
    return s
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || '')
      .join('');
  }, [displayName, answers.shopName]);

  async function saveDisplayName() {
    if (!uid) return;
    setSaving(true);
    setError(null);
    try {
      const trimmed = displayName.trim();
      const nextOnboarding: UserProfile['onboarding'] = {
        ...answers,
        shopName: trimmed,
        ...(onboardingComplete ? { complete: true } : {}),
      };
      await updateUser(uid, { displayName: trimmed, onboarding: nextOnboarding });
      setAnswers((a) => ({ ...a, shopName: trimmed }));
      setEditing(null);
    } catch (e: any) {
      setError(e?.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  async function saveAnswer<K extends FieldKey>(key: K, value: OnboardingAnswers[K]) {
    if (!uid) return;
    setSaving(true);
    setError(null);
    try {
      const nextAnswers: OnboardingAnswers = { ...answers, [key]: value };
      const nextOnboarding: UserProfile['onboarding'] = {
        ...nextAnswers,
        ...(onboardingComplete ? { complete: true } : {}),
      };
      await updateUser(uid, { onboarding: nextOnboarding });
      setAnswers(nextAnswers);
      setEditing(null);
    } catch (e: any) {
      setError(e?.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading account…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="text-red-600">{error}</div>
        <button
          className="px-4 h-10 rounded-lg bg-gray-900 text-white"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Top header */}
      <div className="flex items-center gap-3">
        <span className="relative w-10 h-10">
          <Image src="/images/logo.png" alt="VyapGO" fill className="object-contain" />
        </span>
        <h1
          className="text-2xl font-bold"
          style={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Account
        </h1>
      </div>

      {/* Details card with circular logo on the right */}
      <div className="mt-8 rounded-2xl bg-white border border-amber-200/50 shadow-sm overflow-hidden">
        <div className="h-[3px] w-full" style={{ background: BRAND }} />
        <div className="px-6 py-4 border-b border-amber-100/60 flex items-center justify-between">
          <div className="font-semibold text-gray-900">Business details</div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-600">Logo</div>
            <MonogramCircle initials={initials || 'VG'} />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Shop name */}
          <Row
            label="Shop name"
            value={displayName || '—'}
            editing={editing === 'displayName'}
            onEdit={() => setEditing('displayName')}
            onCancel={() => setEditing(null)}
            action={
              editing === 'displayName' ? (
                <div className="flex gap-2 items-center">
                  <input
                    className="h-10 rounded-lg border border-gray-300 px-3 text-sm"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Shree Ganesh Kirana"
                  />
                  <SaveBtn onClick={saveDisplayName} saving={saving} />
                </div>
              ) : null
            }
            saving={saving}
          />

          {/* Business type */}
          <Row
            label="Business type"
            value={answers.businessType || '—'}
            editing={editing === 'businessType'}
            onEdit={() => setEditing('businessType')}
            onCancel={() => setEditing(null)}
            action={
              editing === 'businessType' ? (
                <SelectInline
                  options={BUSINESS_TYPES}
                  value={answers.businessType || ''}
                  onChange={(v) => saveAnswer('businessType', v)}
                  saving={saving}
                />
              ) : null
            }
            saving={saving}
          />

          {/* Location */}
          <Row
            label="Location (City, State)"
            value={answers.locationCity || '—'}
            editing={editing === 'locationCity'}
            onEdit={() => setEditing('locationCity')}
            onCancel={() => setEditing(null)}
            action={
              editing === 'locationCity' ? (
                <TextInline
                  initial={answers.locationCity || ''}
                  onSave={(v) => saveAnswer('locationCity', v)}
                  saving={saving}
                  placeholder="Pune, Maharashtra"
                />
              ) : null
            }
            saving={saving}
          />

          {/* Selling channels */}
          <Row
            label="Selling channels"
            value={(answers.sellingChannels?.length ? answers.sellingChannels : ['—']).join(', ')}
            editing={editing === 'sellingChannels'}
            onEdit={() => setEditing('sellingChannels')}
            onCancel={() => setEditing(null)}
            action={
              editing === 'sellingChannels' ? (
                <MultiChipsInline
                  initial={answers.sellingChannels ?? []}
                  options={['In-store', 'WhatsApp', 'Instagram', 'Zomato', 'Swiggy', 'ONDC']}
                  onSave={(v) => saveAnswer('sellingChannels', v)}
                  saving={saving}
                />
              ) : null
            }
            saving={saving}
          />

          {/* Inventory size */}
          <Row
            label="Inventory size"
            value={answers.inventorySize || '—'}
            editing={editing === 'inventorySize'}
            onEdit={() => setEditing('inventorySize')}
            onCancel={() => setEditing(null)}
            action={
              editing === 'inventorySize' ? (
                <SelectInline
                  options={INVENTORY_SIZES}
                  value={answers.inventorySize || ''}
                  onChange={(v) => saveAnswer('inventorySize', v)}
                  saving={saving}
                />
              ) : null
            }
            saving={saving}
          />

          {/* Primary goal */}
          <Row
            label="Primary goal"
            value={answers.primaryGoal || '—'}
            editing={editing === 'primaryGoal'}
            onEdit={() => setEditing('primaryGoal')}
            onCancel={() => setEditing(null)}
            action={
              editing === 'primaryGoal' ? (
                <SelectInline
                  options={GOALS}
                  value={answers.primaryGoal || ''}
                  onChange={(v) => saveAnswer('primaryGoal', v)}
                  saving={saving}
                />
              ) : null
            }
            saving={saving}
          />
        </div>
      </div>

      {/* Sign-in methods card */}
      <AuthMethodsCard providers={providers} onProvidersUpdate={setProviders} />
    </div>
  );
}

/* ---------- Auth Methods Card ---------- */

function AuthMethodsCard({
  providers,
  onProvidersUpdate,
}: {
  providers: string[];
  onProvidersUpdate: (p: string[]) => void;
}) {
  const hasGoogle = providers.includes('google.com');
  const hasPhone = providers.includes('phone');

  const [working, setWorking] = useState<null | 'google' | 'phone-send' | 'phone-verify'>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [dial, setDial] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');

  const e164 = `${dial}${phone.replace(/\D/g, '')}`;

  async function refreshProviders() {
    try {
      await auth.currentUser?.reload();
      onProvidersUpdate(auth.currentUser?.providerData.map((p) => p.providerId) || []);
    } catch {}
  }

  async function handleLinkGoogle() {
    setErr(null);
    setMsg(null);
    setWorking('google');
    try {
      await linkGoogleToCurrent();
      setMsg('Google account linked.');
      await refreshProviders();
    } catch (e: any) {
      setErr(e?.message || 'Could not link Google');
    } finally {
      setWorking(null);
    }
  }

  async function handleSendOtp() {
    setErr(null);
    setMsg(null);
    if (!/^\+\d{6,15}$/.test(e164)) {
      setErr('Enter a valid phone number');
      return;
    }
    setWorking('phone-send');
    try {
      await startLinkPhone(e164, 'recaptcha-link');
      setOtpSent(true);
      setMsg('OTP sent to your phone.');
    } catch (e: any) {
      setErr(e?.message || 'Could not send OTP');
    } finally {
      setWorking(null);
    }
  }

  async function handleVerifyOtp() {
    setErr(null);
    setMsg(null);
    if (!/^\d{4,8}$/.test(code)) {
      setErr('Enter the OTP code');
      return;
    }
    setWorking('phone-verify');
    try {
      await verifyLinkPhone(code);
      setMsg('Phone number linked.');
      setOtpSent(false);
      setPhone('');
      setCode('');
      await refreshProviders();
    } catch (e: any) {
      setErr(e?.message || 'Could not verify OTP');
    } finally {
      setWorking(null);
    }
  }

  return (
    <div className="mt-8 rounded-2xl bg-white border border-amber-200/50 shadow-sm overflow-hidden">
      <div className="h-[3px] w-full" style={{ background: BRAND }} />
      <div className="px-6 py-4 border-b border-amber-100/60 flex items-center justify-between">
        <div className="font-semibold text-gray-900">Sign-in methods</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Google */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium text-gray-900">Google</div>
            <div className="text-sm text-gray-600">
              {hasGoogle ? 'Connected to your account.' : 'Link your Google account for easy sign-in.'}
            </div>
          </div>
          {hasGoogle ? (
            <span className="text-xs px-2.5 h-8 inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-900">
              Linked
            </span>
          ) : (
            <button
              onClick={handleLinkGoogle}
              disabled={!!working}
              className="h-9 px-4 rounded-lg text-white font-semibold disabled:opacity-60"
              style={{ background: BRAND }}
            >
              {working === 'google' ? 'Linking…' : 'Link Google'}
            </button>
          )}
        </div>

        {/* Phone */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="font-medium text-gray-900">Phone (OTP)</div>
            <div className="text-sm text-gray-600">
              {hasPhone
                ? 'A phone number is linked to your account.'
                : 'Link a phone number to sign in with OTP.'}
            </div>

            {!hasPhone && (
              <div className="mt-3">
                <label className="text-xs font-medium text-gray-700">Phone number</label>
                <div className="mt-1.5 flex gap-2">
                  <select
                    className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-gray-800 text-sm"
                    value={dial}
                    onChange={(e) => setDial(e.target.value)}
                    disabled={!!working}
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="98765 43210"
                    className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-amber-300/60"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!!working}
                  />
                </div>

                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={!!working}
                    className="mt-3 h-9 px-4 rounded-lg text-white font-semibold disabled:opacity-60"
                    style={{ background: BRAND }}
                  >
                    {working === 'phone-send' ? 'Sending OTP…' : 'Send OTP'}
                  </button>
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter OTP"
                      className="h-10 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-amber-300/60"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={!!working}
                    />
                    <button
                      onClick={handleVerifyOtp}
                      disabled={!!working}
                      className="h-9 px-4 rounded-lg text-white font-semibold disabled:opacity-60"
                      style={{ background: BRAND }}
                    >
                      {working === 'phone-verify' ? 'Verifying…' : 'Verify & link'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {hasPhone ? (
            <span className="text-xs px-2.5 h-8 inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 text-emerald-900">
              Linked
            </span>
          ) : null}
        </div>

        {(msg || err) && (
          <div className="text-sm">
            {msg && <div className="text-emerald-700">{msg}</div>}
            {err && <div className="text-red-600">{err}</div>}
          </div>
        )}

        {/* Recaptcha anchor for linking (invisible) */}
        <div id="recaptcha-link" className="hidden" />
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function MonogramCircle({ initials }: { initials: string }) {
  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md"
      style={{
        background:
          'radial-gradient(120% 120% at 0% 0%, #f97316 0%, #f59e0b 45%, #10b981 100%)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
      title="Brand logo preview"
      aria-label="Brand monogram"
    >
      {initials}
    </div>
  );
}

function Row(props: {
  label: string;
  value: string;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  action?: React.ReactNode;
  saving?: boolean;
}) {
  const { label, value, editing, onEdit, onCancel, action, saving } = props;
  return (
    <div className="px-6 py-4 flex items-start justify-between gap-4">
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="mt-1 font-medium text-gray-900 break-words">{value || '—'}</div>
      </div>
      <div className="flex items-center gap-3">
        {action}
        {editing ? (
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={onCancel}
            disabled={!!saving}
          >
            Close
          </button>
        ) : (
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={onEdit}
            disabled={!!saving}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function SaveBtn({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="h-10 px-4 rounded-lg text-white font-semibold disabled:opacity-60"
      style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, #10b981)' }}
    >
      {saving ? 'Saving…' : 'Save'}
    </button>
  );
}

function TextInline({
  initial,
  onSave,
  saving,
  placeholder,
}: {
  initial: string;
  onSave: (v: string) => void | Promise<void>;
  saving: boolean;
  placeholder?: string;
}) {
  const [val, setVal] = useState(initial);
  useEffect(() => setVal(initial), [initial]); // keep in sync if parent updates
  return (
    <div className="flex gap-2 items-center">
      <input
        className="h-10 rounded-lg border border-gray-300 px-3 text-sm"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={placeholder}
      />
      <SaveBtn onClick={() => onSave(val.trim())} saving={saving} />
    </div>
  );
}

function SelectInline({
  options,
  value,
  onChange,
  saving,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void | Promise<void>;
  saving: boolean;
}) {
  const [val, setVal] = useState(value);
  useEffect(() => setVal(value), [value]); // keep in sync if parent updates
  return (
    <div className="flex gap-2 items-center">
      <select
        className="h-10 rounded-lg border border-gray-300 px-3 text-sm"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <SaveBtn onClick={() => onChange(val)} saving={saving} />
    </div>
  );
}

function MultiChipsInline({
  initial,
  options,
  onSave,
  saving,
}: {
  initial: string[];
  options: string[];
  onSave: (v: string[]) => void | Promise<void>;
  saving: boolean;
}) {
  const [sel, setSel] = useState<string[]>(initial);
  useEffect(() => setSel(initial), [initial]); // keep in sync if parent updates
  const toggle = (v: string) =>
    setSel((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {options.map((o) => {
        const active = sel.includes(o);
        return (
          <button
            key={o}
            onClick={() => toggle(o)}
            className={`h-9 px-3 rounded-full border text-sm transition ${
              active
                ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {o}
          </button>
        );
      })}
      <SaveBtn onClick={() => onSave(sel)} saving={saving} />
    </div>
  );
}