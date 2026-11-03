import { icon } from '../icons.js';
import { PHONES, ACCESSORIES, SERIES, findPhone, findAccessory } from '../data.js';
import { crumbs, stars, esc, $, $$, toast, openCart, openLightbox, accessoryCard, phoneCard, wireCards, isTransparent, go } from '../ui.js';
import * as store from '../store.js';
import * as nav from '../nav.js';
import { notFound } from './legal.js';
import { storyHtml, mountStory } from './phonestory.js';

const CARE_PRICE = { x: 199, s: 129, a: 79 };

function gallerySlides(p, color) {
  return [color.img, ...p.gallery];
}
const imgTag = (src, alt = '', cls = '') => `<img src="${src}" alt="${esc(alt)}" class="${isTransparent(src) ? 'contain ' : ''}${cls}">`;

export const phonePage = {
  title: ({ params }) => findPhone(params.id)?.name || 'Not found',
  render(ctx) {
    const p = findPhone(ctx.params.id);
    if (!p) return notFound.render(ctx);
    const color = p.colors.find(c => c.id === ctx.query.color) || p.colors[0];
    const st = p.storage.find(s => String(s.gb) === ctx.query.storage) || p.storage[0];
    const slides = gallerySlides(p, color);
    const care = CARE_PRICE[p.series];
    const acc = ACCESSORIES.filter(a => !a.compat || a.compat === p.id).slice(0, 4);
    return storyHtml(p) + `<div class="container" id="buy" style="scroll-margin-top:120px">
      <div style="padding-top:72px"><p class="eyebrow">Buy</p><h2 class="display-2" style="margin:10px 0 18px">Make it yours.</h2>${crumbs([['Home', '#/'], ['Phones', '#/phones'], [SERIES[p.series].name.replace('ASTRA ', ''), `#/phones?series=${p.series}`], [p.name, '#']])}</div>
      <section class="pdp">
        <div class="gallery">
          <div class="gallery-main" id="gMain" role="img" aria-label="${esc(p.name)} gallery">
            ${imgTag(slides[0], `${p.name} in ${color.name}`)}
            <button class="gallery-nav prev glass" aria-label="Previous image">${icon('chevL')}</button>
            <button class="gallery-nav next glass" aria-label="Next image">${icon('chevR')}</button>
          </div>
          <div class="thumbs-row" id="gThumbs">${slides.map((s, i) => `<button class="${i ? '' : 'on'}" data-i="${i}" aria-label="Image ${i + 1}">${imgTag(s)}</button>`).join('')}</div>
        </div>

        <div class="buy stack" style="--stack:26px">
          <div>
            <div class="row">${p.badge ? `<span class="chip chip-new">${p.badge}</span>` : ''}<span class="chip">${p.tier}</span></div>
            <h2 class="h2" style="margin-top:14px;font-size:clamp(34px,4vw,52px)">${esc(p.name)}</h2>
            <p class="lead" style="margin-top:8px">${esc(p.tagline)}</p>
            <div class="row" style="margin-top:12px;font-size:14px">${stars(p.rating)}<span class="muted">${p.rating} · ${p.reviews.toLocaleString()} reviews</span></div>
            <p class="muted" style="margin-top:16px">${esc(p.blurb)}</p>
          </div>

          <div>
            <div class="opt-label"><span>Colour</span><b id="colorName">${color.name}</b></div>
            <div class="color-opts" id="colors">${p.colors.map(c => `<button class="color-opt ${c.id === color.id ? 'on' : ''}" data-color="${c.id}" aria-label="${esc(c.name)}" title="${esc(c.name)}"><span style="background:${c.hex}"></span></button>`).join('')}</div>
          </div>

          <div>
            <div class="opt-label"><span>Storage</span><a href="#/faq" class="dim" style="font-size:13px">How much do I need?</a></div>
            <div class="opt-grid" id="storage">${p.storage.map(s => `<button class="opt ${s.gb === st.gb ? 'on' : ''}" data-gb="${s.gb}"><b>${store.fmtGB(s.gb)}</b><span>${store.money(s.price)}</span></button>`).join('')}</div>
          </div>

          <label class="ship-opt" style="align-items:flex-start">
            <input type="checkbox" id="care" style="margin-top:3px">
            <div><b style="font-weight:500">Add Astra Care+ — ${store.money(care)}</b><div class="dim" style="font-size:13px;margin-top:2px">3 years of cover incl. accidental damage, express replacement and priority support.</div></div>
          </label>

          <div class="card card-pad" style="padding:22px">
            <div class="price-box"><span class="price-big" id="price">${store.money(st.price)}</span><span class="muted" id="monthly">or ${store.money2(st.price / 24)}/mo. for 24 mo.*</span></div>
            <p class="dim" style="font-size:13px;margin-top:6px">Free delivery · Trade in and save up to ${store.money(p.series === 'x' ? 860 : 400)}. <a class="link" href="#/trade-in" style="font-size:13px">Estimate</a></p>
            <div class="row" style="margin-top:18px;gap:10px" id="buyBtns">
              <button class="btn btn-primary btn-lg" style="flex:1" id="addBtn">${icon('bag')} Add to bag</button>
              <button class="btn btn-ghost btn-lg" style="flex:1" id="buyNow">Buy now</button>
            </div>
          </div>

          <div class="assurances card">
            <div>${icon('truck')} Free delivery in 3–5 days, or next-day available</div>
            <div>${icon('refresh')} 30-day free returns</div>
            <div>${icon('shield')} 2-year warranty included</div>
          </div>
        </div>
      </section>

      <section class="section-sm">
        <div class="hl-grid" data-stagger=".08">${p.highlights.map(([i, b, s]) => `<div class="hl card" data-reveal data-tilt="6">${icon(i)}<b>${b}</b><span>${s}</span></div>`).join('')}</div>
      </section>
    </div>

    <div class="container">
      <section class="section-sm" id="specs" style="scroll-margin-top:120px">
        <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:28px">
          <h2 class="h2" data-reveal>Tech specs</h2>
          <a href="#/compare?ids=${p.id}" class="link">${icon('compare')} Compare with other models</a>
        </div>
        <div class="spec-table">${Object.entries(p.specs).map(([g, rows]) => `<div class="spec-group" data-reveal><h3>${g}</h3><dl>${Object.entries(rows).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`).join('')}
          <div class="spec-group" data-reveal><h3>In the box</h3><dl><dt>Contents</dt><dd>${esc(p.name)}, USB-C to USB-C cable (1 m), SIM tool, quick start guide. Charger sold separately to reduce e-waste.</dd></dl></div>
        </div>
        <p class="dim" style="font-size:12px;margin-top:20px">*0% APR financing subject to status. Battery and performance figures are based on ASTRA internal testing of pre-production units.</p>
      </section>

      <section class="section-sm">
        <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:28px"><h2 class="h2">Made for ${esc(p.name.replace('ASTRA ', ''))}</h2><a href="#/accessories" class="link">All accessories ${icon('arrow')}</a></div>
        <div class="grid-cards" id="accs">${acc.map(accessoryCard).join('')}</div>
      </section>
    </div>

    `;
  },
  mount(root, ctx) {
    const p = findPhone(ctx.params.id); if (!p) return;
    let color = p.colors.find(c => c.id === ctx.query.color) || p.colors[0];
    let st = p.storage.find(s => String(s.gb) === ctx.query.storage) || p.storage[0];
    let slides = gallerySlides(p, color), idx = 0;
    const main = $('#gMain', root), thumbs = $('#gThumbs', root);

    const show = i => {
      idx = (i + slides.length) % slides.length;
      const old = main.querySelector('img:not(.fade-out)');
      const img = document.createElement('div'); img.innerHTML = imgTag(slides[idx], `${p.name} image ${idx + 1}`); const n = img.firstChild;
      n.style.opacity = 0; main.insertBefore(n, old.nextSibling);
      requestAnimationFrame(() => { n.style.opacity = 1; old.classList.add('fade-out'); setTimeout(() => old.remove(), 500); });
      main.classList.remove('zoomed');
      $$('button', thumbs).forEach((b, j) => b.classList.toggle('on', j === idx));
    };
    const syncUrl = () => nav.replace(`#/phone/${p.id}?color=${color.id}&storage=${st.gb}`);
    const updatePrice = () => {
      const care = $('#care', root).checked ? CARE_PRICE[p.series] : 0;
      const pr = $('#price', root); pr.innerHTML = `<span class="price-anim">${store.money(st.price + care)}</span>`;
      $('#monthly', root).textContent = `or ${store.money2((st.price + care) / 24)}/mo. for 24 mo.*`;
    };

    $('.prev', main).onclick = e => { e.stopPropagation(); show(idx - 1); };
    $('.next', main).onclick = e => { e.stopPropagation(); show(idx + 1); };
    main.addEventListener('click', e => { if (e.target.closest('button')) return; innerWidth < 720 ? openLightbox(slides[idx]) : main.classList.toggle('zoomed'); });
    main.addEventListener('pointermove', e => {
      if (!main.classList.contains('zoomed')) return;
      const r = main.getBoundingClientRect(); const img = main.querySelector('img:last-of-type');
      img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    });
    // swipe
    let sx = null;
    main.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    main.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1)); sx = null; });
    thumbs.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) show(+b.dataset.i); });

    $('#colors', root).addEventListener('click', e => {
      const b = e.target.closest('[data-color]'); if (!b) return;
      color = p.colors.find(c => c.id === b.dataset.color);
      $$('.color-opt', root).forEach(x => x.classList.toggle('on', x === b));
      $('#colorName', root).textContent = color.name;
      slides = gallerySlides(p, color);
      const first = thumbs.querySelector('button img'); first.src = color.img;
      show(0); syncUrl(); updatePrice();
    });
    $('#storage', root).addEventListener('click', e => {
      const b = e.target.closest('[data-gb]'); if (!b) return;
      st = p.storage.find(s => s.gb === +b.dataset.gb);
      $$('.opt', $('#storage', root)).forEach(x => x.classList.toggle('on', x === b));
      syncUrl(); updatePrice();
    });
    $('#care', root).onchange = updatePrice;

    const add = () => {
      store.addToCart({ kind: 'phone', id: p.id, color: color.id, storage: st.gb });
      if ($('#care', root).checked) store.addToCart({ kind: 'care', id: p.id, price: CARE_PRICE[p.series] });
      return true;
    };
    $('#addBtn', root).onclick = () => { add(); toast(`${p.name} · ${color.name} · ${store.fmtGB(st.gb)} added`, { action: ['View bag', openCart] }); };
    $('#buyNow', root).onclick = () => { add(); go('#/checkout'); };
    wireCards($('#accs', root));

    updatePrice();

    return mountStory(root, p, { onPickColor: id => root.querySelector(`#colors [data-color="${id}"]`)?.click() });
  },
};

export const accessoryPage = {
  title: ({ params }) => findAccessory(params.id)?.name || 'Not found',
  render(ctx) {
    const a = findAccessory(ctx.params.id);
    if (!a) return notFound.render(ctx);
    const related = ACCESSORIES.filter(x => x.id !== a.id && x.cat === a.cat).concat(ACCESSORIES.filter(x => x.id !== a.id && x.cat !== a.cat)).slice(0, 4);
    const compat = a.compat ? [findPhone(a.compat)] : PHONES.filter(p => a.cat !== 'Cases' || p.series !== 'a');
    return `<div class="container">
      <div style="padding-top:32px">${crumbs([['Home', '#/'], ['Accessories', '#/accessories'], [a.cat, `#/accessories?cat=${a.cat}`], [a.name, '#']])}</div>
      <section class="pdp">
        <div class="gallery"><div class="gallery-main" id="gMain">${imgTag(a.img, a.name)}</div></div>
        <div class="buy stack" style="--stack:24px">
          <div>
            <div class="row">${a.badge ? `<span class="chip chip-new">${a.badge}</span>` : ''}<span class="chip">${a.cat}</span></div>
            <h1 style="margin-top:14px">${esc(a.name)}</h1>
            <div class="row" style="margin-top:12px;font-size:14px">${stars(a.rating)}<span class="muted">${a.rating}</span></div>
            <p class="lead" style="margin-top:16px">${esc(a.blurb)}</p>
          </div>
          ${a.colors?.length ? `<div><div class="opt-label"><span>Colour</span><b id="colorName">${a.colors[0].name}</b></div><div class="color-opts" id="colors">${a.colors.map((c, i) => `<button class="color-opt ${i ? '' : 'on'}" data-color="${c.id}" aria-label="${esc(c.name)}"><span style="background:${c.hex}"></span></button>`).join('')}</div></div>` : ''}
          <div class="card" style="padding:22px">
            <div class="price-box"><span class="price-big">${store.money(a.price)}</span><span class="muted">Free delivery</span></div>
            <div class="row" style="margin-top:18px;gap:10px">
              <div class="qty" style="height:56px;margin:0"><button data-q="-1" aria-label="Decrease">${icon('minus')}</button><span id="qty">1</span><button data-q="1" aria-label="Increase">${icon('plus')}</button></div>
              <button class="btn btn-primary btn-lg" style="flex:1" id="addBtn">${icon('bag')} Add to bag</button>
            </div>
          </div>
          <div><h3 class="h3" style="margin-bottom:14px">Highlights</h3><ul class="stack" style="--stack:10px;padding:0;list-style:none;margin:0">${a.features.map(f => `<li class="row" style="flex-wrap:nowrap">${icon('check')}<span class="muted">${esc(f)}</span></li>`).join('')}</ul></div>
          <div><h3 class="h3" style="margin-bottom:14px">Compatibility</h3><div class="row" style="gap:8px">${compat.map(p => `<a class="chip" href="#/phone/${p.id}">${p.name}</a>`).join('')}</div></div>
        </div>
      </section>
      <section class="section-sm"><h2 class="h2" style="margin-bottom:28px">You may also like</h2><div class="grid-cards" id="rel">${related.map(accessoryCard).join('')}</div></section>
    </div>`;
  },
  mount(root, ctx) {
    const a = findAccessory(ctx.params.id); if (!a) return;
    let qty = 1, color = a.colors?.[0];
    root.querySelector('.buy .qty').addEventListener('click', e => { const b = e.target.closest('[data-q]'); if (!b) return; qty = Math.max(1, Math.min(10, qty + +b.dataset.q)); $('#qty', root).textContent = qty; });
    $('#colors', root)?.addEventListener('click', e => { const b = e.target.closest('[data-color]'); if (!b) return; color = a.colors.find(c => c.id === b.dataset.color); $$('.color-opt', root).forEach(x => x.classList.toggle('on', x === b)); $('#colorName', root).textContent = color.name; });
    $('#addBtn', root).onclick = () => { store.addToCart({ kind: 'accessory', id: a.id, color: color?.id }, qty); toast(`${a.name} added to your bag`, { action: ['View bag', openCart] }); };
    $('#gMain', root).onclick = () => openLightbox(a.img);
    wireCards($('#rel', root));
  },
};
