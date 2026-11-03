import { icon } from '../icons.js';
import { PHONES, ACCESSORIES, SERIES, fromPrice } from '../data.js';
import { phoneCard, accessoryCard, wireCards, crumbs, $, $$, go } from '../ui.js';
import * as store from '../store.js';
import { initReveal, initTilt } from '../fx.js';
import * as nav from '../nav.js';

const COLOR_FAMILIES = { Dark: ['graphite', 'onyx', 'ocean'], Light: ['silver', 'sand', 'glacier'], Colourful: ['lavender', 'sage', 'desert'] };
const SORTS = [['featured', 'Featured'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['newest', 'Newest'], ['rating', 'Top rated']];

function setQuery(q) {
  const qs = new URLSearchParams(Object.entries(q).filter(([, v]) => v !== '' && v != null)).toString();
  nav.replace(nav.current().split('?')[0] + (qs ? '?' + qs : ''));
}

function compareTray() {
  return `<div class="compare-tray glass" id="cmpTray"><span style="font-size:14px"><b id="cmpN">0</b> selected to compare</span><div class="thumbs" id="cmpThumbs"></div><button class="btn btn-ghost btn-sm" id="cmpClear">Clear</button><a class="btn btn-primary btn-sm" id="cmpGo" href="#/compare">Compare ${icon('arrow', 'arrow')}</a></div>`;
}
function updateTray(root) {
  const ids = store.getState().compare, tray = $('#cmpTray', root); if (!tray) return;
  tray.classList.toggle('show', ids.length > 0);
  $('#cmpN', root).textContent = ids.length;
  $('#cmpThumbs', root).innerHTML = ids.map(id => { const p = PHONES.find(p => p.id === id); return `<img src="${p.colors[0].img}" alt="${p.name}" title="${p.name}">`; }).join('');
  $('#cmpGo', root).href = '#/compare?ids=' + ids.join(',');
  $$('[data-compare]', root).forEach(c => { c.checked = ids.includes(c.dataset.compare); });
}

export const phonesPage = {
  title: 'Smartphones',
  render({ query }) {
    const counts = s => PHONES.filter(p => p.series === s).length;
    const sel = (query.series || '').split(',').filter(Boolean);
    const maxPrice = Math.max(...PHONES.map(p => p.storage.at(-1).price));
    return `<div class="container">
      <header class="page-head">
        ${crumbs([['Home', '#/'], ['Phones', '#/phones']])}
        <h1 class="display-2" data-split>All phones</h1>
        <p class="lead" style="margin-top:14px;max-width:620px" data-reveal>From the titanium X1 Pro to the endlessly capable A3 — every ASTRA is built with the same obsession for detail.</p>
      </header>
      <div class="catalog">
        <aside class="filters glass" id="filters" aria-label="Filters">
          <div class="row" style="justify-content:space-between"><b>Filters</b><button class="link" id="resetF" style="font-size:13px">Reset</button></div>
          <div class="filter-group"><h4>Series</h4>
            ${Object.values(SERIES).map(s => `<label class="check"><input type="checkbox" name="series" value="${s.id}" ${sel.includes(s.id) ? 'checked' : ''}>${s.name.replace('ASTRA ', '')}<span class="count">${counts(s.id)}</span></label>`).join('')}
          </div>
          <div class="filter-group"><h4>Max price</h4>
            <input type="range" class="range" id="price" min="199" max="${maxPrice}" step="50" value="${query.max || maxPrice}" aria-label="Maximum price">
            <div class="row" style="justify-content:space-between;font-size:13px;color:var(--text-3)"><span>$199</span><span id="priceVal">Up to ${store.money(+(query.max || maxPrice))}</span></div>
          </div>
          <div class="filter-group"><h4>Storage</h4>
            ${[64, 128, 256, 512, 1024].map(gb => `<label class="check"><input type="checkbox" name="storage" value="${gb}" ${(query.storage || '').split(',').includes(String(gb)) ? 'checked' : ''}>${store.fmtGB(gb)}</label>`).join('')}
          </div>
          <div class="filter-group"><h4>Colour</h4>
            ${Object.keys(COLOR_FAMILIES).map(c => `<label class="check"><input type="checkbox" name="color" value="${c}" ${(query.color || '').split(',').includes(c) ? 'checked' : ''}>${c}</label>`).join('')}
          </div>
          <div class="filter-group"><h4>Features</h4>
            <label class="check"><input type="checkbox" name="feat" value="5g" ${(query.feat || '').includes('5g') ? 'checked' : ''}>5G</label>
            <label class="check"><input type="checkbox" name="feat" value="wireless" ${(query.feat || '').includes('wireless') ? 'checked' : ''}>Wireless charging</label>
            <label class="check"><input type="checkbox" name="feat" value="tele" ${(query.feat || '').includes('tele') ? 'checked' : ''}>Telephoto camera</label>
          </div>
          <button class="btn btn-primary btn-block filter-toggle" id="applyF">Show results</button>
        </aside>
        <div>
          <div class="toolbar">
            <span class="muted" id="resultCount"></span>
            <div class="row">
              <button class="btn btn-ghost btn-sm filter-toggle" id="openF">${icon('filter')} Filters</button>
              <select class="select" id="sort" aria-label="Sort by">${SORTS.map(([v, l]) => `<option value="${v}" ${query.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
            </div>
          </div>
          <div class="grid-cards" id="results"></div>
        </div>
      </div>
    </div>${compareTray()}`;
  },
  mount(root, { query }) {
    const results = $('#results', root), filters = $('#filters', root);
    const read = () => {
      const vals = n => $$(`input[name="${n}"]:checked`, root).map(i => i.value);
      return { series: vals('series').join(','), storage: vals('storage').join(','), color: vals('color').join(','), feat: vals('feat').join(','), max: $('#price', root).value, sort: $('#sort', root).value };
    };
    const apply = (animate = true) => {
      const q = read(); setQuery({ ...q, max: +q.max >= +$('#price', root).max ? '' : q.max, sort: q.sort === 'featured' ? '' : q.sort });
      $('#priceVal', root).textContent = 'Up to ' + store.money(+q.max);
      let list = PHONES.filter(p => {
        if (q.series && !q.series.split(',').includes(p.series)) return false;
        if (fromPrice(p) > +q.max) return false;
        if (q.storage && !p.storage.some(s => q.storage.split(',').includes(String(s.gb)))) return false;
        if (q.color && !p.colors.some(c => q.color.split(',').some(f => COLOR_FAMILIES[f].includes(c.id)))) return false;
        if (q.feat) {
          const f = q.feat.split(','), sp = JSON.stringify(p.specs);
          if (f.includes('5g') && !p.specs.Connectivity.Network.includes('5G')) return false;
          if (f.includes('wireless') && (p.specs.Battery.Wireless || '—') === '—') return false;
          if (f.includes('tele') && !/Telephoto/.test(sp)) return false;
        }
        return true;
      });
      const by = { 'price-asc': (a, b) => fromPrice(a) - fromPrice(b), 'price-desc': (a, b) => fromPrice(b) - fromPrice(a), newest: (a, b) => b.released.localeCompare(a.released), rating: (a, b) => b.rating - a.rating }[q.sort];
      if (by) list = [...list].sort(by);
      $('#resultCount', root).textContent = `${list.length} ${list.length === 1 ? 'phone' : 'phones'}`;
      results.innerHTML = list.length ? list.map(p => phoneCard(p)).join('') : `<div class="empty card" style="grid-column:1/-1">${icon('search')}<p>No phones match these filters.</p><button class="btn btn-ghost" style="margin-top:18px" id="clearAll">Clear filters</button></div>`;
      $$('[data-reveal]', results).forEach((el, i) => { el.style.setProperty('--d', (i * 0.06) + 's'); if (!animate) el.classList.add('in'); });
      initReveal(results); initTilt(results);
      $('#clearAll', root)?.addEventListener('click', reset);
      updateTray(root);
    };
    const reset = () => { $$('input[type="checkbox"]', filters).forEach(i => i.checked = false); $('#price', root).value = $('#price', root).max; $('#sort', root).value = 'featured'; apply(); };
    filters.addEventListener('change', () => apply());
    $('#price', root).addEventListener('input', () => apply(false));
    $('#sort', root).addEventListener('change', () => apply());
    $('#resetF', root).onclick = reset;
    const openF = o => { filters.classList.toggle('open', o); document.body.classList.toggle('no-scroll', o); };
    $('#openF', root).onclick = () => openF(true);
    $('#applyF', root).onclick = () => openF(false);
    wireCards(results);
    $('#cmpClear', root).onclick = () => store.setCompare([]);
    const unsub = store.subscribe(() => updateTray(root));
    apply();
    return () => { unsub(); document.body.classList.remove('no-scroll'); };
  },
};

export const accessoriesPage = {
  title: 'Accessories',
  render({ query }) {
    const cats = ['All', ...new Set(ACCESSORIES.map(a => a.cat))];
    const cur = query.cat || 'All';
    return `<div class="container">
      <header class="page-head">
        ${crumbs([['Home', '#/'], ['Accessories', '#/accessories']])}
        <h1 class="display-2" data-split>Accessories</h1>
        <p class="lead" style="margin-top:14px;max-width:620px" data-reveal>Audio, charging and protection — designed alongside every ASTRA phone for a perfect fit.</p>
      </header>
      <div class="bento" style="margin-bottom:48px">
        <a href="#/accessory/buds-pro" class="b-span-4 card acc-split" data-reveal>
          <img src="assets/img/accessories/buds-pro.jpg" alt="ASTRA Buds Pro 2">
          <div class="bcap"><span class="chip chip-new">New</span><h2 class="h2" style="margin-top:14px">Buds Pro 2</h2><p class="muted" style="margin-top:8px;max-width:360px">Silence, perfected. Adaptive ANC and lossless spatial audio.</p></div>
        </a>
        <a href="#/accessory/mag-pad" class="b-span-2 card shade-b" data-reveal style="min-height:420px">
          <img class="bimg" src="assets/img/accessories/mag-pad.jpg" alt="AstraMag Wireless Charger">
          <div class="bcap"><h3 class="h3">AstraMag</h3><p class="muted" style="margin-top:6px">50 W magnetic wireless.</p></div>
        </a>
      </div>
      <div class="toolbar">
        <div class="tabs" role="tablist">${cats.map(c => `<button role="tab" data-cat="${c}" class="${c === cur ? 'on' : ''}">${c}</button>`).join('')}</div>
        <select class="select" id="sort" aria-label="Sort by">${SORTS.filter(s => s[0] !== 'newest').map(([v, l]) => `<option value="${v}" ${query.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
      </div>
      <div class="grid-cards" id="results"></div>
    </div>`;
  },
  mount(root, { query }) {
    let cat = query.cat || 'All';
    const results = $('#results', root);
    const apply = () => {
      const sort = $('#sort', root).value;
      setQuery({ cat: cat === 'All' ? '' : cat, sort: sort === 'featured' ? '' : sort });
      let list = ACCESSORIES.filter(a => cat === 'All' || a.cat === cat);
      const by = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating }[sort];
      if (by) list = [...list].sort(by);
      results.innerHTML = list.map(accessoryCard).join('');
      $$('[data-reveal]', results).forEach((el, i) => el.style.setProperty('--d', (i * 0.06) + 's'));
      initReveal(results); initTilt(results);
    };
    root.querySelector('.tabs').addEventListener('click', e => {
      const b = e.target.closest('[data-cat]'); if (!b) return;
      cat = b.dataset.cat; $$('.tabs button', root).forEach(x => x.classList.toggle('on', x === b)); apply();
    });
    $('#sort', root).onchange = apply;
    wireCards(results);
    apply();
  },
};
