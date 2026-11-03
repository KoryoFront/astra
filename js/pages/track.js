import { icon } from '../icons.js';
import { crumbs, esc, $, fieldError, emailOk, shake, lineItem } from '../ui.js';
import * as store from '../store.js';
import { timeline } from './account.js';

function mapSvg(idx) {
  // Stylised route map; the courier dot advances with order status
  const pts = [[60, 190], [180, 120], [330, 150], [470, 70], [620, 100]];
  const d = 'M' + pts.map(p => p.join(',')).join(' L');
  const [cx, cy] = pts[Math.max(0, Math.min(4, idx))];
  return `<svg viewBox="0 0 680 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="rgba(255,255,255,.04)"/></pattern></defs>
    <rect width="680" height="240" fill="url(#grid)"/>
    <path d="M0 40 Q200 80 340 20 T680 60" stroke="rgba(255,255,255,.05)" stroke-width="18" fill="none"/>
    <path d="M0 210 Q260 170 400 220 T680 180" stroke="rgba(255,255,255,.05)" stroke-width="12" fill="none"/>
    <path d="${d}" stroke="rgba(255,255,255,.18)" stroke-width="2" stroke-dasharray="6 6" fill="none"/>
    <path d="M${pts.slice(0, idx + 1).map(p => p.join(',')).join(' L')}" stroke="#b9c6ff" stroke-width="2.5" fill="none"/>
    ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${i <= idx ? '#b9c6ff' : '#2a2c33'}"/>`).join('')}
    <circle cx="${cx}" cy="${cy}" r="14" fill="rgba(185,198,255,.25)"><animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/></circle>
    <circle cx="${cx}" cy="${cy}" r="7" fill="#fff"/>
    <text x="60" y="222" fill="#7d818c" font-size="12" font-family="Inter">ASTRA Fulfilment</text><text x="560" y="130" fill="#7d818c" font-size="12" font-family="Inter">Your address</text>
  </svg>`;
}

export default {
  title: 'Track your order',
  render({ query }) {
    return `<div class="container narrow">
      <header class="page-head">${crumbs([['Home', '#/'], ['Support', '#/support'], ['Track order', '#/track']])}
        <h1 class="display-2" data-split>Track your order</h1>
        <p class="lead" style="margin-top:12px" data-reveal>Enter your order number and the email you used at checkout.</p></header>
      <form class="card card-pad form-grid" id="trackF" novalidate data-reveal>
        <div class="field"><label for="onum">Order number</label><input id="onum" placeholder="AST-2611-12345" value="${esc(query.order || '')}"></div>
        <div class="field"><label for="oemail">Email</label><input id="oemail" type="email" value="${esc(query.email || store.currentUser()?.email || '')}"></div>
        <div class="full row" style="justify-content:space-between"><span class="dim" style="font-size:13px">Try the demo order <button type="button" class="link" id="demoOrder" style="font-size:13px">AST-2610-48213</button></span><button class="btn btn-primary">Track ${icon('arrow', 'arrow')}</button></div>
      </form>
      <div id="result" style="margin:32px 0 80px"></div>
    </div>`;
  },
  mount(root, { query }) {
    const f = $('#trackF', root), res = $('#result', root);
    const run = () => {
      const n = $('#onum', f), e = $('#oemail', f);
      fieldError(n, /^AST-\d{4}-\d{5}$/i.test(n.value.trim()) ? '' : 'Order numbers look like AST-2611-12345.');
      fieldError(e, emailOk(e.value) ? '' : 'Enter a valid email.');
      if (f.querySelector('.invalid')) return shake(f);
      const o = store.findOrder(n.value, e.value);
      if (!o) { res.innerHTML = `<div class="card card-pad center co-panel">${icon('search').replace('<svg', '<svg style="width:36px;height:36px;margin:0 auto 12px"')}<h2 class="h3">We couldn't find that order</h2><p class="muted" style="margin-top:8px">Check the order number and email match your confirmation. Orders placed in this demo are stored on this device only.</p></div>`; return; }
      const s = store.orderStatus(o);
      res.innerHTML = `<div class="stack co-panel" style="--stack:20px">
        <div class="card card-pad"><div class="row" style="justify-content:space-between"><div><span class="eyebrow">Order ${o.num}</span><h2 class="h2" style="margin-top:8px">${s.label}</h2><p class="muted" style="margin-top:4px">${s.idx === 4 ? 'Delivered' : 'Estimated delivery'} ${store.fmtDate(s.eta)} · Carrier: ASTRA Express · Tracking ${o.num.replace('AST', 'AX')}${o.placed % 97}</p></div></div>
          <div class="map" style="margin-top:20px">${mapSvg(s.idx)}</div></div>
        <div class="card card-pad">${timeline(o)}</div>
        <div class="card card-pad">${o.lines.map(l => lineItem(l, { editable: false })).join('')}</div>
      </div>`;
    };
    f.onsubmit = e => { e.preventDefault(); run(); };
    $('#demoOrder', f).onclick = () => { $('#onum', f).value = 'AST-2610-48213'; $('#oemail', f).value = 'demo@astra.com'; run(); };
    if (query.order && query.email) run();
  },
};
