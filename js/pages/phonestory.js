// Scroll-driven 3D storytelling for an individual phone page.
import { icon } from '../icons.js';
import { SERIES, fromPrice } from '../data.js';
import { STORIES } from '../stories.js';
import { phone3d } from '../phone3d.js';
import { esc, $, $$ } from '../ui.js';
import * as store from '../store.js';
import { onScroll, sectionProgress, range, lerp, ease, reduce, finePointer } from '../fx.js';

const stat = ([v, suf, label]) => `<div class="ps-stat"><b><span data-count="${v}" ${/^p$|^K$/.test(suf.trim()) ? 'data-plain' : ''}>0</span>${suf}</b><span>${label}</span></div>`;

export function storyHtml(p) {
  const s = STORIES[p.id];
  const short = p.name.replace('ASTRA ', '');
  const words = s.intro.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
  return `
  <nav class="pnav" id="pnav" aria-label="${esc(p.name)} sections"><div class="pnav-in">
    <b class="pnav-name">${esc(short)}</b>
    <div class="pnav-links">${[['overview', 'Overview'], ['design', 'Design'], ['camera', 'Camera'], ['display', 'Display'], ['performance', 'Performance'], ['battery', 'Battery'], ['specs', 'Specs']].map(([id, l]) => `<button data-goto="${id}">${l}</button>`).join('')}</div>
    <span class="pnav-price">From ${store.money(fromPrice(p))}</span>
    <button class="btn btn-primary btn-sm" data-goto="buy">Buy</button>
  </div></nav>

  <section class="ps-hero" id="overview" aria-label="${esc(p.name)}">
    <div class="ps-sticky">
      <div class="ps-bg"><img src="${s.bg}" alt="" id="psBg"></div>
      <div class="ps-shade"></div>
      <div class="ps-name" id="psName" aria-hidden="true">${(short.includes(' ') ? [short.split(' ')[0], short.split(' ').slice(1).join(' ')] : [short.slice(0, 1), short.slice(1)]).map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="ps-hero-phone" id="psHeroPhone">${phone3d({ front: s.front, back: s.back, frame: s.frame, id: 'psP1', alt: p.name })}</div>
      <div class="ps-hero-copy" id="psHeroCopy"><div class="container">
        <p class="eyebrow">${SERIES[p.series].name}${p.badge ? ` · ${p.badge}` : ''}</p>
        <h1 class="ps-title">${esc(p.name)}</h1>
        <p class="lead" style="margin-top:8px">${esc(p.tagline)}</p>
        <div class="row" style="margin-top:22px;gap:12px"><button class="btn btn-primary btn-lg" data-goto="buy">Buy from ${store.money(fromPrice(p))} ${icon('arrow', 'arrow')}</button><a class="btn btn-ghost btn-lg" href="#/compare?ids=${p.id}">Compare</a></div>
      </div></div>
    </div>
  </section>

  <section class="statement" id="psIntro"><div class="statement-sticky"><div class="container"><p>${words}</p></div></div></section>

  <section class="story" id="design" aria-label="Design">
    <div class="story-sticky">
      <div class="story-grid" id="dsGrid"></div>
      <div class="story-word" id="dsWord">${s.word} · ${s.word} ·</div>
      <div class="story-title" id="dsTitle"><p class="eyebrow">Design</p><h2 class="display-2" style="margin-top:12px">${esc(s.design.title)}</h2></div>
      ${phone3d({ front: s.front, back: s.back, frame: s.frame, id: 'psP2', alt: p.name })}
      <div class="story-callouts">${s.design.callouts.map(([n, t], i) => `<div class="callout ${['c-l1', 'c-r1', 'c-l2', 'c-r2'][i]}" data-at="${(0.12 + i * 0.2).toFixed(2)}"><span class="num">${esc(n)}</span><p>${esc(t)}</p></div>`).join('')}</div>
      <div class="story-progress" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    </div>
  </section>

  <section class="zoom-section" id="camera" aria-label="Camera">
    <div class="zoom-sticky">
      <img src="${s.cam}" alt="${esc(p.name)} camera" id="camImg" style="transform-origin:${s.camOrigin}">
      <div class="shade"></div>
      <div class="zoom-text" id="camText"><div class="container">
        <p class="eyebrow">Camera</p>
        <h2 class="display-2" style="margin-top:14px;max-width:900px">${esc(s.camera.title)}</h2>
        <p class="lead" style="margin-top:12px;max-width:620px">${esc(s.camera.sub)}</p>
        <div class="ps-stats" data-reveal>${s.camera.stats.map(stat).join('')}</div>
      </div></div>
    </div>
  </section>

  <section class="ps-shots section-sm" aria-label="Photo samples"><div class="container">
    <p class="eyebrow" data-reveal>Shot on ${esc(short)}</p>
    <div class="ps-shots-grid">${s.shots.map((src, i) => `<figure style="margin:0" data-reveal="tilt"><div class="ps-shot"><img src="${src}" alt="" loading="lazy" data-parallax="${[0.08, -0.06, 0.12][i]}"></div></figure>`).join('')}</div>
  </div></section>

  <section class="ps-display" id="display" aria-label="Display">
    <div class="ps-display-sticky">
      <div class="story-grid"></div>
      <div class="ps-display-copy" id="dpCopy"><div class="container"><p class="eyebrow">Display</p><h2 class="display-2" style="margin-top:12px;max-width:760px">${esc(s.display.title)}</h2><p class="lead" style="margin-top:12px;max-width:560px">${esc(s.display.sub)}</p></div></div>
      <div class="ps-display-phone" id="dpPhone"><img src="${s.front}" alt="${esc(p.name)} display"></div>
      <div class="ps-display-stats" id="dpStats"><div class="container"><div class="ps-stats" data-reveal>${s.display.stats.map(stat).join('')}</div></div></div>
    </div>
  </section>

  <section class="section ps-perf" id="performance" aria-label="Performance"><div class="container">
    <p class="eyebrow" data-reveal>Performance</p>
    <div class="ps-chip" data-reveal="blur">${esc(s.perf.chip)}</div>
    <h2 class="h2" style="margin-top:8px" data-reveal>${esc(s.perf.title)}</h2>
    <p class="lead" style="margin-top:12px;max-width:620px" data-reveal>${esc(s.perf.sub)}</p>
    <div class="ps-cards" data-stagger=".08">${s.perf.stats.map(st => `<div class="card ps-card" data-reveal="tilt">${stat(st)}</div>`).join('')}</div>
  </div></section>

  <section class="ps-battery" id="battery" aria-label="Battery">
    <div class="ps-battery-sticky"><div class="container ps-battery-grid">
      <div class="ps-ring"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="88" class="track"/><circle cx="100" cy="100" r="88" class="fill" id="batFill"/></svg>
        <div class="ps-ring-num"><b id="batNum">0</b><span>mAh</span></div></div>
      <div><p class="eyebrow">Battery</p><h2 class="display-2" style="margin-top:12px">${esc(s.battery.title)}</h2><p class="lead" style="margin-top:12px">${esc(s.battery.sub)}</p>
        <div class="ps-stats ps-stats-3" data-reveal>${s.battery.stats.map(stat).join('')}</div></div>
    </div></div>
  </section>

  <section class="ps-colors" id="colours" aria-label="Colours" style="height:${100 + p.colors.length * 70}vh">
    <div class="ps-colors-sticky" id="colWash">
      <div class="container" style="position:relative;z-index:2"><p class="eyebrow">Colours</p><h2 class="display-2" style="margin-top:10px">Pick your finish.</h2></div>
      <div class="ps-colors-stage">${p.colors.map((c, i) => `<figure class="ps-color${i ? '' : ' on'}" data-hex="${c.hex}" style="margin:0"><img src="${c.img}" alt="${esc(p.name)} in ${esc(c.name)}" loading="lazy"></figure>`).join('')}</div>
      <div class="container ps-color-names">${p.colors.map((c, i) => `<button class="${i ? '' : 'on'}" data-pick="${c.id}"><span class="swatch" style="background:${c.hex}"></span>${esc(c.name)}</button>`).join('')}</div>
    </div>
  </section>`;
}

export function mountStory(root, p, { onPickColor } = {}) {
  const s = STORIES[p.id]; if (!s) return () => {};
  const offs = [];
  const mobile = () => innerWidth <= 720;

  // Section nav: smooth scroll + active state
  const nav = $('#pnav', root);
  nav.addEventListener('click', e => { const b = e.target.closest('[data-goto]'); if (b) document.getElementById(b.dataset.goto)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  root.querySelectorAll('.ps-hero [data-goto]').forEach(b => b.onclick = () => document.getElementById(b.dataset.goto)?.scrollIntoView({ behavior: 'smooth' }));
  const ids = ['overview', 'design', 'camera', 'display', 'performance', 'battery', 'specs'];
  offs.push(onScroll(() => {
    let cur = ids[0];
    ids.forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.4) cur = id; });
    $$('.pnav-links button', nav).forEach(b => b.classList.toggle('on', b.dataset.goto === cur));
    nav.classList.toggle('solid', scrollY > 60);
  }));

  // Hero: phone turns in 3D and rises faster than the backdrop; the name splits apart behind it
  const hero = $('#overview', root), bg = $('#psBg', root), name = $('#psName', root), p1 = $('#psP1', root), copy = $('#psHeroCopy', root);
  const nameParts = [...name.children];
  let mx = 0, my = 0;
  const paintHero = () => {
    const pr = sectionProgress(hero), e = ease(pr);
    bg.style.transform = `translate3d(${(-mx * 10).toFixed(1)}px, ${(pr * 6).toFixed(2)}vh, 0) scale(${(1.06 + e * 0.16).toFixed(4)})`;
    if (!reduce) p1.style.transform = `translateY(${(-e * (mobile() ? 8 : 14)).toFixed(2)}vh) rotateY(${(lerp(-22, 200, e) + mx * 14).toFixed(2)}deg) rotateX(${(lerp(8, -4, e) - my * 8).toFixed(2)}deg) scale(${lerp(1, 0.86, e).toFixed(3)})`;
    if (nameParts.length > 1) { nameParts[0].style.transform = `translateX(${(-e * 30).toFixed(2)}vw)`; nameParts[1].style.transform = `translateX(${(e * 30).toFixed(2)}vw)`; }
    else nameParts[0].style.transform = `scale(${(1 + e * 0.4).toFixed(3)})`;
    name.style.opacity = (1 - range(pr, 0.4, 0.9)).toFixed(3);
    copy.style.opacity = (1 - range(pr, 0.05, 0.4)).toFixed(3);
    copy.style.transform = `translateY(${(-e * 12).toFixed(2)}vh)`;
  };
  offs.push(onScroll(paintHero));
  if (finePointer && !reduce) {
    const mv = ev => { mx = ev.clientX / innerWidth - 0.5; my = ev.clientY / innerHeight - 0.5; if (scrollY < innerHeight) requestAnimationFrame(paintHero); };
    addEventListener('pointermove', mv, { passive: true }); offs.push(() => removeEventListener('pointermove', mv));
  }

  // Intro words
  const intro = $('#psIntro', root), words = $$('.w', intro);
  offs.push(onScroll(() => { const n = Math.round(range(sectionProgress(intro), 0.05, 0.8) * words.length); words.forEach((w, i) => { w.style.opacity = i < n ? 1 : 0.14; }); }));

  // Design: full 3D spin with type sliding behind
  const ds = $('#design', root), p2 = $('#psP2', root), word = $('#dsWord', root), grid = $('#dsGrid', root), dt = $('#dsTitle', root);
  const callouts = $$('.callout', ds), dots = $$('.story-progress i', ds);
  offs.push(onScroll(() => {
    const pr = sectionProgress(ds);
    const rot = reduce ? 0 : lerp(-30, 390, ease(range(pr, 0, 0.92)));
    p2.style.transform = `rotateY(${rot.toFixed(2)}deg) rotateX(${(Math.sin(pr * Math.PI * 2) * 10).toFixed(2)}deg) scale(${(lerp(0.8, 1.12, range(pr, 0, 0.25)) - range(pr, 0.85, 1) * 0.2).toFixed(3)})`;
    word.style.transform = `translate3d(${lerp(10, -70, pr).toFixed(2)}%, -50%, 0)`;
    grid.style.transform = `translate3d(0, ${(-pr * 160).toFixed(1)}px, 0)`;
    dt.style.opacity = 1 - range(pr, 0.05, 0.12);
    callouts.forEach(c => { const at = parseFloat(c.dataset.at); c.classList.toggle('on', pr >= at && pr < at + 0.24); });
    dots.forEach((d, i) => d.classList.toggle('on', pr >= 0.12 + i * 0.2 && pr < 0.32 + i * 0.2));
  }));

  // Camera: dive out of the lens
  const cam = $('#camera', root), camImg = $('#camImg', root), camText = $('#camText', root);
  offs.push(onScroll(() => {
    const pr = sectionProgress(cam);
    camImg.style.transform = `scale(${lerp(2.6, 1, ease(range(pr, 0, 0.7))).toFixed(3)})`;
    camText.style.opacity = range(pr, 0.3, 0.55);
    camText.style.transform = `translateY(${lerp(60, 0, ease(range(pr, 0.3, 0.65)))}px)`;
  }));

  // Display: the phone grows toward you until the screen fills the view
  const dp = $('#display', root), dpPhone = $('#dpPhone', root), dpCopy = $('#dpCopy', root), dpStats = $('#dpStats', root);
  offs.push(onScroll(() => {
    const pr = sectionProgress(dp), e = ease(range(pr, 0, 0.8));
    dpPhone.style.transform = `translate3d(0, ${lerp(30, 0, e).toFixed(2)}vh, 0) perspective(1200px) rotateX(${lerp(28, 0, e).toFixed(2)}deg) scale(${lerp(0.7, mobile() ? 1.25 : 1.6, e).toFixed(3)})`;
    dpCopy.style.opacity = (1 - range(pr, 0.25, 0.45)).toFixed(3);
    dpStats.style.opacity = range(pr, 0.55, 0.8).toFixed(3);
  }));

  // Battery ring charges with scroll
  const bat = $('#battery', root), fill = $('#batFill', root), num = $('#batNum', root);
  const C = 2 * Math.PI * 88; fill.style.strokeDasharray = C;
  offs.push(onScroll(() => {
    const pr = ease(range(sectionProgress(bat), 0.05, 0.7));
    fill.style.strokeDashoffset = (C * (1 - pr)).toFixed(1);
    num.textContent = Math.round(s.battery.mah * pr).toLocaleString('en-US');
  }));

  // Colours: each finish takes the stage in turn
  const col = $('#colours', root), figs = $$('.ps-color', col), names = $$('[data-pick]', col), wash = $('#colWash', root);
  let lastActive = -1;
  offs.push(onScroll(() => {
    const pr = sectionProgress(col), n = figs.length;
    const active = Math.min(n - 1, Math.floor(pr * n * 0.999));
    figs.forEach((f, i) => {
      const d = i - pr * (n - 1);
      f.style.transform = `translate3d(${(d * 42).toFixed(2)}vw, 0, ${(-Math.abs(d) * 300).toFixed(0)}px) rotateY(${(-d * 35).toFixed(2)}deg)`;
      f.style.opacity = Math.max(0, 1 - Math.abs(d) * 0.6).toFixed(3);
    });
    if (active !== lastActive) {
      lastActive = active;
      names.forEach((b, i) => b.classList.toggle('on', i === active));
      wash.style.setProperty('--wash', figs[active].dataset.hex);
    }
  }));
  names.forEach(b => b.onclick = () => { onPickColor?.(b.dataset.pick); document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' }); });

  return () => offs.forEach(f => f());
}
