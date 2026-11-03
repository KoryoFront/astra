import { icon } from '../icons.js';
import { TRADE_IN } from '../data.js';
import { crumbs, $, $$, toast, go } from '../ui.js';
import * as store from '../store.js';

export default {
  title: 'Trade in & upgrade',
  render() {
    return `<div class="container">
      <header class="page-head">${crumbs([['Home', '#/'], ['Trade in', '#/trade-in']])}
        <p class="eyebrow">Trade in & upgrade</p>
        <h1 class="display-2" style="margin-top:12px" data-split>Your old phone<br><span class="muted">is worth more than you think.</span></h1>
      </header>
      <div class="ti-steps" data-stagger=".08">
        ${[['Get an estimate', 'Answer three quick questions about your device.'], ['Choose your ASTRA', 'Your credit is applied instantly at checkout.'], ['Ship it free', 'We send a prepaid, padded trade-in kit.'], ['Get paid', 'Credit is confirmed after a quick inspection.']].map(([b, s], i) => `<div class="ti-step card" data-reveal><div class="n">0${i + 1}</div><b style="display:block;margin-top:10px;font-weight:500">${b}</b><p class="muted" style="font-size:14px;margin-top:6px">${s}</p></div>`).join('')}
      </div>
      <section class="section-sm ti-grid">
        <form class="card card-pad stack" style="--stack:22px" id="tiF">
          <h2 class="h3">Get your estimate</h2>
          <div class="field"><label for="brand">Brand</label><select id="brand">${Object.keys(TRADE_IN.brands).map(b => `<option>${b}</option>`).join('')}</select></div>
          <div class="field"><label for="device">Model</label><select id="device"></select></div>
          <div><div class="opt-label"><span>Condition</span></div><div class="cond-opts" id="cond">
            ${[['flawless', 'Flawless', 'Like new, no scratches'], ['good', 'Good', 'Light signs of use'], ['fair', 'Fair', 'Visible scratches or dents'], ['broken', 'Broken', 'Cracked or not working']].map(([k, b, s], i) => `<button type="button" class="opt ${i === 1 ? 'on' : ''}" data-cond="${k}"><b>${b}</b><span>${s}</span></button>`).join('')}
          </div></div>
          <label class="check"><input type="checkbox" id="power" checked> It powers on and the screen works</label>
          <label class="check"><input type="checkbox" id="upgrade" checked> I'm upgrading to an X Series phone (+${store.money(TRADE_IN.bonus)} bonus)</label>
        </form>
        <div class="card card-pad stack" style="--stack:18px;position:sticky;top:calc(var(--nav-h) + 20px)" data-reveal>
          <span class="eyebrow">Estimated trade-in value</span>
          <div class="estimate" id="est">$0</div>
          <p class="muted" id="estNote"></p>
          <div class="totals" id="estBreak"></div>
          <button class="btn btn-primary btn-lg btn-block" id="applyTI">Apply to my order ${icon('arrow', 'arrow')}</button>
          <p class="dim" style="font-size:12px">Final value confirmed after inspection. Demo estimates for illustration only.</p>
        </div>
      </section>
    </div>`;
  },
  mount(root) {
    let cond = 'good', last = 0, current = null;
    const brand = $('#brand', root), device = $('#device', root);
    const fillDevices = () => { device.innerHTML = TRADE_IN.brands[brand.value].map(d => `<option>${d}</option>`).join(''); };
    const animateTo = v => {
      const from = last, t0 = performance.now(); last = v;
      const step = now => { const t = Math.min(1, (now - t0) / 600); $('#est', root).textContent = store.money(Math.round(from + (v - from) * (1 - Math.pow(1 - t, 3)))); if (t < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const calc = () => {
      const base = TRADE_IN.base[device.value] || 0;
      let mult = TRADE_IN.condition[cond];
      if (!$('#power', root).checked) mult = Math.min(mult, TRADE_IN.condition.broken);
      const dev = Math.round(base * mult / 5) * 5;
      const bonus = $('#upgrade', root).checked ? TRADE_IN.bonus : 0;
      current = { device: `${brand.value === 'Other' ? '' : brand.value + ' '}${device.value}`, condition: cond, value: dev + bonus };
      animateTo(dev + bonus);
      $('#estNote', root).textContent = `for your ${current.device} in ${cond} condition`;
      $('#estBreak', root).innerHTML = `<div class="row"><span class="muted">Device value</span><span>${store.money(dev)}</span></div><div class="row"><span class="muted">Upgrade bonus</span><span>${bonus ? store.money(bonus) : '—'}</span></div>`;
    };
    brand.onchange = () => { fillDevices(); calc(); };
    device.onchange = calc;
    $('#cond', root).onclick = e => { const b = e.target.closest('[data-cond]'); if (!b) return; cond = b.dataset.cond; $$('#cond .opt', root).forEach(x => x.classList.toggle('on', x === b)); calc(); };
    $('#power', root).onchange = calc; $('#upgrade', root).onchange = calc;
    $('#applyTI', root).onclick = () => {
      store.setTradeIn(current);
      toast(`Trade-in credit of ${store.money(current.value)} saved to your bag.`);
      go(store.getState().cart.some(i => i.kind === 'phone') ? '#/cart' : '#/phones');
    };
    fillDevices(); calc();
  },
};
