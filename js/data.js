// ASTRA product catalogue — demo data for the prototype storefront.
const P = 'assets/img/products/';
const A = 'assets/img/accessories/';

export const SERIES = {
  x: { id: 'x', name: 'ASTRA X Series', tagline: 'Flagship performance', accent: '#9aa4b5' },
  s: { id: 's', name: 'ASTRA S Series', tagline: 'Power for every day', accent: '#a99be0' },
  a: { id: 'a', name: 'ASTRA A Series', tagline: 'Smart. Reliable. Accessible.', accent: '#8fb09d' },
};

export const PHONES = [
  {
    id: 'x1-pro', series: 'x', name: 'ASTRA X1 Pro', tier: 'Flagship', badge: 'New',
    tagline: 'Power. Intelligence. Elegance.',
    blurb: 'Our most advanced phone ever. Aerospace titanium, a 200 MP triple-camera system and the Nova G3 chip with on-device Astra AI.',
    released: '2026-09-24', rating: 4.9, reviews: 2184,
    colors: [
      { id: 'graphite', name: 'Graphite Titanium', hex: '#3a3b3f', img: P + 'x-graphite.jpg' },
      { id: 'silver', name: 'Silver Frost', hex: '#c9ccd1', img: P + 'x-silver.jpg' },
      { id: 'desert', name: 'Desert Titanium', hex: '#b39a7f', img: P + 'x-desert.jpg' },
    ],
    storage: [ { gb: 256, price: 1199 }, { gb: 512, price: 1349 }, { gb: 1024, price: 1599 } ],
    gallery: [P + 'x-front.webp', P + 'x-back.webp', P + 'x-side.jpg', P + 'x-macro.jpg', P + 'x-display.jpg', P + 'x-lifestyle.jpg'],
    highlights: [
      ['chip', 'Nova G3', '3 nm, 8-core CPU'],
      ['camera', '200 MP', 'Triple Pro camera'],
      ['battery', '5,500 mAh', '90 W HyperCharge'],
      ['display', '6.8" AMOLED', '1–144 Hz LTPO'],
    ],
    specs: {
      Display: { Size: '6.8" LTPO AMOLED, 3200 × 1440', 'Refresh rate': '1–144 Hz adaptive', Brightness: '3,000 nits peak, 1,800 nits HBM', Protection: 'Astra Shield Glass Ultra' },
      Performance: { Chip: 'ASTRA Nova G3 (3 nm)', CPU: '8-core, up to 4.1 GHz', GPU: 'Nova Prism 12-core, hardware ray tracing', 'Neural engine': '78 TOPS NPU', RAM: '16 GB LPDDR5X' },
      Camera: { Main: '200 MP, 1/1.3" sensor, f/1.6, OIS', 'Ultra wide': '50 MP, 122° FoV, f/2.0', Telephoto: '50 MP periscope, 5× optical, 100× AstraZoom', Front: '32 MP, autofocus', Video: '8K 30 fps, 4K 120 fps Dolby Vision HDR' },
      Battery: { Capacity: '5,500 mAh silicon-carbon', Wired: '90 W HyperCharge (0–100% in 29 min)', Wireless: '50 W AstraMag wireless, 10 W reverse' },
      'Design & build': { Dimensions: '163.2 × 76.4 × 8.2 mm', Weight: '214 g', Frame: 'Grade 5 titanium', Back: 'Frosted matte glass', 'Water resistance': 'IP68 + IP69' },
      Connectivity: { Network: '5G Sub-6 / mmWave', 'Wi-Fi': 'Wi-Fi 7', Bluetooth: '5.4', Other: 'UWB, NFC, USB-C 3.2 Gen 2, dual eSIM' },
      Software: { OS: 'AstraOS 6 (Android 17)', Updates: '7 years of OS & security updates', AI: 'Astra AI: Live Translate, Magic Eraser Pro, Smart Summaries, Circle Search' },
    },
  },
  {
    id: 'x1', series: 'x', name: 'ASTRA X1', tier: 'Flagship',
    tagline: 'Flagship. Distilled.',
    blurb: 'Everything you love about the X Series in a lighter aluminium design. Nova G3 power, a 50 MP triple camera and an all-day battery.',
    released: '2026-09-24', rating: 4.8, reviews: 1532,
    colors: [
      { id: 'ocean', name: 'Ocean Blue', hex: '#26324a', img: P + 'x-ocean.jpg' },
      { id: 'graphite', name: 'Graphite', hex: '#3a3b3f', img: P + 'x-graphite.jpg' },
      { id: 'silver', name: 'Silver Frost', hex: '#c9ccd1', img: P + 'x-silver.jpg' },
    ],
    storage: [ { gb: 128, price: 899 }, { gb: 256, price: 999 }, { gb: 512, price: 1149 } ],
    gallery: [P + 'x-front.webp', P + 'x-back.webp', P + 'x-side.jpg', P + 'x-display.jpg'],
    highlights: [
      ['chip', 'Nova G3', '3 nm, 8-core CPU'],
      ['camera', '50 MP', 'Triple camera, 3× optical'],
      ['battery', '5,000 mAh', '67 W HyperCharge'],
      ['display', '6.3" AMOLED', '1–120 Hz LTPO'],
    ],
    specs: {
      Display: { Size: '6.3" LTPO AMOLED, 2640 × 1216', 'Refresh rate': '1–120 Hz adaptive', Brightness: '2,600 nits peak', Protection: 'Astra Shield Glass 2' },
      Performance: { Chip: 'ASTRA Nova G3 (3 nm)', CPU: '8-core, up to 3.9 GHz', GPU: 'Nova Prism 10-core', 'Neural engine': '78 TOPS NPU', RAM: '12 GB LPDDR5X' },
      Camera: { Main: '50 MP, 1/1.56" sensor, f/1.7, OIS', 'Ultra wide': '12 MP, 120° FoV', Telephoto: '10 MP, 3× optical, 30× AstraZoom', Front: '12 MP, autofocus', Video: '4K 60 fps HDR' },
      Battery: { Capacity: '5,000 mAh', Wired: '67 W HyperCharge', Wireless: '25 W AstraMag wireless' },
      'Design & build': { Dimensions: '150.8 × 71.6 × 7.9 mm', Weight: '182 g', Frame: 'Aerospace aluminium', Back: 'Frosted matte glass', 'Water resistance': 'IP68' },
      Connectivity: { Network: '5G Sub-6', 'Wi-Fi': 'Wi-Fi 7', Bluetooth: '5.4', Other: 'NFC, USB-C 3.2, dual eSIM' },
      Software: { OS: 'AstraOS 6 (Android 17)', Updates: '7 years of OS & security updates', AI: 'Astra AI: Live Translate, Magic Eraser, Smart Summaries' },
    },
  },
  {
    id: 's5-plus', series: 's', name: 'ASTRA S5 Plus', tier: 'Mid-range', badge: 'Popular',
    tagline: 'Big screen. Bigger days.',
    blurb: 'A stunning 6.7" display, a 64 MP OIS camera and two-day battery life wrapped in soft satin glass.',
    released: '2026-04-15', rating: 4.7, reviews: 3410,
    colors: [
      { id: 'lavender', name: 'Lavender Mist', hex: '#a99be0', img: P + 's-lavender.jpg' },
      { id: 'glacier', name: 'Glacier Blue', hex: '#a9c7de', img: P + 's-glacier.jpg' },
      { id: 'onyx', name: 'Onyx', hex: '#232326', img: P + 's-onyx.jpg' },
    ],
    storage: [ { gb: 256, price: 649 }, { gb: 512, price: 749 } ],
    gallery: [P + 's-front.webp', P + 's-side.jpg', P + 's-lifestyle.jpg'],
    highlights: [
      ['chip', 'Nova S2', '4 nm, AI-ready'],
      ['camera', '64 MP', 'OIS dual camera'],
      ['battery', '5,200 mAh', 'Two-day battery'],
      ['display', '6.7" AMOLED', '120 Hz'],
    ],
    specs: {
      Display: { Size: '6.7" AMOLED, 2412 × 1080', 'Refresh rate': '120 Hz', Brightness: '1,900 nits peak', Protection: 'Astra Shield Glass 2' },
      Performance: { Chip: 'ASTRA Nova S2 (4 nm)', CPU: '8-core, up to 3.2 GHz', GPU: 'Nova Prism 6-core', 'Neural engine': '40 TOPS NPU', RAM: '12 GB' },
      Camera: { Main: '64 MP, f/1.8, OIS', 'Ultra wide': '12 MP, 118° FoV', Front: '16 MP', Video: '4K 30 fps' },
      Battery: { Capacity: '5,200 mAh', Wired: '45 W fast charging', Wireless: '15 W wireless' },
      'Design & build': { Dimensions: '161.9 × 75.1 × 7.6 mm', Weight: '188 g', Frame: 'Aluminium', Back: 'Satin glass', 'Water resistance': 'IP67' },
      Connectivity: { Network: '5G Sub-6', 'Wi-Fi': 'Wi-Fi 6E', Bluetooth: '5.3', Other: 'NFC, USB-C, eSIM' },
      Software: { OS: 'AstraOS 6 (Android 17)', Updates: '5 years of OS & security updates', AI: 'Astra AI: Live Translate, Magic Eraser, Smart Summaries' },
    },
  },
  {
    id: 's5', series: 's', name: 'ASTRA S5', tier: 'Mid-range',
    tagline: 'Power for every day.',
    blurb: 'The perfect balance of performance, design and value — with Astra AI built in and a camera that shines in low light.',
    released: '2026-04-15', rating: 4.6, reviews: 4122,
    colors: [
      { id: 'glacier', name: 'Glacier Blue', hex: '#a9c7de', img: P + 's-glacier.jpg' },
      { id: 'lavender', name: 'Lavender Mist', hex: '#a99be0', img: P + 's-lavender.jpg' },
      { id: 'onyx', name: 'Onyx', hex: '#232326', img: P + 's-onyx.jpg' },
    ],
    storage: [ { gb: 128, price: 499 }, { gb: 256, price: 579 } ],
    gallery: [P + 's-front.webp', P + 's-side.jpg', P + 's-lifestyle.jpg'],
    highlights: [
      ['chip', 'Nova S2', '4 nm, AI-ready'],
      ['camera', '50 MP', 'Dual camera'],
      ['battery', '4,800 mAh', '45 W charging'],
      ['display', '6.2" AMOLED', '120 Hz'],
    ],
    specs: {
      Display: { Size: '6.2" AMOLED, 2340 × 1080', 'Refresh rate': '120 Hz', Brightness: '1,700 nits peak', Protection: 'Astra Shield Glass' },
      Performance: { Chip: 'ASTRA Nova S2 (4 nm)', CPU: '8-core, up to 3.0 GHz', GPU: 'Nova Prism 6-core', 'Neural engine': '40 TOPS NPU', RAM: '8 GB' },
      Camera: { Main: '50 MP, f/1.8, OIS', 'Ultra wide': '8 MP, 112° FoV', Front: '16 MP', Video: '4K 30 fps' },
      Battery: { Capacity: '4,800 mAh', Wired: '45 W fast charging', Wireless: '15 W wireless' },
      'Design & build': { Dimensions: '149.6 × 71.0 × 7.5 mm', Weight: '172 g', Frame: 'Aluminium', Back: 'Satin glass', 'Water resistance': 'IP67' },
      Connectivity: { Network: '5G Sub-6', 'Wi-Fi': 'Wi-Fi 6E', Bluetooth: '5.3', Other: 'NFC, USB-C, eSIM' },
      Software: { OS: 'AstraOS 6 (Android 17)', Updates: '5 years of OS & security updates', AI: 'Astra AI: Live Translate, Magic Eraser' },
    },
  },
  {
    id: 'a3', series: 'a', name: 'ASTRA A3', tier: 'Essential',
    tagline: 'Smart. Reliable. Accessible.',
    blurb: 'Big battery, bright 120 Hz display and a 50 MP camera — at a price that makes sense.',
    released: '2026-02-10', rating: 4.6, reviews: 5890,
    colors: [
      { id: 'sage', name: 'Sage Green', hex: '#7f9c8a', img: P + 'a-sage.jpg' },
      { id: 'sand', name: 'Sand', hex: '#d8cbb5', img: P + 'a-sand.jpg' },
      { id: 'graphite', name: 'Graphite', hex: '#3a3b3f', img: P + 'a-graphite.jpg' },
    ],
    storage: [ { gb: 128, price: 299 }, { gb: 256, price: 349 } ],
    gallery: [P + 'a-front.webp', P + 'a-side.jpg', P + 'a-lifestyle.jpg'],
    highlights: [
      ['chip', 'Nova A1', '6 nm octa-core'],
      ['camera', '50 MP', 'Dual camera'],
      ['battery', '6,000 mAh', 'Up to 2.5 days'],
      ['display', '6.6" OLED', '120 Hz'],
    ],
    specs: {
      Display: { Size: '6.6" OLED, 2400 × 1080', 'Refresh rate': '120 Hz', Brightness: '1,200 nits peak', Protection: 'Astra Shield Glass' },
      Performance: { Chip: 'ASTRA Nova A1 (6 nm)', CPU: '8-core, up to 2.6 GHz', GPU: 'Nova Prism 4-core', 'Neural engine': '12 TOPS NPU', RAM: '6 GB / 8 GB' },
      Camera: { Main: '50 MP, f/1.8', 'Ultra wide': '5 MP', Front: '13 MP', Video: '1080p 60 fps' },
      Battery: { Capacity: '6,000 mAh', Wired: '33 W fast charging', Wireless: '—' },
      'Design & build': { Dimensions: '164.0 × 76.0 × 8.4 mm', Weight: '196 g', Frame: 'Recycled polymer', Back: 'Matte soft-touch', 'Water resistance': 'IP54' },
      Connectivity: { Network: '5G Sub-6', 'Wi-Fi': 'Wi-Fi 6', Bluetooth: '5.3', Other: 'NFC, USB-C, 3.5 mm jack, microSD' },
      Software: { OS: 'AstraOS 6 (Android 17)', Updates: '4 years of OS & security updates', AI: 'Astra AI Essentials: Live Translate, Smart Summaries' },
    },
  },
  {
    id: 'a3-lite', series: 'a', name: 'ASTRA A3 Lite', tier: 'Essential',
    tagline: 'Everything you need.',
    blurb: 'A dependable everyday phone with a huge battery and a clean, ad-free AstraOS experience.',
    released: '2026-02-10', rating: 4.4, reviews: 2760,
    colors: [
      { id: 'graphite', name: 'Graphite', hex: '#3a3b3f', img: P + 'a-graphite.jpg' },
      { id: 'sand', name: 'Sand', hex: '#d8cbb5', img: P + 'a-sand.jpg' },
    ],
    storage: [ { gb: 64, price: 199 }, { gb: 128, price: 229 } ],
    gallery: [P + 'a-front.webp', P + 'a-side.jpg'],
    highlights: [
      ['chip', 'Nova A1', '6 nm octa-core'],
      ['camera', '48 MP', 'AI camera'],
      ['battery', '6,000 mAh', 'Up to 2.5 days'],
      ['display', '6.6" LCD', '90 Hz'],
    ],
    specs: {
      Display: { Size: '6.6" LCD, 1612 × 720', 'Refresh rate': '90 Hz', Brightness: '700 nits', Protection: 'Tempered glass' },
      Performance: { Chip: 'ASTRA Nova A1 (6 nm)', CPU: '8-core, up to 2.4 GHz', GPU: 'Nova Prism 4-core', 'Neural engine': '12 TOPS NPU', RAM: '4 GB / 6 GB' },
      Camera: { Main: '48 MP, f/1.8', Depth: '2 MP', Front: '8 MP', Video: '1080p 30 fps' },
      Battery: { Capacity: '6,000 mAh', Wired: '25 W fast charging', Wireless: '—' },
      'Design & build': { Dimensions: '164.0 × 76.0 × 8.6 mm', Weight: '199 g', Frame: 'Recycled polymer', Back: 'Matte soft-touch', 'Water resistance': 'IP52' },
      Connectivity: { Network: '4G LTE', 'Wi-Fi': 'Wi-Fi 5', Bluetooth: '5.2', Other: 'NFC, USB-C, 3.5 mm jack, microSD' },
      Software: { OS: 'AstraOS 6 Go', Updates: '3 years of security updates', AI: 'Astra AI Essentials: Live Translate' },
    },
  },
];

export const ACCESSORIES = [
  { id: 'buds-pro', cat: 'Audio', name: 'ASTRA Buds Pro 2', price: 229, img: A + 'buds-pro.jpg', rating: 4.8, badge: 'New',
    blurb: 'Adaptive ANC, lossless spatial audio and 36-hour battery life in a pebble-smooth titanium-finish case.',
    features: ['Adaptive noise cancelling up to 52 dB', 'Lossless spatial audio with head tracking', '8 h playback, 36 h with case', 'IP57 sweat & water resistance', 'Live Translate with Astra AI'],
    colors: [{ id: 'graphite', name: 'Graphite', hex: '#3a3b3f' }, { id: 'silver', name: 'Silver', hex: '#c9ccd1' }] },
  { id: 'buds', cat: 'Audio', name: 'ASTRA Buds', price: 99, img: A + 'buds.jpg', rating: 4.6,
    blurb: 'Rich, balanced sound and active noise cancelling in a pocket-sized case.',
    features: ['Active noise cancelling', '7 h playback, 30 h with case', 'Fast pair with Astra phones', 'IPX4'],
    colors: [{ id: 'white', name: 'Cloud White', hex: '#e9e9ec' }, { id: 'graphite', name: 'Graphite', hex: '#3a3b3f' }] },
  { id: 'charger-90', cat: 'Charging', name: 'HyperCharge 90 W GaN Charger', price: 59, img: A + 'charger.jpg', rating: 4.8,
    blurb: 'Charge your X1 Pro from 0 to 100% in 29 minutes. Three USB-C ports in a compact gallium-nitride design.',
    features: ['90 W HyperCharge for ASTRA phones', '65 W USB PD for laptops', 'Three USB-C ports', 'Foldable pins', '1 m USB-C cable included'],
    colors: [{ id: 'graphite', name: 'Graphite', hex: '#3a3b3f' }] },
  { id: 'stand-3in1', cat: 'Charging', name: 'AstraMag 3-in-1 Stand', price: 129, img: A + 'stand.jpg', rating: 4.6,
    blurb: 'Charge your phone, buds and watch together on one sculpted aluminium stand.',
    features: ['50 W phone + 5 W buds + 3 W watch', 'Adjustable tilt', 'Anodised aluminium', 'Includes 65 W adapter'],
    colors: [{ id: 'graphite', name: 'Graphite', hex: '#3a3b3f' }] },
  { id: 'powerbank', cat: 'Charging', name: 'AstraMag Power Bank 10K', price: 69, img: A + 'powerbank.jpg', rating: 4.5,
    blurb: '10,000 mAh magnetic power bank with a built-in kickstand. Slim enough to forget it\'s there.',
    features: ['10,000 mAh capacity', '15 W magnetic wireless', '30 W USB-C in/out', 'Fold-out kickstand'],
    colors: [{ id: 'graphite', name: 'Graphite', hex: '#3a3b3f' }, { id: 'silver', name: 'Silver', hex: '#c9ccd1' }] },
  { id: 'case-x1pro', cat: 'Cases', name: 'X1 Pro Aramid Case', price: 59, img: A + 'case.jpg', rating: 4.7, compat: 'x1-pro',
    blurb: 'Ultra-thin 0.7 mm aramid fibre with AstraMag magnets. Feather-light, incredibly strong.',
    features: ['Aerospace aramid fibre', '0.7 mm thin, 14 g', 'AstraMag compatible', 'Raised camera lip'],
    colors: [{ id: 'black', name: 'Black Weave', hex: '#1b1b1d' }] },
  { id: 'case-leather', cat: 'Cases', name: 'Vegan Leather Case', price: 49, img: A + 'case-leather.jpg', rating: 4.5,
    blurb: 'Soft-touch vegan leather made from plant-based materials with a microfibre lining. Available for X1 Pro, X1, S5 Plus and S5.',
    features: ['Plant-based vegan leather', 'Microfibre lining', 'AstraMag compatible', 'Aluminium buttons'],
    colors: [{ id: 'tan', name: 'Tan', hex: '#a7764d' }, { id: 'black', name: 'Black', hex: '#1b1b1d' }] },
  { id: 'cable', cat: 'Charging', name: 'Braided USB-C Cable (2 m)', price: 25, img: A + 'cable.jpg', rating: 4.8,
    blurb: '240 W braided USB-C cable rated for 30,000 bends.',
    features: ['240 W power delivery', 'USB 3.2 data', 'Braided nylon', '2 m length'],
    colors: [{ id: 'graphite', name: 'Graphite', hex: '#3a3b3f' }] },
];

export const PROMO_CODES = {
  ASTRA10: { type: 'percent', value: 10, label: '10% off your order' },
  WELCOME50: { type: 'fixed', value: 50, label: '$50 off orders over $400', min: 400 },
  FREESHIP: { type: 'ship', value: 0, label: 'Free express shipping' },
};

export const SHIPPING = [
  { id: 'standard', name: 'Standard delivery', eta: '3–5 business days', price: 0 },
  { id: 'express', name: 'Express delivery', eta: '1–2 business days', price: 14.99 },
  { id: 'nextday', name: 'Next-day delivery', eta: 'Order by 8pm', price: 24.99 },
];

// Trade-in estimates (USD) by device and condition
export const TRADE_IN = {
  brands: {
    ASTRA: ['X0 Pro', 'X0', 'S4 Plus', 'S4', 'A2'],
    Apple: ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17', 'iPhone 16 Pro', 'iPhone 16', 'iPhone 15'],
    Samsung: ['Galaxy S26 Ultra', 'Galaxy S26', 'Galaxy S25 Ultra', 'Galaxy S25', 'Galaxy A56'],
    Google: ['Pixel 11 Pro', 'Pixel 11', 'Pixel 10 Pro', 'Pixel 10'],
    Other: ['Other Android smartphone'],
  },
  base: {
    'X0 Pro': 520, 'X0': 400, 'S4 Plus': 260, 'S4': 200, 'A2': 80,
    'iPhone 17 Pro Max': 760, 'iPhone 17 Pro': 650, 'iPhone 17': 470, 'iPhone 16 Pro': 480, 'iPhone 16': 340, 'iPhone 15': 240,
    'Galaxy S26 Ultra': 640, 'Galaxy S26': 410, 'Galaxy S25 Ultra': 460, 'Galaxy S25': 300, 'Galaxy A56': 110,
    'Pixel 11 Pro': 520, 'Pixel 11': 360, 'Pixel 10 Pro': 380, 'Pixel 10': 260,
    'Other Android smartphone': 50,
  },
  condition: { flawless: 1, good: 0.8, fair: 0.55, broken: 0.2 },
  bonus: 100, // ASTRA upgrade bonus when buying a new X Series phone
};

export const FAQS = [
  { cat: 'Orders & shipping', q: 'How long does delivery take?', a: 'Standard delivery is free and arrives in 3–5 business days. Express (1–2 days) and next-day delivery are available at checkout.' },
  { cat: 'Orders & shipping', q: 'Can I track my order?', a: 'Yes. Open Account → Orders, or use the Track Order page with your order number and email address.' },
  { cat: 'Orders & shipping', q: 'Can I change or cancel an order?', a: 'Orders can be cancelled from your account until they are dispatched — usually within 2 hours of being placed.' },
  { cat: 'Payments', q: 'Is my payment information secure?', a: 'Yes. Card details are validated on your device and are never stored on our servers. We only keep the card type and last four digits with your order.' },
  { cat: 'Payments', q: 'Which payment methods do you accept?', a: 'Visa, Mastercard, American Express and Astra Pay, plus 0% financing over 12 or 24 months on eligible phones.' },
  { cat: 'Returns', q: 'What is your return policy?', a: 'You can return any product within 30 days of delivery for a full refund, as long as it is in its original condition.' },
  { cat: 'Warranty', q: 'What does the standard warranty cover?', a: 'Every ASTRA phone includes a 2-year limited warranty covering manufacturing defects. Astra Care+ adds accidental damage protection.' },
  { cat: 'Warranty', q: 'What is Astra Care+?', a: 'Astra Care+ extends cover to 3 years and includes two accidental damage repairs per year, express replacement and priority support.' },
  { cat: 'Devices', q: 'How many years of updates will my phone get?', a: 'X Series phones get 7 years of OS and security updates, S Series get 5 years, and A Series get 4 years (A3 Lite: 3 years of security updates).' },
  { cat: 'Devices', q: 'Does Astra AI work offline?', a: 'Most Astra AI features — Live Translate, Smart Summaries and Magic Eraser — run on-device on the Nova neural engine, so they work offline and your data stays private.' },
  { cat: 'Trade-in', q: 'How does trade-in work?', a: 'Get an instant estimate, add it to your order, and we\'ll send a free prepaid kit. Once we inspect your device the credit is refunded to your payment method.' },
];

export const STORES = [
  { city: 'London', addr: '210 Regent Street, W1B 5AH', hours: '10:00–21:00' },
  { city: 'New York', addr: '535 Fifth Avenue, NY 10017', hours: '10:00–21:00' },
  { city: 'Tokyo', addr: '4-2-1 Ginza, Chuo-ku', hours: '11:00–20:00' },
  { city: 'Berlin', addr: 'Kurfürstendamm 26, 10719', hours: '10:00–20:00' },
];

export const allProducts = () => [
  ...PHONES.map(p => ({ ...p, kind: 'phone' })),
  ...ACCESSORIES.map(a => ({ ...a, kind: 'accessory' })),
];
export const findPhone = id => PHONES.find(p => p.id === id);
export const findAccessory = id => ACCESSORIES.find(a => a.id === id);
export const fromPrice = p => Math.min(...p.storage.map(s => s.price));
