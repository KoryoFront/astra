import { crumbs, esc } from '../ui.js';
import { icon } from '../icons.js';

const DOCS = {
  privacy: ['Privacy policy', [
    ['Demo notice', 'ASTRA is a fictional brand and this website is a prototype. No personal data is transmitted to any server. Everything you enter — accounts, addresses, orders — is stored only in your browser\'s local storage and can be cleared at any time from Account → Settings → Reset demo data.'],
    ['Payment data', 'Card numbers, expiry dates and security codes entered at checkout are held in memory only while the order is placed and are never transmitted. Only the card brand and last four digits are saved with your order.'],
    ['Cookies', 'This prototype does not set tracking cookies. Fonts are loaded from Google Fonts.'],
  ]],
  terms: ['Terms of sale', [
    ['Simulated purchases', 'All purchases on this site are simulated. No contract of sale is formed, no goods will be delivered and no payment is taken.'],
    ['Pricing', 'Prices are shown in US dollars and are fictional. Estimated tax is calculated at a flat 8% for demonstration.'],
    ['Returns', 'In a real ASTRA store you could return products within 30 days of delivery. In this demo you can cancel orders from your account before they ship.'],
    ['Warranty', 'Product warranty information is illustrative. See the Warranty page for the simulated coverage checker.'],
  ]],
  cookies: ['Cookie policy', [
    ['What we store', 'This demo uses your browser\'s localStorage (key: astra.v1) to remember your bag, demo accounts and orders. It does not use advertising or analytics cookies.'],
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
