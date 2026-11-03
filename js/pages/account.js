import { icon } from '../icons.js';
import { crumbs, esc, $, $$, fieldError, emailOk, shake, toast, go, lineItem, totalsHtml } from '../ui.js';
import * as store from '../store.js';
import { ORDER_STAGES } from '../store.js';
import { notFound } from './legal.js';

const nextOf = q => (q.next && q.next.startsWith('/') ? '#' + q.next : '#/account');

function authShell(inner, img = 'assets/img/products/x-lifestyle.jpg') {
  return `<div class="auth-wrap"><div class="auth-media"><img src="${img}" alt=""></div><div class="auth-form">${inner}</div></div>`;
}

export const loginPage = {
  title: 'Sign in',
  render({ query }) {
    if (store.currentUser()) return `<div class="container section center"><p class="muted">You're already signed in.</p><a class="btn btn-primary" style="margin-top:20px" href="${nextOf(query)}">Continue</a></div>`;
    return authShell(`<form id="login" class="stack" style="--stack:18px" novalidate>
      <div><p class="eyebrow">Welcome back</p><h1 class="h2" style="margin-top:10px">Sign in to ASTRA</h1></div>
      <div class="demo-creds">Demo account: <b>demo@astra.com</b> / <b>astra2026</b> <button type="button" id="fillDemo">Fill in</button></div>
      <div class="field"><label for="email">Email</label><input id="email" type="email" autocomplete="username" required></div>
      <div class="field"><label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password" required><button type="button" class="adorn" id="peek" style="pointer-events:auto;color:var(--text-3)" aria-label="Show password">${icon('eye').replace('<svg', '<svg style="width:18px;height:18px"')}</button></div>
      <div class="row" style="justify-content:space-between;font-size:14px"><label class="check" style="padding:0"><input type="checkbox" checked> Keep me signed in</label><button type="button" class="link" id="forgot" style="font-size:14px">Forgot password?</button></div>
      <p class="err" id="formErr" style="color:var(--err);font-size:14px;min-height:0"></p>
      <button class="btn btn-primary btn-lg btn-block">Sign in</button>
      <p class="muted center" style="font-size:14px">New to ASTRA? <a class="link" href="#/register${query.next ? '?next=' + encodeURIComponent(query.next) : ''}">Create an account</a></p>
      <p class="dim center" style="font-size:12px">Accounts are stored only in this browser for demo purposes.</p>
    </form>`);
  },
  mount(root, { query }) {
    const f = $('#login', root); if (!f) return;
    $('#fillDemo', f).onclick = () => { $('#email', f).value = 'demo@astra.com'; $('#pw', f).value = 'astra2026'; };
    $('#peek', f).onclick = () => { const p = $('#pw', f); p.type = p.type === 'password' ? 'text' : 'password'; };
    $('#forgot', f).onclick = () => toast('Demo store: password reset emails aren\'t sent. Use the demo account or register a new one.');
    f.onsubmit = async e => {
      e.preventDefault();
      const em = $('#email', f), pw = $('#pw', f);
      fieldError(em, emailOk(em.value) ? '' : 'Enter a valid email address.');
      fieldError(pw, pw.value ? '' : 'Enter your password.');
      if (!emailOk(em.value) || !pw.value) return shake(f);
      const btn = f.querySelector('.btn-primary'); btn.disabled = true; btn.textContent = 'Signing in…';
      await new Promise(r => setTimeout(r, 600));
      const r = await store.login(em.value, pw.value);
      btn.disabled = false; btn.textContent = 'Sign in';
      if (!r.ok) { $('#formErr', f).textContent = r.msg; shake(f); return; }
      toast(`Welcome back, ${store.currentUser().name.split(' ')[0]}.`);
      go(nextOf(query));
    };
  },
};

export const registerPage = {
  title: 'Create account',
  render({ query }) {
    return authShell(`<form id="reg" class="stack" style="--stack:18px" novalidate>
      <div><p class="eyebrow">Join ASTRA</p><h1 class="h2" style="margin-top:10px">Create your account</h1><p class="muted" style="margin-top:8px">Track orders, save your details and get early access to launches.</p></div>
      <div class="field"><label for="name">Full name</label><input id="name" autocomplete="name" required></div>
      <div class="field"><label for="email">Email</label><input id="email" type="email" autocomplete="email" value="${esc(query.email || '')}" required></div>
      <div class="field"><label for="pw">Password</label><input id="pw" type="password" autocomplete="new-password" required><div class="progress-bar" style="height:4px;margin-top:4px"><i id="pwBar" style="transition:width .3s,background .3s"></i></div><span class="dim" style="font-size:12px" id="pwHint">At least 8 characters, including a number.</span></div>
      <label class="check"><input type="checkbox" id="agree"> I agree to the <a class="link" href="#/legal/terms">terms</a> and <a class="link" href="#/legal/privacy">privacy policy</a>.</label>
      <label class="check"><input type="checkbox" checked> Send me ASTRA news and offers</label>
      <p class="err" id="formErr" style="color:var(--err);font-size:14px"></p>
      <button class="btn btn-primary btn-lg btn-block">Create account</button>
      <p class="muted center" style="font-size:14px">Already have an account? <a class="link" href="#/login">Sign in</a></p>
    </form>`, 'assets/img/products/s-lifestyle.jpg');
  },
  mount(root, { query }) {
    const f = $('#reg', root);
    const pw = $('#pw', f);
    pw.oninput = () => {
      const v = pw.value; const s = (v.length >= 8) + /\d/.test(v) + /[A-Z]/.test(v) + /[^A-Za-z0-9]/.test(v);
      const bar = $('#pwBar', f); bar.style.width = (s / 4 * 100) + '%'; bar.style.background = ['var(--err)', 'var(--err)', 'var(--warn)', '#b9c6ff', 'var(--ok)'][s];
      $('#pwHint', f).textContent = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][s] + ' password';
    };
    f.onsubmit = async e => {
      e.preventDefault();
      const n = $('#name', f), em = $('#email', f);
      const errs = [[n, n.value.trim().length >= 2 ? '' : 'Enter your name.'], [em, emailOk(em.value) ? '' : 'Enter a valid email.'], [pw, pw.value.length >= 8 && /\d/.test(pw.value) ? '' : 'Use 8+ characters including a number.']];
      errs.forEach(([el, m]) => fieldError(el, m));
      if (errs.some(x => x[1])) return shake(f);
      if (!$('#agree', f).checked) { $('#formErr', f).textContent = 'Please accept the terms to continue.'; return shake(f); }
      const r = await store.register({ name: n.value, email: em.value, password: pw.value });
      if (!r.ok) { $('#formErr', f).textContent = r.msg; return shake(f); }
      toast('Account created. Welcome to ASTRA.');
      go(nextOf(query));
    };
  },
};

function acctShell(active, inner) {
  const u = store.currentUser();
  const nav = [['#/account', 'home', 'Overview'], ['#/account/orders', 'box', 'Orders'], ['#/track', 'truck', 'Track an order'], ['#/account/settings', 'settings', 'Settings'], ['#/trade-in', 'refresh', 'Trade in'], ['#/support', 'chat', 'Support']];
  return `<div class="container">
    <header class="page-head" style="padding-bottom:32px">${crumbs([['Home', '#/'], ['Account', '#/account']])}
      <div class="row" style="gap:18px"><span class="avatar">${esc(u.name[0] || 'A')}</span><div><h1 class="h2">Hi, ${esc(u.name.split(' ')[0])}</h1><p class="muted">${esc(u.email)} · Member since ${new Date(u.created).getFullYear()}</p></div></div>
    </header>
    <div class="acct-grid">
      <nav class="acct-nav" aria-label="Account">${nav.map(([h, i, l]) => `<a href="${h}" class="${active === h ? 'on' : ''}">${icon(i)} ${l}</a>`).join('')}<button id="logout">${icon('logout')} Sign out</button></nav>
      <div>${inner}</div>
    </div></div>`;
}
function wireLogout(root) { $('#logout', root).onclick = () => { store.logout(); toast('You\'ve been signed out.'); go('#/'); }; }

function orderCard(o) {
  const s = store.orderStatus(o);
  return `<a href="#/account/orders/${o.num}" class="order-card card" data-reveal>
    <div class="row" style="justify-content:space-between"><div><b>${o.num}</b><div class="dim" style="font-size:13px">Placed ${store.fmtDate(o.placed)} · ${o.lines.reduce((n, l) => n + l.qty, 0)} item(s)</div></div><span class="chip ${s.idx === 4 ? 'chip-ok' : s.idx < 0 ? '' : 'chip-warn'}">${s.label}</span></div>
    <div class="row" style="justify-content:space-between"><div class="order-thumbs">${o.lines.slice(0, 4).map(l => `<img src="${l.img}" alt="">`).join('')}</div><b>${store.money2(o.totals.total)}</b></div>
    ${s.idx >= 0 ? `<div class="progress-bar"><i style="width:${(s.idx / 4) * 100}%"></i></div>` : ''}
  </a>`;
}

export const accountPage = {
  title: 'Account', auth: true,
  render() {
    const orders = store.myOrders();
    const spent = orders.filter(o => !o.cancelled).reduce((s, o) => s + o.totals.total, 0);
    const active = orders.filter(o => { const s = store.orderStatus(o); return s.idx >= 0 && s.idx < 4; });
    return acctShell('#/account', `<div class="stack" style="--stack:28px">
      <div class="stat-grid">
        <div class="card card-pad" data-reveal><span class="eyebrow">Orders</span><div class="big-num" style="font-size:48px;margin-top:8px">${orders.length}</div></div>
        <div class="card card-pad" data-reveal><span class="eyebrow">In progress</span><div class="big-num" style="font-size:48px;margin-top:8px">${active.length}</div></div>
        <div class="card card-pad" data-reveal><span class="eyebrow">Astra Rewards</span><div class="big-num" style="font-size:48px;margin-top:8px">${Math.round(spent).toLocaleString()}</div><span class="dim" style="font-size:13px">points</span></div>
      </div>
      <div><div class="row" style="justify-content:space-between;margin-bottom:16px"><h2 class="h3">Recent orders</h2><a href="#/account/orders" class="link">View all ${icon('arrow')}</a></div>
        <div class="stack" style="--stack:14px">${orders.slice(0, 2).map(orderCard).join('') || `<div class="empty card">${icon('box')}<p>No orders yet.</p><a href="#/phones" class="btn btn-ghost" style="margin-top:16px">Start shopping</a></div>`}</div></div>
      <div class="card card-pad row" style="justify-content:space-between" data-reveal><div><b>Upgrade to X1 Pro</b><p class="muted" style="font-size:14px">Members get an extra $100 trade-in bonus this month.</p></div><a href="#/trade-in" class="btn btn-primary btn-sm">Get estimate</a></div>
    </div>`);
  },
  mount(root) { wireLogout(root); },
};

export const ordersPage = {
  title: 'Orders', auth: true,
  render() {
    const orders = store.myOrders();
    return acctShell('#/account/orders', `<h2 class="h3" style="margin-bottom:18px">Order history</h2><div class="stack" style="--stack:14px">${orders.map(orderCard).join('') || `<div class="empty card">${icon('box')}<p>You haven't placed any orders yet.</p></div>`}</div>`);
  },
  mount(root) { wireLogout(root); },
};

export function timeline(o) {
  const s = store.orderStatus(o);
  if (s.idx < 0) return `<div class="card card-pad"><span class="chip">Cancelled</span><p class="muted" style="margin-top:10px">This order was cancelled on ${store.fmtDate(o.cancelled)}. Any simulated payment authorisation was released.</p></div>`;
  const times = [0, 1, 4 * 60, 20 * 60, null].map((m, i) => i < 4 ? o.placed + m * 60000 : s.eta);
  return `<div class="timeline">${ORDER_STAGES.map((st, i) => `<div class="tl-step ${i < s.idx || s.idx === 4 ? 'done' : i === s.idx ? 'current' : ''}"><span class="tl-dot">${icon(st.icon)}</span><div><b>${st.label}</b><span>${i <= s.idx ? new Date(Math.min(times[i], Date.now())).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : i === 4 ? 'Estimated ' + store.fmtDate(s.eta) : 'Pending'}</span></div></div>`).join('')}</div>`;
}

export const orderDetailPage = {
  title: ({ params }) => 'Order ' + params.num, auth: true,
  render(ctx) {
    const o = store.myOrders().find(o => o.num === ctx.params.num);
    if (!o) return notFound.render(ctx);
    const s = store.orderStatus(o);
    return acctShell('#/account/orders', `<div class="stack" style="--stack:20px">
      <a href="#/account/orders" class="link">${icon('arrowL')} All orders</a>
      <div class="row" style="justify-content:space-between"><div><h2 class="h2">${o.num}</h2><p class="muted">Placed ${store.fmtDate(o.placed)}</p></div><span class="chip ${s.idx === 4 ? 'chip-ok' : 'chip-warn'}">${s.label}</span></div>
      <div class="card card-pad">${timeline(o)}</div>
      <div class="card card-pad">${o.lines.map(l => lineItem(l, { editable: false })).join('')}<div style="margin-top:18px">${totalsHtml(o.totals)}</div></div>
      <div class="form-grid">
        <div class="card card-pad"><span class="eyebrow">Delivery address</span><p class="muted" style="margin-top:8px">${esc(o.name)}<br>${esc(o.address.line1)}<br>${esc(o.address.city)} ${esc(o.address.zip)}<br>${esc(o.address.country)}</p></div>
        <div class="card card-pad"><span class="eyebrow">Payment</span><p class="muted" style="margin-top:8px">${o.card.brand.toUpperCase()} •••• ${o.card.last4}</p></div>
      </div>
      <div class="row">${s.idx >= 0 && s.idx < 2 ? `<button class="btn btn-ghost" id="cancel">Cancel order</button>` : ''}<a class="btn btn-ghost" href="#/contact?order=${o.num}">Get help</a><button class="btn btn-ghost" id="reorder">${icon('refresh')} Buy again</button></div>
    </div>`);
  },
  mount(root, { params }) {
    if (!$('#logout', root)) return;
    wireLogout(root);
    const o = store.myOrders().find(o => o.num === params.num); if (!o) return;
    $('#cancel', root)?.addEventListener('click', () => { if (confirm('Cancel this order?')) { store.cancelOrder(o.num); toast('Order cancelled.'); go('#/account/orders/' + o.num); dispatchEvent(new HashChangeEvent('hashchange')); } });
    $('#reorder', root).onclick = () => { o.items.forEach(i => { const { qty, ...rest } = i; store.addToCart(rest, qty); }); toast('Items added to your bag.'); go('#/cart'); };
  },
};

export const settingsPage = {
  title: 'Settings', auth: true,
  render() {
    const u = store.currentUser(); const a = u.addresses?.[0] || {};
    return acctShell('#/account/settings', `<form id="settings" class="stack" style="--stack:28px" novalidate>
      <div class="card card-pad"><h2 class="h3" style="margin-bottom:18px">Profile</h2><div class="form-grid">
        <div class="field"><label for="name">Full name</label><input id="name" value="${esc(u.name)}"></div>
        <div class="field"><label>Email</label><input value="${esc(u.email)}" disabled></div>
      </div></div>
      <div class="card card-pad"><h2 class="h3" style="margin-bottom:18px">Default address</h2><div class="form-grid">
        <div class="field full"><label for="line1">Address</label><input id="line1" value="${esc(a.line1 || '')}"></div>
        <div class="field"><label for="city">City</label><input id="city" value="${esc(a.city || '')}"></div>
        <div class="field"><label for="zip">Postcode</label><input id="zip" value="${esc(a.zip || '')}"></div>
        <div class="field full"><label for="country">Country</label><input id="country" value="${esc(a.country || '')}"></div>
      </div></div>
      <div class="card card-pad"><h2 class="h3" style="margin-bottom:12px">Preferences</h2>
        <label class="check"><input type="checkbox" checked> Launch news and offers by email</label>
        <label class="check"><input type="checkbox" checked> Order updates by SMS</label>
        <label class="check"><input type="checkbox"> Personalised recommendations</label>
      </div>
      <div class="row"><button class="btn btn-primary">Save changes</button><button type="button" class="btn btn-ghost" id="clearData">Reset demo data</button></div>
    </form>`);
  },
  mount(root) {
    wireLogout(root);
    $('#settings', root).onsubmit = e => {
      e.preventDefault();
      store.updateProfile({ name: $('#name', root).value.trim() || store.currentUser().name, addresses: [{ line1: $('#line1', root).value, city: $('#city', root).value, zip: $('#zip', root).value, country: $('#country', root).value }] });
      toast('Your changes have been saved.');
    };
    $('#clearData', root).onclick = () => { if (confirm('Clear all locally stored demo data (cart, accounts, orders)?')) { try { localStorage.removeItem('astra.v1'); } catch { } location.hash = '#/'; location.reload(); } };
  },
};
