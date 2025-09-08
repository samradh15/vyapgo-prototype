'use client';

import { Fragment, useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuthUser } from '@/providers/auth-user-provider';
import { saveOnboarding } from '@/lib/firebase-db';

const QUESTIONS = [
  { key: 'storeName', label: 'Store name', type: 'text', placeholder: 'e.g., Shree Kirana' },
  { key: 'businessType', label: 'Business type', type: 'select', options: ['Grocery', 'Pharmacy', 'Restaurant', 'Electronics', 'Clothing', 'Other'] },
  { key: 'categories', label: 'Categories (comma separated)', type: 'text', placeholder: 'fruits, dairy, snacks' },
  { key: 'location', label: 'City / Area', type: 'text', placeholder: 'e.g., Pune' },
  { key: 'teamSize', label: 'Team size', type: 'number', placeholder: 'e.g., 3' },
  { key: 'goal', label: 'Main goal', type: 'select', options: ['Online catalogue', 'Billing & invoicing', 'Inventory tracking', 'Marketing / WhatsApp catalog'] },
] as const;

export default function OnboardingModal() {
  const { user, needsOnboarding, refreshProfile } = useAuthUser();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const open = !!(user && needsOnboarding);
  const q = QUESTIONS[step];
  const progress = useMemo(() => ((step + 1) / QUESTIONS.length) * 100, [step]);

  const next = async () => {
    if (step < QUESTIONS.length - 1) return setStep(step + 1);
    if (!user) return;
    setSaving(true);
    try {
      await saveOnboarding(user.uid, {
        shopName: answers.storeName || '',
        businessType: answers.businessType || '',
        locationCity: answers.location || '',
        primaryGoal: answers.goal || '',
      });
      await refreshProfile();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-xl">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-3"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-3"
            >
              <Dialog.Panel className="rounded-2xl bg-white shadow-xl border border-amber-200/60">
                <div className="p-6">
                  <Dialog.Title className="text-lg font-semibold">Let’s set up your shop</Dialog.Title>
                  <p className="text-sm text-gray-600 mt-1">Answer a few quick questions to personalize your dashboard.</p>

                  <div className="mt-4 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-emerald-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-800">{q.label}</label>
                    {q.type === 'text' && (
                      <input
                        className="mt-2 w-full h-11 rounded-xl border border-gray-200 px-3"
                        placeholder={q.placeholder}
                        value={answers[q.key] || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                      />
                    )}
                    {q.type === 'number' && (
                      <input
                        type="number"
                        className="mt-2 w-full h-11 rounded-xl border border-gray-200 px-3"
                        placeholder={q.placeholder}
                        value={answers[q.key] || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                      />
                    )}
                    {q.type === 'select' && (
                      <select
                        className="mt-2 w-full h-11 rounded-xl border border-gray-200 px-3"
                        value={answers[q.key] || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                      >
                        <option value="">Select…</option>
                        {q.options!.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      disabled={step === 0 || saving}
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      className="px-4 h-10 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      disabled={saving}
                      onClick={next}
                      className="px-5 h-10 rounded-lg text-white font-semibold"
                      style={{ background: 'linear-gradient(90deg,#f97316,#f59e0b,#10b981)' }}
                    >
                      {step === QUESTIONS.length - 1 ? (saving ? 'Saving…' : 'Finish') : 'Next'}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}