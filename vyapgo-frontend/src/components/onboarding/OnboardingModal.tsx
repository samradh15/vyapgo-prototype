'use client';

import React, { useEffect, useMemo, useState } from 'react';

type StepId = 'category' | 'name' | 'location' | 'type' | 'language' | 'goal';

const STEPS: StepId[] = ['category', 'name', 'location', 'type', 'language', 'goal'];

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  // answers
  const [category, setCategory] = useState<string>('');
  const [bizName, setBizName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [kind, setKind] = useState<string>('Products');
  const [language, setLanguage] = useState<string>('English');
  const [goal, setGoal] = useState<string>('Launch quickly');

  // open on first load if pending flag is set
  useEffect(() => {
    try {
      if (localStorage.getItem('vyap:onboarding:pending') === '1') {
        setOpen(true);
      }
    } catch {}
  }, []);

  const progressPct = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  function closeAndClear() {
    try {
      localStorage.removeItem('vyap:onboarding:pending');
    } catch {}
    setOpen(false);
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleFinish();
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleFinish() {
    // save to localStorage (wire to API later)
    const payload = {
      category,
      bizName,
      city,
      pincode,
      kind,
      language,
      goal,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('vyap:onboarding:data', JSON.stringify(payload));
      localStorage.setItem('vyap:has_onboarded', '1');
      localStorage.removeItem('vyap:onboarding:pending');
    } catch {}
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={closeAndClear} />
      {/* modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-amber-200/50 overflow-hidden">
        {/* progress */}
        <div className="h-1 bg-amber-100">
          <div
            className="h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Quick setup</h3>
            <button
              onClick={closeAndClear}
              className="text-gray-500 hover:text-gray-800 rounded-md px-2 py-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">Answer a few questions to personalize VyapGO.</p>

          {/* step content */}
          {STEPS[step] === 'category' && (
            <div>
              <label className="text-sm font-medium text-gray-800">What kind of shop do you run?</label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {['Grocery', 'Pharmacy', 'Restaurant', 'Electronics', 'Clothing', 'Other'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      category === c ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {STEPS[step] === 'name' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-800">Business name</label>
              <input
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="eg. Shree Ram General Store"
                className="w-full h-11 rounded-xl border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-amber-300/60"
              />
            </div>
          )}

          {STEPS[step] === 'location' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-800">Where is your shop?</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-amber-300/60"
                />
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  inputMode="numeric"
                  className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-amber-300/60"
                />
              </div>
            </div>
          )}

          {STEPS[step] === 'type' && (
            <div>
              <label className="text-sm font-medium text-gray-800">Do you sell products or services?</label>
              <div className="mt-3 flex gap-2">
                {['Products', 'Services', 'Both'].map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      kind === k ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {STEPS[step] === 'language' && (
            <div>
              <label className="text-sm font-medium text-gray-800">Preferred language</label>
              <div className="mt-3 flex gap-2 flex-wrap">
                {['English', 'हिंदी', 'বাংলা', 'मराठी', 'ગુજરાતી', 'தமிழ்'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      language === l ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {STEPS[step] === 'goal' && (
            <div>
              <label className="text-sm font-medium text-gray-800">What’s your main goal?</label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {['Launch quickly', 'Track inventory', 'Grow sales', 'Accept payments', 'Staff mgmt', 'Analytics'].map(
                  (g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`px-3 py-2 rounded-lg border text-sm ${
                        goal === g ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {g}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`px-4 py-2 rounded-lg text-sm border ${
                step === 0 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button onClick={closeAndClear} className="text-sm text-gray-500 hover:text-gray-800">
                Skip for now
              </button>
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(90deg, #f97316, #f59e0b, #10b981)' }}
              >
                {step === STEPS.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}