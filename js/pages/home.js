import { icon } from '../icons.js';
import { PHONES, ACCESSORIES, SERIES, fromPrice } from '../data.js';
import { phoneCard, accessoryCard, wireCards } from '../ui.js';
import { onScroll, sectionProgress, range, lerp, ease, reduce, finePointer } from '../fx.js';
import * as store from '../store.js';
import { phone3d } from '../phone3d.js';

const RING = [
  ['x1-pro', 'x-back.webp'], ['x1', 'x-front.webp'], ['s5-plus', 's-back.webp'], ['s5', 's-front.webp'], ['a3', 'a-back.webp'], ['a3-lite', 'a-front.webp'],
];

const P = 'assets/img/products/';
const H = 'assets/img/hero/';
const L = 'assets/img/lifestyle/';

const STATEMENT = 'Aerospace titanium. A *200 MP* camera that sees in the dark. A *Nova G3* chip that thinks on-device — privately. Two days of battery. *This is ASTRA.*';

const SCENES = [
  { img: H + 'hero-bg.jpg', t: 'Built for the edge.', s: 'IP68 + IP69 sealed, Shield Glass Ultra and a Grade 5 titanium frame. Take it anywhere.' },
  { img: P + 'x-night.jpg', t: 'Night, unlocked.', s: 'A 1/1.3″ sensor and Night Vision Pro pull detail out of the dark — handheld, in seconds.' },
  { img: P + 'x-lifestyle.jpg', t: 'Portraits, perfected.', s: 'A 5× periscope with natural bokeh and Astra AI skin-tone mapping for every complexion.' },
  { img: P + 'x-display.jpg', t: 'Colour that glows.', s: '3,000 nits, 1–144 Hz LTPO and 10-bit colour. Brilliant in sunlight, gentle at night.' },
];

export default {
  title: '',
  render() {
    const featured = ['x1-pro', 's5-plus', 'a3'].map(id => PHONES.find(p => p.id === id));
    // Words wrapped in *asterisks* (may span several words) get the highlight gradient
    let inHl = false;
    const wordsHtml = STATEMENT.split(' ').map(w => {
      const starts = w.startsWith('*'), ends = /\*[.,]?$/.test(w);
      if (starts) inHl = true;
      const html = `<span class="w${inHl ? ' hi' : ''}">${w.replace(/\*/g, '')}</span>`;
      if (ends) inHl = false;
      return html;
    }).join(' ');

    return `
<section class="lhero" id="lhero" aria-label="ASTRA X1 Pro">
  <div class="lhero-sticky">
    <div class="lh lh-bg lh-bg-in"><img src="${H}hero-bg.jpg" srcset="${H}hero-bg-sm.jpg 1280w, ${H}hero-bg.jpg 2560w" sizes="100vw" alt="" fetchpriority="high" id="lhBg"></div>
    <div class="lh lh-sky" id="lhSky"></div>
    <div class="lh lh-phones"><div class="lh-phones-in"><img src="${H}hero-phones.webp" alt="ASTRA X1 Pro in Graphite Titanium, back and front" id="lhPhones"></div></div>
    <div class="lh lh-fg"><img src="${H}hero-fg.webp" alt="" id="lhFg"></div>
    <div class="lh lh-fade"></div>
    <div class="lh-content" id="lhContent">
      <a href="#/phone/x1-pro" class="pill-label" style="align-self:flex-start;margin-bottom:26px;animation:fadeUp .9s .2s both"><b>New</b> X1 Pro — available now ${icon('chevR').replace('<svg', '<svg style="width:14px;height:14px"')}</a>
      <h1 class="lh-title" data-split><span class="thin">ASTRA</span> X1 Pro</h1>
      <p class="lh-sub" data-split data-delay=".25">Power. Intelligence. Elegance.</p>
      <div class="lh-specs">
        ${[['Nova G3', '3 nm Astra AI'], ['200 MP', 'Pro camera'], ['5,500', 'mAh battery'], ['144 Hz', 'AMOLED']].map(([b, s], i) => `<div style="animation-delay:${0.7 + i * 0.08}s"><b>${b}</b><span>${s}</span></div>`).join('')}
      </div>
      <div class="row" style="gap:12px;animation:fadeUp .9s 1s both">
        <a href="#/phone/x1-pro" class="btn btn-primary btn-lg" data-magnetic>Buy from ${store.money(1199)} ${icon('arrow', 'arrow')}</a>
        <a href="#/compare?ids=x1-pro,x1,s5-plus" class="btn btn-ghost btn-lg">Compare models</a>
      </div>
    </div>
    <div class="lh-scroll" aria-hidden="true">Scroll<i></i></div>
    <div class="lh lh-dim" id="lhDim"></div>
  </div>
</section>

<section class="statement" id="statement" aria-label="Introduction">
  <div class="statement-sticky"><div class="container"><p id="stmt">${wordsHtml}</p></div></div>
</section>

<section class="container" aria-label="Series" style="padding-bottom:clamp(60px,9vw,120px)">
  <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:28px">
    <div><p class="eyebrow">The family</p><h2 class="display-2" style="margin-top:10px" data-split>Three series.<br><span class="muted">One standard.</span></h2></div>
    <a href="#/phones" class="link" data-reveal>Shop all phones ${icon('arrow')}</a>
  </div>
  <div class="series-tall" data-stagger=".1">
    ${Object.values(SERIES).map(s => {
      const ps = PHONES.filter(p => p.series === s.id), p = ps[0];
      return `<a class="st-card" href="#/phones?series=${s.id}" data-reveal>
        <div class="st-media"><img src="${p.colors[0].img}" alt="${s.name}" loading="lazy"></div>
        <div class="st-foot"><div><span class="eyebrow">${ps.map(x => x.name.replace('ASTRA ', '')).join(' · ')}</span><h3 style="margin-top:6px">${s.name.replace('ASTRA ', '')}</h3><p class="muted" style="margin-top:4px">${s.tagline} · From ${store.money(Math.min(...ps.map(fromPrice)))}</p></div><span class="go">${icon('arrow')}</span></div>
      </a>`;
    }).join('')}
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">${Array(2).fill(['Aerospace titanium', '200 MP Pro camera', 'Nova G3 · 3 nm', '7 years of updates', 'Astra AI on-device', '90 W HyperCharge', 'IP68 + IP69'].map(t => `<span>${t}</span>`).join('')).join('')}</div></div>

<!-- 3D rotation storytelling: phone turns while type and grid slide behind it -->
<section class="story" id="story" aria-label="X1 Pro design">
  <div class="story-sticky">
    <div class="story-grid" id="storyGrid"></div>
    <div class="story-word" id="storyWord">TITANIUM · TITANIUM ·</div>
    <div class="story-title" id="storyTitle">
      <p class="eyebrow">Design</p>
      <h2 class="display-2" style="margin-top:12px">Forged in titanium.</h2>
    </div>
    ${phone3d({ front: P + 'x-front.webp', back: P + 'x-back.webp', frame: '#5b5d63', id: 'phone3d', alt: 'ASTRA X1 Pro' })}
    <div class="story-callouts">
      <div class="callout c-l1" data-at=".12"><span class="num">6.8″</span><p>LTPO AMOLED that adapts from 1 to 144 Hz and peaks at 3,000 nits.</p></div>
      <div class="callout c-r1" data-at=".32"><span class="num">8.2 mm</span><p>Grade 5 titanium frame. Strong, light, and sculpted to disappear in your hand.</p></div>
      <div class="callout c-l2" data-at=".52"><span class="num">Triple</span><p>Pro camera island with 200 MP main, 50 MP ultra wide and 5× periscope.</p></div>
      <div class="callout c-r2" data-at=".72"><span class="num">IP69</span><p>Frosted matte glass, sealed against dust, water and high-pressure jets.</p></div>
    </div>
    <div class="story-progress" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  </div>
</section>

<!-- Scenes: the phone holds still while worlds change behind it -->
<section class="scenes" id="scenes" aria-label="Shot on ASTRA">
  <div class="scenes-sticky">
    ${SCENES.map((s, i) => `<div class="scene" data-i="${i}"><img class="scene-blur" src="${s.img}" alt="" aria-hidden="true" loading="lazy"><img class="scene-img" src="${s.img}" alt="" loading="${i ? 'lazy' : 'eager'}"></div>`).join('')}
    <div class="scenes-head"><div class="container"><p class="eyebrow">Shot on ASTRA X1 Pro</p></div></div>
    <div class="scenes-phone"><img src="${P}x-front.webp" alt="ASTRA X1 Pro" id="scenesPhone"></div>
    <div class="scenes-copy">${SCENES.map((s, i) => `<div class="scene-cap${i ? '' : ' on'}"><span class="num">0${i + 1} / 0${SCENES.length}</span><h3>${s.t}</h3><p>${s.s}</p></div>`).join('')}</div>
    <div class="scenes-bar"><i id="scenesBar"></i></div>
  </div>
</section>

<!-- Camera zoom reveal -->
<section class="zoom-section" id="zoom" aria-label="Camera">
  <div class="zoom-sticky">
    <img src="${P}x-macro.jpg" alt="Close-up of the X1 Pro triple camera" id="zoomImg">
    <div class="shade"></div>
    <div class="zoom-text"><div class="container">
      <p class="eyebrow">Pro camera system</p>
      <h2 class="display-2" style="margin-top:14px;max-width:900px">200 megapixels.<br><span class="muted">See what others miss.</span></h2>
      <div class="zoom-stats">
        <div><b>1/1.3″</b><span>Main sensor</span></div>
        <div><b>5×</b><span>Optical periscope</span></div>
        <div><b>100×</b><span>AstraZoom</span></div>
        <div><b>8K</b><span>Dolby Vision video</span></div>
      </div>
    </div></div>
  </div>
</section>

<!-- Performance bento -->
<section class="section" aria-label="Performance">
  <div class="container">
    <div class="bento">
      <div class="b-span-6 card" style="min-height:min(72vh,660px)" data-reveal="scale">
        <img class="bimg" src="${P}x-chip.jpg" alt="ASTRA Nova G3 chip" loading="lazy" data-parallax="0.06" style="inset:-6% 0;height:112%">
        <div class="bcap" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;z-index:2;background:linear-gradient(180deg,rgba(0,0,0,.55),transparent 40%,rgba(0,0,0,.7))">
          <div><p class="eyebrow">Nova G3 · 3 nm</p><h2 class="display-2" style="margin-top:12px" data-split>The mind<br>behind the magic.</h2></div>
          <div class="row" style="gap:clamp(24px,6vw,80px);align-items:flex-end">
            <div><div class="big-num"><span data-count="78">0</span></div><span class="muted">TOPS neural engine</span></div>
            <div><div class="big-num"><span data-count="40">0</span>%</div><span class="muted">faster CPU</span></div>
            <div><div class="big-num"><span data-count="2.1">0</span>×</div><span class="muted">ray-traced graphics</span></div>
          </div>
        </div>
      </div>
      <div class="b-span-4 card ai-card" data-reveal>
        <div class="ai-head"><p class="eyebrow">Astra AI</p><h3 class="h2" style="margin-top:10px">Private by design.</h3><p class="muted" style="margin-top:10px">Everything runs on the Nova G3 neural engine, so your calls, photos and notes never leave the phone.</p></div>
        <div class="ai-demos">
          <div class="ai-demo">
            <span class="ai-label">Live Translate</span>
            <div class="bubble in">Where's the nearest station?</div>
            <div class="bubble out" lang="ja">最寄りの駅はどこですか？</div>
            <span class="ai-meta">40 languages, during calls</span>
          </div>
          <div class="ai-demo">
            <span class="ai-label">Smart Summaries</span>
            <div class="ai-lines"><i></i><i></i><i></i><i></i></div>
            <ul class="ai-sum"><li>Flight moved to 9:40</li><li>Now leaving gate B12</li><li>Lounge access included</li></ul>
          </div>
          <div class="ai-demo">
            <span class="ai-label">Call Notes</span>
            <div class="ai-wave">${Array.from({ length: 22 }, (_, i) => `<i style="--h:${[30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 25, 65, 85, 40, 75, 55, 90, 35, 60, 45, 70, 30][i]}%;--d:${(i * 0.05).toFixed(2)}s"></i>`).join('')}</div>
            <span class="ai-meta">3 action items saved</span>
          </div>
        </div>
      </div>
      <div class="b-span-2 card bat-card" data-reveal>
        <p class="eyebrow">Battery</p>
        <div class="bat-big"><span data-count="2">0</span><small>days</small></div>
        <p class="muted">5,500 mAh silicon-carbon cell. Video playback up to 31 hours.</p>
        <div class="bat-charge">
          <div class="bat-shell"><i data-fill="100"></i></div>
          <div class="bat-ticks"><span>0%</span><span>50% · 12 min</span><span>100% · 29 min</span></div>
        </div>
        <p class="dim" style="font-size:13px">90 W HyperCharge · 50 W AstraMag wireless</p>
      </div>
      <div class="b-span-4 card upd-card" data-reveal>
        <div class="upd-head">
          <div><p class="eyebrow">AstraOS</p><h3 class="h2" style="margin-top:10px">Seven years of upgrades.</h3><p class="muted" style="margin-top:10px;max-width:440px">New AstraOS versions, Astra AI features and monthly security patches for every X Series phone until 2033.</p></div>
          <div class="upd-big"><span data-count="7">0</span><small>years</small></div>
        </div>
        <div class="upd-track">
          <div class="upd-line"><i data-fill="100"></i></div>
          <ol class="upd-steps">${Array.from({ length: 8 }, (_, i) => `<li class="${i ? '' : 'now'}" style="--d:${(i * 0.25).toFixed(2)}s"><b><em>AstraOS </em>${6 + i}</b><span>${i ? 2026 + i : 'Today'}</span></li>`).join('')}</ol>
        </div>
        <div class="upd-feats"><span>${icon('shield')} Monthly security patches</span><span>${icon('sparkle')} New Astra AI features</span><span>${icon('refresh')} Free version upgrades</span></div>
      </div>
      <a href="#/phone/x1-pro" class="b-span-2 card side-card" data-reveal>
        <img src="${P}x-side.jpg" alt="X1 Pro titanium side profile" loading="lazy">
        <div class="bcap"><p class="eyebrow">Design</p><h3 class="h3" style="margin-top:6px">8.2 mm of titanium.</h3></div>
      </a>
    </div>
  </div>
</section>

<!-- 3D lineup ring -->
<section class="lineup" id="ring" aria-label="The ASTRA lineup">
  <div class="lineup-sticky">
    <div class="lineup-head container"><p class="eyebrow">The lineup</p><h2 class="display-2" style="margin-top:10px">Six phones. Turn to explore.</h2></div>
    <div class="lineup-stage"><div class="lineup-floor"></div><div class="lineup-rot" id="ringRot">
      ${RING.map(([id, img], i) => { const ph = PHONES.find(x => x.id === id); return `<a class="lineup-item" href="#/phone/${id}" style="--i:${i}" aria-label="${ph.name}"><img src="${P}${img}" alt="${ph.name}" loading="lazy"></a>`; }).join('')}
    </div></div>
    <div class="lineup-label" id="ringLabel"></div>
  </div>
</section>

<!-- Lineup -->
<section class="section-sm" aria-label="Lineup">
  <div class="container">
    <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:40px">
      <div><p class="eyebrow">Best sellers</p><h2 class="display-2" style="margin-top:12px" data-split>Find your ASTRA.</h2></div>
      <a href="#/phones" class="link" data-reveal>Shop all phones ${icon('arrow')}</a>
    </div>
    <div class="grid-cards" id="featured" data-stagger=".1">${featured.map(p => phoneCard(p)).join('')}</div>
  </div>
</section>

<!-- Accessories -->
<section class="section-sm" aria-label="Accessories">
  <div class="container">
    <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:32px">
      <div><p class="eyebrow">Accessories</p><h2 class="h2" style="margin-top:10px">Complete the experience.</h2></div>
      <a href="#/accessories" class="link">All accessories ${icon('arrow')}</a>
    </div>
    <div class="grid-cards" id="accs" data-stagger=".08">${ACCESSORIES.slice(0, 4).map(accessoryCard).join('')}</div>
  </div>
</section>

<!-- Trade-in band -->
<section class="section-sm">
  <div class="container">
    <div class="card" style="border-radius:var(--radius-lg);overflow:hidden;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:center" data-reveal="scale">
      <div style="padding:clamp(28px,5vw,64px)">
        <p class="eyebrow">Trade in & upgrade</p>
        <h2 class="h2" style="margin-top:12px">Get up to $860 off X1 Pro.</h2>
        <p class="lead" style="margin-top:14px">Trade in your eligible smartphone and get an extra $100 upgrade bonus when you switch to the X Series.</p>
        <div class="row" style="margin-top:28px;gap:14px"><a href="#/trade-in" class="btn btn-primary">Get your estimate ${icon('arrow', 'arrow')}</a><a href="#/phone/x1-pro" class="btn btn-ghost">Buy X1 Pro</a></div>
      </div>
      <div style="height:100%;min-height:340px;position:relative;overflow:hidden"><img src="assets/img/hero/hero-bg-sm.jpg" alt="" loading="lazy" style="position:absolute;inset:-8% 0;width:100%;height:116%;object-fit:cover" data-parallax="0.08"><img src="${L}lineup-cut.webp" alt="The ASTRA lineup" loading="lazy" style="position:absolute;inset:8% 6%;width:88%;height:84%;object-fit:contain;filter:drop-shadow(0 30px 40px rgba(0,0,0,.5))"></div>
    </div>
  </div>
</section>`;
  },

  mount(root) {
    wireCards(root.querySelector('#featured'));
    wireCards(root.querySelector('#accs'));
    const offs = [];
    const mobile = () => innerWidth <= 720;

    // Progress bars fill when visible
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.fill + '%'; io.unobserve(e.target); } }), { threshold: .5 });
    root.querySelectorAll('[data-fill]').forEach(el => io.observe(el));
    offs.push(() => io.disconnect());

    /* ---- Layered hero: background, phones and rocks travel at different speeds ---- */
    const hero = root.querySelector('#lhero');
    const bg = root.querySelector('#lhBg'), ph = root.querySelector('#lhPhones'), fg = root.querySelector('#lhFg');
    const content = root.querySelector('#lhContent'), dim = root.querySelector('#lhDim');
    let mx = 0, my = 0, tmx = 0, tmy = 0, heroP = 0, raf = 0;
    const paintHero = () => {
      const p = heroP, e = ease(p);
      if (!reduce) {
        bg.style.transform = `translate3d(${(-mx * 8).toFixed(1)}px, ${(p * 5 - my * 6).toFixed(2)}vh, 0) scale(${(1.04 + e * 0.14).toFixed(4)})`;
        ph.style.transform = `translate3d(${(mx * 22).toFixed(1)}px, calc(${(-e * (mobile() ? 16 : 30)).toFixed(2)}vh + ${(my * 14).toFixed(1)}px), 0) rotate(${(-e * 7 + mx * 1.5).toFixed(2)}deg) scale(${(1 + e * 0.14).toFixed(4)})`;
        fg.style.transform = `translate3d(${(mx * 36).toFixed(1)}px, ${(e * 10).toFixed(2)}vh, 0) scale(${(1 + e * 0.1).toFixed(4)})`;
        content.style.transform = `translate3d(0, ${(-e * 18).toFixed(2)}vh, 0)`;
      }
      content.style.opacity = Math.max(0, 1 - range(p, 0.05, 0.55) * 1.2).toFixed(3);
      dim.style.opacity = (range(p, 0.6, 1) * 0.85).toFixed(3);
    };
    offs.push(onScroll(() => { heroP = sectionProgress(hero); paintHero(); }));
    if (finePointer && !reduce) {
      const loop = () => { mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06; paintHero(); raf = Math.abs(tmx - mx) + Math.abs(tmy - my) > 0.001 ? requestAnimationFrame(loop) : 0; };
      const onMove = e => { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; if (!raf && scrollY < innerHeight) raf = requestAnimationFrame(loop); };
      addEventListener('pointermove', onMove, { passive: true });
      offs.push(() => { removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); });
    }

    /* ---- Statement: words light up as you scroll ---- */
    const st = root.querySelector('#statement'), words = [...root.querySelectorAll('#stmt .w')];
    offs.push(onScroll(() => {
      const p = range(sectionProgress(st), 0.05, 0.85), n = Math.round(p * words.length);
      words.forEach((w, i) => { w.style.opacity = i < n ? 1 : 0.14; });
    }));

    /* ---- 3D story: phone rotates, type and grid move the opposite way ---- */
    const story = root.querySelector('#story'), phone = root.querySelector('#phone3d');
    const word = root.querySelector('#storyWord'), grid = root.querySelector('#storyGrid');
    const title = root.querySelector('#storyTitle'), callouts = [...root.querySelectorAll('.callout')], dots = [...root.querySelectorAll('.story-progress i')];
    offs.push(onScroll(() => {
      const p = sectionProgress(story);
      const rot = reduce ? 0 : lerp(-25, 395, ease(range(p, 0, 0.92)));
      const tilt = Math.sin(p * Math.PI * 2) * 8;
      const scale = lerp(0.8, 1.15, range(p, 0, 0.25)) - range(p, 0.85, 1) * 0.2;
      phone.style.transform = `translateY(${(Math.sin(p * Math.PI) * -3).toFixed(2)}vh) rotateY(${rot.toFixed(2)}deg) rotateX(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      word.style.transform = `translate3d(${lerp(10, -70, p).toFixed(2)}%, -50%, 0)`;
      grid.style.transform = `translate3d(0, ${(-p * 160).toFixed(1)}px, 0)`;
      title.style.opacity = 1 - range(p, 0.05, 0.12);
      callouts.forEach(c => { const at = parseFloat(c.dataset.at); c.classList.toggle('on', p >= at && p < at + 0.24); });
      dots.forEach((d, i) => d.classList.toggle('on', p >= 0.12 + i * 0.2 && p < 0.32 + i * 0.2));
    }));

    /* ---- Scenes: phone stays put while backgrounds wipe and drift behind it ---- */
    const sc = root.querySelector('#scenes'), scenes = [...sc.querySelectorAll('.scene')], caps = [...sc.querySelectorAll('.scene-cap')];
    const sPhone = root.querySelector('#scenesPhone'), bar = root.querySelector('#scenesBar');
    offs.push(onScroll(() => {
      const p = sectionProgress(sc), n = scenes.length, seg = 1 / n;
      scenes.forEach((s, i) => {
        const local = range(p, (i - 0.5) * seg, (i + 0.15) * seg); // wipe in
        if (i) s.style.clipPath = `inset(${((1 - ease(local)) * 100).toFixed(2)}% 0 0 0)`;
        const drift = range(p, (i - 0.5) * seg, (i + 1) * seg);
        s.querySelector('.scene-img').style.transform = `translate3d(0, ${lerp(6, -6, drift).toFixed(2)}%, 0) scale(${lerp(1.15, 1.02, drift).toFixed(3)})`;
      });
      const active = Math.min(n - 1, Math.floor((p + seg * 0.35) / seg));
      caps.forEach((c, i) => c.classList.toggle('on', i === active));
      if (!reduce) sPhone.style.transform = `translate3d(0, ${(Math.sin(p * Math.PI * n) * 2.2).toFixed(2)}vh, 0) rotate(${(Math.sin(p * Math.PI * n) * -2.5).toFixed(2)}deg) rotateY(${lerp(-14, 14, p).toFixed(2)}deg)`;
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
    }));

    /* ---- 3D lineup ring turns with scroll ---- */
    const ring = root.querySelector('#ring'), rot = root.querySelector('#ringRot'), label = root.querySelector('#ringLabel');
    const items = [...rot.children];
    let lastIdx = -1;
    offs.push(onScroll(() => {
      const p = sectionProgress(ring);
      const deg = -ease(range(p, 0.05, 0.95)) * 300;
      rot.style.transform = `translateZ(calc(var(--R) * -1)) rotateX(-6deg) rotateY(${deg.toFixed(2)}deg)`;
      items.forEach((it, i) => {
        const a = ((i * 60 + deg) % 360 + 360) % 360, facing = Math.cos(a * Math.PI / 180);
        it.style.opacity = (0.25 + 0.75 * Math.max(0, facing)).toFixed(3);
        it.firstElementChild.style.filter = `drop-shadow(0 30px 40px rgba(0,0,0,.6)) brightness(${(0.45 + 0.55 * Math.max(0, facing)).toFixed(2)})`;
      });
      const idx = ((Math.round(-deg / 60) % 6) + 6) % 6;
      if (idx !== lastIdx) {
        lastIdx = idx; const ph = PHONES.find(x => x.id === RING[idx][0]);
        label.innerHTML = `<p class="eyebrow">${ph.tier}</p><h3 style="margin-top:6px">${ph.name}</h3><p class="muted" style="margin-top:6px">${ph.tagline} · From ${store.money(fromPrice(ph))}</p><a class="btn btn-ghost btn-sm" style="margin-top:16px" href="#/phone/${ph.id}">Explore ${icon('arrow', 'arrow')}</a>`;
      }
    }));

    /* ---- Camera zoom-out reveal ---- */
    const zoom = root.querySelector('#zoom'), zImg = root.querySelector('#zoomImg'), zt = root.querySelector('.zoom-text');
    offs.push(onScroll(() => {
      const p = sectionProgress(zoom);
      zImg.style.transform = `scale(${lerp(1.7, 1, ease(range(p, 0, 0.7))).toFixed(3)})`;
      zt.style.opacity = range(p, 0.25, 0.5);
      zt.style.transform = `translateY(${lerp(60, 0, ease(range(p, 0.25, 0.6)))}px)`;
    }));

    return () => offs.forEach(f => f());
  },
};
