'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';


// Bezier for easeOutCubic (valid type for v12)
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: EASE }
  }
};


// --- minimal inline icons (bespoke) ---
const ArrowRight = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const Check = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const Dot = ({ className = 'w-2 h-2 bg-emerald-500 rounded-full' }) => <span className={className} />;

// --- motion helpers ---
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: EASE },
  }),
};

export default function ServicesPage() {
  // in-view refs
  const heroRef = useRef<HTMLDivElement>(null);
  const suiteRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const presetsRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const suiteInView = useInView(suiteRef, { once: true, margin: '-100px' });
  const valueInView = useInView(valueRef, { once: true, margin: '-100px' });
  const presetsInView = useInView(presetsRef, { once: true, margin: '-100px' });
  const howInView = useInView(howRef, { once: true, margin: '-100px' });
  const faqInView = useInView(faqRef, { once: true, margin: '-100px' });

  // industry presets
  const presets = [
    { id: 'kirana', label: 'Kirana' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'pharma', label: 'Pharma' },
    { id: 'salon', label: 'Salon / Services' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'wholesale', label: 'Wholesale' },
  ] as const;

  const presetSpecs: Record<
    typeof presets[number]['id'],
    { widgets: string; bill: string; actions: string[] }
  > = {
    kirana: {
      widgets: 'Quick sale, Low-stock, Today’s totals',
      bill: 'Thermal 2" / 3" (on request)',
      actions: ['Add item by voice', 'Quick sale entry', 'Reorder list'],
    },
    restaurant: {
      widgets: 'KOT, Table view, Today’s totals',
      bill: 'Thermal 3" (on request)',
      actions: ['Open table', 'Add KOT by voice', 'Close bill'],
    },
    pharma: {
      widgets: 'Expiry alerts, Batch, Today’s totals',
      bill: 'A4/A5 + Thermal (on request)',
      actions: ['Add batch', 'Scan & sell', 'Expiry check'],
    },
    salon: {
      widgets: 'Appointments, Staff targets',
      bill: 'A5 / Thermal (on request)',
      actions: ['New appointment', 'Service checkout', 'Staff sales'],
    },
    electronics: {
      widgets: 'Warranty, High-value ledger',
      bill: 'A4 with terms (on request)',
      actions: ['New invoice draft', 'Warranty add', 'Reserve stock'],
    },
    wholesale: {
      widgets: 'Bulk orders, RFQ, Balances',
      bill: 'A4/A5 GST (on request)',
      actions: ['Create RFQ', 'Dispatch note', 'Payment follow-up'],
    },
  };

  const [activePreset, setActivePreset] = useState<typeof presets[number]['id']>('kirana');

  // faq
  const faqs = [
    {
      q: 'Can I use voice for daily work?',
      a: 'Yes. Add items, record sales entries, check totals, and run analyses by voice. The app confirms before saving.',
    },
    {
      q: 'Do I need to bill every sale?',
      a: 'No. We record operational entries by default. Billing can be enabled after a short compliance consult.',
    },
    {
      q: 'How safe is my data?',
      a: 'Encrypted in transit and at rest, daily backups with restore tests, and role-based access for your team.',
    },
    {
      q: 'How do app changes work?',
      a: 'Two free changes after delivery. Further edits are handled at a small, fixed fee.',
    },
    {
      q: 'I don’t have a logo/icon.',
      a: 'We generate a clean app icon from your shop name and colors.',
    },
  ];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section
        ref={heroRef}
        className="pt-28 pb-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              AI that runs your shop, your way.
            </h1>
            <p className="mt-5 text-xl text-gray-700 max-w-3xl mx-auto">
              Inventory, billing-ready records, staff, and a money dashboard—built as your own branded app.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/model"
                className="px-7 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all"
              >
                Create my app
              </Link>
              <Link
                href="#how-it-works"
                className="px-7 py-3 rounded-xl border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold transition-all inline-flex items-center gap-2"
              >
                See how it works <ArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE SUITE (3 TILES) */}
      <section ref={suiteRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={suiteInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* VyapYantra */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <Image src="/images/yantra.png" alt="VyapYantra" width={52} height={52} />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">VyapYantra</h3>
                  <p className="text-sm text-gray-600">Your shop’s own app—fast, reliable, branded.</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {[
                  'Inventory & sales records (billing-ready)',
                  'Custom bill templates (enable on request)',
                  'Staff & roles, attendance',
                  'Money dashboard (cash vs online, UPI links)',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1"><Check /></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/services/vyapyantra"
                  className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                >
                  Learn more <ArrowRight />
                </Link>
                <Link
                  href="/model"
                  className="inline-flex items-center gap-2 text-gray-800 font-medium hover:text-gray-900"
                >
                  Start
                </Link>
              </div>
            </motion.div>

            {/* Studio */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-yellow-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <Image src="/images/copilot.png" alt="VyapYantra Studio" width={52} height={52} />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">VyapYantra Studio</h3>
                  <p className="text-sm text-gray-600">No-code builder with voice.</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {[
                  'Voice/text onboarding',
                  'Live preview, two free changes',
                  'Theme / logo / icon branding',
                  'Export & download when approved',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1"><Check /></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/services/studio"
                  className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                >
                  Learn more <ArrowRight />
                </Link>
                <Link
                  href="/model"
                  className="inline-flex items-center gap-2 text-gray-800 font-medium hover:text-gray-900"
                >
                  Start
                </Link>
              </div>
            </motion.div>

            {/* VyapMandi */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <Image src="/images/mandi.png" alt="VyapMandi" width={52} height={52} />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">VyapMandi</h3>
                  <p className="text-sm text-gray-600">Unlock sourcing & visibility as you grow.</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {[
                  'Sales milestones → listing unlock',
                  'Supplier directory & RFQ',
                  'Inventory-aware (phase-wise)',
                  'Managed B2B ops by VyapGO',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1"><Check /></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/services/vyapmandi"
                  className="inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                >
                  Learn more <ArrowRight />
                </Link>
                <Link
                  href="/model"
                  className="inline-flex items-center gap-2 text-gray-800 font-medium hover:text-gray-900"
                >
                  Start
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT YOU GET (3 PANELS) */}
      <section ref={valueRef} className="py-14 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={valueInView ? 'visible' : 'hidden'}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                title: 'Run',
                desc: 'Daily ops in one place.',
                points: ['Items & stock ledger', 'Quick sales entries', 'Staff roles & attendance', 'Money snapshot'],
              },
              {
                title: 'Grow',
                desc: 'Insights when you need them.',
                points: ['Slow movers', 'Reorder list', 'Profit nudges', 'Forecasts (pay-as-you-go)'],
              },
              {
                title: 'Brand',
                desc: 'It looks like your app.',
                points: ['Icon, name, colors', 'Bill layout on request', 'Two free changes', 'Transparent edit fees'],
              },
            ].map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl bg-white/90 backdrop-blur-sm border border-orange-100 p-6"
              >
                <div className="flex items-center gap-2">
                  <Dot />
                  <h3 className="text-lg font-semibold text-gray-900">{b.title}</h3>
                </div>
                <p className="mt-1 text-gray-700">{b.desc}</p>
                <ul className="mt-4 space-y-2">
                  {b.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-gray-800">
                      <span className="mt-1"><Check /></span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INDUSTRY PRESETS */}
      <section ref={presetsRef} className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate={presetsInView ? 'visible' : 'hidden'}>
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold text-gray-900 mb-4">
              Industry presets
            </motion.h2>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {presets.map((p) => {
                const active = p.id === activePreset;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePreset(p.id)}
                    className={[
                      'px-4 py-2 rounded-full text-sm font-medium border transition-all',
                      active
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-transparent shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300',
                    ].join(' ')}
                    aria-pressed={active}
                  >
                    {p.label}
                  </button>
                );
              })}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Default widgets</div>
                  <div className="mt-1 text-gray-900">{presetSpecs[activePreset].widgets}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Bill preference</div>
                  <div className="mt-1 text-gray-900">{presetSpecs[activePreset].bill}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">Quick actions</div>
                  <ul className="mt-1 space-y-1">
                    {presetSpecs[activePreset].actions.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-gray-900">
                        <Dot className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" ref={howRef} className="py-14 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate={howInView ? 'visible' : 'hidden'}>
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold text-gray-900 text-center">
              How it works
            </motion.h2>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {[
                {
                  n: '1',
                  t: 'Tell us',
                  d: 'Share business details by voice or text.',
                },
                {
                  n: '2',
                  t: 'Preview',
                  d: 'We configure; you approve; two changes included.',
                },
                {
                  n: '3',
                  t: 'Download',
                  d: 'Get your branded app and dashboard access.',
                },
              ].map((s, i) => (
                <motion.div
                  key={s.n}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-2xl bg-white border border-orange-100 p-6 text-center"
                >
                  <div className="mx-auto w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white flex items-center justify-center font-semibold">
                    {s.n}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-gray-900">{s.t}</div>
                  <p className="mt-1 text-gray-700">{s.d}</p>
                </motion.div>
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Billing enablement available after a short compliance consult.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/model"
                className="px-7 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all"
              >
                Start with voice
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 rounded-xl border-2 border-gray-900 text-gray-900 hover:bg-gray-50 font-semibold transition-all"
              >
                Talk to us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.h2
            initial="hidden"
            animate={faqInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-2xl font-semibold text-gray-900"
          >
            Frequently asked
          </motion.h2>

          <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
            {faqs.map((f, idx) => {
              const open = openFaq === idx;
              return (
                <div key={f.q} className="py-4">
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() => setOpenFaq(open ? null : idx)}
                    aria-expanded={open}
                  >
                    <span className="text-gray-900 font-medium">{f.q}</span>
                    <span
                      className={[
                        'ml-4 inline-flex items-center justify-center w-6 h-6 rounded-full border',
                        open ? 'rotate-45 border-gray-900 text-gray-900' : 'border-gray-400 text-gray-600',
                      ].join(' ')}
                    >
                      +
                    </span>
                  </button>
                  {open && <p className="mt-3 text-gray-700">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA (DARK) */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold">Ready to run your shop on your own app?</h2>
          <p className="mt-3 text-gray-300">
            Build it with VyapGO. Fast setup, branded delivery, and support when you need it.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/model"
              className="px-7 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all"
            >
              Create my app
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 rounded-xl border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold transition-all"
            >
              Talk to expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
