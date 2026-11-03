// Client-side state: cart, accounts, orders, compare list. Persisted to localStorage.
import { findPhone, findAccessory, PROMO_CODES, SHIPPING } from './data.js';

const KEY = 'astra.v1';
const listeners = new Set();

const defaults = () => ({ cart: [], promo: null, users: {}, session: null, orders: [], compare: [], tradeIn: null, newsletter: [] });

let state;
try { state = { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { state = defaults(); }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable — keep in memory */ }
  listeners.forEach(fn => fn(state));
}
export const subscribe = fn => (listeners.add(fn), () => listeners.delete(fn));
export const getState = () => state;

/* ---------- Cart ---------- */
export function resolveItem(item) {
  if (item.kind === 'phone') {
    const p = findPhone(item.id); if (!p) return null;
    const c = p.colors.find(c => c.id === item.color) || p.colors[0];
    const s = p.storage.find(s => s.gb === item.storage) || p.storage[0];
    return { ...item, name: p.name, img: c.img, meta: `${c.name} · ${fmtGB(s.gb)}`, price: s.price, href: `#/phone/${p.id}` };
  }
  if (item.kind === 'care') {
    const p = findPhone(item.id);
    return { ...item, name: `Astra Care+ for ${p ? p.name : 'phone'}`, img: 'assets/img/brand/care.svg', meta: '3 years · accidental damage', price: item.price, href: '#/warranty' };
  }
  const a = findAccessory(item.id); if (!a) return null;
  const c = (a.colors || []).find(c => c.id === item.color) || (a.colors || [])[0];
  return { ...item, name: a.name, img: a.img, meta: c ? c.name : a.cat, price: a.price, href: `#/accessory/${a.id}` };
}
const keyOf = i => [i.kind, i.id, i.color || '', i.storage || ''].join('|');

export function addToCart(item, qty = 1) {
  const k = keyOf(item);
  const ex = state.cart.find(i => keyOf(i) === k);
  if (ex) ex.qty = Math.min(10, ex.qty + qty); else state.cart.push({ ...item, qty });
  save();
}
export function setQty(key, qty) {
  const it = state.cart.find(i => keyOf(i) === key); if (!it) return;
  if (qty <= 0) state.cart = state.cart.filter(i => i !== it); else it.qty = Math.min(10, qty);
  save();
}
export const removeItem = key => setQty(key, 0);
export const cartKey = keyOf;
export const cartCount = () => state.cart.reduce((n, i) => n + i.qty, 0);
export const cartLines = () => state.cart.map(resolveItem).filter(Boolean);
export function clearCart() { state.cart = []; state.promo = null; state.tradeIn = null; save(); }

export function applyPromo(code) {
  const c = (code || '').trim().toUpperCase();
  if (!PROMO_CODES[c]) return { ok: false, msg: 'That code isn\'t valid.' };
  const sub = totals().subtotal;
  if (PROMO_CODES[c].min && sub < PROMO_CODES[c].min) return { ok: false, msg: `Requires a subtotal of ${money(PROMO_CODES[c].min)}.` };
  state.promo = c; save();
  return { ok: true, msg: PROMO_CODES[c].label };
}
export function removePromo() { state.promo = null; save(); }
export function setTradeIn(t) { state.tradeIn = t; save(); }

export function totals(shipId = 'standard') {
  const lines = cartLines();
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  let discount = 0, shipping = (SHIPPING.find(s => s.id === shipId) || SHIPPING[0]).price;
  const promo = state.promo && PROMO_CODES[state.promo];
  if (promo) {
    if (promo.type === 'percent') discount = subtotal * promo.value / 100;
    if (promo.type === 'fixed' && subtotal >= (promo.min || 0)) discount = promo.value;
    if (promo.type === 'ship') shipping = 0;
  }
  const tradeIn = state.tradeIn && lines.some(l => l.kind === 'phone') ? Math.min(state.tradeIn.value, subtotal - discount) : 0;
  if (!lines.length) shipping = 0;
  const taxable = Math.max(0, subtotal - discount - tradeIn);
  const tax = taxable * 0.08;
  const total = taxable + shipping + tax;
  return { lines, subtotal, discount, shipping, tradeIn, tax, total, promo: state.promo };
}

/* ---------- Compare ---------- */
export function toggleCompare(id) {
  if (state.compare.includes(id)) state.compare = state.compare.filter(x => x !== id);
  else { if (state.compare.length >= 3) state.compare.shift(); state.compare.push(id); }
  save();
}
export function setCompare(ids) { state.compare = ids.slice(0, 3); save(); }

/* ---------- Accounts (demo only — stored locally) ---------- */
async function hash(s) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('astra:' + s));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  } catch { return 'h' + [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7); }
}
export const currentUser = () => (state.session && state.users[state.session]) || null;

export async function register({ name, email, password }) {
  email = email.trim().toLowerCase();
  if (state.users[email]) return { ok: false, msg: 'An account with this email already exists.' };
  state.users[email] = { name: name.trim(), email, pw: await hash(password), created: Date.now(), addresses: [] };
  state.session = email;
  // Attach any guest orders placed with this email
  state.orders.forEach(o => { if (o.email === email) o.user = email; });
  save();
  return { ok: true };
}
export async function login(email, password) {
  email = email.trim().toLowerCase();
  const u = state.users[email];
  if (!u || u.pw !== await hash(password)) return { ok: false, msg: 'Incorrect email or password.' };
  state.session = email; save();
  return { ok: true };
}
export function logout() { state.session = null; save(); }
export function updateProfile(patch) { const u = currentUser(); if (!u) return; Object.assign(u, patch); save(); }

// Seed demo account with order history
export async function ensureDemo() {
  const email = 'demo@astra.com';
  if (state.users[email]) return;
  state.users[email] = { name: 'Alex Morgan', email, pw: await hash('astra2026'), created: Date.parse('2024-03-12'), addresses: [{ line1: '210 Regent Street', city: 'London', zip: 'W1B 5AH', country: 'United Kingdom' }] };
  const mk = (num, daysAgo, items, ship = 'standard') => {
    const placed = Date.now() - daysAgo * 864e5;
    const lines = items.map(resolveItem);
    const sub = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const shipping = (SHIPPING.find(s => s.id === ship) || SHIPPING[0]).price;
    return { num, placed, user: email, email, name: 'Alex Morgan', items, lines, ship,
      address: { line1: '210 Regent Street', city: 'London', zip: 'W1B 5AH', country: 'United Kingdom' },
      totals: { subtotal: sub, discount: 0, shipping, tradeIn: 0, tax: sub * 0.08, total: sub * 1.08 + shipping },
      card: { brand: 'visa', last4: '4242' }, simulated: true, seed: true };
  };
  state.orders.push(
    mk('AST-2610-48213', 1, [{ kind: 'phone', id: 'x1-pro', color: 'graphite', storage: 512, qty: 1 }, { kind: 'accessory', id: 'case-x1pro', color: 'black', qty: 1 }], 'express'),
    mk('AST-2607-11920', 120, [{ kind: 'accessory', id: 'buds-pro', color: 'graphite', qty: 1 }]),
    mk('AST-2512-90377', 330, [{ kind: 'phone', id: 's5', color: 'glacier', storage: 256, qty: 1 }, { kind: 'accessory', id: 'charger-90', color: 'graphite', qty: 1 }]),
  );
  save();
}

/* ---------- Orders ---------- */
export function genOrderNumber() {
  const d = new Date();
  const yymm = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0');
  return `AST-${yymm}-${String(Math.floor(10000 + Math.random() * 89999))}`;
}
export function placeOrder(o) { state.orders.unshift(o); save(); return o; }
export const findOrder = (num, email) => state.orders.find(o => o.num.toUpperCase() === (num || '').trim().toUpperCase() && (!email || o.email.toLowerCase() === email.trim().toLowerCase()));
export const myOrders = () => { const u = currentUser(); return u ? state.orders.filter(o => o.user === u.email || o.email === u.email).sort((a, b) => b.placed - a.placed) : []; };

// Simulated fulfilment timeline derived from order age.
export const ORDER_STAGES = [
  { id: 'placed', label: 'Order placed', icon: 'check' },
  { id: 'processing', label: 'Processing', icon: 'box' },
  { id: 'shipped', label: 'Shipped', icon: 'truck' },
  { id: 'out', label: 'Out for delivery', icon: 'pin' },
  { id: 'delivered', label: 'Delivered', icon: 'home' },
];
export function orderStatus(o) {
  if (o.cancelled) return { idx: -1, label: 'Cancelled' };
  const mins = (Date.now() - o.placed) / 60000;
  const days = { express: 2, nextday: 1, standard: 4 }[o.ship] || 4;
  // demo pacing: new orders progress over minutes, older orders by days
  let idx;
  if (mins < 1) idx = 0; else if (mins < 4) idx = 1; else if (mins < 60 * 20) idx = 2;
  else if (mins < 60 * 24 * days) idx = 3; else idx = 4;
  return { idx, label: ORDER_STAGES[idx].label, eta: o.placed + days * 864e5 };
}
export function cancelOrder(num) { const o = state.orders.find(o => o.num === num); if (o) { o.cancelled = Date.now(); save(); } }

export function subscribeNewsletter(email) { if (!state.newsletter.includes(email)) state.newsletter.push(email); save(); }

/* ---------- Formatting ---------- */
export const money = n => '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
export const money2 = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtGB = gb => gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`;
export const fmtDate = t => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
