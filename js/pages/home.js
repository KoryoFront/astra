import { icon } from '../icons.js';
import { PHONES, ACCESSORIES, SERIES } from '../data.js';
import { phoneCard, accessoryCard, wireCards } from '../ui.js';
import { onScroll, sectionProgress, range, lerp, ease, reduce } from '../fx.js';

const P = 'assets/img/products/';

export default {
  title: '',
  render() {
    const featured = ['x1-pro', 's5-plus', 'a3'].map(id => PHONES.find(p => p.id === id));
    return `
<section class="hero" aria-label="ASTRA X1 Pro">
  <div class="hero-media" data-parallax="-0.12"><img src="${P}x-hero.jpg" alt="Two ASTRA X1 Pro smartphones on volcanic rock at dusk" fetchpriority="high"></div>
  <div class="hero-content">
    <span class="chip chip-new" style="align-self:flex-start;margin-bottom:22px;animation:fadeUp .8s .1s both">${icon('sparkle')} New · Available now</span>
    <h1 class="hero-title" data-split><span class="wordmark">ASTRA</span>&nbsp; X1 Pro</h1>
    <p class="hero-sub" data-split data-delay=".25">Power. Intelligence. Elegance.</p>
    <div class="hero-feats">
      ${[['chip', 'Next-Gen<br>Astra AI'], ['camera', '200 MP<br>Pro Camera'], ['battery', 'All-Day<br>Battery'], ['display', 'AMOLED<br>144 Hz Display']].map(([i, t], n) => `<div class="hero-feat" style="animation-delay:${0.6 + n * 0.1}s">${icon(i)}${t}</div>`).join('')}
    </div>
    <div class="row" style="gap:16px;animation:fadeUp .9s 1s both">
      <a href="#/phone/x1-pro" class="btn btn-primary btn-lg" data-magnetic>Explore X1 Pro ${icon('arrow', 'arrow')}</a>
      <a href="#/compare?ids=x1-pro,x1,s5-plus" class="btn btn-ghost btn-lg">Compare Models</a>
    </div>
  </div>
  <div class="scroll-cue" aria-hidden="true"></div>
</section>

<section class="container" style="padding-top:28px">
  <div class="series-grid" data-stagger=".12">
    ${Object.values(SERIES).map(s => {
      const p = PHONES.find(p => p.series === s.id);
      return `<a class="series-card card" href="#/phones?series=${s.id}" data-reveal data-tilt="5">
        <div><h3>${s.name}</h3><p>${s.tagline}</p>${icon('arrow', 'arrow-ico')}</div>
        <img src="${p.colors[0].img}" alt="${s.name}" loading="lazy">
      </a>`;
    }).join('')}
  </div>
  <div class="perks" style="margin-top:28px" data-stagger=".1">
    ${[['truck', 'Fast, Reliable Delivery', 'Free nationwide'], ['shield', 'Astra Care', 'Warranty & support'], ['refresh', 'Trade In & Upgrade', 'Get more for your device'], ['leaf', 'A More Sustainable Astra', 'Responsible technology']].map(([i, b, s], n) => `<a class="perk" href="${['#/faq', '#/warranty', '#/trade-in', '#/about#sustainability'][n]}" data-reveal>${icon(i)}<div><b>${b}</b><span>${s}</span></div></a>`).join('')}
  </div>
</section>

<div class="marquee" aria-hidden="true" style="margin-top:40px"><div class="marquee-track">${Array(2).fill(['Aerospace titanium', '200 MP Pro camera', 'Nova G3 · 3 nm', '7 years of updates', 'Astra AI on-device', '90 W HyperCharge', 'IP68 + IP69'].map(t => `<span>${t}</span>`).join('')).join('')}</div></div>

<!-- 3D rotation storytelling -->
<section class="story" id="story" aria-label="X1 Pro design">
  <div class="story-sticky">
    <div class="story-bg"></div><div class="story-glow" id="storyGlow"></div>
    <div class="story-title" id="storyTitle">
      <p class="eyebrow">Design</p>
      <h2 class="display-2" style="margin-top:12px">Forged in <span class="silver-text">titanium</span>.</h2>
    </div>
    <div class="phone3d-wrap"><div class="phone3d" id="phone3d">
      <div class="face front"><img src="${P}x-front.webp" alt="ASTRA X1 Pro front"></div>
      <div class="edge"></div>
      <div class="face back"><img src="${P}x-back.webp" alt="ASTRA X1 Pro back"></div>
    </div></div>
    <div class="story-callouts">
      <div class="callout c-l1" data-at=".12"><span class="num">6.8″</span><p>LTPO AMOLED that adapts from 1 to 144 Hz and peaks at 3,000 nits.</p></div>
      <div class="callout c-r1" data-at=".32"><span class="num">8.2 mm</span><p>Grade 5 titanium frame. Strong, light, and sculpted to disappear in your hand.</p></div>
      <div class="callout c-l2" data-at=".52"><span class="num">Triple</span><p>Pro camera island with 200 MP main, 50 MP ultra wide and 5× periscope.</p></div>
      <div class="callout c-r2" data-at=".72"><span class="num">IP69</span><p>Frosted matte glass, sealed against dust, water and high-pressure jets.</p></div>
    </div>
    <div class="story-progress" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  </div>
</section>

<!-- Camera zoom reveal -->
<section class="zoom-section" id="zoom" aria-label="Camera">
  <div class="zoom-sticky">
    <img src="${P}x-macro.jpg" alt="Close-up of the X1 Pro triple camera" id="zoomImg">
    <div class="shade"></div>
    <div class="zoom-text"><div class="container">
      <p class="eyebrow" id="zoomEyebrow">Pro camera system</p>
      <h2 class="display-2" style="margin-top:14px;max-width:900px" id="zoomTitle">200 megapixels.<br><span class="muted">See what others miss.</span></h2>
      <div class="zoom-stats" id="zoomStats">
        <div><b>1/1.3″</b><span>Main sensor</span></div>
        <div><b>5×</b><span>Optical periscope</span></div>
        <div><b>100×</b><span>AstraZoom</span></div>
        <div><b>8K</b><span>Dolby Vision video</span></div>
      </div>
    </div></div>
  </div>
</section>

<!-- Chip -->
<section class="section" aria-label="Performance">
  <div class="container">
    <div class="bento">
      <div class="b-span-6 card" style="min-height:min(70vh,640px)" data-reveal="scale">
        <img class="bimg" src="${P}x-chip.jpg" alt="ASTRA Nova G3 chip" loading="lazy" data-parallax="0.06" style="inset:-6% 0">
        <div class="bcap" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;z-index:2">
          <div><p class="eyebrow">Nova G3 · 3 nm</p><h2 class="display-2" style="margin-top:12px" data-split>The mind<br>behind the magic.</h2></div>
          <div class="row" style="gap:clamp(24px,6vw,80px);align-items:flex-end">
            <div><div class="big-num"><span data-count="78">0</span></div><span class="muted">TOPS neural engine</span></div>
            <div><div class="big-num"><span data-count="40">0</span>%</div><span class="muted">faster CPU</span></div>
            <div><div class="big-num"><span data-count="2.1">0</span>×</div><span class="muted">ray-traced graphics</span></div>
          </div>
        </div>
      </div>
      <div class="b-span-3 card" data-reveal style="padding:32px;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(circle at 80% 0%,rgba(185,198,255,.16),transparent 60%),linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.01))">
        <div>${icon('ai')}<h3 class="h3" style="margin-top:20px">Astra AI. Private by design.</h3><p class="muted" style="margin-top:10px">Live Translate calls in 40 languages, summarise anything, erase distractions from photos — all on-device.</p></div>
        <div class="row" style="margin-top:28px;flex-wrap:wrap;gap:8px">${['Live Translate', 'Magic Eraser Pro', 'Smart Summaries', 'Circle Search', 'Call Notes'].map(t => `<span class="chip">${t}</span>`).join('')}</div>
      </div>
      <div class="b-span-3 card" data-reveal style="padding:32px">
        ${icon('battery')}<h3 class="h3" style="margin-top:20px">Two days. One charge.</h3>
        <p class="muted" style="margin-top:10px">A 5,500 mAh silicon-carbon battery, and 90 W HyperCharge that fills it in just 29 minutes.</p>
        <div style="margin-top:28px"><div class="row" style="justify-content:space-between;font-size:14px"><span class="muted">0–100%</span><b>29 min</b></div><div class="progress-bar" style="margin-top:8px"><i data-fill="100"></i></div>
        <div class="row" style="justify-content:space-between;font-size:14px;margin-top:16px"><span class="muted">Video playback</span><b>31 hrs</b></div><div class="progress-bar" style="margin-top:8px"><i data-fill="86"></i></div></div>
      </div>
      <a href="#/phone/x1-pro" class="b-span-4 card shade-t" data-reveal style="min-height:420px">
        <img class="bimg" src="${P}x-display.jpg" alt="X1 Pro display" loading="lazy">
        <div class="bcap bottom"><p class="eyebrow">Display</p><h3 class="h2" style="margin-top:8px">3,000 nits of brilliance.</h3></div>
      </a>
      <div class="b-span-2 card" data-reveal style="padding:32px;display:flex;flex-direction:column;justify-content:flex-end;min-height:420px;background:linear-gradient(160deg,#1a1c24,#0a0a0d)">
        <div class="big-num"><span data-count="7">0</span></div><h3 class="h3" style="margin-top:8px">years of updates</h3><p class="muted" style="margin-top:8px">New AstraOS features and security patches until 2033.</p>
      </div>
    </div>
  </div>
</section>

<!-- Horizontal gallery -->
<section class="hscroll" id="hscroll" aria-label="Shot on ASTRA">
  <div class="hscroll-sticky">
    <div class="container" style="margin-bottom:32px"><p class="eyebrow">Shot on ASTRA</p><h2 class="display-2" style="margin-top:12px">Moments, <span class="muted">masterfully kept.</span></h2></div>
    <div class="hscroll-track" id="hTrack">
      ${[['x-night.jpg', 'Night Vision Pro', 'Shot on X1 Pro · 1/1.3″ sensor'], ['x-lifestyle.jpg', 'Portrait Studio', 'Shot on X1 Pro · 85 mm portrait'], ['s-lifestyle.jpg', 'Group Selfie AI', 'Shot on S5 Plus · Ultra-wide front'], ['a-lifestyle.jpg', 'Everyday Brilliance', 'Shot on A3 · 50 MP AI camera'], ['x-display.jpg', 'Living Colour', 'X1 Pro · 10-bit AMOLED']].map(([img, t, s]) => `<figure class="hpanel" style="margin:0"><img src="${P}${img}" alt="${t}" loading="lazy"><figcaption class="cap"><h3 class="h3">${t}</h3><p class="muted" style="font-size:14px;margin-top:4px">${s}</p></figcaption></figure>`).join('')}
    </div>
  </div>
</section>

<!-- Lineup -->
<section class="section" aria-label="Lineup">
  <div class="container">
    <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:40px">
      <div><p class="eyebrow" data-reveal>The lineup</p><h2 class="display-2" style="margin-top:12px" data-split>Find your ASTRA.</h2></div>
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
        <h2 class="h2" style="margin-top:12px">Get up to <span class="silver-text">$860</span> off X1 Pro.</h2>
        <p class="lead" style="margin-top:14px">Trade in your eligible smartphone and get an extra $100 upgrade bonus when you switch to the X Series.</p>
        <div class="row" style="margin-top:28px;gap:14px"><a href="#/trade-in" class="btn btn-primary">Get your estimate ${icon('arrow', 'arrow')}</a><a href="#/phone/x1-pro" class="btn btn-ghost">Buy X1 Pro</a></div>
      </div>
      <div style="height:100%;min-height:320px;position:relative;overflow:hidden"><img src="${P}x-silver.jpg" alt="ASTRA X1 Pro in Silver Frost" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%" data-parallax="0.08"></div>
    </div>
  </div>
</section>`;
  },

  mount(root) {
    wireCards(root.querySelector('#featured'));
    wireCards(root.querySelector('#accs'));
    const offs = [];

    // Progress bars fill when visible
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.fill + '%'; io.unobserve(e.target); } }), { threshold: .5 });
    root.querySelectorAll('[data-fill]').forEach(el => io.observe(el));
    offs.push(() => io.disconnect());

    // 3D phone rotation story
    const story = root.querySelector('#story'), phone = root.querySelector('#phone3d'), glow = root.querySelector('#storyGlow');
    const title = root.querySelector('#storyTitle'), callouts = [...root.querySelectorAll('.callout')], dots = [...root.querySelectorAll('.story-progress i')];
    offs.push(onScroll(() => {
      const p = sectionProgress(story);
      const rot = reduce ? 0 : lerp(-25, 395, ease(range(p, 0, 0.92)));
      const tilt = Math.sin(p * Math.PI * 2) * 8;
      const scale = lerp(0.8, 1.15, range(p, 0, 0.25)) - range(p, 0.85, 1) * 0.2;
      phone.style.transform = `rotateY(${rot.toFixed(2)}deg) rotateX(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      glow.style.transform = `scale(${(0.8 + p * 0.8).toFixed(3)})`;
      title.style.opacity = 1 - range(p, 0.05, 0.12);
      callouts.forEach((c, i) => { const at = parseFloat(c.dataset.at); c.classList.toggle('on', p >= at && p < at + 0.24); });
      dots.forEach((d, i) => d.classList.toggle('on', p >= 0.12 + i * 0.2 && p < 0.32 + i * 0.2));
    }));

    // Camera zoom-out reveal
    const zoom = root.querySelector('#zoom'), zImg = root.querySelector('#zoomImg'), zt = root.querySelector('.zoom-text');
    offs.push(onScroll(() => {
      const p = sectionProgress(zoom);
      zImg.style.transform = `scale(${lerp(1.7, 1, ease(range(p, 0, 0.7))).toFixed(3)})`;
      zt.style.opacity = range(p, 0.25, 0.5);
      zt.style.transform = `translateY(${lerp(60, 0, ease(range(p, 0.25, 0.6)))}px)`;
    }));

    // Horizontal scroll gallery
    const hs = root.querySelector('#hscroll'), track = root.querySelector('#hTrack');
    offs.push(onScroll(() => {
      const p = sectionProgress(hs);
      const max = track.scrollWidth - innerWidth;
      track.style.transform = `translate3d(${(-max * ease(p)).toFixed(1)}px,0,0)`;
    }));

    return () => offs.forEach(f => f());
  },
};
