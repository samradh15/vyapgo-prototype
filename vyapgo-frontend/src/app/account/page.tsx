'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth-client';
import {
  ensureUserDoc,
  getAccount,
  updateAccount,
  type OnboardingAnswers,
} from '@/lib/firebase-db';

const BRAND = 'linear-gradient(90deg, #f97316, #f59e0b, #10b981)';

type FieldKey =
  | 'shopName'
  | 'businessType'
  | 'locationCity'
  | 'sellingChannels'
  | 'inventorySize'
  | 'primaryGoal';

const BUSINESS_TYPES = [
  'Kirana / Grocery',
  'Restaurant',
  'Salon',
  'Pharmacy',
  'Boutique',
  'Other',
];

const INVENTORY_SIZES = ['<50', '50-200', '200+'];

const GOALS = [
  'Faster billing',
  'Online orders',
  'Analytics & insights',
  'Inventory tracking',
];

export default function AccountPage() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile + answers
  const [displayName, setDisplayName] = useState('');
  const [answers, setAnswers] = useState<OnboardingAnswers>({});

  // editing which row?
  const [editing, setEditing] = useState<FieldKey | 'displayName' | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login');
        return;
      }
      setUid(user.uid);

      await ensureUserDoc(user.uid, {
        displayName: user.displayName ?? null,
        providerIds: user.providerData?.map((p) => p.providerId) ?? [],
      });

      const data = await getAccount(user.uid);
      setDisplayName(data.profile.displayName || data.onboarding.answers.shopName || '');
      setAnswers(data.onboarding.answers || {});

      setLoading(false);
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
    try {
      await updateAccount(uid, {
        profile: { displayName },
        onboardingAnswers: { shopName: displayName },
      });
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  async function saveAnswer<K extends FieldKey>(key: K, value: OnboardingAnswers[K]) {
    if (!uid) return;
    setSaving(true);
    try {
      await updateAccount(uid, { onboardingAnswers: { [key]: value } });
      setAnswers((a) => ({ ...a, [key]: value }));
      setEditing(null);
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
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

      <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Left: editable details */}
        <div className="rounded-2xl bg-white border border-amber-200/50 shadow-sm">
          <div className="px-6 py-4 border-b border-amber-100/60 font-semibold text-gray-900">
            Business details
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
            />
          </div>
        </div>

        {/* Right: Brand tile (no emoji, no storage) */}
        <div className="rounded-2xl bg-white border border-amber-200/50 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900">Brand</div>
          </div>

          {/* Monogram logo */}
          <div className="mt-4 flex items-center gap-4">
            <Monogram initials={initials || 'VG'} />
            <div className="text-sm text-gray-600">
              Your basic brand mark is a monogram generated from your shop name.  
              You can refine this later when Storage is enabled.
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-1">Initials</div>
            <div className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">
              {initials || 'VG'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Monogram({ initials }: { initials: string }) {
  return (
    <div
      className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg"
      style={{
        background:
          'radial-gradient(120% 120% at 0% 0%, #f97316 0%, #f59e0b 45%, #10b981 100%)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
      title="Brand mark"
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
}) {
  const { label, value, editing, onEdit, onCancel, action } = props;
  return (
    <div className="px-6 py-4 flex items-start justify-between gap-4">
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="mt-1 font-medium text-gray-900 break-words">{value || '—'}</div>
      </div>
      <div className="flex items-center gap-3">
        {action}
        {editing ? (
          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={onCancel}>
            Close
          </button>
        ) : (
          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={onEdit}>
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
  return (
    <div className="flex gap-2 items-center">
      <input
        className="h-10 rounded-lg border border-gray-300 px-3 text-sm"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={placeholder}
      />
      <SaveBtn onClick={() => onSave(val)} saving={saving} />
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
            className={`h-9 px-3 rounded-full border text-sm ${
              active ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-gray-300'
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