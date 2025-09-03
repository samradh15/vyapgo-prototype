'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AppKey = 'yantra' | 'mandi';
type YantraTab = 'inventory' | 'sales' | 'staff' | 'vyapgo';
type MandiTab = 'home' | 'catalog' | 'cart' | 'orders';

const BEIGE = '#F6F0E6';

export default function AuthPreview() {
  const [app, setApp] = useState<AppKey>('yantra');
  return (
    <div className="relative h-full w-full">
      {/* Soft beige gradient + dotted overlay */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            'radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.6), transparent 70%), linear-gradient(180deg,#F6F0E6,#F2E9DD)',
          border: '1px solid rgba(251,191,36,0.35)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-60 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '22px 22px, 44px 44px',
          backgroundPosition: '0 0, 11px 11px',
        }}
      />

      <div className="relative h-full flex flex-col p-6">
        {/* Top actions */}
        <div className="flex items-center justify-between mb-5">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-700/80 hover:text-slate-900 transition"
            aria-label="Back to website"
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 shadow-sm">←</span>
            Back to website
          </a>

          {/* App switcher */}
          <div className="inline-flex rounded-xl bg-white/80 border border-amber-200/60 overflow-hidden shadow-sm">
            <button
              onClick={() => setApp('yantra')}
              className={`px-3.5 py-2 text-sm font-medium transition ${
                app === 'yantra'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              VyapYantra
            </button>
            <button
              onClick={() => setApp('mandi')}
              className={`px-3.5 py-2 text-sm font-medium transition ${
                app === 'mandi'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              VyapMandi
            </button>
          </div>
        </div>

        {/* Phone frame */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="relative rounded-[28px] overflow-hidden"
            style={{
              width: 360,
              height: 720,
              boxShadow:
                '0 20px 45px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.2), inset 0 0 0 2px rgba(0,0,0,0.5)',
              background: '#0f172a',
              border: '1px solid rgba(0,0,0,0.5)',
            }}
            aria-label="App phone preview"
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-40 bg-black rounded-b-2xl z-20" />
            <div className="absolute inset-0 p-4 pt-8">
              <AnimatePresence mode="wait">
                {app === 'yantra' ? (
                  <motion.div
                    key="yantra"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    <YantraPhone />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mandi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="h-full"
                  >
                    <MandiPhone />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Micro trust */}
        <div className="mt-5 text-xs text-slate-600/80">
          Built for Indian SMBs • Hindi/English supported • UPI & COD ready
        </div>
      </div>
    </div>
  );
}

/* ---------------- VyapYantra simulated app ---------------- */

function YantraPhone() {
  const [tab, setTab] = useState<YantraTab>('inventory');
  const [stock, setStock] = useState({ apples: 100, bananas: 150, milk: 75 });
  const [toast, setToast] = useState<string | null>(null);

  const handleUpdate = (key: keyof typeof stock) => {
    setStock((s) => ({ ...s, [key]: Math.max(0, s[key] - 1) }));
    setToast('Updated stock -1');
    window.setTimeout(() => setToast(null), 1200);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top title */}
      <div className="flex items-center justify-between text-slate-200 mb-3">
        <h3 className="font-semibold">VyapYantra</h3>
        <span className="inline-flex items-center gap-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Ready
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {([
          ['inventory', 'Inventory'],
          ['sales', 'Sales'],
          ['staff', 'Staff'],
          ['vyapgo', 'VyapGo'],
        ] as [YantraTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-xs rounded-lg py-2 ${
              tab === key ? 'bg-slate-800 text-white ring-1 ring-white/10' : 'bg-slate-900/50 text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-3 flex-1 rounded-xl bg-slate-900/60 border border-white/10 p-3 overflow-hidden">
        {tab === 'inventory' && (
          <div className="h-full flex flex-col">
            <h4 className="text-slate-100 font-semibold mb-2">Inventory Management</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Stat title="Total Items" value="250" />
              <Stat title="Stock Value" value="₹45,000" />
            </div>
            <div className="space-y-2 overflow-auto">
              <ItemCard title="Fresh Apples" meta={`Stock: ${stock.apples} • ₹120/kg`} onUpdate={() => handleUpdate('apples')} />
              <ItemCard title="Bananas" meta={`Stock: ${stock.bananas} • ₹80/kg`} onUpdate={() => handleUpdate('bananas')} />
              <ItemCard title="Milk (1L)" meta={`Stock: ${stock.milk} • ₹60/pack`} onUpdate={() => handleUpdate('milk')} />
            </div>
            <button className="mt-auto text-xs bg-amber-500/90 hover:bg-amber-500 text-black font-medium rounded-lg py-2">
              Add New Item
            </button>
          </div>
        )}

        {tab === 'sales' && (
          <div className="h-full flex flex-col">
            <h4 className="text-slate-100 font-semibold mb-2">Sales Dashboard</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Stat title="Today's Sales" value="₹12,500" />
              <Stat title="Transactions" value="87" />
            </div>
            <div className="space-y-2 overflow-auto">
              <SaleCard id="#001" meta="₹850 • 2:30 PM • Cash" />
              <SaleCard id="#002" meta="₹1,200 • 2:45 PM • UPI" />
              <SaleCard id="#003" meta="₹650 • 3:00 PM • Card" />
            </div>
            <button className="mt-auto text-xs bg-emerald-500/90 hover:bg-emerald-500 text-black font-medium rounded-lg py-2">
              Record New Sale
            </button>
          </div>
        )}

        {tab === 'staff' && (
          <div className="h-full flex flex-col">
            <h4 className="text-slate-100 font-semibold mb-2">Staff Management</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Stat title="Total Staff" value="5" />
              <Stat title="Monthly Payroll" value="₹25,000" />
            </div>
            <div className="space-y-2 overflow-auto">
              <Person name="Rajesh Kumar" role="Store Manager • ₹15,000/m" />
              <Person name="Priya Sharma" role="Cashier • ₹10,000/m" />
              <Person name="Suresh Singh" role="Helper • ₹8,000/m" />
            </div>
            <button className="mt-auto text-xs bg-amber-500/90 hover:bg-amber-500 text-black font-medium rounded-lg py-2">
              Add Employee
            </button>
          </div>
        )}

        {tab === 'vyapgo' && (
          <div className="h-full">
            <h4 className="text-slate-100 font-semibold mb-2">VyapGo Services</h4>
            <div className="grid grid-cols-1 gap-2">
              <Service title="AI Data Scientist" cta="Explore AI" />
              <Service title="VyapGo Copilot" cta="Try Copilot" />
              <Service title="Business Analytics" cta="View Reports" />
            </div>
          </div>
        )}
      </div>

      {/* Tiny toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] px-3 py-1.5 rounded-lg bg-white/90 text-slate-900"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- VyapMandi simulated app ---------------- */

function MandiPhone() {
  const [tab, setTab] = useState<MandiTab>('catalog');
  const [cart, setCart] = useState<{ name: string; qty: number; price: number }[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const addToCart = (p: { name: string; price: number }) => {
    setCart((c) => {
      const idx = c.findIndex((i) => i.name === p.name);
      if (idx >= 0) {
        const copy = [...c];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...c, { name: p.name, qty: 1, price: p.price }];
    });
    setToast('Added to cart');
    window.setTimeout(() => setToast(null), 1200);
  };

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);
  const total = useMemo(() => cart.reduce((n, i) => n + i.qty * i.price, 0), [cart]);

  return (
    <div className="h-full flex flex-col">
      {/* Top title */}
      <div className="flex items-center justify-between text-slate-200 mb-3">
        <h3 className="font-semibold">VyapMandi</h3>
        <span className="text-xs text-slate-300">Cart: {cartCount}</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {([
          ['home', 'Home'],
          ['catalog', 'Catalog'],
          ['cart', `Cart (${cartCount})`],
          ['orders', 'Orders'],
        ] as [MandiTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-[11px] rounded-lg py-2 ${
              tab === key ? 'bg-slate-800 text-white ring-1 ring-white/10' : 'bg-slate-900/50 text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-3 flex-1 rounded-xl bg-slate-900/60 border border-white/10 p-3 overflow-hidden">
        {tab === 'home' && (
          <div className="h-full">
            <h4 className="text-slate-100 font-semibold mb-2">Fresh deals today</h4>
            <Banner title="Save 10% on bulk fruits" />
            <Banner title="Free delivery over ₹999" />
          </div>
        )}

        {tab === 'catalog' && (
          <div className="h-full">
            <h4 className="text-slate-100 font-semibold mb-2">Popular items</h4>
            <div className="space-y-2 overflow-auto">
              <Product name="Fresh Apples" price={120} onAdd={() => addToCart({ name: 'Fresh Apples', price: 120 })} />
              <Product name="Bananas" price={80} onAdd={() => addToCart({ name: 'Bananas', price: 80 })} />
              <Product name="Milk (1L)" price={60} onAdd={() => addToCart({ name: 'Milk (1L)', price: 60 })} />
            </div>
          </div>
        )}

        {tab === 'cart' && (
          <div className="h-full flex flex-col">
            <h4 className="text-slate-100 font-semibold mb-2">Your Cart</h4>
            <div className="space-y-2 flex-1 overflow-auto">
              {cart.length === 0 ? (
                <div className="text-slate-300 text-sm">Your cart is empty.</div>
              ) : (
                cart.map((i) => (
                  <div
                    key={i.name}
                    className="flex items-center justify-between bg-slate-800/70 border border-white/10 rounded-lg px-3 py-2 text-slate-100"
                  >
                    <div className="text-xs">
                      <div className="font-medium">{i.name}</div>
                      <div className="text-slate-300">
                        {i.qty} × ₹{i.price}
                      </div>
                    </div>
                    <div className="text-xs font-semibold">₹{i.qty * i.price}</div>
                  </div>
                ))
              )}
            </div>
            <button
              disabled={cart.length === 0}
              className={`mt-2 text-xs rounded-lg py-2 font-medium ${
                cart.length === 0
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-emerald-500/90 hover:bg-emerald-500 text-black'
              }`}
            >
              Checkout • ₹{total}
            </button>
          </div>
        )}

        {tab === 'orders' && (
          <div className="h-full">
            <h4 className="text-slate-100 font-semibold mb-2">Recent Orders</h4>
            <Order id="#A102" meta="₹1,240 • Delivered" />
            <Order id="#A101" meta="₹820 • In transit" />
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] px-3 py-1.5 rounded-lg bg-white/90 text-slate-900"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- small building blocks ---------------- */

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/80 border border-white/10 p-3">
      <div className="text-slate-400 text-[11px]">{title}</div>
      <div className="text-slate-100 text-lg font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function ItemCard({ title, meta, onUpdate }: { title: string; meta: string; onUpdate: () => void }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 flex items-center justify-between">
      <div className="text-xs">
        <div className="text-slate-100 font-medium">{title}</div>
        <div className="text-slate-300">{meta}</div>
      </div>
      <button
        onClick={onUpdate}
        className="text-[11px] px-3 py-1.5 rounded-md bg-amber-500/90 hover:bg-amber-500 text-black font-medium transition"
      >
        Update
      </button>
    </div>
  );
}

function SaleCard({ id, meta }: { id: string; meta: string }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 flex items-center justify-between text-xs">
      <div className="text-slate-100 font-medium">Sale {id}</div>
      <div className="text-slate-300">{meta}</div>
    </div>
  );
}

function Person({ name, role }: { name: string; role: string }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 text-xs">
      <div className="text-slate-100 font-medium">{name}</div>
      <div className="text-slate-300">{role}</div>
    </div>
  );
}

function Service({ title, cta }: { title: string; cta: string }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 text-xs flex items-center justify-between">
      <div className="text-slate-100 font-medium">{title}</div>
      <button className="text-[11px] px-3 py-1.5 rounded-md bg-emerald-500/90 hover:bg-emerald-500 text-black font-medium transition">
        {cta}
      </button>
    </div>
  );
}

function Product({ name, price, onAdd }: { name: string; price: number; onAdd: () => void }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 flex items-center justify-between text-xs">
      <div className="text-slate-100 font-medium">{name}</div>
      <div className="flex items-center gap-2">
        <div className="text-slate-300">₹{price}</div>
        <button
          onClick={onAdd}
          className="text-[11px] px-3 py-1.5 rounded-md bg-amber-500/90 hover:bg-amber-500 text-black font-medium transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function Banner({ title }: { title: string }) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-white/10 p-3 text-xs text-slate-100 mb-2">
      {title}
    </div>
  );
}

function Order({ id, meta }: { id: string; meta: string }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-white/10 p-3 text-xs flex items-center justify-between">
      <div className="text-slate-100 font-medium">Order {id}</div>
      <div className="text-slate-300">{meta}</div>
    </div>
  );
}