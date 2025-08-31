'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

/* ---------- types ---------- */
type CategoryId =
  | 'all'
  | 'packaging'
  | 'grocery'
  | 'electronics'
  | 'apparel'
  | 'pharma'
  | 'home';

type SortKey = 'match' | 'price-asc' | 'price-desc' | 'lead' | 'rating';

type Product = {
  id: string;
  name: string;
  category: CategoryId;
  city: string;
  assured: boolean;
  priceMin: number;
  priceMax?: number;
  moq: number;
  leadDays: number;
  rating: number;
  orders: number;
  inStock: boolean;
  badges?: string[];
};

/* ---------- mock data (replace with API) ---------- */
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '3-Ply Corrugated Boxes (12×12×12) Kraft',
    category: 'packaging',
    city: 'Delhi',
    assured: true,
    priceMin: 14,
    priceMax: 18,
    moq: 500,
    leadDays: 3,
    rating: 4.7,
    orders: 1200,
    inStock: true,
    badges: ['Fast Dispatch'],
  },
  {
    id: 'p2',
    name: 'Organic Basmati Rice 25kg (Aged)',
    category: 'grocery',
    city: 'Karnal',
    assured: true,
    priceMin: 1950,
    priceMax: 2150,
    moq: 10,
    leadDays: 2,
    rating: 4.6,
    orders: 980,
    inStock: true,
    badges: ['Organic'],
  },
  {
    id: 'p3',
    name: 'Thermal Receipt Rolls 57×30 (POS) — 100 pcs',
    category: 'packaging',
    city: 'Mumbai',
    assured: false,
    priceMin: 850,
    priceMax: 950,
    moq: 100,
    leadDays: 4,
    rating: 4.3,
    orders: 540,
    inStock: true,
    badges: ['Value'],
  },
  {
    id: 'p4',
    name: 'Men’s Cotton Polo T-Shirts (200 GSM)',
    category: 'apparel',
    city: 'Tiruppur',
    assured: true,
    priceMin: 230,
    priceMax: 290,
    moq: 100,
    leadDays: 5,
    rating: 4.5,
    orders: 620,
    inStock: true,
    badges: ['Customizable'],
  },
  {
    id: 'p5',
    name: 'LED Tube Light 20W (Pack of 50)',
    category: 'electronics',
    city: 'Noida',
    assured: true,
    priceMin: 135,
    priceMax: 160,
    moq: 50,
    leadDays: 3,
    rating: 4.8,
    orders: 2100,
    inStock: true,
    badges: ['Assured'],
  },
  {
    id: 'p6',
    name: 'Hand Sanitizer 500ml (WHO Formula)',
    category: 'pharma',
    city: 'Ahmedabad',
    assured: false,
    priceMin: 65,
    priceMax: 78,
    moq: 200,
    leadDays: 6,
    rating: 4.2,
    orders: 410,
    inStock: true,
  },
  {
    id: 'p7',
    name: 'Kitchen Garbage Bags (Large) — 1,000 pcs',
    category: 'home',
    city: 'Indore',
    assured: true,
    priceMin: 1.9,
    priceMax: 2.4,
    moq: 1000,
    leadDays: 4,
    rating: 4.4,
    orders: 770,
    inStock: true,
  },
  {
    id: 'p8',
    name: 'Bluetooth Barcode Scanner (2D, USB)',
    category: 'electronics',
    city: 'Pune',
    assured: true,
    priceMin: 1450,
    priceMax: 1890,
    moq: 5,
    leadDays: 2,
    rating: 4.6,
    orders: 340,
    inStock: false,
    badges: ['Popular'],
  },
];

/* ---------- helpers ---------- */
const money = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const clamp2 = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
};

/* ---------- page ---------- */
export default function MarketplaceResults() {
  const router = useRouter();
  const sp = useSearchParams();

  // Hydration safety: read URL on client only
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const initialQ = (mounted ? (sp.get('q') || '') : '').trim();
  const initialCat = (mounted ? ((sp.get('cat') as CategoryId) || 'all') : 'all');

  const [query, setQuery] = useState(initialQ);
  const [category, setCategory] = useState<CategoryId>(initialCat);
  const [city, setCity] = useState<string>('all');
  const [assuredOnly, setAssuredOnly] = useState(false);
  const [ratingMin, setRatingMin] = useState<number>(0);
  const [leadMax, setLeadMax] = useState<number>(0);
  const [priceBand, setPriceBand] = useState<'all' | '0-5' | '5-50' | '50-500' | '500+'>('all');
  const [sort, setSort] = useState<SortKey>('match');

  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [rfqOpen, setRfqOpen] = useState(false);

  useEffect(() => {
    const ok =
      typeof window !== 'undefined' &&
      (((window as any).webkitSpeechRecognition) ||
        (window as any).SpeechRecognition);
    setMicSupported(!!ok);
  }, []);

  // seed from URL after mount (prevents mismatch)
  useEffect(() => {
    if (!mounted) return;
    setQuery(initialQ);
    setCategory(initialCat);
    // keep URL shareable as user edits
    const params = new URLSearchParams();
    if (initialQ) params.set('q', initialQ);
    if (initialCat !== 'all') params.set('cat', initialCat);
    router.replace(`/marketplace/search?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // reflect live changes to URL
  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category !== 'all') params.set('cat', category);
    router.replace(`/marketplace/search?${params.toString()}`, { scroll: false });
  }, [query, category, mounted, router]);

  const cities = useMemo(() => {
    const set = new Set(INITIAL_PRODUCTS.map((p) => p.city));
    return ['all', ...Array.from(set)];
  }, []);

  const startVoice = () => {
    if (!micSupported) return;
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recog = new SR();
    recog.lang = 'hi-IN';
    recog.continuous = false;
    recog.interimResults = false;

    setListening(true);
    recog.onresult = (e: any) => {
      const t = e.results[0][0].transcript as string;
      setQuery(t);
    };
    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);
    try {
      recog.start();
    } catch {
      setListening(false);
    }
  };

  const filtered = useMemo(() => {
    let items = INITIAL_PRODUCTS.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesCat = category === 'all' ? true : p.category === category;
      const matchesCity = city === 'all' ? true : p.city === city;
      const matchesAssured = assuredOnly ? p.assured : true;
      const matchesRating = p.rating >= ratingMin;
      const matchesLead = leadMax > 0 ? p.leadDays <= leadMax : true;

      let matchesPrice = true;
      if (priceBand !== 'all') {
        const [min, max] =
          priceBand === '0-5'
            ? [0, 5]
            : priceBand === '5-50'
            ? [5, 50]
            : priceBand === '50-500'
            ? [50, 500]
            : [500, Infinity];
        matchesPrice = p.priceMin >= min && p.priceMin <= max;
      }

      return (
        matchesQ &&
        matchesCat &&
        matchesCity &&
        matchesAssured &&
        matchesRating &&
        matchesLead &&
        matchesPrice
      );
    });

    items = items.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return (a.priceMin || 0) - (b.priceMin || 0);
        case 'price-desc':
          return (b.priceMin || 0) - (a.priceMin || 0);
        case 'lead':
          return a.leadDays - b.leadDays;
        case 'rating':
          return b.rating - a.rating;
        default: {
          const score = (p: Product) =>
            (p.assured ? 2 : 0) + p.rating * 0.5 + Math.min(p.orders / 1000, 1);
          return score(b) - score(a);
        }
      }
    });

    return items;
  }, [query, category, city, assuredOnly, ratingMin, leadMax, priceBand, sort]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const clearSelection = () => setSelected([]);

  if (!mounted) {
    // stable shell during hydration
    return (
      <div className="min-h-screen">
        <HeaderThemed />
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="h-10 w-72 bg-white/60 border border-white/70 rounded-xl" />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* brand background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(255,137,56,0.12),transparent),radial-gradient(1000px_500px_at_80%_0%,rgba(255,221,87,0.12),transparent),radial-gradient(1000px_600px_at_50%_120%,rgba(16,185,129,0.12),transparent)]" />
      <HeaderThemed />

      {/* Sticky search + quick filters */}
      <div className="sticky top-20 z-30">
        <div className="bg-white/85 backdrop-blur border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={() => {}}
                onVoice={startVoice}
                listening={listening}
                micSupported={micSupported}
                placeholder="Search again or refine"
              />
              <div className="hidden sm:flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-700">Sort</span>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  <option value="match">Best match</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="lead">Fastest dispatch</option>
                  <option value="rating">Top rated</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  checked={assuredOnly}
                  onChange={(e) => setAssuredOnly(e.target.checked)}
                />
                Assured only
              </label>

              <Select value={city} onChange={setCity} items={cities} label="City" />

              <Select
                value={priceBand}
                onChange={(v) => setPriceBand(v as any)}
                items={['all', '0-5', '5-50', '50-500', '500+']}
                label="Price"
              />

              <Select
                value={String(ratingMin)}
                onChange={(v) => setRatingMin(parseFloat(v))}
                items={['0', '3.5', '4', '4.5']}
                label="Rating"
                renderItem={(v) => (v === '0' ? 'Any' : `${v}★+`)}
              />

              <Select
                value={String(leadMax)}
                onChange={(v) => setLeadMax(parseInt(v, 10))}
                items={['0', '2', '3', '5', '7']}
                label="Lead"
                renderItem={(v) => (v === '0' ? 'Any' : `≤ ${v} d`)}
              />

              <div className="ml-auto flex items-center gap-2 sm:hidden">
                <span className="text-sm text-gray-700">Sort</span>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  <option value="match">Best match</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="lead">Fastest dispatch</option>
                  <option value="rating">Top rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Results</h1>
              <p className="text-sm text-gray-700">{filtered.length} products</p>
            </div>
            <div className="text-sm text-gray-700">
              {query ? (
                <>for <span className="font-medium text-gray-900">“{query}”</span></>
              ) : (
                <>showing all</>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              onReset={() => {
                setQuery('');
                setCategory('all');
                setCity('all');
                setAssuredOnly(false);
                setRatingMin(0);
                setLeadMax(0);
                setPriceBand('all');
                setSort('match');
              }}
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.03 }}
                >
                  <ProductCard
                    product={p}
                    selected={selected.includes(p.id)}
                    onSelect={() => toggleSelect(p.id)}
                    onQuote={() => {
                      if (!selected.includes(p.id)) {
                        setSelected((prev) => [...prev, p.id]);
                      }
                      setRfqOpen(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Compare drawer (z-50 so it’s above header) */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            className="fixed bottom-0 inset-x-0 z-50"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mx-auto max-w-7xl px-6 pb-6">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
                <div className="flex items-center justify-between px-5 py-3 border-b">
                  <div className="text-sm text-gray-800">
                    <span className="font-medium">{selected.length}</span> item(s) selected for RFQ
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setRfqOpen(true)}
                      className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                    >
                      Create RFQ
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="px-5 py-3 flex gap-3 overflow-x-auto">
                  {selected.slice(0, 6).map((id) => {
                    const p = INITIAL_PRODUCTS.find((x) => x.id === id)!;
                    return (
                      <div key={id} className="min-w-[220px] border border-gray-200 rounded-xl p-3 bg-gray-50">
                        <div className="text-sm font-medium text-gray-900" style={clamp2}>
                          {p.name}
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          {p.city} • MOQ {p.moq}
                        </div>
                        <div className="mt-1 text-sm text-gray-900">
                          {money(p.priceMin)}{p.priceMax ? `–${money(p.priceMax)}` : ''} / unit
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterThemed />

      {/* RFQ modal (z-50; overlay covers header) */}
      <RFQModal
        open={rfqOpen}
        onClose={() => setRfqOpen(false)}
        productIds={selected}
        onSubmitted={() => {
          setRfqOpen(false);
          clearSelection();
          alert('RFQ submitted. You’ll receive quotes in 24–48 hours.');
        }}
      />
    </div>
  );
}

/* ---------- header/footer (identical brand as landing) ---------- */

function HeaderThemed() {
  const [isScrolled, setIsScrolled] = useState(true); // results page starts below, so keep condensed
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
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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
  const year = useMemo(() => new Date().getFullYear(), []);
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
          © {year} VyapMandi • Powered by VyapGO Technology
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

/* ---------- inputs/cards/modals ---------- */

function SearchBar({
  value,
  onChange,
  onSubmit,
  onVoice,
  listening,
  micSupported,
  placeholder,
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
    <div className="rounded-2xl border border-gray-200 shadow-sm bg-white/95 backdrop-blur flex items-center px-2 flex-1">
      <div className="px-3 text-gray-500">
        <svg width="20" height="20" viewBox="0 0 24 24" className="stroke-current">
          <circle cx="11" cy="11" r="7" fill="none" strokeWidth="2" />
          <path d="M20 20l-3-3" fill="none" strokeWidth="2" />
        </svg>
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
          {listening ? 'Listening…' : 'Speak'}
        </button>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  items,
  label,
  renderItem,
}: {
  value: string;
  onChange: (v: string) => void;
  items: string[];
  label: string;
  renderItem?: (v: string) => string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-800">
      <span className="text-gray-700">{label}</span>
      <select
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((v) => (
          <option key={v} value={v}>
            {renderItem ? renderItem(v) : v}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProductCard({
  product,
  selected,
  onSelect,
  onQuote,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
  onQuote: () => void;
}) {
  const {
    name, city, assured, priceMin, priceMax, moq, leadDays, rating, orders, inStock, badges,
  } = product;

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition">
      <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center relative">
        <div className="text-center px-6">
          <div className="text-sm text-gray-500">Product</div>
          <div className="mt-1 font-medium text-gray-900" style={clamp2}>{name}</div>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          {assured && <span className="px-2 py-0.5 text-xs rounded bg-emerald-600 text-white">Assured</span>}
          {badges?.slice(0, 1).map((b) => (
            <span key={b} className="px-2 py-0.5 text-xs rounded bg-gray-900/80 text-white">{b}</span>
          ))}
        </div>
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-3 py-1 rounded bg-white text-gray-900 text-sm">Out of stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-gray-900 font-medium" style={clamp2}>{name}</div>
            <div className="text-sm text-gray-600 mt-0.5">
              {city} • MOQ {moq} • {leadDays} day{leadDays > 1 ? 's' : ''}
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-800 select-none">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              checked={selected}
              onChange={onSelect}
            />
            Compare
          </label>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-gray-900 font-semibold">
            {money(priceMin)}{priceMax ? `–${money(priceMax)}` : ''}{' '}
            <span className="text-xs text-gray-600 font-normal">/ unit</span>
          </div>
          <div className="text-sm text-gray-800">{rating}★ • {orders.toLocaleString()} orders</div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onQuote}
            disabled={!inStock}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
              inStock
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Get Quote
          </button>
          <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" className="stroke-gray-400">
          <circle cx="11" cy="11" r="7" fill="none" strokeWidth="2" />
          <path d="M20 20l-3-3" fill="none" strokeWidth="2" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No products found</h3>
      <p className="mt-1 text-gray-700">Try adjusting your search or filters.</p>
      <button
        onClick={onReset}
        className="mt-4 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
      >
        Reset filters
      </button>
    </div>
  );
}

/* ---------- RFQ Modal ---------- */
function RFQModal({
  open,
  onClose,
  productIds,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  productIds: string[];
  onSubmitted: () => void;
}) {
  const items = productIds
    .map((id) => INITIAL_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const [city, setCity] = useState('');
  const [needBy, setNeedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!open) return;
    const m: Record<string, number> = {};
    items.forEach((p) => (m[p.id] = p.moq));
    setQtyMap(m);
  }, [open, items]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-[6%] mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="font-semibold text-gray-900">Create RFQ</div>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">Close</button>
          </div>
          <div className="px-6 py-5">
            {items.length === 0 ? (
              <div className="text-gray-700 text-sm">No items selected.</div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((p) => (
                    <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900" style={clamp2}>{p.name}</div>
                        <div className="text-gray-700">MOQ {p.moq} • {p.city}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">Qty</span>
                        <input
                          type="number"
                          min={p.moq}
                          value={qtyMap[p.id] || p.moq}
                          onChange={(e) =>
                            setQtyMap((prev) => ({
                              ...prev,
                              [p.id]: Math.max(p.moq, Number(e.target.value || p.moq)),
                            }))
                          }
                          className="w-24 px-2 py-1 border rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-800 mb-1">Delivery city / pincode</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. 560001"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-800 mb-1">Need by (date)</label>
                    <input
                      type="date"
                      value={needBy}
                      onChange={(e) => setNeedBy(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-800 mb-1">Notes / specs (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Grade, GSM, brand, packaging, or constraints."
                      className="w-full px-3 py-2 border rounded-lg h-24"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!city || !needBy) {
                        alert('Please fill delivery city/pincode and need-by date.');
                        return;
                      }
                      onSubmitted();
                    }}
                    className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  >
                    Submit RFQ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}