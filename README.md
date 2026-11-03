# ASTRA — premium smartphone storefront (demo prototype)

A complete, interactive e-commerce prototype for **ASTRA**, a fictional premium smartphone brand.
All product and lifestyle imagery was generated with Higgsfield AI (GPT Image 2.5), using
master renders as references so phone designs, camera layouts, colours and the ASTRA wordmark
stay consistent across every shot.

> **Demo only.** ASTRA is fictional. Checkout is a simulation: no payment is processed, real card
> numbers are rejected, and all data (accounts, orders, bag) lives in your browser's localStorage.

## Run it

No build step or dependencies — it's static HTML/CSS/ES modules.

```bash
python3 -m http.server 8000   # or any static server
# open http://localhost:8000
```

(Opening `index.html` straight from disk won't work, because browsers block ES modules on `file://`.)

## What's inside

| Area | Route |
| --- | --- |
| Home: animated hero, 3D scroll-rotating phone, camera zoom reveal, horizontal gallery, bento features | `#/` |
| Phone catalogue: filter by series, price, storage, colour and features; sort; compare tray | `#/phones` |
| Product pages: gallery (zoom, swipe, lightbox), colours, storage, Astra Care+, sticky buy bar, specs | `#/phone/x1-pro` |
| Compare up to 3 phones, with a "highlight differences" option | `#/compare` |
| Accessories store and product pages | `#/accessories`, `#/accessory/buds-pro` |
| Bag with promo codes, trade-in credit, shipping and tax | `#/cart` |
| 4-step checkout with a simulated card payment and 3-D Secure | `#/checkout` |
| Order confirmation with a generated order number | `#/order/:num` |
| Sign in / register / account / order history / order detail / settings | `#/login`, `#/account` |
| Order tracking with a timeline and route map | `#/track` |
| Support hub, FAQs, warranty and coverage checker, contact | `#/support`, `#/faq`, `#/warranty`, `#/contact` |
| About, sustainability, stores; trade-in estimator; legal pages | `#/about`, `#/trade-in`, `#/legal/terms` |

### Demo credentials

- Account: `demo@astra.com` / `astra2026`. Comes with seeded order history; try tracking `AST-2610-48213`.
- Promo codes: `ASTRA10`, `WELCOME50` (orders over $400), `FREESHIP`.
- Test cards (any future expiry; CVV `123`, or `1234` for Amex):

| Card | Result |
| --- | --- |
| 4242 4242 4242 4242 | Approved (Visa) |
| 5555 5555 5555 4444 | Approved (Mastercard) |
| 3782 822463 10005 | Approved (Amex) |
| 4000 0027 6000 3184 | 3-D Secure challenge, code `123456` |
| 4000 0000 0000 0002 | Declined |
| 4000 0000 0000 9995 | Insufficient funds |

## Code layout

```
index.html            app shell
css/styles.css        design system, components, animations, responsive rules
js/app.js             hash router, page transitions
js/data.js            product catalogue, accessories, trade-in values, FAQs
js/store.js           bag, totals, promo codes, accounts, orders, tracking (localStorage)
js/ui.js              header, footer, bag drawer, search, toasts, shared components
js/fx.js              scroll engine, reveal-on-scroll, parallax, tilt, counters, confetti
js/icons.js           SVG icon set and ASTRA logo
js/pages/*.js         one module per page (render + mount)
assets/img/           AI-generated product, accessory and lifestyle imagery
```

Animations respect `prefers-reduced-motion`.
