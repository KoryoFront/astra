// Animation engine: reveal-on-scroll, scroll-linked scenes, tilt, counters, split text.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

let scrollFns = new Set();
let ticking = false;
let io;

function frame() {
  ticking = false;
  const y = window.scrollY, vh = window.innerHeight;
  scrollFns.forEach(fn => fn(y, vh));
}
function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
addEventListener('scroll', requestFrame, { passive: true });
addEventListener('resize', requestFrame, { passive: true });

/** Register a scroll-linked callback (y, viewportHeight). Returns unregister fn. */
export function onScroll(fn) { scrollFns.add(fn); requestFrame(); return () => scrollFns.delete(fn); }
export function resetScrollFns() { scrollFns = new Set(); }

/** Progress (0..1) of an element's scroll through the viewport while sticky */
export function sectionProgress(el) {
  const r = el.getBoundingClientRect();
  const total = r.height - innerHeight;
  return total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total));
}
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const range = (p, start, end) => clamp((p - start) / (end - start));
export const ease = t => 1 - Math.pow(1 - t, 3);

/** Wrap each line of [data-split] text into masked spans */
function split(root) {
  root.querySelectorAll('[data-split]:not(.split-done)').forEach(el => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map((l, i) => `<span class="split-line"><span style="--d:${(i * 0.09 + (parseFloat(el.dataset.delay) || 0)).toFixed(2)}s">${l}</span></span>`).join('');
    el.classList.add('split-done');
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'fade');
  });
}

function counters(el) {
  el.querySelectorAll('[data-count]').forEach(c => {
    if (c.dataset.counted) return; c.dataset.counted = 1;
    const target = parseFloat(c.dataset.count), dec = (c.dataset.count.split('.')[1] || '').length;
    const plain = c.hasAttribute('data-plain');
    const fmt = v => plain ? v.toFixed(dec) : Number(v.toFixed(dec)).toLocaleString('en-US', { minimumFractionDigits: dec });
    if (reduce) { c.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 1600;
    const step = now => { const t = clamp((now - t0) / dur); c.textContent = fmt(target * ease(t)); if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
}

export function initReveal(root = document) {
  split(root);
  if (io) io.disconnect();
  io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); counters(e.target); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  root.querySelectorAll('[data-reveal]:not(.in)').forEach(el => io.observe(el));
  root.querySelectorAll('[data-stagger]').forEach(parent => {
    [...parent.children].forEach((c, i) => { c.style.setProperty('--d', (i * (parseFloat(parent.dataset.stagger) || 0.08)).toFixed(2) + 's'); });
  });
}

/** Parallax: [data-parallax="0.2"] moves at fraction of scroll relative to its section */
export function initParallax(root = document) {
  if (reduce) return;
  const els = [...root.querySelectorAll('[data-parallax]')];
  if (!els.length) return;
  return onScroll((y, vh) => {
    els.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const speed = parseFloat(el.dataset.parallax);
      const center = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`;
    });
  });
}

/** 3D tilt on hover for [data-tilt] */
export function initTilt(root = document) {
  if (!finePointer || reduce) return;
  root.querySelectorAll('[data-tilt]').forEach(el => {
    const max = parseFloat(el.dataset.tilt) || 6;
    if (!el.querySelector('.shine')) el.insertAdjacentHTML('beforeend', '<span class="shine"></span>');
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * max).toFixed(2)}deg) rotateY(${((px - 0.5) * max).toFixed(2)}deg) translateY(-4px)`;
      el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/** Magnetic buttons */
export function initMagnetic(root = document) {
  if (!finePointer || reduce) return;
  root.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/** Scroll-linked effects: [data-sx] elements get --p (0..1 travel through the viewport)
 *  and --in (eased entry, 0..1) as CSS variables; CSS turns them into motion. */
export function initScrollFx(root = document) {
  const els = [...root.querySelectorAll('[data-sx]')];
  if (!els.length) return;
  els.forEach(el => {
    el.removeAttribute('data-reveal');
    if (el.dataset.sx === 'stagger') [...el.children].forEach((c, k) => { c.style.setProperty('--k', k); c.removeAttribute('data-reveal'); c.querySelectorAll(':scope > [data-reveal]').forEach(x => x.classList.add('in')); });
  });
  // count-up numbers inside scroll-driven cards start when the card comes into view
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { counters(e.target); cio.unobserve(e.target); } }), { threshold: 0.3 });
  els.forEach(el => { if (el.querySelector('[data-count]')) cio.observe(el); });
  if (reduce) { els.forEach(el => { el.style.setProperty('--in', 1); el.style.setProperty('--p', 0.5); }); return () => cio.disconnect(); }
  const off = onScroll((y, vh) => {
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return;
      const p = clamp((vh - r.top) / (vh + r.height));
      const end = parseFloat(el.dataset.sxEnd || 0.42);
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--in', ease(range(p, 0.02, end)).toFixed(4));
    });
  });
  return () => { off(); cio.disconnect(); };
}

export function initFx(root) {
  const offs = [];
  initReveal(root);
  const sx = initScrollFx(root); if (sx) offs.push(sx);
  const p = initParallax(root); if (p) offs.push(p);
  initTilt(root); initMagnetic(root);
  return () => offs.forEach(f => f());
}

/** Lightweight confetti burst on canvas */
export function confetti() {
  if (reduce) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  const ctx = c.getContext('2d'); const dpr = Math.min(2, devicePixelRatio || 1);
  c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
  const cols = ['#ffffff', '#b9c6ff', '#e9d8ff', '#c9ccd3', '#8fa2ff'];
  const parts = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight / 2.6, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 4, r: Math.random() * 6 + 3, c: cols[Math.random() * cols.length | 0], a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
  const t0 = performance.now();
  (function step(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - (now - t0) / 3200); ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
    if (now - t0 < 3200) requestAnimationFrame(step); else c.remove();
  })(t0);
}

export { reduce, finePointer };
