'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

/* -------------------------------------------------------
   Brand animation easing + tiny helpers
--------------------------------------------------------*/
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/* Fixed phone preview size (no layout shift) */
const PHONE_W = 360;
const PHONE_H = 740;

/* -------------------------------------------------------
   Inline SVG icon set (no external images for logos)
--------------------------------------------------------*/
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2l7 3v6c0 5.55-3.84 9.74-7 11-3.16-1.26-7-5.45-7-11V5l7-3zm0 3.18L7 6.9v4.1c0 4.31 2.96 7.9 5 8.93 2.04-1.03 5-4.62 5-8.93V6.9l-5-1.72z" />
    </svg>
  );
}
function EscrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 1l9 5v6c0 5-3.96 9.27-9 11C6.96 21.27 3 17 3 12V6l9-5zm0 3.18L6 7.06v4.94c0 3.95 2.73 7.3 6 8.59 3.27-1.29 6-4.64 6-8.59V7.06L12 4.18z" />
      <path d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3V8z" />
    </svg>
  );
}
function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M3 6h11v9H3V6zm13 3h3l3 3v3h-2.05A2.5 2.5 0 0 0 17 17a2.5 2.5 0 0 0-2.95 2H9.95A2.5 2.5 0 0 0 7 17a2.5 2.5 0 0 0-2.95 2H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5zM18 12h2.586L22 13.414V14h-4v-2zM7 19.5A1.5 1.5 0 1 0 7 16.5a1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  );
}
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
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path d="M20 20l-3-3" strokeWidth="2" />
    </svg>
  );
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <path d="M12 7v5l3 2" strokeWidth="2" />
    </svg>
  );
}
function RupeeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
      <path d="M7 4h10M7 8h10M7 12h6a5 5 0 0 1-5 5H7" strokeWidth="2" />
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
function FactoryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M3 20h18v-9l-5 3V8l-5 3V6l-8 5v9zm4-2v-3h2v3H7zm4 0v-3h2v3h-2zm4 0v-3h2v3h-2z" />
    </svg>
  );
}
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

/* -------------------------------------------------------
   Category types & options
--------------------------------------------------------*/
type CategoryId =
  | 'all'
  | 'packaging'
  | 'grocery'
  | 'electronics'
  | 'apparel'
  | 'pharma'
  | 'home';

const CATEGORIES: { id: CategoryId; name: string; icon: React.ReactNode }[] = [
  { id: 'all', name: 'All', icon: <SparkIcon className="w-5 h-5 text-yellow-600" /> },
  { id: 'packaging', name: 'Packaging', icon: <BoxGlyph /> },
  { id: 'grocery', name: 'Grocery', icon: <BagGlyph /> },
  { id: 'electronics', name: 'Electronics', icon: <ChipGlyph /> },
  { id: 'apparel', name: 'Apparel', icon: <TshirtGlyph /> },
  { id: 'pharma', name: 'Pharma', icon: <CapsuleGlyph /> },
  { id: 'home', name: 'Home & Utility', icon: <HomeGlyph /> },
];

/* Simple custom glyphs for categories */
function BoxGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-orange-600">
      <path d="M3 7l9 4 9-4M3 7v10l9 4 9-4V7" strokeWidth="2" />
    </svg>
  );
}
function BagGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-emerald-600">
      <path d="M6 9h12l-1 11H7L6 9z" strokeWidth="2" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" strokeWidth="2" />
    </svg>
  );
}
function ChipGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-700">
      <rect x="6" y="6" width="12" height="12" rx="2" strokeWidth="2" />
      <path d="M3 10h3M3 14h3M18 10h3M18 14h3M10 3v3M14 3v3M10 18v3M14 18v3" strokeWidth="2" />
    </svg>
  );
}
function TshirtGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-sky-700">
      <path d="M8 4l4 2 4-2 3 3-3 3v10H8V10L5 7l3-3z" />
    </svg>
  );
}
function CapsuleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-fuchsia-700">
      <rect x="3" y="8" width="18" height="8" rx="4" strokeWidth="2" />
      <path d="M12 8v8" strokeWidth="2" />
    </svg>
  );
}
function HomeGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-teal-700">
      <path d="M3 11l9-7 9 7v9H3v-9z" strokeWidth="2" />
      <path d="M9 20v-6h6v6" strokeWidth="2" />
    </svg>
  );
}

/* -------------------------------------------------------
   Page
--------------------------------------------------------*/
export default function MarketplaceLanding() {
  /* hero search state */
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<CategoryId>('all');
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const ok =
      typeof window !== 'undefined' &&
      (((window as any).webkitSpeechRecognition) || (window as any).SpeechRecognition);
    setMicSupported(!!ok);
  }, []);

  const onVoice = () => {
    if (!micSupported) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recog = new SR();
    recog.lang = 'hi-IN';
    recog.continuous = false    ;
    recog.interimResults = false;

    setListening(true);
    recog.onresult = (e: any) => {
      const t = e.results[0][0].transcript as string;
      setQ(t);
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    try { recog.start(); } catch { setListening(false); }
  };

  const submitSearch = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (cat !== 'all') params.set('cat', cat);
    window.location.href = `/marketplace/search?${params.toString()}`; // simple, SSR-safe
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* softly animated gradient background (brand) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(255,137,56,0.12),transparent),radial-gradient(1000px_500px_at_80%_0%,rgba(255,221,87,0.12),transparent),radial-gradient(1000px_600px_at_50%_120%,rgba(16,185,129,0.12),transparent)]" />
      <HeaderThemed />

      {/* Hero */}
      <section className="pt-24 lg:pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: EASE }}
            className="grid lg:grid-cols-12 gap-10 items-center"
          >
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-white/70 backdrop-blur border border-orange-200 shadow-sm text-orange-700">
                <SparkIcon className="w-3.5 h-3.5" /> Powered by VyapGO Voice + Assured
              </div>

              <h1 className="mt-3 text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-yellow-600 to-green-600">VyapMandi</span>{' '}
                — Quality-assured B2B marketplace.
              </h1>
              <p className="mt-4 text-lg text-gray-700 max-w-2xl">
                Voice search (Hindi/English). Compare vetted suppliers. Create RFQs and close with escrow.
              </p>

              {/* Search bar */}
              <div className="mt-6">
                <SearchBar
                  value={q}
                  onChange={setQ}
                  onSubmit={submitSearch}
                  onVoice={onVoice}
                  listening={listening}
                  micSupported={micSupported}
                  placeholder="e.g. 3-ply boxes Delhi 500 pcs"
                />
                <div className="mt-3 text-sm text-gray-700">
                  Popular:
                  <span className="ml-2 inline-flex gap-2">
                    {['corrugated boxes', 'basmati rice', 'barcode scanner'].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setQ(s); setCat('all'); }}
                        className="underline underline-offset-2 hover:text-gray-900"
                      >
                        {s}
                      </button>
                    ))}
                  </span>
                </div>
              </div>

              {/* Category rail */}
              <div className="mt-8 flex flex-wrap gap-3">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className={[
                      'px-4 py-2 rounded-full border transition flex items-center gap-2',
                      cat === c.id
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-transparent shadow'
                        : 'bg-white/90 text-gray-800 border-gray-200 hover:bg-white',
                    ].join(' ')}
                    aria-pressed={cat === c.id}
                    title={c.name}
                  >
                    <span aria-hidden>{c.icon}</span>
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <button
                  onClick={submitSearch}
                  className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg"
                >
                  Search suppliers
                </button>
              </div>
            </div>

            {/* Phone preview (integrated from your “perfect” version; no notch, fixed size, ~10s loop) */}
            <div className="lg:col-span-5">
              <div
                className="mx-auto md:scale-100 scale-90 origin-top will-change-transform"
                style={{ width: PHONE_W, height: PHONE_H }}
              >
                <PhonePreview />
              </div>
              <div className="mt-4 text-sm">
                <Link href="/apply/seller" className="text-orange-700 hover:text-orange-800">
                  List on VyapMandi →
                </Link>
                <span className="mx-2 text-gray-400">|</span>
                <Link href="/services/vyapyantra" className="text-gray-800 hover:text-gray-900">
                  Build with VyapYantra →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1) Live activity + trust belt */}
      <section className="py-6 bg-white/60 backdrop-blur border-y border-gray-200/70">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <LiveTicker />
            <TrustStrip />
          </div>
        </div>
      </section>

      {/* 2) Category worlds */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="Explore categories" subtitle="Depth, verified vendors, predictable lead times." />
          <CategoryWorlds />
        </div>
      </section>

      {/* 3) Curated collections */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="Curated collections" subtitle="Merchandised bundles for common business needs." />
          <Collections />
        </div>
      </section>

      {/* 4) How it works (journey) */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="How it works" subtitle="From voice to delivery, with protection at every step." />
          <HowItWorks />
        </div>
      </section>

      {/* 5) Assured program */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="VyapMandi Assured" subtitle="Trusted tiers — Basic / Gold / Pro" />
          <AssuredTiers />
        </div>
      </section>

      {/* 6) Buyer value calculator */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="Estimate your savings" subtitle="Quantify why buyers switch to VyapMandi." />
          <ValueCalculator />
        </div>
      </section>

      {/* 7) Buyer stories */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="Real buyer outcomes" subtitle="Measured improvements after switching." />
          <BuyerStories />
        </div>
      </section>

      {/* 8) Seller spotlights */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="Verified seller spotlights" subtitle="Depth of supply, documented QA, fast dispatch." />
          <SellerSpotlights />
        </div>
      </section>

      {/* 9) Logistics & payments */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="Logistics & payments" subtitle="Escrow and tracked fulfilment built-in." />
          <LogisticsRail />
        </div>
      </section>

      {/* 10) Tools by VyapYantra */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader title="Powered by VyapYantra" subtitle="Glue that automates your ops." />
          <ToolsByYantra />
        </div>
      </section>

      {/* 11) FAQ */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <SectionHeader title="FAQ & policies" subtitle="The answers we get asked the most." centered />
          <FAQ />
        </div>
      </section>

      {/* 12) Sticky RFQ bar (client-only, no SSR shift) */}
      <StickyRFQBar />

      <FooterThemed />

      {/* Static JSON-LD for FAQ (hydration-safe) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How fast do I get quotes?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Most RFQs receive first quotes within 3–6 hours during business days.',
                },
              },
              {
                '@type': 'Question',
                name: 'How does escrow work?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You pay into escrow. Funds are released to the seller after delivery and QC acknowledgement.',
                },
              },
              {
                '@type': 'Question',
                name: 'What’s a QA tier?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sellers are tiered Basic/Gold/Pro based on verification, on-time record, and QC artefacts.',
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------
   Header / Footer (brand-consistent, non-white)
--------------------------------------------------------*/
function HeaderThemed() {
  const [isScrolled, setIsScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-gradient-to-r from-orange-100/90 via-yellow-100/90 to-green-100/90 backdrop-blur-md shadow-sm'
          : 'bg-gradient-to-r from-orange-50/80 via-yellow-50/80 to-green-50/80 backdrop-blur'
      }`}
      initial={{ y: reduceMotion ? 0 : -60, opacity: reduceMotion ? 1 : 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' }}
      aria-label="Main"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="relative w-11 h-11">
              <Image src="/images/logo.png" alt="VyapGO" fill className="object-contain" priority />
            </span>
            <span className="text-2xl font-bold text-gray-900">VyapMandi</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/marketplace">Marketplace</NavLink>
            <Link
              href="/model"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Try VyapYantra
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative font-medium text-gray-800 hover:text-orange-700 transition-colors group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full" />
    </Link>
  );
}
function FooterThemed() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="relative h-9 w-9">
                <Image src="/images/logo.png" alt="VyapGO" fill className="object-contain" />
              </span>
              <div>
                <div className="font-semibold">VyapMandi</div>
                <div className="text-xs text-gray-400">Marketplace by VyapGO</div>
              </div>
            </div>
            <p className="mt-4 text-gray-400">
              Voice-powered, quality-assured B2B marketplace. RFQs, vetted suppliers, and escrow for safe procurement.
            </p>
          </div>

          <FooterCol title="For Buyers" items={['Voice Search', 'Assured Program', 'Escrow', 'RFQs']} />
          <FooterCol title="For Sellers" items={['Apply as Seller', 'Quality Guidelines', 'Fees', 'Support']} />
          <FooterCol title="Company" items={['About', 'Contact', 'Privacy', 'Terms']} />
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-sm text-gray-500">
          © VyapMandi • Powered by VyapGO Technology
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-semibold mb-3">{title}</div>
      <ul className="space-y-2 text-gray-400">
        {items.map((x) => (
          <li key={x}>
            <a href="#" className="hover:text-white">{x}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------
   Hero: Search bar
--------------------------------------------------------*/
function SearchBar({
  value, onChange, onSubmit, onVoice, listening, micSupported, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onVoice: () => void;
  listening: boolean;
  micSupported: boolean;
  placeholder?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-sm bg-white/95 backdrop-blur flex items-center px-2">
      <div className="px-3 text-gray-500">
        <SearchIcon className="w-5 h-5" />
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search products or categories'}
        className="flex-1 py-3 outline-none text-gray-900 placeholder:text-gray-500 bg-transparent"
        onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(); }}
      />
      <div className="flex items-center gap-2 pl-2">
        <button
          type="button"
          onClick={onVoice}
          disabled={!micSupported || listening}
          className={`px-3 py-2 rounded-lg text-white transition ${
            listening
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
          }`}
          title={micSupported ? 'Voice search' : 'Microphone not available'}
        >
          <span className="inline-flex items-center gap-2">
            <MicIcon className="w-4 h-4 text-white" /> {listening ? 'Listening…' : 'Speak'}
          </span>
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          onClick={onSubmit}
        >
          Search
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Integrated Phone Preview (from your “perfect” version)
   - NO black notch / OS bar
   - Fixed outer size: PHONE_W x PHONE_H (prevents page shift)
   - ~10s meaningful loop (Voice → Results → RFQ → Submit → Success)
--------------------------------------------------------*/
function PhonePreview() {
  // phases: 0 idle, 1 voice typing, 2 results, 3 highlight get-quote, 4 rfq sheet fill, 5 submit + toast
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [typed, setTyped] = useState('');
  const timers = useRef<number[]>([]);
  const typer = useRef<number | null>(null);
  const QUERY_TEXT = '3-ply boxes Delhi 500 pcs';

  const clearAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (typer.current) {
      window.clearInterval(typer.current);
      typer.current = null;
    }
  };

  const startTyping = (text: string, totalMs = 1800) => {
    setTyped('');
    const per = Math.max(40, Math.floor(totalMs / Math.max(1, text.length)));
    let i = 0;
    typer.current = window.setInterval(() => {
      i++;
      setTyped(text.slice(0, i));
      if (i >= text.length && typer.current) {
        window.clearInterval(typer.current);
        typer.current = null;
      }
    }, per);
  };

  const run = React.useCallback(() => {
    clearAll();
    setPhase(0);

    // 0 → 1: tap mic + start typing (at 1.0s)
    timers.current.push(
      window.setTimeout(() => { setPhase(1); startTyping(QUERY_TEXT, 2000); }, 1000)
    );

    // 1 → 2: show results (at 3.3s)
    timers.current.push(window.setTimeout(() => setPhase(2), 3300));

    // 2 → 3: highlight Get Quote (at 4.8s)
    timers.current.push(window.setTimeout(() => setPhase(3), 4800));

    // 3 → 4: slide RFQ & autofill (at 6.6s)
    timers.current.push(window.setTimeout(() => setPhase(4), 6600));

    // 4 → 5: submit + success toast (at 8.6s)
    timers.current.push(window.setTimeout(() => setPhase(5), 8600));

    // loop again (at ~10.2s)
    timers.current.push(window.setTimeout(() => run(), 10200));
  }, []);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => run());
    return () => { window.cancelAnimationFrame(id); clearAll(); };
  }, [run]);

  return (
    <div
      className="relative rounded-[2rem] border border-gray-300 shadow-2xl bg-white overflow-hidden"
      style={{ width: PHONE_W, height: PHONE_H }}
    >
      {/* in-app brand header (no OS notch) */}
      <div className="h-12 bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 flex items-center px-4">
        <div className="text-white font-semibold tracking-wide">VyapMandi</div>
      </div>

      {/* screen area */}
      <div className="relative p-4 bg-white" style={{ height: PHONE_H - 48 }}>
        {/* search row */}
        <motion.div
          className="rounded-xl border border-gray-200 bg-white shadow-sm flex items-center px-3 py-2 relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <div className="ml-2 flex-1 min-w-0 text-sm text-gray-900">
            {phase === 0 && <span className="text-gray-500">Try “corrugated boxes delhi 500 pcs”</span>}
            {phase >= 1 && <span className="font-medium">{typed || ''}</span>}
          </div>
          <div
            className={`ml-2 rounded-lg px-2 py-1 text-white text-xs ${phase === 1 ? 'bg-red-500' : 'bg-gray-800'}`}
          >
            {phase === 1 ? 'Listening' : 'Mic'}
          </div>
          <AnimatePresence>
            {phase === 1 && (
              <motion.span
                className="absolute right-2 -bottom-2 h-6 w-6 rounded-full bg-black/80"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* transcript pill */}
        <AnimatePresence>
          {phase === 1 && typed.length > 0 && (
            <motion.div
              className="absolute left-4 top-[84px] inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs text-green-800"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              Captured: “{typed}”
            </motion.div>
          )}
        </AnimatePresence>

        {/* results grid */}
        <div className="absolute left-4 right-4 top-[120px] bottom-[220px]">
          <div className="grid grid-cols-2 gap-3 h-full">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-3 relative overflow-hidden"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 8 }}
                transition={{ duration: 0.35, delay: phase >= 2 ? i * 0.12 : 0 }}
              >
                <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-orange-50 to-green-50 relative" />
                <div
                  className="mt-2 text-xs font-medium text-gray-900"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {i === 0 ? '3-ply Corrugated Boxes (12×12×12)'
                    : i === 1 ? 'Thermal Receipt Rolls 57×30'
                    : i === 2 ? 'LED Tube Light 20W (Pack)'
                    : 'Men’s Cotton Polo T-Shirts (200 GSM)'}
                </div>
                <div className="text-[11px] text-gray-600">
                  MOQ {i === 0 ? 500 : i === 1 ? 100 : i === 2 ? 50 : 100} • {i === 0 ? 'Delhi' : i === 1 ? 'Mumbai' : i === 2 ? 'Noida' : 'Tiruppur'}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{i === 0 ? '14–18' : i === 1 ? '850–950' : i === 2 ? '135–160' : '230–290'}
                  </div>
                  <div
                    className={`text-[11px] px-2 py-1 rounded-md text-white ${
                      i === 0 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gray-700'
                    }`}
                  >
                    Get Quote
                  </div>
                </div>

                {/* pointer highlight on first card */}
                {i === 0 && phase === 3 && (
                  <motion.span
                    className="absolute bottom-8 right-3 h-7 w-7 rounded-full bg-black/80"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.9 }}
                    transition={{ duration: 0.25 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* RFQ sheet */}
        <motion.div
          className="absolute left-0 right-0 bottom-4"
          initial={{ y: 300, opacity: 0 }}
          animate={{
            y: phase >= 4 ? 0 : phase >= 3 ? 40 : 300,
            opacity: phase >= 3 ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        >
          <div className="mx-auto w-[92%] rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="px-4 py-2 border-b text-sm font-semibold text-gray-900">Create RFQ</div>
            <div className="px-4 py-3 space-y-2 text-[12px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">3-ply Corrugated Boxes</div>
                  <div className="text-gray-600">MOQ 500 • Delhi</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Qty</span>
                  <div className="w-20 h-8 border rounded-md flex items-center justify-center">
                    {phase >= 4 ? '500' : '—'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="h-9 border rounded-md flex items-center px-2">
                  <span className="text-gray-500 mr-2">Pincode</span>
                  <span className="text-gray-900">{phase >= 4 ? '110001' : ''}</span>
                </div>
                <div className="h-9 border rounded-md flex items-center px-2">
                  <span className="text-gray-500 mr-2">Need by</span>
                  <span className="text-gray-900">{phase >= 4 ? '30-09-2025' : ''}</span>
                </div>
                <div className="col-span-2 h-16 border rounded-md px-2 py-1 text-gray-700 overflow-hidden">
                  {phase >= 4 ? 'GSM 150+, 72-hour dispatch preferred.' : ''}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <div className="px-3 py-1.5 rounded-md border text-gray-700 bg-white">Cancel</div>
                <div className={`px-3 py-1.5 rounded-md text-white ${phase >= 4 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gray-300'}`}>
                  Submit
                </div>
              </div>
            </div>
          </div>

          {/* success toast */}
          <AnimatePresence>
            {phase === 5 && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-8 z-10"
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="rounded-full bg-green-600 text-white text-xs px-3 py-1.5 shadow">
                  RFQ submitted ✓
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* helper line */}
        <div className="absolute left-0 right-0 bottom-0 pb-1 text-center text-[11px] text-gray-600">
          Simulation: Voice → Results → RFQ → Submit → Success
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Live ticker & trust strip
--------------------------------------------------------*/
function LiveTicker() {
  const reduceMotion = useReducedMotion();
  const items = useMemo(
    () => [
      { icon: <Rupert icon={<SearchIcon className="w-3.5 h-3.5" />} />, text: 'RFQ from Jaipur for 3-ply boxes (500 pcs)' },
      { icon: <Rupert icon={<EscrowIcon className="w-3.5 h-3.5 text-orange-600" />} />, text: 'Escrow released to Tiruppur Knit Co.' },
      { icon: <Rupert icon={<ShieldIcon className="w-3.5 h-3.5 text-emerald-600" />} />, text: 'QC proof verified for LED tubes (20W)' },
      { icon: <Rupert icon={<TruckIcon className="w-3.5 h-3.5" />} />, text: 'Dispatch booked: Karnal → Delhi (Rice)' },
      { icon: <Rupert icon={<ClockIcon className="w-3.5 h-3.5" />} />, text: 'Avg quote time now: 3h 12m' },
      { icon: <Rupert icon={<ShieldIcon className="w-3.5 h-3.5 text-emerald-600" />} />, text: 'Seller “Gold” tier upgraded: Noida Electronics' },
    ],
    []
  );
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((s) => (s + 1) % items.length), 2600);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <div className="relative h-7 overflow-hidden" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={i}
          initial={{ y: reduceMotion ? 0 : 16, opacity: reduceMotion ? 1 : 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduceMotion ? 0 : -16, opacity: reduceMotion ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
          className="absolute inset-x-0"
        >
          <div className="inline-flex items-center gap-2 text-sm text-gray-800">
            {items[i].icon}
            <span>{items[i].text}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
function Rupert({ icon }: { icon: React.ReactNode }) {
  return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm">{icon}</span>;
}
function TrustStrip() {
  const chips = [
    { t: 'Assured QC', icon: <ShieldIcon className="w-4 h-4 text-emerald-600" /> },
    { t: 'Escrow Payments', icon: <EscrowIcon className="w-4 h-4 text-orange-600" /> },
    { t: 'Verified Sellers', icon: <SparkIcon className="w-4 h-4 text-yellow-600" /> },
    { t: 'GST Invoices', icon: <SearchIcon className="w-4 h-4" /> },
  ];
  return (
    <div className="flex items-center gap-4 overflow-x-auto">
      {chips.map((c) => (
        <motion.div
          key={c.t}
          whileHover={{ y: -2 }}
          className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm"
        >
          {c.icon}
          <span className="text-gray-800 text-sm">{c.t}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------
   Sections
--------------------------------------------------------*/
function SectionHeader({ title, subtitle, centered }: { title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className={['mt-2 text-gray-700', centered ? 'mx-auto max-w-2xl' : ''].join(' ')}>{subtitle}</p>}
    </div>
  );
}

/* Category worlds */
function CategoryWorlds() {
  const blocks = [
    { id: 'packaging', title: 'Packaging', stats: 'Lead 2–5d • MOQ 200–1000', icon: <BoxGlyph /> },
    { id: 'grocery', title: 'Grocery', stats: 'Staples • Grains • Oils', icon: <BagGlyph /> },
    { id: 'electronics', title: 'Electronics', stats: 'POS • Lights • Scanners', icon: <ChipGlyph /> },
    { id: 'apparel', title: 'Apparel', stats: 'Tees • Polos • Workwear', icon: <TshirtGlyph /> },
    { id: 'pharma', title: 'Pharma', stats: 'Sanitisers • PPE • Dispensers', icon: <CapsuleGlyph /> },
    { id: 'home', title: 'Home & Utility', stats: 'Bags • Cleaners • Disposables', icon: <HomeGlyph /> },
    { id: 'all', title: 'All categories', stats: 'Browse everything', icon: <SparkIcon className="w-5 h-5 text-yellow-600" /> },
  ] as const;

  return (
    <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {blocks.map((b, i) => (
        <Link
          key={b.id}
          href={`/marketplace/search?cat=${b.id}`}
          className="group rounded-2xl border border-orange-100 bg-white p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-50 to-green-50 border border-gray-200 flex items-center justify-center">
                {b.icon}
              </span>
              <div className="font-semibold text-gray-900">{b.title}</div>
            </div>
            <motion.span
              initial={{ x: -4, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
              viewport={{ once: true }}
              className="text-orange-700 text-sm"
            >
              Explore →
            </motion.span>
          </div>
          <div className="mt-2 text-sm text-gray-700">{b.stats}</div>
        </Link>
      ))}
    </div>
  );
}

/* Collections */
function Collections() {
  const rows = [
    { title: 'Festive Packing Essentials', blurb: 'Boxes, tapes, fillers ready to dispatch.', q: 'packaging essentials' },
    { title: 'Retail Ops Kit', blurb: 'Billing rolls, barcode scanners, 20W LED tubes.', q: 'retail operations kit' },
    { title: 'New Store Setup', blurb: 'Housekeeping, bins, signage, starter inventory.', q: 'new store setup' },
  ];
  return (
    <div className="mt-6 grid md:grid-cols-3 gap-6">
      {rows.map((c, i) => (
        <motion.article
          key={c.title}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white border border-orange-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2">
            <SparkIcon className="w-5 h-5 text-yellow-600" />
            <div className="font-semibold text-gray-900">{c.title}</div>
          </div>
          <p className="mt-2 text-gray-700">{c.blurb}</p>
          <Link
            href={`/marketplace/search?q=${encodeURIComponent(c.q)}`}
            className="mt-3 inline-block text-sm text-orange-700 hover:text-orange-800"
          >
            Browse collection →
          </Link>
        </motion.article>
      ))}
    </div>
  );
}

/* How it works */
function HowItWorks() {
  const steps = [
    { t: 'Describe your need', d: 'Type or speak in Hindi/English; attach specs.', icon: <MicIcon className="w-5 h-5" /> },
    { t: 'Assured shortlisting', d: 'Verified sellers with QA tiers are prioritised.', icon: <ShieldIcon className="w-5 h-5 text-emerald-600" /> },
    { t: 'Escrow & SLA', d: 'Secure payment; on-time dispatch with tracking.', icon: <EscrowIcon className="w-5 h-5 text-orange-600" /> },
    { t: 'Delivery & payout', d: 'QC acknowledgement releases payment to seller.', icon: <TruckIcon className="w-5 h-5" /> },
  ];
  return (
    <div className="mt-6 grid md:grid-cols-4 gap-6">
      {steps.map((s, i) => (
        <motion.div
          key={s.t}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center gap-2 font-semibold text-gray-900">{s.icon}{s.t}</div>
          <div className="mt-2 text-gray-700">{s.d}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* Assured tiers */
function AssuredTiers() {
  const tiers = [
    {
      name: 'Basic',
      color: 'from-gray-50 to-white',
      points: ['KYB docs verified', 'MOQ & lead time stated', 'Dispute support'],
    },
    {
      name: 'Gold',
      color: 'from-yellow-50 to-white',
      points: ['Site / factory validation', 'Lot sampling photos', 'On-time record ≥ 90%'],
    },
    {
      name: 'Pro',
      color: 'from-emerald-50 to-white',
      points: ['Full QA artefacts', 'Video QC proof', 'On-time record ≥ 96%'],
    },
  ];
  return (
    <div className="mt-6 grid md:grid-cols-3 gap-6">
      {tiers.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}
          viewport={{ once: true }}
          className={`rounded-2xl border border-gray-200 bg-gradient-to-br ${t.color} p-6`}
        >
          <div className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-emerald-700" />
            <div className="text-lg font-semibold text-gray-900">{t.name}</div>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-gray-800">
            {t.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-600" />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/* Value calculator */
function ValueCalculator() {
  const [orders, setOrders] = useState(8);
  const [ticket, setTicket] = useState(25000);
  const [defect, setDefect] = useState(4); // %
  const [timeCrit, setTimeCrit] = useState(6); // 0..10

  const saved = useMemo(() => {
    const monthly = orders * ticket;
    const defectSavings = monthly * (defect / 100) * 0.4;
    const timeValue = monthly * (timeCrit / 1000);
    return Math.round(defectSavings + timeValue);
  }, [orders, ticket, defect, timeCrit]);

  return (
    <div className="mt-6 grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <SliderRow label="Monthly orders" value={orders} onChange={setOrders} min={1} max={50} step={1} suffix="orders" />
        <SliderRow label="Avg ticket size" value={ticket} onChange={setTicket} min={5000} max={100000} step={1000} format={money} />
        <SliderRow label="Defect/return rate" value={defect} onChange={setDefect} min={0} max={20} step={1} suffix="%" />
        <SliderRow label="Lead-time criticality" value={timeCrit} onChange={setTimeCrit} min={0} max={10} step={1} suffix="/10" />
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <div className="text-gray-900 text-lg font-semibold">Estimated monthly impact</div>
        <div className="mt-3 text-3xl font-bold text-emerald-700">{money(saved)}</div>
        <div className="mt-2 text-gray-700">from fewer defects/returns and tighter fulfilment.</div>
        <Link
          href="/marketplace/search?q=assured"
          className="mt-4 inline-flex px-4 py-2 rounded-lg text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
        >
          Start an RFQ
        </Link>
      </div>
    </div>
  );
}
function SliderRow({
  label, value, onChange, min, max, step, suffix, format,
}: {
  label: string; value: number; onChange: (n: number) => void;
  min: number; max: number; step: number; suffix?: string; format?: (n: number) => string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-700">{label}</label>
        <div className="text-sm font-medium text-gray-900">
          {format ? format(value) : `${value}${suffix ? ` ${suffix}` : ''}`}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
    </div>
  );
}

/* Buyer stories */
function BuyerStories() {
  const items = [
    { logo: <FactoryIcon className="w-6 h-6" />, name: 'PackRight Industries', metric: '72-hour dispatch', delta: 'won enterprise POs', year: '2023' },
    { logo: <FactoryIcon className="w-6 h-6" />, name: 'Karnal Agro', metric: 'RFQ close 4/10', delta: 'consistent repeat buyers', year: '2024' },
    { logo: <FactoryIcon className="w-6 h-6" />, name: 'Tiruppur Knit Co.', metric: 'fewer returns', delta: 'faster payouts', year: '2023' },
  ];
  return (
    <div className="mt-6 grid md:grid-cols-3 gap-6">
      {items.map((s, i) => (
        <motion.article
          key={s.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white border border-orange-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-2">
            {s.logo}
            <div className="font-semibold text-gray-900">{s.name}</div>
          </div>
          <p className="mt-2 text-gray-700">
            Achieved <span className="font-medium">{s.metric}</span>; {s.delta}.
          </p>
          <div className="mt-3 text-sm text-gray-500">Since {s.year}</div>
          <Link href="/seller/profile" className="mt-2 inline-block text-sm text-orange-700 hover:text-orange-800">
            Visit profile →
          </Link>
        </motion.article>
      ))}
    </div>
  );
}

/* Seller spotlights */
function SellerSpotlights() {
  const sellers = [
    { name: 'Noida LEDs', city: 'Noida', tier: 'Gold', lead: '3–4d', moq: '50', resp: '2h', badges: ['Verified docs', 'On-time 96%'] },
    { name: 'Karnal Agro', city: 'Karnal', tier: 'Pro', lead: '2–3d', moq: '10 bags', resp: '3h', badges: ['Site visit', 'Low dispute'] },
    { name: 'PackRight', city: 'Delhi', tier: 'Gold', lead: '3d', moq: '500', resp: '4h', badges: ['QC artefacts', 'Fast dispatch'] },
  ];
  return (
    <div className="mt-6 grid md:grid-cols-3 gap-6">
      {sellers.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE, delay: i * 0.05 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900">{s.name}</div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">{s.tier}</span>
          </div>
          <div className="mt-1 text-sm text-gray-600 flex items-center gap-2"><MapPinIcon className="w-4 h-4" /> {s.city}</div>
          <dl className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-gray-50 p-2 text-center"><dt className="text-gray-600">Lead</dt><dd className="font-medium text-gray-900">{s.lead}</dd></div>
            <div className="rounded-lg bg-gray-50 p-2 text-center"><dt className="text-gray-600">MOQ</dt><dd className="font-medium text-gray-900">{s.moq}</dd></div>
            <div className="rounded-lg bg-gray-50 p-2 text-center"><dt className="text-gray-600">Response</dt><dd className="font-medium text-gray-900">{s.resp}</dd></div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            {s.badges.map((b) => (
              <span key={b} className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200">{b}</span>
            ))}
          </div>
          <Link
            href={`/marketplace/search?q=${encodeURIComponent(s.name)}`}
            className="mt-4 inline-block text-sm text-orange-700 hover:text-orange-800"
          >
            Request sample →
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/* Logistics & Escrow Rail */
function LogisticsRail() {
  const nodes = [
    { t: 'RFQ', d: 'Describe need' },
    { t: 'Assured', d: 'Seller picked' },
    { t: 'Escrow', d: 'Funds secured' },
    { t: 'Dispatch', d: 'QC & ship' },
    { t: 'Release', d: 'Payment after delivery' },
  ];
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
      <div className="grid md:grid-cols-5 gap-4">
        {nodes.map((n, i) => (
          <div key={n.t} className="flex md:flex-col items-center md:items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-50 to-green-50 border border-gray-200 flex items-center justify-center">
              {i === 0 && <SearchIcon className="w-5 h-5" />}
              {i === 1 && <ShieldIcon className="w-5 h-5 text-emerald-600" />}
              {i === 2 && <EscrowIcon className="w-5 h-5 text-orange-600" />}
              {i === 3 && <TruckIcon className="w-5 h-5" />}
              {i === 4 && <CheckIcon className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{n.t}</div>
              <div className="text-xs text-gray-600">{n.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-700">
        Coverage: metro & tier-2 lanes. <Link href="/contact" className="text-orange-700 hover:text-orange-800">See SLA & coverage →</Link>
      </div>
    </div>
  );
}

/* Tools by VyapYantra */
function ToolsByYantra() {
  const tools = [
    { t: 'PO generator', d: 'Create GST-ready POs from your RFQs.' },
    { t: 'Auto-catalog from Excel', d: 'Bulk import SKUs and publish listings.' },
    { t: 'Low-stock alerts', d: 'Get notified and auto-trigger RFQs.' },
  ];
  return (
    <div className="mt-6 grid md:grid-cols-3 gap-6">
      {tools.map((x) => (
        <div key={x.t} className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="font-semibold text-gray-900">{x.t}</div>
          <div className="mt-2 text-gray-700">{x.d}</div>
          <Link href="/model" className="mt-3 inline-block text-sm text-gray-900 hover:text-black underline underline-offset-2">
            Try in Studio →
          </Link>
        </div>
      ))}
    </div>
  );
}

/* FAQ */
function FAQ() {
  const q = [
    { q: 'How fast do I get quotes?', a: 'Most RFQs receive first quotes within 3–6 hours on business days.' },
    { q: 'How does escrow work?', a: 'You pay into escrow; funds are released after delivery + QC acknowledgement.' },
    { q: 'What’s a QA tier?', a: 'Sellers are graded Basic/Gold/Pro from docs, site checks, QC artefacts, on-time record.' },
    { q: 'Are returns supported?', a: 'Assured orders include a claims/return window as per the product category policy.' },
    { q: 'Do you issue GST invoices?', a: 'Yes. GST invoices are provided on request by verified sellers for eligible orders.' },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-6 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
      {q.map((item, idx) => (
        <div key={item.q}>
          <button
            className="w-full text-left px-5 py-4 flex items-center justify-between"
            onClick={() => setOpen((o) => (o === idx ? null : idx))}
            aria-expanded={open === idx}
          >
            <span className="font-medium text-gray-900">{item.q}</span>
            <span className="text-gray-500">{open === idx ? '−' : '+'}</span>
          </button>
          <AnimatePresence initial={false}>
            {open === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="px-5 pb-4 text-gray-700"
              >
                {item.a}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* Sticky RFQ bar */
function StickyRFQBar() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.3;
      setShow(scrolled);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!mounted || !show) return null;
  const submit = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set('q', text.trim());
    window.location.href = `/marketplace/search?${params.toString()}`;
  };
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="fixed bottom-4 inset-x-0 z-40"
      role="region"
      aria-label="Quick RFQ"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border border-gray-200 bg-white/95 backdrop-blur shadow-xl p-2 flex items-center gap-2">
          <div className="px-2 text-gray-500"><SearchIcon className="w-5 h-5" /></div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 py-2 outline-none bg-transparent text-gray-900 placeholder:text-gray-500"
            placeholder="Describe what you need (e.g., 500 kraft boxes, 3-day dispatch, Delhi)…"
          />
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            Start RFQ
          </button>
        </div>
      </div>
    </motion.div>
  );
}