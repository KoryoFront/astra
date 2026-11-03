// Shared UI components and global chrome (header, footer, cart drawer, search, toasts).
import { icon, LOGO, LOGO_MARK, WORDMARK } from './icons.js';
import { PHONES, ACCESSORIES, SERIES, fromPrice } from './data.js';
import * as store from './store.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export { go } from './nav.js';

/* ---------- Small components ---------- */
export const stars = r => `<span class="stars" aria-label="${r} out of 5">${'★'.repeat(Math.round(r))}${'☆'.repeat(5 - Math.round(r))}</span>`;
export const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb">${items.map((it, i) => i < items.length - 1 ? `<a href="${it[1]}">${esc(it[0])}</a><span>/</span>` : `<span aria-current="page">${esc(it[0])}</span>`).join('')}</nav>`;
export const isTransparent = src => /\.(png|webp|svg)$/.test(src);

export function phoneCard(p, { compare = true } = {}) {
  const inCmp = store.getState().compare.includes(p.id);
  return `<article class="p-card card" data-tilt="4" data-reveal>
    <a href="#/phone/${p.id}" class="media" aria-label="${esc(p.name)}">
      ${p.badge ? `<span class="chip chip-new">${p.badge}</span>` : ''}
      <img src="${p.colors[0].img}" alt="${esc(p.name)} in ${esc(p.colors[0].name)}" loading="lazy" data-swap>
      <div class="quick"><span class="btn btn-primary btn-sm btn-block">View ${esc(p.name.replace('ASTRA ', ''))} ${icon('arrow', 'arrow')}</span></div>
    </a>
    <div class="row" style="justify-content:space-between"><span class="eyebrow">${SERIES[p.series].name.replace('ASTRA ', '')} · ${p.tier}</span>${stars(p.rating)}</div>
    <h3 style="margin-top:8px"><a href="#/phone/${p.id}">${esc(p.name)}</a></h3>
    <p class="sub">${esc(p.tagline)}</p>
    <div class="swatches">${p.colors.map((c, i) => `<button class="swatch" style="background:${c.hex}" title="${esc(c.name)}" aria-label="${esc(c.name)}" data-img="${c.img}"></button>`).join('')}</div>
    <div class="foot">
      <span class="price">From ${store.money(fromPrice(p))}</span>
      ${compare ? `<label class="compare-check"><input type="checkbox" data-compare="${p.id}" ${inCmp ? 'checked' : ''}> Compare</label>` : ''}
    </div>
  </article>`;
}

export function accessoryCard(a) {
  return `<article class="p-card card" data-tilt="4" data-reveal>
    <a href="#/accessory/${a.id}" class="media" aria-label="${esc(a.name)}">
      ${a.badge ? `<span class="chip chip-new">${a.badge}</span>` : ''}
      <img src="${a.img}" alt="${esc(a.name)}" loading="lazy">
    </a>
    <div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(a.cat)}</span>${stars(a.rating)}</div>
    <h3 style="margin-top:8px;font-size:18px"><a href="#/accessory/${a.id}">${esc(a.name)}</a></h3>
    <p class="sub">${esc(a.blurb)}</p>
    <div class="foot">
      <span class="price">${store.money(a.price)}</span>
      <button class="btn btn-dark btn-sm" data-add-acc="${a.id}">${icon('plus')} Add</button>
    </div>
  </article>`;
}

/** Wire behaviours common to product cards inside root */
export function wireCards(root) {
  root.addEventListener('click', e => {
    const sw = e.target.closest('.swatch[data-img]');
    if (sw) { e.preventDefault(); const img = sw.closest('.p-card').querySelector('[data-swap]'); img.style.opacity = 0; setTimeout(() => { img.src = sw.dataset.img; img.style.opacity = 1; }, 220); return; }
    const add = e.target.closest('[data-add-acc]');
    if (add) {
      const a = ACCESSORIES.find(x => x.id === add.dataset.addAcc);
      store.addToCart({ kind: 'accessory', id: a.id, color: a.colors?.[0]?.id });
      toast(`${a.name} added to your bag`, { action: ['View bag', openCart] });
    }
  });
  root.addEventListener('change', e => {
    const c = e.target.closest('[data-compare]');
    if (c) store.toggleCompare(c.dataset.compare);
  });
}

/* ---------- Toasts ---------- */
export function toast(msg, { error = false, action } = {}) {
  const host = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast glass' + (error ? ' err' : '');
  t.innerHTML = `${icon(error ? 'alert' : 'check')}<span>${esc(msg)}</span>${action ? `<button class="link" style="margin-left:6px">${esc(action[0])}</button>` : ''}`;
  if (action) t.querySelector('button').onclick = () => { action[1](); dismiss(); };
  host.appendChild(t);
  const dismiss = () => { t.classList.add('out'); setTimeout(() => t.remove(), 350); };
  setTimeout(dismiss, 3800);
}

/* ---------- Header ---------- */
const NAV = [['Phones', '#/phones'], ['Accessories', '#/accessories'], ['Trade In', '#/trade-in'], ['Support', '#/support'], ['About ASTRA', '#/about']];

export function renderHeader() {
  const megaCards = Object.values(SERIES).map(s => {
    const p = PHONES.find(p => p.series === s.id);
    return `<a class="mega-card" href="#/phones?series=${s.id}"><img src="assets/img/products/${s.id}-back.webp" alt="" loading="lazy"><b>${s.name.replace('ASTRA ', '')}</b><span>${s.tagline}</span><em>From ${store.money(Math.min(...PHONES.filter(x => x.series === s.id).map(fromPrice)))}</em></a>`;
  }).join('');
  $('#siteHeader').innerHTML = `<div class="container nav">
    <a href="#/" class="logo-link" aria-label="ASTRA home">${LOGO}</a>
    <nav class="nav-links" aria-label="Primary">
      ${NAV.map(([l, h]) => h === '#/phones' ? `<div class="has-mega"><a href="${h}" data-nav="${h}">${l}</a><div class="mega glass">${megaCards}<div class="mega-links"><span class="eyebrow" style="padding:8px 10px">Shop</span><a href="#/phones">All phones</a><a href="#/compare">Compare models</a><a href="#/trade-in">Trade in & upgrade</a><a href="#/warranty">Astra Care+</a></div></div></div>` : `<a href="${h}" data-nav="${h}">${l}</a>`).join('')}
    </nav>
    <div class="nav-actions">
      <button class="icon-btn" id="searchBtn" aria-label="Search">${icon('search')}</button>
      <a class="icon-btn" href="#/account" aria-label="Account" id="acctBtn">${icon('user')}</a>
      <button class="icon-btn" id="cartBtn" aria-label="Shopping bag">${icon('cart')}<span class="badge-dot" id="cartCount">0</span></button>
      <button class="icon-btn menu-toggle" id="menuBtn" aria-label="Menu">${icon('menu')}</button>
    </div>
  </div>`;
  $('#mobileMenu').innerHTML = `<button class="icon-btn close" id="menuClose" aria-label="Close menu">${icon('close')}</button>
    ${[['Home', '#/'], ...NAV, ['Compare', '#/compare'], ['Account', '#/account'], ['Track order', '#/track']].map(([l, h], i) => `<a href="${h}" style="transition-delay:${0.04 * i + 0.05}s">${l}</a>`).join('')}`;

  $('#searchBtn').onclick = openSearch;
  $('#cartBtn').onclick = openCart;
  $('#menuBtn').onclick = () => toggleMenu(true);
  $('#menuClose').onclick = () => toggleMenu(false);
  $('#mobileMenu').addEventListener('click', e => { if (e.target.closest('a')) toggleMenu(false); });

  // Sticky header: always visible; turns into a glass pill once the page scrolls
  const h = $('#siteHeader');
  addEventListener('scroll', () => { h.classList.toggle('scrolled', scrollY > 40); }, { passive: true });
  updateCartBadge(false);
}

export function setActiveNav(hash) {
  $$('[data-nav]').forEach(a => a.classList.toggle('active', hash.startsWith(a.dataset.nav)));
}
function toggleMenu(open) {
  $('#mobileMenu').classList.toggle('open', open);
  $('#mobileMenu').setAttribute('aria-hidden', !open);
  document.body.classList.toggle('no-scroll', open);
}

let lastCount = 0;
export function updateCartBadge(bump = true) {
  const n = store.cartCount(), b = $('#cartCount'); if (!b) return;
  b.textContent = n; b.classList.toggle('show', n > 0);
  if (bump && n > lastCount) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  lastCount = n;
}

/* ---------- Footer ---------- */
export function renderFooter() {
  $('#siteFooter').innerHTML = `<div class="container">
    <div class="foot-grid">
      <div>
        <a href="#/" class="logo" aria-label="ASTRA home">${LOGO_MARK}${WORDMARK}</a>
        <p class="muted" style="margin-top:18px;max-width:340px;font-size:14px">Designed to elevate every moment. Premium smartphones, thoughtfully engineered.</p>
        <form class="newsletter" id="newsletter"><input type="email" required placeholder="Email for launch news" aria-label="Email address"><button class="btn btn-primary btn-sm">Subscribe</button></form>
        <div class="socials"><a href="#/about" aria-label="ASTRA on X">${icon('x')}</a><a href="#/about" aria-label="ASTRA on Instagram">${icon('ig')}</a><a href="#/about" aria-label="ASTRA on YouTube">${icon('yt')}</a><a href="#/about" aria-label="ASTRA on TikTok">${icon('tt')}</a></div>
      </div>
      <div><h4>Shop</h4><ul><li><a href="#/phones">All phones</a></li><li><a href="#/phone/x1-pro">X1 Pro</a></li><li><a href="#/phones?series=s">S Series</a></li><li><a href="#/phones?series=a">A Series</a></li><li><a href="#/accessories">Accessories</a></li><li><a href="#/compare">Compare</a></li></ul></div>
      <div><h4>Services</h4><ul><li><a href="#/trade-in">Trade in & upgrade</a></li><li><a href="#/warranty">Astra Care+</a></li><li><a href="#/track">Track order</a></li><li><a href="#/account/orders">Order history</a></li></ul></div>
      <div><h4>Support</h4><ul><li><a href="#/support">Help centre</a></li><li><a href="#/faq">FAQs</a></li><li><a href="#/warranty">Warranty</a></li><li><a href="#/contact">Contact us</a></li></ul></div>
      <div><h4>ASTRA</h4><ul><li><a href="#/about">About ASTRA</a></li><li><a href="#/about#sustainability">Sustainability</a></li><li><a href="#/about#careers">Careers</a></li><li><a href="#/about#press">Newsroom</a></li></ul></div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 ASTRA Technologies. All rights reserved. <span id="releaseStamp" style="opacity:.5;margin-left:8px"></span></span>
      <span class="row" style="gap:20px"><a href="#/legal/privacy">Privacy</a><a href="#/legal/terms">Terms of sale</a><a href="#/legal/cookies">Cookies</a><span>United States (USD)</span></span>
    </div>
  </div>`;
  $('#newsletter').onsubmit = e => {
    e.preventDefault(); const inp = e.target.querySelector('input');
    store.subscribeNewsletter(inp.value); inp.value = ''; toast('You\'re on the list. Welcome to ASTRA.');
  };
}

/* ---------- Cart drawer ---------- */
export function openCart() {
  renderDrawer();
  $('#cartDrawer').classList.add('open'); $('#drawerBackdrop').classList.add('open');
  $('#cartDrawer').setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}
export function closeCart() {
  $('#cartDrawer').classList.remove('open'); $('#drawerBackdrop').classList.remove('open');
  $('#cartDrawer').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}
export function lineItem(l, { editable = true } = {}) {
  const k = store.cartKey(l);
  return `<div class="line-item" data-key="${esc(k)}">
    <a href="${l.href}"><img src="${l.img}" alt=""></a>
    <div><a class="name" href="${l.href}">${esc(l.name)}</a><div class="meta">${esc(l.meta)}</div>
      ${editable ? `<div class="row" style="gap:12px"><div class="qty"><button data-q="-1" aria-label="Decrease quantity">${icon('minus')}</button><span>${l.qty}</span><button data-q="1" aria-label="Increase quantity">${icon('plus')}</button></div><button class="remove-btn" data-remove>Remove</button></div>` : `<div class="meta">Qty ${l.qty}</div>`}
    </div>
    <div class="price">${store.money(l.price * l.qty)}</div>
  </div>`;
}
export function wireLineItems(root) {
  root.addEventListener('click', e => {
    const li = e.target.closest('.line-item'); if (!li) return;
    const k = li.dataset.key;
    const q = e.target.closest('[data-q]');
    if (q) { const it = store.getState().cart.find(i => store.cartKey(i) === k); store.setQty(k, it.qty + +q.dataset.q); }
    if (e.target.closest('[data-remove]')) { li.style.transition = 'opacity .3s, transform .3s'; li.style.opacity = 0; li.style.transform = 'translateX(30px)'; setTimeout(() => store.removeItem(k), 280); }
  });
}
export function totalsHtml(t, { showShipping = true } = {}) {
  return `<div class="totals">
    <div class="row"><span class="muted">Subtotal</span><span>${store.money2(t.subtotal)}</span></div>
    ${t.discount ? `<div class="row discount"><span>Promo (${esc(t.promo)})</span><span>−${store.money2(t.discount)}</span></div>` : ''}
    ${t.tradeIn ? `<div class="row discount"><span>Trade-in credit</span><span>−${store.money2(t.tradeIn)}</span></div>` : ''}
    ${showShipping ? `<div class="row"><span class="muted">Shipping</span><span>${t.shipping ? store.money2(t.shipping) : 'Free'}</span></div>` : ''}
    <div class="row"><span class="muted">Estimated tax (8%)</span><span>${store.money2(t.tax)}</span></div>
    <div class="row grand"><span>Total</span><span>${store.money2(t.total)}</span></div>
  </div>`;
}
export function renderDrawer() {
  const d = $('#cartDrawer'); const t = store.totals();
  d.innerHTML = `<div class="drawer-head"><h3 class="h3">Your bag ${t.lines.length ? `<span class="dim" style="font-size:15px">(${store.cartCount()})</span>` : ''}</h3><button class="icon-btn" data-close aria-label="Close bag">${icon('close')}</button></div>
    <div class="drawer-body">${t.lines.length ? t.lines.map(l => lineItem(l)).join('') : `<div class="empty">${icon('bag')}<p>Your bag is empty.</p><a href="#/phones" class="btn btn-ghost" style="margin-top:20px">Shop phones</a></div>`}</div>
    ${t.lines.length ? `<div class="drawer-foot">${totalsHtml(t)}<div class="stack" style="--stack:10px;margin-top:18px"><a href="#/checkout" class="btn btn-primary btn-block btn-lg">Checkout ${icon('lock')}</a><a href="#/cart" class="btn btn-ghost btn-block">View bag</a></div></div>` : ''}`;
  d.querySelector('[data-close]').onclick = closeCart;
  d.querySelectorAll('a').forEach(a => a.addEventListener('click', closeCart));
}
let drawerWired = false;
export function initDrawer() {
  if (drawerWired) return; drawerWired = true;
  $('#drawerBackdrop').onclick = closeCart;
  wireLineItems($('#cartDrawer'));
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeSearch(); closeLightbox(); } });
}

/* ---------- Search ---------- */
const INDEX = [
  ...PHONES.map(p => ({ t: p.name, s: `${p.tier} · from ${store.money(fromPrice(p))}`, h: `#/phone/${p.id}`, img: p.colors[0].img, k: `${p.name} ${p.series} ${p.tier} phone smartphone ${p.tagline}` })),
  ...ACCESSORIES.map(a => ({ t: a.name, s: `${a.cat} · ${store.money(a.price)}`, h: `#/accessory/${a.id}`, img: a.img, k: `${a.name} ${a.cat} accessory ${a.blurb}` })),
  ...[['Compare phones', '#/compare'], ['Trade in your phone', '#/trade-in'], ['Track my order', '#/track'], ['Astra Care+ warranty', '#/warranty'], ['Contact support', '#/contact'], ['FAQs', '#/faq'], ['My account', '#/account'], ['About ASTRA', '#/about']].map(([t, h]) => ({ t, s: 'Page', h, k: t })),
];
export function openSearch() {
  const o = $('#searchOverlay');
  o.innerHTML = `<div class="search-box glass" role="dialog" aria-label="Search">
    <div class="search-input">${icon('search')}<input type="search" placeholder="Search ASTRA" aria-label="Search ASTRA" autocomplete="off"><button class="icon-btn" data-close aria-label="Close">${icon('close')}</button></div>
    <div class="search-results"></div></div>`;
  o.classList.add('open'); o.setAttribute('aria-hidden', 'false');
  const inp = o.querySelector('input'), res = o.querySelector('.search-results');
  let sel = 0;
  const draw = () => {
    const q = inp.value.trim().toLowerCase();
    const list = q ? INDEX.filter(i => q.split(/\s+/).every(w => i.k.toLowerCase().includes(w))).slice(0, 8) : INDEX.slice(0, 6);
    sel = Math.min(sel, Math.max(0, list.length - 1));
    res.innerHTML = (q ? '' : '<div class="search-hint">Popular</div>') + (list.length ? list.map((i, n) => `<a href="${i.h}" class="${n === sel ? 'sel' : ''}">${i.img ? `<img src="${i.img}" alt="">` : `<span class="icon-btn" style="background:var(--surface-2)">${icon('arrow')}</span>`}<span><b style="font-weight:500">${esc(i.t)}</b><br><span class="dim">${esc(i.s)}</span></span></a>`).join('') : `<div class="search-hint">No results for “${esc(inp.value)}”.</div>`);
  };
  inp.oninput = () => { sel = 0; draw(); };
  inp.onkeydown = e => {
    const links = $$('a', res);
    if (e.key === 'ArrowDown') { sel = Math.min(links.length - 1, sel + 1); draw(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
    if (e.key === 'Enter' && links[sel]) { go(links[sel].getAttribute('href')); closeSearch(); }
  };
  o.onclick = e => { if (e.target === o || e.target.closest('[data-close]') || e.target.closest('a')) closeSearch(); };
  draw(); setTimeout(() => inp.focus(), 50);
}
export function closeSearch() { const o = $('#searchOverlay'); o.classList.remove('open'); o.setAttribute('aria-hidden', 'true'); }

/* ---------- Lightbox ---------- */
export function openLightbox(src) {
  const l = $('#lightbox');
  l.innerHTML = `<img src="${src}" alt=""><button class="icon-btn glass" aria-label="Close">${icon('close')}</button>`;
  l.classList.add('open'); l.onclick = closeLightbox;
}
export function closeLightbox() { $('#lightbox').classList.remove('open'); }

/* ---------- Form helpers ---------- */
export function fieldError(field, msg) {
  const f = field.closest('.field'); if (!f) return;
  f.classList.toggle('invalid', !!msg); f.classList.toggle('valid', !msg && !!field.value);
  let e = f.querySelector('.err'); if (!e) { e = document.createElement('span'); e.className = 'err'; f.appendChild(e); }
  e.textContent = msg || '';
}
export const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
