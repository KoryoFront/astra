import { icon } from '../icons.js';
import { FAQS, PHONES, STORES } from '../data.js';
import { crumbs, esc, $, $$, fieldError, emailOk, shake, toast, go } from '../ui.js';
import * as store from '../store.js';

const L = 'assets/img/lifestyle/';

function faqList(items) {
  return items.map((f, i) => `<div class="faq-item" data-reveal><button class="faq-q" aria-expanded="false" aria-controls="fa${i}">${esc(f.q)}<i aria-hidden="true"></i></button><div class="faq-a" id="fa${i}" role="region"><div><p>${esc(f.a)}</p></div></div></div>`).join('');
}
function wireFaq(root) {
  root.addEventListener('click', e => {
    const q = e.target.closest('.faq-q'); if (!q) return;
    const it = q.parentElement, open = !it.classList.contains('open');
    it.classList.toggle('open', open); q.setAttribute('aria-expanded', open);
  });
}

export const supportPage = {
  title: 'Support',
  render() {
    return `<section style="position:relative;min-height:62vh;display:flex;align-items:flex-end;overflow:hidden">
      <img src="${L}support.jpg" alt="ASTRA support specialist helping a customer" data-parallax="-0.1" style="position:absolute;inset:-10% 0;width:100%;height:120%;object-fit:cover;object-position:35% 50%" class="fit-portrait">
      <div style="position:absolute;inset:0;background:linear-gradient(0deg,var(--bg) 5%,rgba(5,5,7,.55) 60%,rgba(5,5,7,.3))"></div>
      <div class="container" style="position:relative;padding-bottom:56px">
        ${crumbs([['Home', '#/'], ['Support', '#/support']])}
        <h1 class="display-2" data-split>How can we help?</h1>
        <form id="helpSearch" class="glass row" style="margin-top:28px;max-width:640px;border-radius:999px;padding:6px 6px 6px 20px;flex-wrap:nowrap" data-reveal>
          ${icon('search').replace('<svg', '<svg style="width:20px;height:20px;color:var(--text-3);flex-shrink:0"')}
          <input id="hq" placeholder="Search help topics, e.g. battery, returns" aria-label="Search help" style="flex:1;background:none;border:0;outline:0;height:44px;min-width:0">
          <button class="btn btn-primary btn-sm">Search</button>
        </form>
      </div>
    </section>
    <div class="container">
      <section class="section-sm">
        <div class="help-grid" data-stagger=".06">
          ${[['truck', 'Track an order', 'Real-time status of your delivery', '#/track'], ['box', 'Order history', 'Invoices, returns and cancellations', '#/account/orders'], ['shield', 'Warranty & Astra Care+', 'Coverage, claims and repairs', '#/warranty'], ['refresh', 'Trade in', 'Get credit for your old phone', '#/trade-in'], ['wrench', 'Book a repair', 'Mail-in or in-store service', '#/contact?topic=repair'], ['doc', 'FAQs', 'Answers to common questions', '#/faq'], ['chat', 'Contact us', 'Chat, call or email our team', '#/contact'], ['pin', 'Find a store', 'Visit an ASTRA flagship', '#/about#stores']].map(([i, b, s, h]) => `<a class="help-card card" href="${h}" data-reveal data-tilt="5">${icon(i)}<b>${b}</b><span>${s}</span></a>`).join('')}
        </div>
      </section>
      <section class="section-sm">
        <h2 class="h2" style="margin-bottom:12px">Product support</h2>
        <p class="muted" style="margin-bottom:28px">Guides, specs and software updates for your device.</p>
        <div class="grid-cards" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">${PHONES.map(p => `<a href="#/phone/${p.id}#specs" class="card" style="padding:16px;border-radius:var(--radius);text-align:center" data-reveal><img src="${p.colors[0].img}" alt="" style="height:180px;width:100%;object-fit:contain;background:#000;border-radius:12px" loading="lazy"><b style="display:block;margin-top:12px;font-weight:500">${p.name}</b><span class="dim" style="font-size:13px">AstraOS 6.0.2 · Up to date</span></a>`).join('')}</div>
      </section>
      <section class="section-sm narrow" style="margin:0 auto"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h2 class="h2">Popular questions</h2><a class="link" href="#/faq">All FAQs ${icon('arrow')}</a></div><div id="faqs">${faqList(FAQS.slice(0, 5))}</div></section>
    </div>`;
  },
  mount(root) {
    wireFaq($('#faqs', root));
    $('#helpSearch', root).onsubmit = e => { e.preventDefault(); go('#/faq?q=' + encodeURIComponent($('#hq', root).value)); };
  },
};

export const faqPage = {
  title: 'FAQs',
  render({ query }) {
    const cats = ['All', ...new Set(FAQS.map(f => f.cat))];
    return `<div class="container narrow">
      <header class="page-head">${crumbs([['Home', '#/'], ['Support', '#/support'], ['FAQs', '#/faq']])}<h1 class="display-2" data-split>Frequently asked questions</h1></header>
      <div class="row" style="margin-bottom:24px;justify-content:space-between"><div class="tabs" id="cats">${cats.map((c, i) => `<button data-cat="${c}" class="${i ? '' : 'on'}">${c}</button>`).join('')}</div>
        <input class="input" id="fq" placeholder="Filter questions…" value="${esc(query.q || '')}" style="max-width:260px;height:42px;border-radius:999px" aria-label="Filter questions"></div>
      <div id="faqs"></div>
      <div class="card card-pad row" style="margin:48px 0 80px;justify-content:space-between"><div><b>Still need help?</b><p class="muted" style="font-size:14px">Our specialists are available 24/7.</p></div><a class="btn btn-primary" href="#/contact">Contact us</a></div>
    </div>`;
  },
  mount(root) {
    let cat = 'All';
    const draw = () => {
      const q = $('#fq', root).value.trim().toLowerCase();
      const list = FAQS.filter(f => (cat === 'All' || f.cat === cat) && (!q || (f.q + f.a).toLowerCase().includes(q)));
      $('#faqs', root).innerHTML = list.length ? faqList(list) : `<p class="muted">No matching questions. <a class="link" href="#/contact">Ask our team</a>.</p>`;
      $$('[data-reveal]', $('#faqs', root)).forEach(el => el.classList.add('in'));
      if (q && list.length) $('.faq-item', root).classList.add('open');
    };
    $('#cats', root).onclick = e => { const b = e.target.closest('[data-cat]'); if (!b) return; cat = b.dataset.cat; $$('#cats button', root).forEach(x => x.classList.toggle('on', x === b)); draw(); };
    $('#fq', root).oninput = draw;
    wireFaq($('#faqs', root));
    draw();
  },
};

export const warrantyPage = {
  title: 'Warranty & Astra Care+',
  render() {
    return `<div class="container">
      <header class="page-head">${crumbs([['Home', '#/'], ['Support', '#/support'], ['Warranty', '#/warranty']])}
        <p class="eyebrow">Astra Care</p><h1 class="display-2" style="margin-top:12px" data-split>Covered.<br><span class="muted">Whatever happens.</span></h1></header>
      <div class="grid-cards" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
        <div class="card card-pad stack" data-reveal><span class="chip">Included</span><h2 class="h3">Standard warranty</h2><div class="big-num" style="font-size:56px">2 yrs</div>
          <ul class="stack muted" style="--stack:8px;padding-left:18px;margin:0"><li>Manufacturing defects</li><li>Battery below 80% health</li><li>Free mail-in repair</li><li>Phone & chat support</li></ul></div>
        <div class="card card-pad stack" data-reveal style="border-color:rgba(255,255,255,.3)"><span class="chip chip-new">Recommended</span><h2 class="h3">Astra Care+</h2><div class="big-num" style="font-size:56px">3 yrs</div>
          <ul class="stack muted" style="--stack:8px;padding-left:18px;margin:0"><li>Everything in standard warranty</li><li>2 accidental damage repairs per year</li><li>Screen repair: $29 · Other damage: $99</li><li>Express replacement next business day</li><li>Priority 24/7 specialist support</li></ul>
          <p>X Series $199 · S Series $129 · A Series $79</p><a href="#/phones" class="btn btn-primary">Add with a new phone</a></div>
      </div>
      <section class="section-sm">
        <h2 class="h2" style="margin-bottom:24px">Check your coverage</h2>
        <form class="card card-pad form-grid" id="cov" novalidate>
          <div class="field"><label for="imei">Serial number or IMEI</label><input id="imei" placeholder="15-digit IMEI" inputmode="numeric" maxlength="15"></div>
          <div class="field"><label for="model">Model</label><select id="model">${PHONES.map(p => `<option>${p.name}</option>`).join('')}</select></div>
          <div class="full row" style="justify-content:space-between"><span class="dim" style="font-size:13px">Dial *#06# on your phone to see its IMEI.</span><button class="btn btn-primary">Check coverage</button></div>
        </form>
        <div id="covRes" style="margin-top:20px"></div>
      </section>
      <section class="section-sm narrow" style="margin:0 auto 60px"><h2 class="h2" style="margin-bottom:12px">Warranty FAQs</h2><div id="faqs">${faqList(FAQS.filter(f => f.cat === 'Warranty' || f.cat === 'Returns'))}</div></section>
    </div>`;
  },
  mount(root) {
    wireFaq($('#faqs', root));
    $('#cov', root).onsubmit = e => {
      e.preventDefault(); const i = $('#imei', root);
      fieldError(i, /^\d{15}$/.test(i.value) ? '' : 'Enter a 15-digit IMEI.');
      if (!/^\d{15}$/.test(i.value)) return shake(i.closest('.field'));
      const seed = [...i.value].reduce((s, d) => s + +d, 0);
      const care = seed % 2 === 0, months = 6 + seed % 18;
      const until = new Date(); until.setMonth(until.getMonth() + months);
      $('#covRes', root).innerHTML = `<div class="card card-pad row co-panel" style="gap:18px">${icon('shield').replace('<svg', '<svg style="width:36px;height:36px;color:var(--ok)"')}<div><b>${esc($('#model', root).value)} — ${care ? 'Astra Care+' : 'Standard warranty'} active</b><p class="muted" style="font-size:14px">Covered until ${store.fmtDate(until)}. ${care ? 'Accidental damage repairs remaining this year: 2.' : '<a class="link" href="#/contact?topic=care">Add Astra Care+</a> within 60 days of purchase.'}</p></div></div>`;
    };
  },
};

export const contactPage = {
  title: 'Contact us',
  render({ query }) {
    const u = store.currentUser();
    const topics = { order: 'An existing order', repair: 'Repair or technical issue', care: 'Astra Care+ / warranty', tradein: 'Trade-in', sales: 'Product advice', other: 'Something else' };
    const sel = query.order ? 'order' : query.topic || 'order';
    return `<div class="container">
      <header class="page-head">${crumbs([['Home', '#/'], ['Support', '#/support'], ['Contact', '#/contact']])}<h1 class="display-2" data-split>Get in touch</h1><p class="lead" style="margin-top:12px" data-reveal>Our specialists are here 24/7. Average reply time: under 2 hours.</p></header>
      <div class="ti-grid" style="margin-bottom:80px">
        <form class="card card-pad stack" style="--stack:16px" id="contactF" novalidate data-reveal>
          <div class="form-grid">
            <div class="field"><label for="cn">Name</label><input id="cn" value="${esc(u?.name || '')}"></div>
            <div class="field"><label for="ce">Email</label><input id="ce" type="email" value="${esc(u?.email || '')}"></div>
            <div class="field"><label for="ct">Topic</label><select id="ct">${Object.entries(topics).map(([k, v]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
            <div class="field"><label for="co">Order number (optional)</label><input id="co" value="${esc(query.order || '')}" placeholder="AST-…"></div>
            <div class="field full"><label for="cm">Message</label><textarea id="cm" placeholder="How can we help?"></textarea></div>
          </div>
          <button class="btn btn-primary btn-lg">Send message</button>
        </form>
        <div class="stack" style="--stack:16px">
          ${[['chat', 'Live chat', 'Average wait: under 1 minute', 'Start chat', 'chat'], ['phone', 'Call us', '1-800-ASTRA-00 · 24/7', 'Request callback', 'call'], ['mail', 'Email', 'support@astra.example', 'Use the form', 'mail']].map(([i, b, s, cta, a]) => `<div class="card card-pad row" style="justify-content:space-between" data-reveal><div class="row" style="gap:16px">${icon(i).replace('<svg', '<svg style="width:28px;height:28px"')}<div><b>${b}</b><div class="muted" style="font-size:14px">${s}</div></div></div><button class="btn btn-ghost btn-sm" data-act="${a}">${cta}</button></div>`).join('')}
          <div class="card card-pad" id="stores" data-reveal><b>ASTRA flagship stores</b><div class="stack" style="--stack:10px;margin-top:12px">${STORES.map(s => `<div class="row" style="justify-content:space-between;font-size:14px"><span>${icon('pin').replace('<svg', '<svg style="width:16px;height:16px;display:inline;vertical-align:-3px"')} <b style="font-weight:500">${s.city}</b> <span class="muted">${s.addr}</span></span><span class="dim">${s.hours}</span></div>`).join('')}</div></div>
        </div>
      </div>
    </div>`;
  },
  mount(root) {
    const f = $('#contactF', root);
    f.onsubmit = e => {
      e.preventDefault();
      const checks = [[$('#cn', f), v => v.trim() ? '' : 'Enter your name.'], [$('#ce', f), v => emailOk(v) ? '' : 'Enter a valid email.'], [$('#cm', f), v => v.trim().length >= 10 ? '' : 'Tell us a little more (10+ characters).']];
      checks.forEach(([el, r]) => fieldError(el, r(el.value)));
      if (checks.some(([el, r]) => r(el.value))) return shake(f);
      const ticket = 'CS-' + Math.floor(100000 + Math.random() * 899999);
      f.innerHTML = `<div class="center co-panel" style="padding:40px 0">${icon('check').replace('<svg', '<svg style="width:48px;height:48px;color:var(--ok);margin:0 auto 16px"')}<h2 class="h3">Message received</h2><p class="muted" style="margin-top:8px">Your case number is <b style="color:#fff">${ticket}</b>. We'll reply to your email within 2 hours.</p></div>`;
    };
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      ({ chat: () => toast('Connecting you to a specialist…'), call: () => toast('Callback requested. We\'ll call you within 15 minutes.'), mail: () => $('#cm', root)?.focus() })[b.dataset.act]();
    });
  },
};
