// Navigation. On a normal host the route lives in the URL hash (#/phones).
// When embedded (window.ASTRA_EMBED, e.g. a Claude artifact, where hash paths can't be used)
// the route is kept in memory and in-site links are intercepted.
const EMBED = !!window.ASTRA_EMBED;
let route = '#/';
const subs = new Set();
const emit = () => subs.forEach(f => f());

export const isEmbed = EMBED;
export const current = () => (EMBED ? route : location.hash || '#/');
export const onChange = fn => subs.add(fn);

export function go(h) {
  if (EMBED) { route = h; emit(); return; }
  if (location.hash === h) emit(); else location.hash = h;
}
export function replace(h) {
  if (EMBED) route = h;
  else history.replaceState(null, '', h);
}

if (EMBED) {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#/"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    go(a.getAttribute('href'));
  });
} else {
  addEventListener('hashchange', emit);
}
