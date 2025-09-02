'use client';

import React, { useEffect, useMemo, useRef, useState, useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* -----------------------------
   Brand + Motion
------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const BRAND_GRADIENT = 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500';
const BRAND_GRADIENT_TEXT =
  'bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-600';

/* -----------------------------
   Icons (inline)
------------------------------ */
function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2l1.8 5.5L19 9l-5.2 1.5L12 16l-1.8-5.5L5 9l5.2-1.5L12 2z" />
    </svg>
  );
}
function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 1 1-6 0V5a3 3 0 0 1 3-3zm-1 17.93A7.001 7.001 0 0 1 5 13h2a5 5 0 1 0 10 0h2a7.001 7.001 0 0 1-6 6.93V23h-2v-3.07z" />
    </svg>
  );
}
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <path d="M20 6L9 17l-5-5" strokeWidth="2" />
    </svg>
  );
}
function BoxGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <path d="M3 7l9 4 9-4M3 7v10l9 4 9-4V7" strokeWidth="2" />
    </svg>
  );
}
function CreditGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="2" />
      <path d="M3 10h18" strokeWidth="2" />
    </svg>
  );
}
function TruckGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <path d="M3 7h11v7H3zM14 10h3l3 3v1h-2M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" strokeWidth="2" />
    </svg>
  );
}
function UsersGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <circle cx="9" cy="8" r="3" strokeWidth="2" />
      <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M17 3a3 3 0 1 1 0 6M23 21v-2a4 4 0 0 0-3-3" strokeWidth="2" />
    </svg>
  );
}
function ShieldGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2l8 3v6c0 6-4.5 10.5-8 12-3.5-1.5-8-6-8-12V5l8-3z" />
    </svg>
  );
}
function BoltGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

/* -----------------------------
   Premium Mandala (crisp SVG)
------------------------------ */
function MandalaBackdrop() {
  const id = useId();
  const gid = `g-${id}`;
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* brand glows */}
      <div className="absolute inset-0 opacity-[0.10]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_18%_-10%,rgba(249,115,22,0.24),transparent),radial-gradient(1000px_520px_at_82%_0%,rgba(245,158,11,0.24),transparent),radial-gradient(1000px_760px_at_50%_110%,rgba(16,185,129,0.24),transparent)]" />
      </div>

      {/* center mandala */}
      <motion.div
        className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-[0.14]"
        style={{ width: 900, height: 900 }}
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <defs>
            <radialGradient id={gid}>
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </radialGradient>
          </defs>
          {[24, 38, 52, 66, 80, 94].map((r, i) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={`url(#${gid})`} strokeWidth={i === 5 ? 1.4 : 0.9} />
          ))}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * 15 * Math.PI) / 180;
            const x1 = 100 + Math.cos(a) * 45;
            const y1 = 100 + Math.sin(a) * 45;
            const x2 = 100 + Math.cos(a) * 95;
            const y2 = 100 + Math.sin(a) * 95;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${gid})`} strokeWidth="1" />;
          })}
        </svg>
      </motion.div>
    </div>
  );
}

/* -----------------------------
   Header (sticky, minimal)
------------------------------ */
function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition ${solid ? 'bg-[#F6F0E6]/90 backdrop-blur border-b border-amber-200/60' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-16 flex items-center">
          <Link href="/" aria-label="Go to VyapGO home" className="flex items-center gap-3">
            <span className="relative w-9 h-9">
              <Image src="/images/logo.png" alt="VyapGO" fill className="object-contain" priority />
            </span>
            <span className="text-lg font-bold tracking-tight">
              <span className={BRAND_GRADIENT_TEXT}>VyapYantra</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* -----------------------------
   Mic button
------------------------------ */
type MicState = 'idle' | 'listening' | 'blocked';
function MicButton({ state, onClick, disabled }: { state: MicState; onClick: () => void; disabled: boolean }) {
  const active = state === 'listening';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || state === 'blocked'}
      className={`relative inline-flex items-center justify-center w-11 h-11 rounded-xl text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
        active ? 'bg-red-500' : 'bg-gray-900'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110'}`}
      aria-label={state === 'blocked' ? 'Microphone blocked' : active ? 'Stop listening' : 'Start voice input'}
      title={state === 'blocked' ? 'Microphone blocked' : active ? 'Stop' : 'Speak'}
    >
      <MicIcon className="w-5 h-5" />
      <AnimatePresence>
        {active && (
          <motion.span
            className="absolute inset-0 rounded-xl ring-2 ring-red-400"
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.6, 0.9, 0.6] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </button>
  );
}

/* -----------------------------
   Toast
------------------------------ */
function Toast({ msg }: { msg: string }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-full bg-gray-900 text-white text-sm px-4 py-2 shadow-lg"
      role="status"
    >
      {msg}
    </motion.div>
  );
}

/* -----------------------------
   App DNA badges
------------------------------ */
type FeatureKey = 'catalog' | 'payments' | 'delivery' | 'multiuser';
function detectFeatures(input: string): FeatureKey[] {
  const t = input.toLowerCase();
  const out = new Set<FeatureKey>();
  if (/\b(sku|catalog|product|variant|barcode|stock|listing)\b/.test(t)) out.add('catalog');
  if (/\b(pay|upi|cod|payment|checkout|cart|escrow)\b/.test(t)) out.add('payments');
  if (/\b(delivery|slots|area|pincode|dispatch|ship)\b/.test(t)) out.add('delivery');
  if (/\b(staff|role|branch|multi|user|team)\b/.test(t)) out.add('multiuser');
  return Array.from(out);
}
function AppDNABadges({ value }: { value: string }) {
  const features = useMemo(() => detectFeatures(value), [value]);
  const items: { id: FeatureKey; icon: React.ReactNode; label: string }[] = [
    { id: 'catalog', icon: <BoxGlyph className="w-4 h-4" />, label: 'Catalog' },
    { id: 'payments', icon: <CreditGlyph className="w-4 h-4" />, label: 'Payments' },
    { id: 'delivery', icon: <TruckGlyph className="w-4 h-4" />, label: 'Delivery' },
    { id: 'multiuser', icon: <UsersGlyph className="w-4 h-4" />, label: 'Staff' },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const on = features.includes(it.id);
        return (
          <span
            key={it.id}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
              on ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            {it.icon}
            {it.label}
            {on && <CheckIcon className="w-3 h-3 text-emerald-700" />}
          </span>
        );
      })}
    </div>
  );
}

/* -----------------------------
   Sample templates (grid)
------------------------------ */
const TEMPLATES = [
  {
    name: 'Grocery + Delivery',
    tags: ['Catalog', 'Delivery slots', 'UPI/COD'],
    prompt: 'Grocery shop app for my locality. Need product catalog, delivery slots per area, UPI and COD.',
  },
  {
    name: 'Retail POS Lite',
    tags: ['Catalog', 'Barcode', 'Stock'],
    prompt: 'Retail catalog with barcode scanning and stock tracking. Staff users for two branches.',
  },
  {
    name: 'Pharmacy',
    tags: ['E-Rx', 'Refills', 'Delivery'],
    prompt: 'Pharmacy app with e-prescription upload, refill reminders, and local delivery.',
  },
  {
    name: 'Restaurant',
    tags: ['Menu', 'Dine-in', 'Online orders'],
    prompt: 'Restaurant app with digital menu, table dine-in orders and online ordering.',
  },
  {
    name: 'Hardware',
    tags: ['RFQ', 'Quotes', 'GST POs'],
    prompt: 'Hardware store app focused on RFQ and negotiated quotes, with GST invoices and POs.',
  },
  {
    name: 'Apparel',
    tags: ['Variants', 'Sizes', 'Dispatch'],
    prompt: 'Apparel catalog with variants (size/color), order tracking and 48–72h dispatch.',
  },
] as const;

function TemplateCard({
  item,
  onUse,
}: {
  item: typeof TEMPLATES[number];
  onUse: (p: string) => void;
}) {
  return (
    <button
      onClick={() => onUse(item.prompt)}
      className="group text-left rounded-2xl border border-amber-200/70 bg-white p-4 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-amber-400"
    >
      <div className="font-semibold text-gray-900">{item.name}</div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {item.tags.map((t) => (
          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-gray-700 border border-amber-200/70">
            {t}
          </span>
        ))}
      </div>
      {/* faux phone preview */}
      <div className="mt-3 rounded-xl border border-amber-200/70 overflow-hidden">
        <div className="h-8 bg-amber-50" />
        <div className="p-3 space-y-2">
          <div className="h-3 w-3/5 bg-amber-100 rounded" />
          <div className="h-3 w-2/5 bg-amber-100 rounded" />
          <div className="h-10 w-full bg-amber-50 rounded-lg" />
          <div className="h-3 w-4/5 bg-amber-100 rounded" />
        </div>
      </div>
      <div className="mt-3 text-sm text-orange-700">Use this template →</div>
    </button>
  );
}

/* -----------------------------
   How it works
------------------------------ */
function HowItWorks() {
  const steps = [
    { icon: <SparkIcon className="w-5 h-5 text-amber-600" />, t: 'Describe your shop', d: 'Tell us what your app should do.' },
    { icon: <BoltGlyph className="w-5 h-5" />, t: 'We scaffold features', d: 'Inventory, payments, delivery & more.' },
    { icon: <ShieldGlyph className="w-5 h-5" />, t: 'Refine & export', d: 'Open Studio, tweak, and export APK.' },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {steps.map((s) => (
        <div key={s.t} className="rounded-xl border border-amber-200/70 bg-white p-4">
          <div className="flex items-center gap-2 font-medium text-gray-900">{s.icon}{s.t}</div>
          <div className="text-sm text-gray-600 mt-1">{s.d}</div>
        </div>
      ))}
    </div>
  );
}

/* -----------------------------
   Page
------------------------------ */
export default function VyapYantraPage() {
  const reduceMotion = useReducedMotion();

  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [micState, setMicState] = useState<MicState>('idle');
  const [online, setOnline] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const toastTimer = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // 👇 NEW: mount flag to avoid hydration mismatch for Mandala
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // focus shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // online state
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2200);
  };

  // form submit (robust GET redirect)
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    if (!value.trim()) {
      e.preventDefault();
      showToast('Please describe your shop or app idea.');
      return;
    }
    if (!online) {
      e.preventDefault();
      showToast('You are offline — try again when back online.');
      return;
    }
    setBusy(true);
    try { sessionStorage.setItem('businessIdea', value.trim()); } catch {}
    // browser navigates via GET /studio?brief=...
  };

  // mic
  const toggleMic = () => {
    if (micState === 'listening') {
      try { recognitionRef.current?.stop?.(); } catch {}
      setMicState('idle');
      return;
    }
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { setMicState('blocked'); showToast('Microphone not available on this browser.'); return; }
    try {
      const recog = new SR();
      recognitionRef.current = recog;
      recog.lang = 'hi-IN';
      recog.continuous = false;
      recog.interimResults = false;
      recog.onstart = () => setMicState('listening');
      recog.onend = () => setMicState('idle');
      recog.onerror = () => { setMicState('blocked'); showToast('Mic blocked — please allow microphone or type.'); };
      recog.onresult = (e: any) => {
        const transcript: string = e?.results?.[0]?.[0]?.transcript || '';
        const t = transcript.trim().slice(0, 240);
        if (t) {
          setValue(t);
          // submit form reliably
          setTimeout(() => formRef.current?.requestSubmit(), 50);
        }
      };
      recog.start();
    } catch {
      setMicState('blocked');
      showToast('Mic blocked — please allow microphone or type.');
    }
  };

  useEffect(() => () => {
    try { recognitionRef.current?.stop?.(); } catch {}
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  const year = new Date().getFullYear();

  /* ------------- UI ------------- */
  return (
    <div className="relative min-h-screen text-gray-900" style={{ backgroundColor: '#F6F0E6' /* beige */ }}>
      {/* 👇 render Mandala only after mount to prevent hydration drift */}
      {mounted && <MandalaBackdrop />}
      <Header />

      {/* HERO */}
      <main className="relative z-10">
        <section className="pt-28 pb-10">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            >
              <span className={BRAND_GRADIENT_TEXT}>Build your shop app in minutes.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.06 }}
              className="mt-3 text-lg text-gray-700"
            >
              Describe your shop. We’ll open Studio with the right starting point.
            </motion.p>

            {/* Input form (server-friendly GET) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
              className="mx-auto mt-8 max-w-3xl rounded-3xl border border-amber-200/70 bg-white shadow-sm"
            >
              <form
                ref={formRef}
                action="/studio"
                method="GET"
                onSubmit={onSubmit}
                className="contents"
              >
                <div className="flex items-stretch gap-2 p-2 sm:p-3">
                  <div className="hidden sm:flex items-center pl-2">
                    <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-white ${BRAND_GRADIENT} shadow`}>
                      <SparkIcon className="w-5 h-5" />
                    </span>
                  </div>
                  <input
                    ref={inputRef}
                    name="brief"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label="Describe your shop and app idea"
                    placeholder="e.g., Grocery app with delivery slots and UPI"
                    className="flex-1 px-4 py-4 rounded-2xl border border-amber-200/70 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 outline-none text-base"
                    maxLength={240}
                    autoFocus
                  />
                  <div className="flex items-center gap-2 pr-2">
                    <MicButton state={micState} onClick={toggleMic} disabled={busy || !online} />
                    <button
                      type="submit"
                      disabled={busy || !online}
                      className={`px-5 h-12 rounded-2xl text-white font-semibold shadow ${BRAND_GRADIENT} hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-60`}
                    >
                      Start in Studio
                    </button>
                  </div>
                </div>
              </form>

              <div className="flex items-center justify-between px-5 pb-3 text-xs text-gray-600">
                <div>Tip: press <span className="font-semibold">/</span> to focus the box.</div>
                <div>Voice processed in-browser. We don’t store audio.</div>
              </div>
              {/* feature hint */}
              <div className="border-t border-amber-100/70 px-5 py-3">
                <AppDNABadges value={value} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* SAMPLE APPS */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-gray-900">See what you can build</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((t) => (
                <TemplateCard key={t.name} item={t} onUse={(p) => {
                  setValue(p);
                  // submit form straight away to studio
                  setTimeout(() => formRef.current?.requestSubmit(), 50);
                }} />
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <HowItWorks />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-amber-200/70 bg-white p-4">
                <div className="font-medium text-gray-900">How do I export an APK?</div>
                <div className="text-sm text-gray-600 mt-1">
                  Open your app in Studio → Export. We generate a signed APK and give you a download link.
                </div>
              </div>
              <div className="rounded-xl border border-amber-200/70 bg-white p-4">
                <div className="font-medium text-gray-900">Is voice private?</div>
                <div className="text-sm text-gray-600 mt-1">Yes. Speech is processed in-browser. No audio leaves your device.</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center text-xs text-gray-600">
              © <span suppressHydrationWarning>{year}</span> VyapYantra • Powered by VyapGO
            </div>
          </div>
        </footer>
      </main>

      <AnimatePresence>{toast && <Toast msg={toast} />}</AnimatePresence>

      {/* JSON-LD (static target) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'VyapYantra',
            potentialAction: {
              '@type': 'SearchAction',
              target: '/studio?brief={query}', // ← updated
              'query-input': 'required name=query',
            },
          }),
        }}
      />
    </div>
  );
}