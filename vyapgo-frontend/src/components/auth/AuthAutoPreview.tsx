'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Scene = 'yantra' | 'mandi';
type YantraTab = 'inventory' | 'sales' | 'staff';
type MandiTab = 'catalog' | 'cart' | 'orders';

const PHONE_W = 320;
const PHONE_H = 620;

/** Small “tap ripple” to sell the interaction */
function Tap({ x, y, keyId }: { x: number; y: number; keyId: string }) {
  return (
    <motion.span
      key={keyId}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none absolute rounded-full border-2 border-white/70"
      style={{ width: 28, height: 28, left: x - 14, top: y - 14, boxShadow: '0 0 0 6px rgba(255,255,255,0.15)' }}
    />
  );
}

export default function AuthAutoPreview() {
  const [scene, setScene] = useState<Scene>('yantra');

  /** VyapYantra state */
  const [yTab, setYTab] = useState<YantraTab>('inventory');
  const [stock, setStock] = useState({ apples: 100, bananas: 150, milk: 75 });
  const [sales, setSales] = useState({ today: 12500, tx: 87 });

  /** VyapMandi state */
  const [mTab, setMTab] = useState<MandiTab>('catalog');
  const [cart, setCart] = useState<{ name: string; qty: number; price: number }[]>([]);

  const [toast, setToast] = useState<string | null>(null);
  const [taps, setTaps] = useState<{ x: number; y: number; id: string }[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);

  /** Add an ephemeral tap at relative coords in the phone frame */
  const addTap = (relX: number, relY: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = rect.left + relX;
    const y = rect.top + relY;
    const id = Math.random().toString(36).slice(2, 8);
    setTaps((t) => [...t, { x, y, id }]);
    setTimeout(() => setTaps((t) => t.filter((k) => k.id !== id)), 450);
  };

  /** Show a tiny toast */
  const showToast = (msg: string, ms = 1100) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), ms);
  };

  /** Simple director script that loops forever */
  useEffect(() => {
    let mounted = true;

    const runLoop = async () => {
      while (mounted) {
        // ——— YANTRA: inventory -> update -> sales -> staff
        setScene('yantra');
        setYTab('inventory');
        await sleep(700);

        // tap update apples
        addTap(255, 322); // rough button position
        setStock((s) => ({ ...s, apples: Math.max(0, s.apples - 1) }));
        showToast('Updated: Apples -1');
        await sleep(900);

        addTap(255, 382);
        setStock((s) => ({ ...s, bananas: Math.max(0, s.bananas - 1) }));
        showToast('Updated: Bananas -1');
        await sleep(1000);

        setYTab('sales');
        addTap(70, 180);
        setSales((s) => ({ ...s, today: s.today + 350, tx: s.tx + 1 }));
        showToast('Recorded new sale');
        await sleep(1100);

        setYTab('staff');
        showToast('Payroll synced');
        await sleep(1100);

        // ——— MANDI: catalog -> add to cart -> cart -> checkout -> orders
        setScene('mandi');
        setMTab('catalog');
        await sleep(700);

        addTap(265, 270);
        setCart((c) => addItem(c, { name: 'Fresh Apples', price: 120 }));
        showToast('Added to cart');
        await sleep(800);

        addTap(265, 322);
        setCart((c) => addItem(c, { name: 'Bananas', price: 80 }));
        showToast('Added to cart');
        await sleep(800);

        setMTab('cart');
        await sleep(700);

        addTap(230, 530); // checkout button
        showToast('Checkout • UPI');
        await sleep(900);

        setMTab('orders');
        showToast('Order #A103 placed');
        await sleep(1200);

        // small idle before loop
        await sleep(500);
      }
    };

    runLoop();
    return () => {
      mounted = false;
    };
  }, []);

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);
  const total = useMemo(() => cart.reduce((n, i) => n + i.qty * i.price, 0), [cart]);

  return (
    <div className="relative">
      {/* phone frame */}
      <div
        ref={frameRef}
        className="relative rounded-[26px] overflow-hidden"
        style={{
          width: PHONE_W,
          height: PHONE_H,
          background: '#0f172a',
          border: '1px solid rgba(0,0,0,0.55)',
          boxShadow:
            '0 18px 38px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 0 0 2px rgba(0,0,0,0.45)',
        }}
      >
        {/* notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-black rounded-b-2xl z-20" />

        {/* content */}
        <div className="absolute inset-0 p-4 pt-8">
          <AnimatePresence mode="wait">
            {scene === 'yantra' ? (
              <motion.div
                key="yantra"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col"
              >
                {/* header */}
                <div className="flex items-center justify-between text-slate-200 mb-3">
                  <div className="font-semibold">VyapYantra</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Ready
                  </div>
                </div>

                {/* tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {(['inventory', 'sales', 'staff'] as YantraTab[]).map((t) => (
                    <div
                      key={t}
                      className={`text-[11px] rounded-lg py-2 text-center ${
                        yTab === t ? 'bg-slate-800 text-white ring-1 ring-white/10' : 'bg-slate-900/50 text-slate-300'
                      }`}
                    >
                      {t[0].toUpperCase() + t.slice(1)}
                    </div>
                  ))}
                </div>

                {/* body */}
                <div className="mt-3 flex-1 rounded-xl bg-slate-900/60 border border-white/10 p-3 overflow-hidden">
                  {yTab === 'inventory' && (
                    <div className="h-full flex flex-col">
                      <h4 className="text-slate-100 font-semibold mb-2">Inventory</h4>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Stat title="Total Items" value="250" />
                        <Stat title="Stock Value" value="₹45,000" />
                      </div>
                      <div className="space-y-2 overflow-auto">
                        <ItemCard title="Fresh Apples" meta={`Stock: ${stock.apples} • ₹120/kg`} />
                        <ItemCard title="Bananas" meta={`Stock: ${stock.bananas} • ₹80/kg`} />
                        <ItemCard title="Milk (1L)" meta={`Stock: ${stock.milk} • ₹60/pack`} />
                      </div>
                      <button className="mt-auto text-[11px] bg-amber-500/90 hover:bg-amber-500 text-black font-medium rounded-lg py-2">
                        Add New Item
                      </button>
                    </div>
                  )}

                  {yTab === 'sales' && (
                    <div className="h-full flex flex-col">
                      <h4 className="text-slate-100 font-semibold mb-2">Sales</h4>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Stat title="Today's Sales" value={`₹${sales.today.toLocaleString('en-IN')}`} />
                        <Stat title="Transactions" value={`${sales.tx}`} />
                      </div>
                      <div className="space-y-2 overflow-auto">
                        <Row text="UPI • ₹1,200" />
                        <Row text="Cash • ₹850" />
                        <Row text="Card • ₹650" />
                      </div>
                      <button className="mt-auto text-[11px] bg-emerald-500/90 hover:bg-emerald-500 text-black font-medium rounded-lg py-2">
                        Record Sale
                      </button>
                    </div>
                  )}

                  {yTab === 'staff' && (
                    <div className="h-full flex flex-col">
                      <h4 className="text-slate-100 font-semibold mb-2">Staff</h4>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <Stat title="Total Staff" value="5" />
                        <Stat title="Monthly Payroll" value="₹25,000" />
                      </div>
                      <div className="space-y-2 overflow-auto">
                        <Row text="Rajesh • Manager" />
                        <Row text="Priya • Cashier" />
                        <Row text="Suresh • Helper" />
                      </div>
                      <button className="mt-auto text-[11px] bg-amber-500/90 hover:bg-amber-500 text-black font-medium rounded-lg py-2">
                        Add Employee
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mandi"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="h-full flex flex-col"
              >
                {/* header */}
                <div className="flex items-center justify-between text-slate-200 mb-3">
                  <div className="font-semibold">VyapMandi</div>
                  <div className="text-[11px] text-slate-300">Cart: {cartCount}</div>
                </div>

                {/* tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {(['catalog', 'cart', 'orders'] as MandiTab[]).map((t) => (
                    <div
                      key={t}
                      className={`text-[11px] rounded-lg py-2 text-center ${
                        mTab === t ? 'bg-slate-800 text-white ring-1 ring-white/10' : 'bg-slate-900/50 text-slate-300'
                      }`}
                    >
                      {t[0].toUpperCase() + t.slice(1)}
                    </div>
                  ))}
                </div>

                {/* body */}
                <div className="mt-3 flex-1 rounded-xl bg-slate-900/60 border border-white/10 p-3 overflow-hidden">
                  {mTab === 'catalog' && (
                    <div className="h-full">
                      <h4 className="text-slate-100 font-semibold mb-2">Popular</h4>
                      <div className="space-y-2 overflow-auto">
                        <ProductRow name="Fresh Apples" price={120} />
                        <ProductRow name="Bananas" price={80} />
                        <ProductRow name="Milk (1L)" price={60} />
                      </div>
                    </div>
                  )}

                  {mTab === 'cart' && (
                    <div className="h-full flex flex-col">
                      <h4 className="text-slate-100 font-semibold mb-2">Your Cart</h4>
                      <div className="space-y-2 flex-1 overflow-auto">
                        {cart.length === 0 ? (
                          <div className="text-slate-300 text-[13px]">Cart is empty.</div>
                        ) : (
                          cart.map((i) => (
                            <div
                              key={i.name}
                              className="flex items-center justify-between bg-slate-800/70 border border-white/10 rounded-lg px-3 py-2 text-slate-100 text-[12px]"
                            >
                              <div>
                                <div className="font-medium">{i.name}</div>
                                <div className="text-slate-300">{i.qty} × ₹{i.price}</div>
                              </div>
                              <div className="font-semibold">₹{i.qty * i.price}</div>
                            </div>
                          ))
                        )}
                      </div>
                      <button className="mt-2 text-[11px] rounded-lg py-2 font-medium bg-emerald-500/90 hover:bg-emerald-500 text-black">
                        Checkout • ₹{total}
                      </button>
                    </div>
                  )}

                  {mTab === 'orders' && (
                    <div className="h-full">
                      <h4 className="text-slate-100 font-semibold mb-2">Recent Orders</h4>
                      <Row text="Order #A103 • Placed" />
                      <Row text="Order #A102 • Delivered" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* tap ripples (rendered in page coords) */}
      </div>

      <AnimatePresence>
        {taps.map((t) => (
          <Tap x={t.x} y={t.y} keyId={t.id} key={t.id} />
        ))}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-[11px] px-3 py-1.5 rounded-lg bg-white/90 text-slate-900 shadow"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- helpers ---------- */

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
function addItem(
  cart: { name: string; qty: number; price: number }[],
  p: { name: string; price: number },
) {
  const i = cart.findIndex((x) => x.name === p.name);
  if (i >= 0) {
    const next = [...cart];
    next[i] = { ...next[i], qty: next[i].qty + 1 };
    return next;
  }
  return [...cart, { name: p.name, price: p.price, qty: 1 }];
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/80 border border-white/10 p-3">
      <div className="text-slate-400 text-[11px]">{title}</div>
      <div className="text-slate-100 text-lg font-semibold mt-0.5">{value}</div>
    </div>
  );
}
function ItemCard({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 flex items-center justify-between">
      <div className="text-[12px]">
        <div className="text-slate-100 font-medium">{title}</div>
        <div className="text-slate-300">{meta}</div>
      </div>
      <div className="text-[11px] px-3 py-1.5 rounded-md bg-amber-500/90 text-black font-medium">Update</div>
    </div>
  );
}
function Row({ text }: { text: string }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 text-[12px] text-slate-100 flex items-center justify-between">
      <div>{text}</div>
      <div className="text-slate-400">Details</div>
    </div>
  );
}
function ProductRow({ name, price }: { name: string; price: number }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 flex items-center justify-between text-[12px] text-slate-100">
      <div className="font-medium">{name}</div>
      <div className="flex items-center gap-2">
        <div className="text-slate-300">₹{price}</div>
        <div className="text-[11px] px-3 py-1.5 rounded-md bg-amber-500/90 text-black font-medium">Add</div>
      </div>
    </div>
  );
}