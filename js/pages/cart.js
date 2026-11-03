import { icon } from '../icons.js';
import { ACCESSORIES } from '../data.js';
import { crumbs, lineItem, wireLineItems, totalsHtml, accessoryCard, wireCards, $, toast } from '../ui.js';
import * as store from '../store.js';
import { initReveal } from '../fx.js';

export const cartPage = {
  title: 'Your bag',
  render() {
    return `<div class="container">
      <header class="page-head">${crumbs([['Home', '#/'], ['Bag', '#/cart']])}<h1 class="display-2" data-split>Your bag</h1></header>
      <div class="co-grid" id="cartWrap"></div>
      <section class="section-sm"><h2 class="h2" style="margin-bottom:28px">Complete your setup</h2><div class="grid-cards" id="upsell">${ACCESSORIES.slice(0, 4).map(accessoryCard).join('')}</div></section>
    </div>`;
  },
  mount(root) {
    const wrap = $('#cartWrap', root);
    const draw = () => {
      const t = store.totals();
      if (!t.lines.length) {
        wrap.style.display = 'block';
        wrap.innerHTML = `<div class="empty card">${icon('bag')}<h2 class="h3">Your bag is empty</h2><p class="muted" style="margin-top:8px">Explore the lineup and find your next ASTRA.</p><div class="row" style="justify-content:center;margin-top:24px"><a href="#/phones" class="btn btn-primary">Shop phones</a><a href="#/accessories" class="btn btn-ghost">Shop accessories</a></div></div>`;
        return;
      }
      wrap.style.display = '';
      const ti = store.getState().tradeIn;
      wrap.innerHTML = `<div><div class="card card-pad" id="lines">${t.lines.map(l => lineItem(l)).join('')}</div>
        ${ti ? `<div class="card card-pad row" style="margin-top:16px;justify-content:space-between">${icon('refresh')}<span style="flex:1">Trade-in: <b>${ti.device}</b> (${ti.condition}) — estimated credit ${store.money(ti.value)}${t.lines.some(l => l.kind === 'phone') ? '' : ' <span class="dim">(applies when you buy a phone)</span>'}</span><button class="remove-btn" id="rmTI">Remove</button></div>` : `<a href="#/trade-in" class="card card-pad row" style="margin-top:16px">${icon('refresh')}<span style="flex:1">Have an old phone? <b>Trade it in</b> for instant credit.</span>${icon('chevR')}</a>`}
      </div>
      <aside class="co-summary card card-pad">
        <h2 class="h3" style="margin-bottom:20px">Summary</h2>
        <form class="row" id="promoForm" style="flex-wrap:nowrap;margin-bottom:8px">
          <input class="input" id="promo" placeholder="Promo code" aria-label="Promo code" style="height:44px" value="${t.promo || ''}" ${t.promo ? 'disabled' : ''}>
          ${t.promo ? `<button type="button" class="btn btn-ghost btn-sm" id="rmPromo">Remove</button>` : `<button class="btn btn-dark btn-sm">Apply</button>`}
        </form>
        <p class="dim" style="font-size:12px;margin-bottom:20px">Try <b>ASTRA10</b>, <b>WELCOME50</b> or <b>FREESHIP</b>.</p>
        ${totalsHtml(t)}
        <a href="#/checkout" class="btn btn-primary btn-block btn-lg" style="margin-top:22px">Checkout ${icon('lock')}</a>
        <p class="dim center" style="font-size:12px;margin-top:12px">${icon('info', '').replace('<svg', '<svg style="width:14px;height:14px;display:inline;vertical-align:-2px"')} Simulated checkout — no real payment taken.</p>
      </aside>`;
      wireLineItems($('#lines', wrap));
      $('#promoForm', wrap).onsubmit = e => {
        e.preventDefault(); const r = store.applyPromo($('#promo', wrap).value);
        toast(r.msg, { error: !r.ok });
      };
      $('#rmPromo', wrap)?.addEventListener('click', () => store.removePromo());
      $('#rmTI', wrap)?.addEventListener('click', () => store.setTradeIn(null));
      initReveal(wrap);
    };
    wireCards($('#upsell', root));
    const unsub = store.subscribe(draw);
    draw();
    return unsub;
  },
};
