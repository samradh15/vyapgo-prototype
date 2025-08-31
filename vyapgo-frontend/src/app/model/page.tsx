'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LazyMotion, domAnimation, m, AnimatePresence, useReducedMotion } from 'framer-motion';



/* =========================================================
   Brand tokens (aligned with Marketplace)
========================================================= */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const GRADIENT_BAR = 'bg-gradient-to-r from-orange-500 via-yellow-500 to-emerald-500';
const CARD = 'rounded-2xl border border-gray-200 bg-white';
const SHADOW = 'shadow-sm';
const CTA =
  'px-5 py-2.5 rounded-xl text-white font-semibold ' +
  'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 ' +
  'transition shadow-lg hover:shadow-xl';
const KEY = { draft: 'yantra:draft:v1', dna: 'yantra:dna:v1' };

/* =========================================================
   Types
========================================================= */
type FeatureKey = 'catalog' | 'rfq' | 'payments' | 'crm' | 'gst' | 'inventory';
type LanguageKey = 'en' | 'hi';

type AppDNA = {
  name: string;
  category: string;
  city?: string;
  leadTimeDays?: number;
  moq?: string;
  payments?: string[];
  languages: LanguageKey[];
  features: FeatureKey[];
  theme: 'sunrise' | 'saffron';
  prompt: string;
};

/* =========================================================
   Helpers
========================================================= */
const cls = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');
const sanitize = (s: string) =>
  s
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
const isHindi = (s: string) => /[\u0900-\u097F]/.test(s);
const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

function extractFromPrompt(prompt: string) {
  const p = prompt.toLowerCase();
  const catMap: Record<string, string> = {
    grocery: 'Grocery', kirana: 'Grocery', apparel: 'Apparel', clothing: 'Apparel', garment: 'Apparel',
    packaging: 'Packaging', pharma: 'Pharma', medical: 'Pharma', electronics: 'Electronics',
    lights: 'Electronics', hardware: 'Home & Utility', housekeeping: 'Home & Utility',
  };
  let category = 'General';
  for (const k of Object.keys(catMap)) if (p.includes(k)) { category = catMap[k]; break; }

  const cityList = ['mumbai','delhi','noida','gurgaon','gurugram','pune','bengaluru','bangalore','hyderabad','chennai','kolkata','jaipur','indore','nagpur','ahmedabad','surat','thane','andheri','borivali'];
  let city: string | undefined;
  const inMatch = p.match(/\bin\s+([a-z]+(?:\s+[a-z]+)?)/i);
  if (inMatch) city = cap(inMatch[1]);
  if (!city) for (const c of cityList) { if (p.includes(c)) { city = cap(c); break; } }

  let leadTimeDays: number | undefined;
  const d = p.match(/(\d+)\s*(?:day|days|din)/i);
  const h = p.match(/(\d+)\s*(?:hour|hours|ghante)/i);
  if (d) leadTimeDays = Number(d[1]);
  else if (h) leadTimeDays = Math.max(1, Math.round(Number(h[1]) / 24));

  let moq: string | undefined;
  const moqMatch = p.match(/moq\s*(\d+[a-zA-Z\- ]*)/i) || p.match(/(\d{2,6})\s*(?:pcs|pieces|units|bags)/i);
  if (moqMatch) moq = moqMatch[0].toUpperCase();

  const payments: string[] = [];
  if (p.includes('upi')) payments.push('UPI');
  if (p.includes('cod') || p.includes('cash')) payments.push('COD');
  if (p.includes('neft') || p.includes('imps') || p.includes('net')) payments.push('NEFT/IMPS');
  if (p.includes('escrow')) payments.push('Escrow');
  if (p.includes('gst')) payments.push('GST Invoices');

  return { category, city, leadTimeDays, moq, payments };
}

function autoName(category: string, city?: string) {
  const root = category === 'General' ? 'Vyap' : category.split('&')[0];
  return city ? `${city} ${root}` : `${root} App`;
}

const defaultDNA = (prompt: string): AppDNA => {
  const x = extractFromPrompt(prompt);
  return {
    name: autoName(x.category, x.city),
    category: x.category,
    city: x.city,
    leadTimeDays: x.leadTimeDays,
    moq: x.moq,
    payments: x.payments,
    languages: [isHindi(prompt) ? 'hi' : 'en'],
    features: ['catalog', 'rfq', 'payments'],
    theme: 'sunrise',
    prompt,
  };
};

/* =========================================================
   Header (glass, brand-aligned)
========================================================= */
function HeaderThemed() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <m.nav
      className={cls(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out',
        isScrolled ? 'bg-white/85 backdrop-blur-md shadow-sm' : 'bg-white/70 backdrop-blur'
      )}
      initial={{ y: reduce ? 0 : -48, opacity: reduce ? 1 : 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.45, ease: 'easeOut' }}
      aria-label="Main"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative w-9 h-9">
              <Image src="/images/logo.png" alt="VyapGO" fill className="object-contain" />
            </span>
            <span className="text-xl font-bold text-gray-900">
              Vyap<span className="text-orange-600">Yantra</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-gray-800 hover:text-orange-700">Marketplace</Link>
            <Link href="/services" className="text-gray-800 hover:text-orange-700">Solutions</Link>
            <Link href="/docs" className="text-gray-800 hover:text-orange-700">Docs</Link>
            <Link href="/model" className={CTA}>Open Studio</Link>
          </div>
        </div>
      </div>
    </m.nav>
  );
}

/* =========================================================
   Subtle background (behind content, no blur veil)
========================================================= */
function WatermarkBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 select-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1000px 500px at 20% -10%, rgba(255,137,56,0.07), transparent),' +
            'radial-gradient(900px 450px at 80% 0%, rgba(255,221,87,0.07), transparent),' +
            'radial-gradient(1100px 650px at 50% 120%, rgba(16,185,129,0.07), transparent)',
        }}
      />
      <div className="absolute -top-24 right-[-120px] w-[520px] h-[520px] opacity-35">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <radialGradient id="wm-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFEDD5" />
              <stop offset="60%" stopColor="#FFE08A" />
              <stop offset="100%" stopColor="#D1FAE5" />
            </radialGradient>
          </defs>
          {[30, 50, 70, 90].map((r, i) => (
            <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="url(#wm-grad)" strokeWidth="1.2" />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* =========================================================
   UI Atoms
========================================================= */
function Pill({
  children, onRemove, active, onClick, title,
}: { children: React.ReactNode; onRemove?: () => void; active?: boolean; onClick?: () => void; title?: string; }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cls(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm',
        active ? 'border-orange-300 bg-orange-50 text-orange-800' : 'border-gray-200 bg-white text-gray-800',
        'hover:shadow-sm transition'
      )}
    >
      <span>{children}</span>
      {onRemove && (
        <span
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-1 text-gray-500 hover:text-gray-800"
          aria-label="Remove"
        >
          ×
        </span>
      )}
    </button>
  );
}

const ALL_FEATURES: { key: FeatureKey; label: string; desc: string }[] = [
  { key: 'catalog',  label: 'Catalog',  desc: 'List products/services' },
  { key: 'rfq',      label: 'RFQ',      desc: 'Request for quotes' },
  { key: 'payments', label: 'Payments', desc: 'UPI / Escrow / NEFT' },
  { key: 'crm',      label: 'CRM',      desc: 'Leads & follow-ups' },
  { key: 'gst',      label: 'GST POs',  desc: 'Invoices & POs' },
  { key: 'inventory',label: 'Inventory',desc: 'Stock & alerts' },
];

/* =========================================================
   Composer + Voice
========================================================= */
function Composer({
  text, setText, languages, setLanguages,
  features, setFeatures, onValidChange, onPreviewDNA,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  languages: LanguageKey[];
  setLanguages: React.Dispatch<React.SetStateAction<LanguageKey[]>>;
  features: FeatureKey[];
  setFeatures: React.Dispatch<React.SetStateAction<FeatureKey[]>>;
  onValidChange: (ok: boolean) => void;
  onPreviewDNA: () => void;
}) {
  const hi = isHindi(text);
  const [err, setErr] = React.useState<string | null>(null);
  const [listening, setListening] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [micOk, setMicOk] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [restored, setRestored] = React.useState<{ show: boolean; val: string | null }>({ show: false, val: null });

  React.useEffect(() => {
    const ok = typeof window !== 'undefined' && (window.webkitSpeechRecognition || window.SpeechRecognition);
    setMicOk(!!ok);
  }, []);

  React.useEffect(() => {
    const s = sanitize(text);
    let e: string | null = null;
    if (!s) e = hi ? 'कृपया अपने दुकान के बारे में लिखें।' : 'Please describe your shop.';
    else if (s.length < 8) e = hi ? 'और विवरण जोड़ें (कम से कम 8 अक्षर)।' : 'Add a bit more detail (min 8 chars).';
    else if (s.length > 800) e = hi ? 'पाठ बहुत लंबा है (अधिकतम 800).' : 'Text is too long (max 800).';
    else if (features.length === 0) e = hi ? 'कम से कम एक फीचर चुनें।' : 'Pick at least one feature.';
    setErr(e);
    onValidChange(!e);
  }, [text, features, hi, onValidChange]);

  // autosave draft
  React.useEffect(() => {
    const id = window.setInterval(() => {
      const s = sanitize(text);
      if (s) localStorage.setItem(KEY.draft, s);
    }, 1000);
    return () => window.clearInterval(id);
  }, [text]);

  // restore draft
  React.useEffect(() => {
    const saved = localStorage.getItem(KEY.draft);
    if (saved && !text) setRestored({ show: true, val: saved });
  }, [text]);

  // suggestions
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      const trimmed = sanitize(text);
      if (!trimmed) { setSuggestions([]); return; }
      const ex = extractFromPrompt(trimmed);
      const base: string[] = [];
      if (!ex.city) base.push(hi ? 'शहर जोड़ें (उदा. “अंधेरी”)' : 'Add city (e.g., “Andheri”)');
      if (!ex.leadTimeDays) base.push(hi ? 'लीड-टाइम जोड़ें (उदा. “3 दिन”)' : 'Add lead time (e.g., “3 days”)');
      if (!ex.moq) base.push(hi ? 'MOQ जोड़ें (उदा. “MOQ 200 pcs”)' : 'Add MOQ (e.g., “MOQ 200 pcs”)');
      if (!ex.payments?.length) base.push(hi ? 'पेमेंट मोड (UPI / Escrow)' : 'Payment modes (UPI / Escrow)');
      setSuggestions(base.slice(0, 3));
    }, 250);
    return () => window.clearTimeout(id);
  }, [text, hi]);

  // voice
  const onVoice = React.useCallback(() => {
    if (!micOk) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.lang = hi ? 'hi-IN' : 'en-IN';
    recog.continuous = false;
    recog.interimResults = false;

    setListening(true);
    setProcessing(false);
    recog.onresult = (e: any) => {
      setProcessing(true);
      const t = (e?.results?.[0]?.[0]?.transcript as string) || '';
      const clean = sanitize(t)
        .replace(/\b(uh|hmm|umm|haan|acha|like)\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
      setText(prev => sanitize((prev + ' ' + clean).trim()).slice(0, 800));
      setListening(false);
      window.setTimeout(() => setProcessing(false), 350);
    };
    recog.onerror = () => { setListening(false); setProcessing(false); };
    recog.onend = () => { setListening(false); };
    try { recog.start(); } catch { setListening(false); }
  }, [micOk, hi, setText]);

  const toggleFeature = (k: FeatureKey) =>
    setFeatures(old => (old.includes(k) ? old.filter(x => x !== k) : [...old, k]));
  const toggleLang = (k: LanguageKey) =>
    setLanguages(old => (old.includes(k) ? old.filter(x => x !== k) : [...old, k]));

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {restored.show && (
          <m.div
            className={cls(CARD, SHADOW, 'px-3 py-2 text-sm flex items-center justify-between')}
            initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}
          >
            <div className="text-gray-700">{hi ? 'ड्राफ़्ट मिला।' : 'Found a saved draft.'}</div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50"
                onClick={() => setRestored({ show: false, val: null })}
              >
                {hi ? 'नहीं' : 'Dismiss'}
              </button>
              <button
                className={CTA}
                onClick={() => { setText(restored.val || ''); setRestored({ show: false, val: null }); }}
              >
                {hi ? 'रीस्टोर' : 'Restore'}
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className={cls(CARD, SHADOW, 'p-4')}>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="yantra-composer" className="text-sm font-medium text-gray-900">
            {hi ? 'अपने दुकान/ऐप के बारे में बताएँ' : 'Describe your shop app'}
          </label>
          <div className="text-xs text-gray-500">{sanitize(text).length}/800</div>
        </div>

        <textarea
          id="yantra-composer"
          className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none placeholder:text-gray-500 text-gray-900"
          rows={5}
          maxLength={800}
          value={text}
          aria-invalid={!!err}
          aria-describedby="composer-help"
          placeholder={
            hi
              ? 'उदा: “अंधेरी में किराना स्टोर। B2B+B2C। कैटलॉग + RFQ + UPI + GST इनवॉइस। 3 दिन में डिलीवरी।”'
              : 'e.g., “Grocery shop in Andheri. B2B/B2C. Catalog + RFQ + UPI & GST invoices. Deliver within 3 days.”'
          }
          onChange={(e) => setText(sanitize(e.target.value).slice(0, 800))}
        />

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onVoice}
              disabled={!micOk || listening || processing}
              className={cls(
                'px-3 py-1.5 rounded-lg text-white text-sm transition',
                listening ? 'bg-red-500' : 'bg-gray-800 hover:bg-gray-900',
                !micOk && 'opacity-50 cursor-not-allowed'
              )}
              title={micOk ? (hi ? 'वॉयस इनपुट' : 'Voice input') : (hi ? 'माइक उपलब्ध नहीं' : 'Mic not available')}
              aria-live="polite"
            >
              {listening ? (hi ? 'सुन रहे…' : 'Listening…') : processing ? (hi ? 'प्रोसेसिंग…' : 'Processing…') : (hi ? 'बोलें' : 'Speak')}
            </button>
            <Pill active={languages.includes('en')} onClick={() => toggleLang('en')} title="English">EN</Pill>
            <Pill active={languages.includes('hi')} onClick={() => toggleLang('hi')} title="Hindi">HI</Pill>
          </div>

          <div id="composer-help" className={cls('text-sm', err ? 'text-red-600' : 'text-gray-600')}>
            {err ? err : (hi ? 'संकेत: शहर/MOQ/समय/पेमेंट जोड़ें' : 'Tip: add City/MOQ/Lead time/Payments')}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {suggestions.length > 0 && (
            <m.div
              initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}
              className="mt-3 flex flex-wrap gap-2"
              aria-live="polite"
            >
              {suggestions.map((s) => (
                <Pill key={s} onClick={() => setText(prev => sanitize((prev + ' ' + s).trim()).slice(0, 800))}>
                  {s}
                </Pill>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className={cls(CARD, SHADOW, 'p-4')}>
        <div className="text-sm font-medium text-gray-900 mb-3">{hi ? 'फ़ीचर्स चुनें' : 'Choose features'}</div>
        <div className="grid sm:grid-cols-3 gap-3">
          {ALL_FEATURES.map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFeatures(old => (old.includes(f.key) ? old.filter(x => x !== f.key) : [...old, f.key]))}
              className={cls(
                'text-left rounded-xl border px-3 py-2 transition',
                features.includes(f.key) ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white hover:bg-gray-50'
              )}
            >
              <div className="font-medium text-gray-900">{f.label}</div>
              <div className="text-sm text-gray-600">{f.desc}</div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {hi ? 'आप बाद में स्टूडियो में बदल सकते हैं' : 'You can tweak these later in Studio'}
          </div>
          <button
            type="button"
            onClick={onPreviewDNA}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50"
          >
            {hi ? 'DNA देखें' : 'Preview DNA'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Live Preview (no blur, high contrast)
========================================================= */
function LivePreview({ dna }: { dna: AppDNA }) {
  const reduce = useReducedMotion();
  const modules = ['catalog','rfq','payments','crm','gst','inventory']
    .filter(k => dna.features.includes(k as FeatureKey))
    .map(k => ALL_FEATURES.find(f => f.key === k)!.label);

  const chips = [
    dna.city && `📍 ${dna.city}`,
    dna.leadTimeDays && `⏱ ${dna.leadTimeDays}d`,
    dna.moq && `📦 ${dna.moq}`,
    (dna.payments && dna.payments.length > 0) && `₹ ${dna.payments.join(' / ')}`,
  ].filter(Boolean) as string[];

  return (
    <m.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
      className={cls(CARD, SHADOW, 'p-0 overflow-hidden')}
      aria-label="Live app preview"
    >
      <div className={cls('h-2 w-full', GRADIENT_BAR)} />
      <div className="p-5">
        <div className="text-xl font-bold text-gray-900">{dna.name}</div>
        <div className="text-sm text-gray-600">{dna.category}</div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {modules.map((label) => (
            <div key={label} className="rounded-xl border border-gray-200 p-3">
              <div className="text-sm font-semibold text-gray-900">{label}</div>
              <div className="text-xs text-gray-600">Enabled</div>
            </div>
          ))}
        </div>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="text-xs text-gray-600">App DNA (summary)</div>
          <div className="mt-1 text-sm text-gray-800 break-words">{dna.prompt}</div>
        </div>
      </div>
    </m.div>
  );
}

/* =========================================================
   Presets
========================================================= */
function Presets({ onPick }: { onPick: (s: string) => void }) {
  const presets = [
    'Grocery shop in Andheri. Catalog + RFQ + UPI. Deliver within 3 days. Hindi + English.',
    'Packaging supplier in Delhi. Corrugated boxes + tapes. RFQ + GST invoices. MOQ 500.',
    'Pharmacy outlet in Pune. Catalog + CRM + Inventory. UPI + NEFT. Reorder reminders.',
    'Apparel brand in Tiruppur. B2B bulk orders. RFQ + Escrow + GST POs. Lead time 5 days.',
  ];
  return (
    <div className={cls(CARD, SHADOW, 'p-4')}>
      <div className="text-sm font-medium text-gray-900 mb-3">Quick presets</div>
      <div className="grid md:grid-cols-2 gap-3">
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => onPick(p)}
            className="text-left rounded-xl border border-orange-100 bg-white p-3 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-900">{p}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   Sticky CTA
========================================================= */
function StickyBar({ valid, onGenerate, appName }: { valid: boolean; onGenerate: () => void; appName: string; }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.25);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <m.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25, ease: EASE }}
           className="fixed bottom-4 inset-x-0 z-50">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cls('w-8 h-8 rounded-full', GRADIENT_BAR)} />
            <div>
              <div className="text-sm text-gray-600">Ready to scaffold</div>
              <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{appName}</div>
            </div>
          </div>
          <button onClick={onGenerate} disabled={!valid} className={cls(CTA, !valid && 'opacity-50 cursor-not-allowed')}>
            Generate in Studio
          </button>
        </div>
      </div>
    </m.div>
  );
}

/* =========================================================
   DNA Review Modal
========================================================= */
function ReviewModal({
  open, onClose, dna, onConfirm, setDNA
}: { open: boolean; onClose: () => void; dna: AppDNA; onConfirm: () => void; setDNA: (fn: (d: AppDNA) => AppDNA) => void; }) {
  return (
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <m.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}
                 transition={{ duration: 0.2 }}
                 className={cls(CARD, 'w-full max-w-2xl relative p-5')}
                 role="dialog" aria-modal="true" aria-label="Review app DNA">
            <div className="text-lg font-semibold text-gray-900">Review App DNA</div>
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
              <Field label="App name">
                <input className="w-full rounded-lg border border-gray-200 p-2" value={dna.name}
                       onChange={(e) => setDNA(d => ({ ...d, name: e.target.value }))} />
              </Field>
              <Field label="Category">
                <input className="w-full rounded-lg border border-gray-200 p-2" value={dna.category}
                       onChange={(e) => setDNA(d => ({ ...d, category: e.target.value }))} />
              </Field>
              <Field label="City">
                <input className="w-full rounded-lg border border-gray-200 p-2" value={dna.city || ''}
                       onChange={(e) => setDNA(d => ({ ...d, city: e.target.value || undefined }))} />
              </Field>
              <Field label="Lead time (days)">
                <input type="number" min={0} className="w-full rounded-lg border border-gray-200 p-2" value={dna.leadTimeDays || 0}
                       onChange={(e) => setDNA(d => ({ ...d, leadTimeDays: Number(e.target.value) || undefined }))} />
              </Field>
              <Field label="MOQ">
                <input className="w-full rounded-lg border border-gray-200 p-2" value={dna.moq || ''}
                       onChange={(e) => setDNA(d => ({ ...d, moq: e.target.value || undefined }))} />
              </Field>
              <Field label="Payments (comma separated)">
                <input className="w-full rounded-lg border border-gray-200 p-2" value={(dna.payments || []).join(', ')}
                       onChange={(e) => setDNA(d => ({ ...d, payments: e.target.value.split(',').map(s => sanitize(s)).filter(Boolean) }))} />
              </Field>
            </div>

            <div className="mt-3">
              <div className="text-sm font-medium text-gray-900 mb-1">Features</div>
              <div className="flex flex-wrap gap-2">
                {ALL_FEATURES.map(f => (
                  <Pill
                    key={f.key}
                    active={dna.features.includes(f.key)}
                    onClick={() => setDNA(d => ({
                      ...d,
                      features: d.features.includes(f.key)
                        ? d.features.filter(x => x !== f.key)
                        : [...d.features, f.key]
                    }))}
                  >
                    {f.label}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={onConfirm} className={CTA}>Confirm & Generate</button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      {children}
    </label>
  );
}

/* =========================================================
   Page
========================================================= */
export default function VyapYantraPage() {
  const [text, setText] = React.useState<string>('');
  const [langs, setLangs] = React.useState<LanguageKey[]>(['en']);
  const [features, setFeatures] = React.useState<FeatureKey[]>(['catalog', 'rfq', 'payments']);
  const [valid, setValid] = React.useState<boolean>(false);

  const dna = React.useMemo<AppDNA>(() => {
    const base = defaultDNA(text || 'Business app');
    return {
      ...base,
      languages: langs.length ? langs : [isHindi(text) ? 'hi' : 'en'],
      features,
      theme: 'sunrise',
    };
  }, [text, langs, features]);

  const [openReview, setOpenReview] = React.useState(false);
  const [dnaDraft, setDnaDraft] = React.useState<AppDNA>(dna);
  React.useEffect(() => { setDnaDraft(dna); }, [dna]);

  const onPreset = (s: string) => setText(sanitize(s));
  const onPreviewDNA = () => setOpenReview(true);
  const onGenerate = () => setOpenReview(true);
  const confirmGenerate = () => {
    try { localStorage.setItem(KEY.dna, JSON.stringify(dnaDraft)); } catch {}
    window.location.href = '/model/studio?seed=local';
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen overflow-x-hidden">
        <WatermarkBackground />
        <HeaderThemed />

        <main className="pt-24 lg:pt-28 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <m.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.5, ease: EASE }}
                   className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left */}
              <section className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-white border border-orange-200 text-orange-700">
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
                  Describe → Extract → Scaffold
                </div>
                <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                  Describe your shop.{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-yellow-600 to-emerald-600">
                    We’ll scaffold your app.
                  </span>
                </h1>
                <p className="mt-3 text-gray-700">Templates, RFQ, GST POs, inventory—ready in Studio in under a minute.</p>

                <div className="mt-6">
                  <Composer
                    text={text}
                    setText={setText}
                    languages={langs}
                    setLanguages={setLangs}
                    features={features}
                    setFeatures={setFeatures}
                    onValidChange={setValid}
                    onPreviewDNA={onPreviewDNA}
                  />
                </div>

                <div className="mt-6">
                  <Presets onPick={onPreset} />
                </div>
              </section>

              {/* Right */}
              <aside className="lg:col-span-5">
                <LivePreview dna={dna} />
                <div className="mt-4 text-sm text-gray-700">
                  <Link href="/model" className="text-gray-900 hover:text-black underline underline-offset-2">
                    Prefer starting from blank? Open Studio →
                  </Link>
                </div>
              </aside>
            </m.div>

            {/* badges */}
            <section className="mt-12">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { t: 'Assured-ready flows', d: 'Escrow & SLA hooks when you need them.' },
                  { t: 'Localised by default', d: 'English + Hindi prompts and labels.' },
                  { t: 'Exportable DNA', d: 'Portable JSON spec; versioned scaffold.' },
                ].map((x, i) => (
                  <m.div key={x.t} className={cls(CARD, 'p-4')}
                         initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}>
                    <div className="font-semibold text-gray-900">{x.t}</div>
                    <div className="text-gray-700 mt-1 text-sm">{x.d}</div>
                  </m.div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <StickyBar valid={valid} onGenerate={onGenerate} appName={dna.name} />

        <ReviewModal
          open={openReview}
          onClose={() => setOpenReview(false)}
          dna={dnaDraft}
          setDNA={(fn) => setDnaDraft(d => fn(d))}
          onConfirm={confirmGenerate}
        />

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'VyapYantra',
              applicationCategory: 'BusinessApplication',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
            }),
          }}
        />
      </div>
    </LazyMotion>
  );
}