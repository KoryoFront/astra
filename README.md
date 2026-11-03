# ASTRA — premium smartphone storefront (demo prototype)

A complete, interactive e-commerce prototype for **ASTRA**, a fictional premium smartphone brand.
All product and lifestyle imagery was generated with Higgsfield AI (GPT Image 2.5), using
master renders as references so phone designs, camera layouts, colours and the ASTRA wordmark
stay consistent across every shot.

> **Prototype.** ASTRA is a fictional brand. The checkout never processes a payment: card details
> are validated in the browser, never transmitted, and only the brand and last four digits are kept.
> Accounts, orders and the bag live in your browser's localStorage.

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
| Home: layered hero (phones, landscape and rocks move at different speeds), word-by-word statement, 3D rotating phone over moving type, fixed phone over changing scenes, camera zoom reveal, bento features | `#/` |
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
- Checkout accepts any card number that passes validation (Luhn check, future expiry, 3- or 4-digit CVV).
  A few reserved numbers trigger other outcomes for demos (not shown anywhere on the site):

| Card | Result |
| --- | --- |
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
assets/img/           AI-generated product, accessory, lifestyle and layered hero imagery
```

Animations respect `prefers-reduced-motion`.
