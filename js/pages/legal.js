import { crumbs, esc } from '../ui.js';
import { icon } from '../icons.js';

const DOCS = {
  privacy: ['Privacy policy', [
    ['Your data', 'Your account, addresses and orders are saved on your device and can be cleared at any time from Account → Settings → Clear saved data.'],
    ['Payment data', 'Card numbers, expiry dates and security codes entered at checkout are held in memory only while the order is placed and are never transmitted. Only the card brand and last four digits are saved with your order.'],
    ['Cookies', 'We do not use advertising or tracking cookies. Fonts are loaded from Google Fonts.'],
  ]],
  terms: ['Terms of sale', [
    ['About this website', 'This website is a design concept. Orders placed here are not fulfilled and no payment is taken.'],
    ['Pricing', 'Prices are shown in US dollars. Estimated tax is calculated at a flat 8%.'],
    ['Returns', 'Products can be returned within 30 days of delivery. Orders can be cancelled from your account before they ship.'],
    ['Warranty', 'Every ASTRA phone includes a 2-year limited warranty. See the Warranty page to check your coverage.'],
  ]],
  cookies: ['Cookie policy', [
    ['What we store', 'We use your browser\'s local storage to remember your bag, account and orders. It does not use advertising or analytics cookies.'],
    ['Clearing data', 'You can clear this data from Account → Settings, or via your browser settings.'],
  ]],
};

export const legalPage = {
  title: ({ params }) => DOCS[params.doc]?.[0] || 'Not found',
  render(ctx) {
    const d = DOCS[ctx.params.doc]; if (!d) return notFound.render(ctx);
    return `<div class="container narrow" style="padding-bottom:80px">
      <header class="page-head">${crumbs([['Home', '#/'], [d[0], '#']])}<h1 class="display-2" data-split>${d[0]}</h1><p class="dim" style="margin-top:12px">Last updated 3 November 2026</p></header>
      <div class="stack" style="--stack:32px">${d[1].map(([h, p]) => `<section data-reveal><h2 class="h3">${h}</h2><p class="muted" style="margin-top:10px">${esc(p)}</p></section>`).join('')}</div>
    </div>`;
  },
};

export const notFound = {
  title: 'Page not found',
  render() {
    return `<div class="container section center narrow">
      <div class="big-num silver-text" style="font-size:clamp(96px,18vw,200px)">404</div>
      <h1 class="h2" style="margin-top:12px">This page drifted out of orbit.</h1>
      <p class="muted" style="margin-top:12px">The page you're looking for doesn't exist or has moved.</p>
      <div class="row" style="justify-content:center;margin-top:28px"><a href="#/" class="btn btn-primary">Back to home</a><a href="#/phones" class="btn btn-ghost">Shop phones ${icon('arrow', 'arrow')}</a></div>
    </div>`;
  },
};
