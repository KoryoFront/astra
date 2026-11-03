import { icon } from '../icons.js';
import { PHONES, findPhone, fromPrice } from '../data.js';
import { crumbs, esc, $, $$ } from '../ui.js';
import * as store from '../store.js';

function pickIds(query) {
  let ids = (query.ids || '').split(',').filter(id => findPhone(id));
  if (!ids.length) ids = store.getState().compare.filter(id => findPhone(id));
  if (ids.length < 2) ids = [...new Set([...ids, 'x1-pro', 's5-plus', 'a3'])];
  return ids.slice(0, 3);
}

export default {
  title: 'Compare phones',
  render({ query }) {
    const ids = pickIds(query);
    return `<div class="container">
      <header class="page-head">
        ${crumbs([['Home', '#/'], ['Phones', '#/phones'], ['Compare', '#/compare']])}
        <h1 class="display-2" data-split>Compare models</h1>
        <div class="row" style="margin-top:20px;justify-content:space-between">
          <p class="lead">Choose up to three phones to see how they stack up.</p>
          <label class="compare-check"><input type="checkbox" id="diffOnly"> Highlight differences</label>
        </div>
      </header>
      <div class="cmp-wrap" data-reveal><table class="cmp" id="cmp"></table></div>
    </div>`;
  },
  mount(root, { query }) {
    let ids = pickIds(query);
    const table = $('#cmp', root);
    const draw = () => {
      const phones = ids.map(findPhone);
      history.replaceState(null, '', '#/compare?ids=' + ids.join(','));
      store.setCompare(ids);
      const groups = [...new Set(phones.flatMap(p => Object.keys(p.specs)))];
      table.innerHTML = `<thead><tr><th class="rowh"></th>${phones.map((p, i) => `<th>
        <div class="cmp-head">
          <select class="select" data-slot="${i}" aria-label="Phone ${i + 1}">${PHONES.map(o => `<option value="${o.id}" ${o.id === p.id ? 'selected' : ''} ${ids.includes(o.id) && o.id !== p.id ? 'disabled' : ''}>${o.name}</option>`).join('')}</select>
          <img src="${p.colors[0].img}" alt="${esc(p.name)}">
          <b style="font-family:var(--font-display);font-size:18px;font-weight:500">${esc(p.name)}</b>
          <span class="muted">From ${store.money(fromPrice(p))}</span>
          <div class="swatches">${p.colors.map(c => `<span class="swatch" style="background:${c.hex}" title="${esc(c.name)}"></span>`).join('')}</div>
          <a href="#/phone/${p.id}" class="btn btn-primary btn-sm">Buy</a>
        </div></th>`).join('')}</tr></thead>
        <tbody>${groups.map(g => {
          const keys = [...new Set(phones.flatMap(p => Object.keys(p.specs[g] || {})))];
          return `<tr class="group"><td colspan="${phones.length + 1}">${g}</td></tr>` + keys.map(k => {
            const vals = phones.map(p => (p.specs[g] || {})[k] || '—');
            const diff = new Set(vals).size > 1;
            return `<tr data-diff="${diff}"><th class="rowh">${k}</th>${vals.map(v => `<td class="${diff ? 'diff' : ''}">${esc(v)}</td>`).join('')}</tr>`;
          }).join('');
        }).join('')}</tbody>`;
      applyDiff();
    };
    const applyDiff = () => {
      const on = $('#diffOnly', root).checked;
      table.classList.toggle('cmp-diff', on);
      $$('tr[data-diff="false"]', table).forEach(r => r.style.opacity = on ? .35 : 1);
    };
    table.addEventListener('change', e => {
      const s = e.target.closest('[data-slot]'); if (!s) return;
      ids[+s.dataset.slot] = s.value; draw();
    });
    $('#diffOnly', root).onchange = applyDiff;
    draw();
  },
};
