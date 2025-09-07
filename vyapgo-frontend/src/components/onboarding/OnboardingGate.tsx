'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/auth-client';
import {
  ensureUserDoc,
  getOnboardingStatus,
  saveOnboarding,
  type OnboardingAnswers,
} from '@/lib/firebase-db';

const BG = 'rgba(0,0,0,0.45)';
const BRAND_GRADIENT = 'linear-gradient(90deg, #f97316, #f59e0b, #10b981)';

type StepId =
  | 'shopName'
  | 'businessType'
  | 'locationCity'
  | 'sellingChannels'
  | 'inventorySize'
  | 'primaryGoal';

const STEPS: { id: StepId; title: string }[] = [
  { id: 'shopName',       title: 'What is your shop name?' },
  { id: 'businessType',   title: 'What type of business do you run?' },
  { id: 'locationCity',   title: 'Where is your shop located?' },
  { id: 'sellingChannels',title: 'Where do you sell today?' },
  { id: 'inventorySize',  title: 'How big is your inventory?' },
  { id: 'primaryGoal',    title: 'What do you want to improve first?' },
];

export default function OnboardingGate() {
  const [uid, setUid] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [show, setShow] = useState(false);

  // wizard state
  const [stepIdx, setStepIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});

  // 1) Watch auth and decide to show
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setShow(false);
        setChecking(false);
        return;
      }
      setUid(user.uid);

      // make sure user doc exists
      await ensureUserDoc(user.uid);

      // local flag from signup redirect (if you set it)
      const pending = typeof window !== 'undefined'
        ? localStorage.getItem('vyap:onboarding:pending') === '1'
        : false;

      // firestore flag
      const { complete } = await getOnboardingStatus(user.uid);

      // show only if new or incomplete
      const shouldShow = pending || !complete;
      setShow(shouldShow);

      // clean the one-shot local flag so it won’t persist forever
      try { localStorage.removeItem('vyap:onboarding:pending'); } catch {}
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking || !show || !uid) return null;

  /** ---------- Progress + validation ---------- */
  const step = STEPS[stepIdx];
  const pct = Math.round(((stepIdx + 1) / STEPS.length) * 100);

  const canNext = useMemo(() => {
    switch (step.id) {
      case 'shopName':       return !!answers.shopName?.trim();
      case 'businessType':   return !!answers.businessType;
      case 'locationCity':   return !!answers.locationCity?.trim();
      case 'sellingChannels':return (answers.sellingChannels?.length || 0) > 0;
      case 'inventorySize':  return !!answers.inventorySize;
      case 'primaryGoal':    return !!answers.primaryGoal;
      default:               return false;
    }
  }, [step.id, answers]);

  const goNext = () => setStepIdx((i) => (i < STEPS.length - 1 ? i + 1 : i));
  const goBack = () => setStepIdx((i) => (i > 0 ? i - 1 : i));

  async function finish() {
    if (!uid) return;
    setBusy(true);
    try {
      await saveOnboarding(uid, { ...answers }, { complete: true });
      setShow(false); // never show again
    } finally {
      setBusy(false);
    }
  }

  /** ---------- Step body ---------- */
  function StepBody() {
    switch (step.id) {
      case 'shopName':
        return (
          <input
            autoFocus
            placeholder="e.g., Shree Ganesh Kirana"
            className="mt-3 w-full h-11 rounded-xl border border-amber-300/60 bg-white px-3 text-gray-800 outline-none focus:ring-2 focus:ring-amber-300/60"
            value={answers.shopName ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, shopName: e.target.value }))}
          />
        );

      case 'businessType':
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {['Kirana / Grocery','Restaurant','Salon','Pharmacy','Boutique','Other'].map((b) => (
              <button
                key={b}
                onClick={() => setAnswers((a) => ({ ...a, businessType: b }))}
                className={`h-11 rounded-xl border px-3 text-sm ${
                  answers.businessType === b
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        );

      case 'locationCity':
        return (
          <input
            autoFocus
            placeholder="City, State"
            className="mt-3 w-full h-11 rounded-xl border border-amber-300/60 bg-white px-3 text-gray-800 outline-none focus:ring-2 focus:ring-amber-300/60"
            value={answers.locationCity ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, locationCity: e.target.value }))}
          />
        );

      case 'sellingChannels': {
        const options = ['In-store','WhatsApp','Instagram','Zomato','Swiggy','ONDC'];
        const curr = new Set(answers.sellingChannels ?? []);
        const toggle = (v: string) => {
          curr.has(v) ? curr.delete(v) : curr.add(v);
          setAnswers((a) => ({ ...a, sellingChannels: Array.from(curr) }));
        };
        return (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {options.map((v) => {
              const selected = curr.has(v);
              return (
                <button
                  key={v}
                  onClick={() => toggle(v)}
                  className={`h-11 rounded-xl border px-3 text-sm ${
                    selected ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                             : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        );
      }

      case 'inventorySize':
        return (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {['<50','50-200','200+'].map((v) => (
              <button
                key={v}
                onClick={() => setAnswers((a) => ({ ...a, inventorySize: v }))}
                className={`h-11 rounded-xl border px-3 text-sm ${
                  answers.inventorySize === v
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        );

      case 'primaryGoal':
        return (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {['Faster billing','Online orders','Analytics & insights','Inventory tracking'].map((v) => (
              <button
                key={v}
                onClick={() => setAnswers((a) => ({ ...a, primaryGoal: v }))}
                className={`h-11 rounded-xl border px-3 text-sm text-left ${
                  answers.primaryGoal === v
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        );
    }
  }

  /** ---------- Modal ---------- */
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center" style={{ background: BG }}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden bg-white"
           style={{
             border: '1px solid rgba(251,191,36,0.35)',
             boxShadow:
               '0 20px 60px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.6) inset, 0 0 0 1px rgba(255,255,255,0.6) inset',
           }}>
        {/* Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative w-8 h-8">
              <Image src="/images/logo.png" alt="VyapGO" fill className="object-contain" />
            </span>
            <span
              className="font-semibold"
              style={{
                background: BRAND_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              VyapGO setup
            </span>
          </div>
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() => setShow(false)}
          >
            Skip for now
          </button>
        </div>

        {/* Progress */}
        <div className="px-5">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-3 text-sm text-gray-600">
            {stepIdx + 1} / {STEPS.length}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <h2 className="text-lg font-semibold text-gray-900">{step.title}</h2>
          <StepBody />

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={stepIdx === 0}
              className="px-4 h-10 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
            >
              Back
            </button>

            {stepIdx < STEPS.length - 1 ? (
              <button
                onClick={goNext}
                disabled={!canNext}
                className="px-5 h-10 rounded-lg text-white font-semibold disabled:opacity-60"
                style={{ background: BRAND_GRADIENT }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={!canNext || busy}
                className="px-5 h-10 rounded-lg text-white font-semibold disabled:opacity-60"
                style={{ background: BRAND_GRADIENT }}
              >
                {busy ? 'Saving…' : 'Finish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}