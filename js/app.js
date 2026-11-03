// ASTRA storefront — hash router and app bootstrap.
import * as store from './store.js';
import * as nav from './nav.js';
import * as ui from './ui.js';
import { initFx, resetScrollFns } from './fx.js';

import home from './pages/home.js';
import { phonesPage, accessoriesPage } from './pages/catalog.js';
import { phonePage, accessoryPage } from './pages/product.js';
import compare from './pages/compare.js';
import { cartPage } from './pages/cart.js';
import { checkoutPage, confirmationPage } from './pages/checkout.js';
import { loginPage, registerPage, accountPage, ordersPage, orderDetailPage, settingsPage } from './pages/account.js';
import track from './pages/track.js';
import { supportPage, faqPage, warrantyPage, contactPage } from './pages/support.js';
import about from './pages/about.js';
import tradeIn from './pages/tradein.js';
import { legalPage, notFound } from './pages/legal.js';

const routes = [
  ['/', home],
  ['/phones', phonesPage],
  ['/phone/:id', phonePage],
  ['/accessories', accessoriesPage],
  ['/accessory/:id', accessoryPage],
  ['/compare', compare],
  ['/cart', cartPage],
  ['/checkout', checkoutPage],
  ['/order/:num', confirmationPage],
  ['/login', loginPage],
  ['/register', registerPage],
  ['/account', accountPage],
  ['/account/orders', ordersPage],
  ['/account/orders/:num', orderDetailPage],
  ['/account/settings', settingsPage],
  ['/track', track],
  ['/support', supportPage],
  ['/faq', faqPage],
  ['/warranty', warrantyPage],
  ['/contact', contactPage],
  ['/about', about],
  ['/trade-in', tradeIn],
  ['/legal/:doc', legalPage],
];

function match(path) {
  for (const [pattern, page] of routes) {
    const pp = pattern.split('/'), xp = path.split('/');
    if (pp.length !== xp.length) continue;
    const params = {};
    if (pp.every((seg, i) => seg.startsWith(':') ? (params[seg.slice(1)] = decodeURIComponent(xp[i]), true) : seg === xp[i])) return { page, params };
  }
  return { page: notFound, params: {} };
}

function parseHash() {
  const raw = nav.current().slice(1) || '/';
  // support in-page anchors like #/about#sustainability
  const [pathQ, anchor] = raw.split('#');
  const [path, qs] = pathQ.split('?');
  return { path: path.replace(/\/+$/, '') || '/', query: Object.fromEntries(new URLSearchParams(qs || '')), anchor };
}

const app = document.getElementById('app');
// Drop the transition class once done so position:fixed children aren't trapped by the transform
app.addEventListener('animationend', e => { if (e.target === app) app.classList.remove('page-enter'); });
let cleanup = [];
let first = true;
let lastPath = null;

async function render() {
  const { path, query, anchor } = parseHash();
  const { page, params } = match(path);

  // Guarded routes
  if (page.auth && !store.currentUser()) { nav.go('#/login?next=' + encodeURIComponent(path)); return; }

  const samePage = path === lastPath;
  lastPath = path;
  const prog = document.getElementById('routeProgress');

  if (!first && !samePage) {
    prog.className = 'route-progress go';
    app.classList.remove('page-enter'); app.classList.add('page-leave');
    await new Promise(r => setTimeout(r, 260));
  }
  cleanup.forEach(fn => { try { fn && fn(); } catch { } }); cleanup = [];
  resetScrollFns();

  document.body.dataset.route = path.split('/')[1] || 'home';
  const ctx = { params, query, path };
  const title = typeof page.title === 'function' ? page.title(ctx) : page.title;
  document.title = title ? `${title} — ASTRA` : 'ASTRA — Power. Intelligence. Elegance.';
  app.innerHTML = page.render(ctx);
  app.classList.remove('page-leave');
  if (!samePage) { void app.offsetWidth; app.classList.add('page-enter'); }
  if (!samePage || !anchor) scrollTo({ top: 0, behavior: 'instant' });
  if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);

  const m = page.mount && page.mount(app, ctx); if (m) cleanup.push(m);
  cleanup.push(initFx(app));
  ui.setActiveNav('#' + path);
  prog.className = 'route-progress done';
  if (!first) app.focus({ preventScroll: true });
  first = false;
}

async function boot() {
  ui.renderHeader();
  ui.renderFooter();
  ui.initDrawer();
  await store.ensureDemo();
  store.subscribe(() => { ui.updateCartBadge(); if (document.getElementById('cartDrawer').classList.contains('open')) ui.renderDrawer(); });
  nav.onChange(render);
  render();
}
boot();
