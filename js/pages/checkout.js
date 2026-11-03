import { icon, LOGO_MARK } from '../icons.js';
import { SHIPPING } from '../data.js';
import { crumbs, lineItem, totalsHtml, esc, $, $$, fieldError, emailOk, shake, toast, go } from '../ui.js';
import * as store from '../store.js';
import { confetti } from '../fx.js';

/* ---------- Card utilities ----------
   Payments are simulated entirely in the browser: nothing is sent anywhere and only the
   brand + last four digits are kept with the order. Any valid card number is "approved".
   A few reserved numbers trigger other outcomes for demos (see README). */
const SCENARIOS = { '4000002760003184': '3ds', '4000000000000002': 'declined', '4000000000009995': 'insufficient' };
const brandOf = n => /^3[47]/.test(n) ? 'amex' : /^(5[1-5]|2[2-7])/.test(n) ? 'mastercard' : /^4/.test(n) ? 'visa' : /^6(011|5)/.test(n) ? 'discover' : '';
const BRAND_LABEL = { visa: 'VISA', mastercard: '<span style="display:inline-flex"><i style="width:22px;height:22px;border-radius:50%;background:#eb001b;display:block"></i><i style="width:22px;height:22px;border-radius:50%;background:#f79e1b;display:block;margin-left:-9px;mix-blend-mode:screen"></i></span>', amex: 'AMEX', discover: 'DISCOVER' };
const luhn = n => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return n.length >= 13 && s % 10 === 0; };
const fmtCard = (n, brand) => brand === 'amex' ? [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)].filter(Boolean).join(' ') : n.match(/.{1,4}/g)?.join(' ') || '';
const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Netherlands', 'Australia', 'Japan', 'Singapore', 'United Arab Emirates'];

// Checkout session (kept in memory only; card data never persisted)
let co = null;
const fresh = () => {
  const u = store.currentUser();
  const a = u?.addresses?.[0] || {};
  return { step: 1, ship: 'standard', contact: { email: u?.email || '', first: u?.name?.split(' ')[0] || '', last: u?.name?.split(' ').slice(1).join(' ') || '', phone: '', line1: a.line1 || '', line2: '', city: a.city || '', zip: a.zip || '', country: a.country || 'United States' }, card: { num: '', exp: '', cvv: '', name: '' } };
};

const STEP_NAMES = ['Details', 'Delivery', 'Payment', 'Review'];

export const checkoutPage = {
  title: 'Checkout',
  render() {
    if (!store.cartCount()) return `<div class="container section narrow center"><h1 class="h2">Your bag is empty</h1><p class="muted" style="margin-top:12px">Add something to your bag to check out.</p><a href="#/phones" class="btn btn-primary" style="margin-top:24px">Shop phones</a></div>`;
    if (!co) co = fresh();
    return `<div class="container">
      <header class="page-head" style="padding-bottom:24px">
        ${crumbs([['Bag', '#/cart'], ['Checkout', '#/checkout']])}
        <div class="row" style="justify-content:space-between"><h1 class="h2">Checkout</h1><span class="chip">${icon('lock')} Secure checkout</span></div>
      </header>
      <div class="co-grid">
        <div>
          <div class="steps" id="steps"></div>
          <div id="panel"></div>
        </div>
        <aside class="co-summary card card-pad" id="summary"></aside>
      </div>
    </div>
    <div class="processing" id="proc" role="dialog" aria-modal="true" aria-label="Processing payment"></div>`;
  },
  mount(root) {
    if (!store.cartCount()) return;
    const panel = $('#panel', root);
    const drawSteps = () => { $('#steps', root).innerHTML = STEP_NAMES.map((n, i) => `<button class="step ${i + 1 === co.step ? 'on' : i + 1 < co.step ? 'done' : ''}" data-step="${i + 1}" ${i + 1 < co.step ? '' : 'disabled'}><i>${i + 1 < co.step ? '✓' : i + 1}</i><span>${n}</span></button>`).join(''); };
    const drawSummary = () => {
      const t = store.totals(co.ship);
      $('#summary', root).innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:8px"><h2 class="h3">Order summary</h2><a href="#/cart" class="link" style="font-size:14px">Edit</a></div>
        <div>${t.lines.map(l => lineItem(l, { editable: false })).join('')}</div>
        <div style="margin-top:18px">${totalsHtml(t)}</div>`;
    };
    $('#steps', root).addEventListener('click', e => { const b = e.target.closest('[data-step]'); if (b && !b.disabled) { co.step = +b.dataset.step; draw(); } });

    const draw = () => {
      drawSteps(); drawSummary();
      const c = co.contact;
      if (co.step === 1) {
        const u = store.currentUser();
        panel.innerHTML = `<form class="co-panel stack" style="--stack:28px" id="f1" novalidate>
          ${u ? `<div class="card card-pad row" style="padding:16px 20px"><span class="avatar" style="width:40px;height:40px;font-size:16px">${esc(u.name[0])}</span><span>Signed in as <b>${esc(u.email)}</b></span></div>` : `<div class="card card-pad row" style="padding:16px 20px;justify-content:space-between"><span class="muted">Have an account? Faster checkout and order tracking.</span><a class="link" href="#/login?next=/checkout">Sign in ${icon('arrow')}</a></div>`}
          <div><h2 class="h3" style="margin-bottom:18px">Contact</h2>
            <div class="form-grid">
              <div class="field full"><label for="email">Email</label><input id="email" type="email" autocomplete="email" value="${esc(c.email)}" required></div>
              <div class="field"><label for="first">First name</label><input id="first" autocomplete="given-name" value="${esc(c.first)}" required></div>
              <div class="field"><label for="last">Last name</label><input id="last" autocomplete="family-name" value="${esc(c.last)}" required></div>
              <div class="field full"><label for="phone">Phone</label><input id="phone" type="tel" autocomplete="tel" placeholder="For delivery updates" value="${esc(c.phone)}" required></div>
            </div></div>
          <div><h2 class="h3" style="margin-bottom:18px">Delivery address</h2>
            <div class="form-grid">
              <div class="field full"><label for="line1">Address</label><input id="line1" autocomplete="address-line1" value="${esc(c.line1)}" required></div>
              <div class="field full"><label for="line2">Apartment, suite (optional)</label><input id="line2" autocomplete="address-line2" value="${esc(c.line2)}"></div>
              <div class="field"><label for="city">City</label><input id="city" autocomplete="address-level2" value="${esc(c.city)}" required></div>
              <div class="field"><label for="zip">Postcode / ZIP</label><input id="zip" autocomplete="postal-code" value="${esc(c.zip)}" required></div>
              <div class="field full"><label for="country">Country</label><select id="country" autocomplete="country-name">${COUNTRIES.map(x => `<option ${x === c.country ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
            </div></div>
          <button class="btn btn-primary btn-lg">Continue to delivery ${icon('arrow', 'arrow')}</button>
        </form>`;
        const f = $('#f1', panel);
        const rules = { email: v => emailOk(v) ? '' : 'Enter a valid email address.', first: v => v.trim() ? '' : 'Required.', last: v => v.trim() ? '' : 'Required.', phone: v => v.replace(/\D/g, '').length >= 7 ? '' : 'Enter a valid phone number.', line1: v => v.trim().length > 3 ? '' : 'Enter your street address.', city: v => v.trim() ? '' : 'Required.', zip: v => /^[A-Za-z0-9 -]{3,10}$/.test(v.trim()) ? '' : 'Enter a valid postcode.' };
        Object.keys(rules).forEach(k => $('#' + k, f).addEventListener('blur', e => fieldError(e.target, rules[k](e.target.value))));
        f.onsubmit = e => {
          e.preventDefault();
          let bad = null;
          Object.keys(rules).forEach(k => { const el = $('#' + k, f); const m = rules[k](el.value); fieldError(el, m); if (m && !bad) bad = el; });
          ['email', 'first', 'last', 'phone', 'line1', 'line2', 'city', 'zip', 'country'].forEach(k => c[k] = $('#' + k, f).value);
          if (bad) { bad.focus(); shake(bad.closest('.field')); return; }
          co.step = 2; draw(); scrollTo({ top: 0, behavior: 'smooth' });
        };
      }

      if (co.step === 2) {
        const eta = d => new Date(Date.now() + d * 864e5).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        const days = { standard: 5, express: 2, nextday: 1 };
        panel.innerHTML = `<form class="co-panel stack" style="--stack:16px" id="f2">
          <h2 class="h3" style="margin-bottom:6px">Delivery method</h2>
          <p class="muted" style="font-size:14px">Shipping to ${esc(c.first)} ${esc(c.last)}, ${esc(c.line1)}, ${esc(c.city)} ${esc(c.zip)}. <button type="button" class="link" data-back="1" style="font-size:14px">Change</button></p>
          ${SHIPPING.map(s => `<label class="ship-opt"><input type="radio" name="ship" value="${s.id}" ${co.ship === s.id ? 'checked' : ''}><div><b style="font-weight:500">${s.name}</b><div class="dim" style="font-size:13px">${s.eta} · arrives by ${eta(days[s.id])}</div></div><span class="spacer"></span><b>${s.price ? store.money2(s.price) : 'Free'}</b></label>`).join('')}
          <div class="row" style="margin-top:12px"><button type="button" class="btn btn-ghost btn-lg" data-back="1">${icon('arrowL')} Back</button><button class="btn btn-primary btn-lg" style="flex:1">Continue to payment ${icon('arrow', 'arrow')}</button></div>
        </form>`;
        $('#f2', panel).onchange = e => { co.ship = e.target.value; drawSummary(); };
        $('#f2', panel).onsubmit = e => { e.preventDefault(); co.step = 3; draw(); scrollTo({ top: 0, behavior: 'smooth' }); };
      }

      if (co.step === 3) {
        const k = co.card;
        panel.innerHTML = `<form class="co-panel" id="f3" novalidate autocomplete="off">
          <div class="cc-scene"><div class="cc" id="cc">
            <div class="cc-face cc-front">
              <div class="cc-top"><span class="cc-chip"></span><span class="cc-brand" id="ccBrand">${LOGO_MARK.replace('class="mark"', 'style="height:26px;width:auto"')}</span></div>
              <div class="cc-num" id="ccNum">•••• •••• •••• ••••</div>
              <div class="cc-bottom"><div><small>Card holder</small><span class="nm" id="ccName">YOUR NAME</span></div><div style="text-align:right"><small>Expires</small><span id="ccExp">MM/YY</span></div></div>
            </div>
            <div class="cc-face cc-back"><div class="cc-stripe"></div><div class="cc-sig"><span id="ccCvv">•••</span></div><p>Authorised signature. Not valid unless signed.</p></div>
          </div></div>
          <div class="form-grid">
            <div class="field full"><label for="cnum">Card number</label><input id="cnum" inputmode="numeric" autocomplete="off" placeholder="1234 5678 9012 3456" value="${esc(fmtCard(k.num, brandOf(k.num)))}" maxlength="19"><span class="adorn" id="brandTag"></span></div>
            <div class="field"><label for="cexp">Expiry (MM/YY)</label><input id="cexp" inputmode="numeric" placeholder="MM/YY" maxlength="5" value="${esc(k.exp)}"></div>
            <div class="field"><label for="ccvv">Security code (CVV)</label><input id="ccvv" inputmode="numeric" placeholder="123" maxlength="4" value="${esc(k.cvv)}"><span class="adorn">${icon('lock').replace('<svg', '<svg style="width:16px;height:16px;color:var(--text-3)"')}</span></div>
            <div class="field full"><label for="cname">Name on card</label><input id="cname" autocomplete="off" placeholder="As shown on card" value="${esc(k.name || (c.first + ' ' + c.last).trim())}"></div>
          </div>
          <label class="check" style="margin-top:20px"><input type="checkbox" id="billSame" checked> Billing address same as delivery</label>
          <div class="row" style="margin-top:14px;gap:10px;color:var(--text-3);font-size:13px">${['VISA', 'Mastercard', 'AMEX', 'Discover'].map(b => `<span class="chip" style="font-size:11px">${b}</span>`).join('')}</div>
          <div class="row" style="margin-top:24px"><button type="button" class="btn btn-ghost btn-lg" data-back="2">${icon('arrowL')} Back</button><button class="btn btn-primary btn-lg" style="flex:1">Review order ${icon('arrow', 'arrow')}</button></div>
        </form>`;
        const f = $('#f3', panel), cc = $('#cc', panel);
        const num = $('#cnum', f), exp = $('#cexp', f), cvv = $('#ccvv', f), nm = $('#cname', f);
        const paint = () => {
          const raw = num.value.replace(/\D/g, ''), b = brandOf(raw);
          cc.dataset.brand = b;
          $('#ccBrand', panel).innerHTML = b ? BRAND_LABEL[b] : LOGO_MARK.replace('class="mark"', 'style="height:26px;width:auto"');
          $('#brandTag', panel).innerHTML = b ? `<span class="chip" style="padding:2px 8px;font-size:11px">${b.toUpperCase()}</span>` : '';
          const mask = b === 'amex' ? '•••• •••••• •••••' : '•••• •••• •••• ••••';
          const f2 = fmtCard(raw, b); $('#ccNum', panel).textContent = f2 + mask.slice(f2.length);
          $('#ccName', panel).textContent = nm.value.trim().toUpperCase() || 'YOUR NAME';
          $('#ccExp', panel).textContent = exp.value || 'MM/YY';
          $('#ccCvv', panel).textContent = cvv.value ? '•'.repeat(cvv.value.length) : '•••';
          cvv.maxLength = b === 'amex' ? 4 : 3;
        };
        num.addEventListener('input', () => { const raw = num.value.replace(/\D/g, '').slice(0, 16); const b = brandOf(raw); num.value = fmtCard(b === 'amex' ? raw.slice(0, 15) : raw, b); paint(); });
        exp.addEventListener('input', e => { let v = exp.value.replace(/\D/g, '').slice(0, 4); if (v.length === 1 && +v > 1) v = '0' + v; exp.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : (v.length === 2 && e.inputType !== 'deleteContentBackward' ? v + '/' : v); paint(); });
        cvv.addEventListener('input', () => { cvv.value = cvv.value.replace(/\D/g, ''); paint(); });
        nm.addEventListener('input', paint);
        cvv.addEventListener('focus', () => cc.classList.add('flip'));
        cvv.addEventListener('blur', () => cc.classList.remove('flip'));
        const rules = {
          cnum: v => { const r = v.replace(/\D/g, ''); return !r ? 'Enter your card number.' : !luhn(r) ? 'This card number is invalid.' : ''; },
          cexp: v => { const m = v.match(/^(\d{2})\/(\d{2})$/); if (!m) return 'Use MM/YY format.'; const mm = +m[1], yy = 2000 + +m[2]; if (mm < 1 || mm > 12) return 'Invalid month.'; const now = new Date(); if (yy < now.getFullYear() || (yy === now.getFullYear() && mm < now.getMonth() + 1)) return 'This card has expired.'; if (yy > now.getFullYear() + 20) return 'Invalid year.'; return ''; },
          ccvv: v => { const need = brandOf(num.value.replace(/\D/g, '')) === 'amex' ? 4 : 3; return v.length === need ? '' : `Enter the ${need}-digit security code.`; },
          cname: v => v.trim().length >= 2 ? '' : 'Enter the cardholder name.',
        };
        Object.keys(rules).forEach(k => $('#' + k, f).addEventListener('blur', e => e.target.value && fieldError(e.target, rules[k](e.target.value))));
        f.onsubmit = e => {
          e.preventDefault(); let bad = null;
          Object.keys(rules).forEach(k => { const el = $('#' + k, f); const m = rules[k](el.value); fieldError(el, m); if (m && !bad) bad = el; });
          if (bad) { bad.focus(); shake(bad.closest('.field')); return; }
          Object.assign(co.card, { num: num.value.replace(/\D/g, ''), exp: exp.value, cvv: cvv.value, name: nm.value.trim() });
          co.step = 4; draw(); scrollTo({ top: 0, behavior: 'smooth' });
        };
        paint();
      }

      if (co.step === 4) {
        const t = store.totals(co.ship), s = SHIPPING.find(x => x.id === co.ship), b = brandOf(co.card.num);
        panel.innerHTML = `<div class="co-panel stack" style="--stack:16px">
          <h2 class="h3">Review your order</h2>
          <div class="card card-pad row" style="justify-content:space-between;align-items:flex-start"><div><span class="eyebrow">Contact & delivery</span><p style="margin-top:8px">${esc(c.first)} ${esc(c.last)}<br><span class="muted">${esc(c.line1)}${c.line2 ? ', ' + esc(c.line2) : ''}<br>${esc(c.city)} ${esc(c.zip)}, ${esc(c.country)}<br>${esc(c.email)} · ${esc(c.phone)}</span></p></div><button class="link" data-back="1">Edit</button></div>
          <div class="card card-pad row" style="justify-content:space-between;align-items:flex-start"><div><span class="eyebrow">Delivery</span><p style="margin-top:8px">${s.name} <span class="muted">· ${s.eta}</span></p></div><button class="link" data-back="2">Edit</button></div>
          <div class="card card-pad row" style="justify-content:space-between;align-items:flex-start"><div><span class="eyebrow">Payment</span><p style="margin-top:8px;display:flex;gap:10px;align-items:center">${icon('card').replace('<svg', '<svg style="width:20px;height:20px"')} ${b.toUpperCase()} ending ${co.card.num.slice(-4)}</p></div><button class="link" data-back="3">Edit</button></div>
          <label class="check"><input type="checkbox" id="terms"> I agree to the <a class="link" href="#/legal/terms" target="_blank">terms of sale</a>.</label>
          <button class="btn btn-primary btn-lg btn-block" id="placeBtn">${icon('lock')} Pay ${store.money2(t.total)}</button>
          <p class="dim center" style="font-size:12px">${icon('lock').replace('<svg', '<svg style="width:12px;height:12px;display:inline;vertical-align:-1px"')} Payments secured by Astra Pay</p>
        </div>`;
        $('#placeBtn', panel).onclick = () => {
          if (!$('#terms', panel).checked) { const l = $('#terms', panel).closest('.check'); shake(l); l.style.color = 'var(--err)'; toast('Please accept the terms to continue.', { error: true }); return; }
          pay();
        };
      }
      panel.querySelectorAll('[data-back]').forEach(b => b.onclick = () => { co.step = +b.dataset.back; draw(); });
    };

    /* ---------- Simulated payment processing ---------- */
    const proc = $('#proc', root);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const ring = (done, err) => `<div class="ring ${done ? 'done' : ''}"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,.1)" stroke-width="4" fill="none"/>${done ? `<circle cx="40" cy="40" r="34" stroke="${err ? 'var(--err)' : 'var(--ok)'}" stroke-width="4" fill="none"/>${err ? '<path d="M30 30l20 20M50 30 30 50" stroke="var(--err)" stroke-width="4" stroke-linecap="round"/>' : '<path d="m28 41 8 8 16-18" stroke="var(--ok)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'}` : '<circle cx="40" cy="40" r="34" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="60 200" stroke-linecap="round"/>'}</svg></div>`;
    const STEPS = ['Encrypting card details', 'Contacting issuing bank', 'Authorising payment', 'Confirming your order'];
    const showProc = (i, title = 'Processing payment', sub = 'Please don\'t close this window.') => {
      proc.innerHTML = `<div class="proc-box glass">${ring(false)}<h2 class="h3">${title}</h2><p class="muted" style="margin-top:6px;font-size:14px">${sub}</p><div class="proc-steps">${STEPS.map((s, j) => `<div class="${j < i ? 'ok' : j === i ? 'on' : ''}"><i>${j < i ? '✓' : ''}</i>${s}</div>`).join('')}</div></div>`;
      proc.classList.add('open');
    };
    const threeDS = () => new Promise(resolve => {
      proc.innerHTML = `<form class="proc-box glass" id="otp"><div class="row" style="justify-content:center;margin-bottom:12px">${icon('shield').replace('<svg', '<svg style="width:40px;height:40px"')}</div><h2 class="h3">Verify it's you</h2><p class="muted" style="font-size:14px;margin-top:8px">Your bank sent a one-time code to the phone ending ${esc(co.contact.phone.replace(/\D/g, '').slice(-2) || '00')}.</p>
        <div class="otp-inputs">${Array(6).fill('<input inputmode="numeric" maxlength="1" aria-label="Digit">').join('')}</div>
        <p class="err" id="otpErr" style="color:var(--err);font-size:13px;min-height:18px"></p>
        <button class="btn btn-primary btn-block">Verify</button><button type="button" class="btn btn-ghost btn-block" style="margin-top:8px" id="otpCancel">Cancel payment</button></form>`;
      const ins = $$('.otp-inputs input', proc);
      ins.forEach((inp, i) => {
        inp.oninput = () => { inp.value = inp.value.replace(/\D/g, ''); if (inp.value && ins[i + 1]) ins[i + 1].focus(); };
        inp.onkeydown = e => { if (e.key === 'Backspace' && !inp.value && ins[i - 1]) ins[i - 1].focus(); };
        inp.onpaste = e => { const d = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (d) { e.preventDefault(); d.split('').forEach((ch, j) => ins[j] && (ins[j].value = ch)); ins[Math.min(5, d.length)].focus(); } };
      });
      ins[0].focus();
      $('#otp', proc).onsubmit = e => { e.preventDefault(); const code = ins.map(i => i.value).join(''); if (code === '123456') resolve(true); else { $('#otpErr', proc).textContent = 'Incorrect code. Please try again.'; shake($('.otp-inputs', proc)); } };
      $('#otpCancel', proc).onclick = () => resolve(false);
    });
    const fail = async msg => {
      proc.innerHTML = `<div class="proc-box glass">${ring(true, true)}<h2 class="h3">Payment declined</h2><p class="muted" style="margin-top:8px">${msg}</p><button class="btn btn-primary btn-block" style="margin-top:22px" id="retry">Try another card</button></div>`;
      $('#retry', proc).onclick = () => { proc.classList.remove('open'); co.step = 3; draw(); };
    };

    let paying = false;
    const pay = async () => {
      if (paying) return; paying = true;
      const test = { outcome: SCENARIOS[co.card.num] || 'approve' };
      try {
        showProc(0); await sleep(900);
        showProc(1); await sleep(1100);
        if (test.outcome === '3ds') {
          const ok = await threeDS();
          if (!ok) { await fail('Authentication was cancelled.'); return; }
          showProc(2, 'Authenticated', 'Finalising payment…');
        } else showProc(2);
        await sleep(1000);
        if (test.outcome === 'declined') { await fail('Your card was declined by the issuing bank. Please use a different card.'); return; }
        if (test.outcome === 'insufficient') { await fail('Insufficient funds. Please use a different card.'); return; }
        showProc(3); await sleep(800);
        const t = store.totals(co.ship), u = store.currentUser();
        const order = store.placeOrder({
          num: store.genOrderNumber(), placed: Date.now(), user: u?.email || null, email: co.contact.email.trim().toLowerCase(),
          name: `${co.contact.first} ${co.contact.last}`.trim(), phone: co.contact.phone,
          items: store.getState().cart.map(i => ({ ...i })), lines: t.lines, ship: co.ship,
          address: { line1: co.contact.line1, line2: co.contact.line2, city: co.contact.city, zip: co.contact.zip, country: co.contact.country },
          totals: { subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, tradeIn: t.tradeIn, tax: t.tax, total: t.total, promo: t.promo },
          card: { brand: brandOf(co.card.num), last4: co.card.num.slice(-4) }, simulated: true,
          authCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
        });
        proc.innerHTML = `<div class="proc-box glass">${ring(true)}<h2 class="h3">Payment approved</h2><p class="muted" style="margin-top:6px">Authorisation ${order.authCode}</p></div>`;
        await sleep(900);
        store.clearCart(); co = null;
        proc.classList.remove('open');
        go('#/order/' + order.num);
      } finally { paying = false; }
    };

    draw();
    return () => proc.classList.remove('open');
  },
};

export const confirmationPage = {
  title: 'Order confirmed',
  render({ params }) {
    const o = store.findOrder(params.num);
    if (!o) return `<div class="container section center narrow"><h1 class="h2">Order not found</h1><p class="muted" style="margin-top:12px">We couldn't find order ${esc(params.num)} on this device.</p><a class="btn btn-primary" href="#/track" style="margin-top:24px">Track an order</a></div>`;
    const st = store.orderStatus(o);
    return `<div class="container narrow section center">
      <svg class="success-mark" viewBox="0 0 96 96" fill="none"><circle cx="48" cy="48" r="44" stroke="var(--ok)" stroke-width="3"/><path d="m30 49 12 12 24-26" stroke="var(--ok)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <p class="eyebrow" data-reveal>Order confirmed</p>
      <h1 class="display-2" style="margin-top:12px" data-split>Thank you, ${esc(o.name.split(' ')[0] || 'friend')}.</h1>
      <p class="lead" style="margin-top:16px" data-reveal>Your order <b style="color:#fff">${o.num}</b> has been placed. A confirmation is on its way to ${esc(o.email)}.</p>
      <div class="row" style="justify-content:center;margin-top:28px;gap:12px" data-reveal>
        <a href="#/track?order=${o.num}&email=${encodeURIComponent(o.email)}" class="btn btn-primary">${icon('truck')} Track order</a>
        <a href="#/phones" class="btn btn-ghost">Continue shopping</a>
      </div>
      <div class="card card-pad" style="text-align:left;margin-top:48px" data-reveal>
        <div class="row" style="justify-content:space-between;margin-bottom:6px"><b>Order ${o.num}</b><span class="chip chip-ok">${st.label}</span></div>
        <p class="dim" style="font-size:14px">Placed ${store.fmtDate(o.placed)} · Estimated delivery ${store.fmtDate(st.eta)} · Paid with ${o.card.brand.toUpperCase()} •••• ${o.card.last4}</p>
        <div style="margin-top:12px">${o.lines.map(l => lineItem(l, { editable: false })).join('')}</div>
        <div style="margin-top:18px">${totalsHtml(o.totals)}</div>
      </div>
      ${!store.currentUser() ? `<div class="card card-pad row" style="margin-top:20px;justify-content:space-between;text-align:left" data-reveal><span>Create an account to keep track of this order and future purchases.</span><a class="btn btn-ghost btn-sm" href="#/register?email=${encodeURIComponent(o.email)}">Create account</a></div>` : ''}
    </div>`;
  },
  mount(root, { params }) {
    const o = store.findOrder(params.num);
    if (o && Date.now() - o.placed < 15000) setTimeout(confetti, 400);
  },
};
