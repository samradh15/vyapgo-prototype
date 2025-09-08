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
const DISMISS_KEY = 'vyap:onboarding:dismissed:until';
const PENDING_KEY = 'vyap:onboarding:pending';

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

function readDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const until = Number(raw);
  return Number.isFinite(until) && Date.now() < until;
}
function dismissForDays(days = 7) {
  if (typeof window === 'undefined') return;
  const ms = days * 24 * 60 * 60 * 1000;
  localStorage.setItem(DISMISS_KEY, String(Date.now() + ms));
}

export default function OnboardingGate() {
  // --- State hooks (always called, never conditional)
  const [uid, setUid] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [show, setShow] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});

  // --- Effects (always called)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setUid(null);
          setShow(false);
          return;
        }
        setUid(user.uid);

        await ensureUserDoc(user.uid);

        const pending = typeof window !== 'undefined'
          ? localStorage.getItem(PENDING_KEY) === '1'
          : false;
        const dismissed = readDismissed();

        const { complete } = await getOnboardingStatus(user.uid);

        const shouldShow = (pending || !complete) && !dismissed;
        setShow(shouldShow);

        try { localStorage.removeItem(PENDING_KEY); } catch {}
      } catch (e: any) {
        setErr(e?.message || 'Could not check onboarding status.');
        setShow(false);
      } finally {
        setChecking(false);
      }
    });
    return () => unsub();
  }, []);

  // --- Derived values (hooks still ALWAYS called)
  const step = STEPS[Math.min(stepIdx, STEPS.length - 1)];
  const pct = Math.round(((Math.min(stepIdx, STEPS.length - 1) + 1) / STEPS.length) * 100);

  const canNext = useMemo(() => {
    switch (step.id) {
      case 'shopName':        return !!answers.shopName?.trim();
      case 'businessType':    return !!answers.businessType;
      case 'locationCity':    return !!answers.locationCity?.trim();
      case 'sellingChannels': return (answers.sellingChannels?.length || 0) > 0;
      case 'inventorySize':   return !!answers.inventorySize;
      case 'primaryGoal':     return !!answers.primaryGoal;
      default:                return false;
    }
  }, [step.id, answers]);

  // --- Handlers (never conditionally declared)
  const goNext = () => setStepIdx((i) => (i < STEPS.length - 1 ? i + 1 : i));
  const goBack = () => setStepIdx((i) => (i > 0 ? i - 1 : i));

  async function finish() {
    if (!uid) return;
    setBusy(true);
    setErr(null);
    try {
      await saveOnboarding(uid, { ...answers }, { complete: true });
      setShow(false);
    } catch (e: any) {
      setErr(e?.message || 'Could not save. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function skipForNow() {
    dismissForDays(7);
    setShow(false);
  }

  // --- Gate the UI AFTER all hooks have run
  const gated = checking || !uid || !show;
  if (gated) return null;

  // --- Step body
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

  // --- Modal
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
            onClick={skipForNow}
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

          {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
        </div>
      </div>
    </div>
  );
}