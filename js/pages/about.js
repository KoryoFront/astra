import { icon } from '../icons.js';
import { STORES } from '../data.js';
import { crumbs, toast } from '../ui.js';

const L = 'assets/img/lifestyle/';

export default {
  title: 'About ASTRA',
  render() {
    return `<section style="position:relative;height:88vh;min-height:560px;overflow:hidden;margin-top:calc(var(--nav-h) * -1)">
      <img src="${L}lineup.jpg" alt="The ASTRA X1 Pro, S5 and A3 side by side" data-parallax="-0.12" class="fit-always" style="position:absolute;inset:-8% 0;width:100%;height:116%;object-fit:cover">
      <div style="position:absolute;inset:0;background:linear-gradient(0deg,var(--bg) 4%,rgba(5,5,7,.2) 50%,rgba(5,5,7,.5))"></div>
      <div class="container" style="position:absolute;left:0;right:0;bottom:10%">
        ${crumbs([['Home', '#/'], ['About ASTRA', '#/about']])}
        <h1 class="display-1" data-split>Designed to<br>elevate.</h1>
      </div>
    </section>
    <div class="container">
      <section class="section narrow" style="margin:0 auto">
        <p class="eyebrow" data-reveal>Our story</p>
        <p class="h2" style="margin-top:18px;font-weight:300;line-height:1.25" data-reveal>ASTRA was founded in 2019 by a small team of engineers and industrial designers who believed a smartphone should feel as considered as a fine watch — and stay useful for just as long.</p>
        <p class="lead" style="margin-top:24px" data-reveal>Today, ASTRA phones are used by more than 40 million people in 62 countries. We design every product in our studios in London and Tokyo, write our own silicon, and support every flagship with seven years of updates.</p>
      </section>
      <section class="grid-cards" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))" data-stagger=".08">
        ${[['40', 'M+', 'people use ASTRA'], ['62', '', 'countries'], ['7', ' yrs', 'of software updates'], ['100', '%', 'renewable energy in our offices']].map(([n, s, l]) => `<div class="card card-pad" data-reveal><div class="big-num"><span data-count="${n}">0</span>${s}</div><p class="muted" style="margin-top:8px">${l}</p></div>`).join('')}
      </section>
      <section class="section">
        <div class="bento">
          <div class="b-span-4 card shade-t" data-reveal style="min-height:520px"><img class="bimg" src="${L}studio.jpg" alt="ASTRA design studio" loading="lazy"><div class="bcap bottom"><p class="eyebrow">Design</p><h2 class="h2" style="margin-top:8px">Obsessed with the details.</h2><p class="muted" style="margin-top:8px;max-width:520px">Each ASTRA goes through more than 400 prototypes. We machine titanium to tolerances of 10 microns and tune every haptic by hand.</p></div></div>
          <div class="b-span-2 card card-pad" data-reveal style="display:flex;flex-direction:column;justify-content:space-between;min-height:520px">${icon('chip').replace('<svg', '<svg style="width:40px;height:40px"')}<div><h3 class="h3">Our own silicon</h3><p class="muted" style="margin-top:10px">The Nova chip family is designed in-house, so hardware, AstraOS and Astra AI work as one.</p></div></div>
        </div>
      </section>
      <section class="section-sm" id="sustainability">
        <div class="card" style="border-radius:var(--radius-lg);overflow:hidden;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr))" data-reveal>
          <div style="aspect-ratio:16/9;align-self:center;position:relative;max-width:100%"><img src="${L}sustainability.jpg" alt="Recycled materials and plant-fibre packaging" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></div>
          <div class="card-pad" style="padding:clamp(28px,5vw,56px)">
            <p class="eyebrow">A more sustainable ASTRA</p>
            <h2 class="h2" style="margin-top:12px">Responsible technology.</h2>
            <div class="stack" style="--stack:18px;margin-top:24px">
              ${[['recycle', '100% recycled aluminium', 'in every S and A Series frame, and 75% recycled titanium in X1 Pro.'], ['leaf', 'Plastic-free packaging', 'made from FSC-certified plant fibre since 2023.'], ['refresh', 'Built to last', 'with 7 years of updates, user-replaceable batteries in A Series and our trade-in programme.'], ['globe', 'Carbon neutral by 2030', 'across our entire supply chain.']].map(([i, b, s]) => `<div class="row" style="flex-wrap:nowrap;align-items:flex-start;gap:14px">${icon(i).replace('<svg', '<svg style="width:24px;height:24px;flex-shrink:0;margin-top:2px"')}<p><b style="font-weight:500">${b}</b> <span class="muted">${s}</span></p></div>`).join('')}
            </div>
          </div>
        </div>
      </section>
      <section class="section-sm" id="stores">
        <div class="bento">
          <div class="b-span-4 card shade-t" data-reveal style="min-height:440px"><img class="bimg" src="${L}store.jpg" alt="ASTRA flagship store" loading="lazy"><div class="bcap bottom"><p class="eyebrow">Visit us</p><h2 class="h2" style="margin-top:8px">ASTRA flagship stores.</h2></div></div>
          <div class="b-span-2 card card-pad" data-reveal><div class="stack" style="--stack:18px">${STORES.map(s => `<div><b>${s.city}</b><p class="muted" style="font-size:14px">${s.addr}<br>${s.hours} daily</p></div>`).join('')}</div><button class="btn btn-ghost btn-sm" style="margin-top:20px" id="bookVisit">Book a session</button></div>
        </div>
      </section>
      <section class="section-sm grid-cards" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr));margin-bottom:60px">
        <div class="card card-pad" id="careers" data-reveal><p class="eyebrow">Careers</p><h3 class="h3" style="margin-top:10px">Build what's next.</h3><p class="muted" style="margin-top:8px">48 open roles across design, silicon, AI and retail.</p><button class="link" style="margin-top:16px" data-msg="Our careers portal opens soon. Check back for new roles.">See open roles ${icon('arrow')}</button></div>
        <div class="card card-pad" id="press" data-reveal><p class="eyebrow">Newsroom</p><h3 class="h3" style="margin-top:10px">ASTRA unveils X1 Pro.</h3><p class="muted" style="margin-top:8px">24 Sep 2026 — Titanium design, Nova G3 and a 200 MP camera system.</p><a class="link" style="margin-top:16px" href="#/phone/x1-pro">Read more ${icon('arrow')}</a></div>
        <div class="card card-pad" data-reveal><p class="eyebrow">Investors</p><h3 class="h3" style="margin-top:10px">FY2026 results.</h3><p class="muted" style="margin-top:8px">Revenue up 31% year on year. Full report available to shareholders.</p><button class="link" style="margin-top:16px" data-msg="The FY2026 annual report will be published on 15 December.">Learn more ${icon('arrow')}</button></div>
      </section>
    </div>`;
  },
  mount(root) {
    root.addEventListener('click', e => { const b = e.target.closest('[data-msg]'); if (b) toast(b.dataset.msg); });
    root.querySelector('#bookVisit').onclick = () => toast('Session request received. A store specialist will email you shortly.');
  },
};
