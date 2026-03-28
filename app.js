const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const slugify = require('slugify');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const ADMIN_ROUTE = '/itsiregar24';
const BASE_URL = String(process.env.BASE_URL || 'https://example.com').replace(/\/$/, '');
const DATA_DIR = process.env.DATA_DIR || '/data';
const LOCAL_FALLBACK_DIR = path.join(__dirname, 'data');
const ACTIVE_DATA_DIR = fs.existsSync(DATA_DIR) || DATA_DIR === '/data' ? DATA_DIR : LOCAL_FALLBACK_DIR;
const UPLOAD_DIR = path.join(ACTIVE_DATA_DIR, 'uploads');
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret';
const ADMIN_ID = process.env.ADMIN_ID || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
const SITE_AUTHOR = 'Catherine Slim';

const DB_FILES = {
  settings: path.join(ACTIVE_DATA_DIR, 'settings.json'),
  products: path.join(ACTIVE_DATA_DIR, 'products.json'),
  articles: path.join(ACTIVE_DATA_DIR, 'articles.json'),
  promos: path.join(ACTIVE_DATA_DIR, 'promos.json')
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

ensureDir(ACTIVE_DATA_DIR);
ensureDir(UPLOAD_DIR);
ensureDir(LOCAL_FALLBACK_DIR);

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function safeSlug(text, fallback = 'item') {
  const value = slugify(String(text || fallback), { lower: true, strict: true, trim: true });
  return value || fallback;
}

function stripHtml(input = '') {
  return String(input)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(input = '', max = 160) {
  const clean = stripHtml(input);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}...`;
}

function formatRupiah(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
}

function parseLines(value = '') {
  return String(value)
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function boolish(value) {
  return value === true || value === 'true' || value === 'on' || value === '1' || value === 1;
}

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function publicUploadUrl(fileName = '') {
  if (!fileName) return '';
  return `/uploads/${fileName}`;
}

function baseSettings() {
  return {
    siteName: 'Catherine Slim',
    siteTagline: 'Pilihan profesional untuk pendamping gaya hidup sehat.',
    siteDescription:
      'Website resmi Catherine Slim dengan informasi produk, promo, artikel, FAQ, dan konsultasi WhatsApp dalam tampilan profesional.',
    whatsappNumber: '6281234567890',
    heroTitle: 'Catherine Slim untuk gaya hidup lebih terarah',
    heroSubtitle:
      'Tampilan profesional, promo jelas, artikel SEO rapi, dan konsultasi WhatsApp yang mudah diakses dari mana saja.',
    topPromoText: 'Promo spesial hari ini - konsultasi WhatsApp dan penawaran hemat tersedia sekarang.',
    topPromoActive: true,
    logoText: 'Catherine Slim',
    footerText: '© Catherine Slim. Semua hak cipta dilindungi.',
    primaryColor: '#A3B18A',
    secondaryColor: '#7D8F69',
    accentColor: '#F7F4EE',
    metaTitle: 'Catherine Slim | Website Profesional Produk dan Artikel SEO',
    metaDescription:
      'Catherine Slim menghadirkan halaman produk, promo, artikel, FAQ, dan konsultasi WhatsApp dengan tampilan profesional dan SEO terarah.',
    faviconMode: 'cs'
  };
}

function seedProducts() {
  const ts = nowIso();
  return [
    {
      id: createId('prd'),
      name: 'Catherine Slim Original',
      slug: 'catherine-slim-original',
      category: 'Produk Utama',
      shortDesc: 'Pendamping gaya hidup sehat dengan tampilan premium dan halaman detail profesional.',
      desc:
        'Catherine Slim Original hadir sebagai produk unggulan dengan tampilan premium, informasi lengkap, dan area konsultasi WhatsApp untuk membantu calon pelanggan memahami produk dengan lebih nyaman.',
      benefits: ['Tampilan premium', 'Informasi produk jelas', 'Cocok untuk halaman utama SEO'],
      usage: ['Gunakan sesuai petunjuk kemasan', 'Simpan di tempat sejuk dan kering'],
      price: 185000,
      promoPrice: 149000,
      isPromo: true,
      promoLabel: 'Promo Hemat',
      image: '',
      gallery: [],
      status: 'publish',
      isFeatured: true,
      metaTitle: 'Catherine Slim Original | Produk Unggulan Catherine Slim',
      metaDescription:
        'Lihat detail Catherine Slim Original dengan manfaat, informasi, promo, dan tombol WhatsApp yang mudah diakses.',
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: createId('prd'),
      name: 'Paket Hemat Catherine Slim 2 Box',
      slug: 'paket-hemat-catherine-slim-2-box',
      category: 'Paket Promo',
      shortDesc: 'Pilihan paket hemat untuk promo penjualan dan penawaran mingguan.',
      desc:
        'Paket Hemat Catherine Slim 2 Box dibuat untuk kebutuhan promo yang lebih menarik, cocok ditampilkan di homepage dan halaman promo.',
      benefits: ['Nilai promo lebih menarik', 'Bagus untuk area banner promo', 'Mudah ditawarkan via WhatsApp'],
      usage: ['Gunakan sesuai petunjuk kemasan', 'Konsultasikan bila perlu'],
      price: 340000,
      promoPrice: 279000,
      isPromo: true,
      promoLabel: 'Best Deal',
      image: '',
      gallery: [],
      status: 'publish',
      isFeatured: true,
      metaTitle: 'Paket Hemat Catherine Slim 2 Box | Promo Catherine Slim',
      metaDescription: 'Paket promo Catherine Slim 2 Box dengan harga hemat dan tampilan profesional.',
      createdAt: ts,
      updatedAt: ts
    }
  ];
}

function seedArticles() {
  const ts = nowIso();
  return [
    {
      id: createId('art'),
      title: 'Catherine Slim: Panduan Halaman Produk yang Profesional',
      slug: 'catherine-slim-panduan-halaman-produk-yang-profesional',
      excerpt: 'Pelajari struktur halaman produk Catherine Slim yang rapi, profesional, dan mendukung SEO.',
      content:
        '<p>Halaman produk yang baik harus menjelaskan informasi utama secara ringkas, memiliki tombol WhatsApp yang mudah ditemukan, dan memuat elemen kepercayaan seperti promo, FAQ, dan pengiriman.</p><p>Untuk Catherine Slim, arah SEO sebaiknya fokus pada halaman pilar seperti <strong>catherine slim</strong> dan <strong>obat diet</strong>, lalu diperkuat dengan artikel pendukung yang rapi.</p>',
      coverImage: '',
      keywords: ['catherine slim', 'obat diet', 'seo produk'],
      status: 'publish',
      metaTitle: 'Catherine Slim | Panduan Halaman Produk Profesional',
      metaDescription: 'Panduan membuat halaman produk Catherine Slim yang profesional dan SEO-friendly.',
      createdAt: ts,
      updatedAt: ts
    },
    {
      id: createId('art'),
      title: 'Obat Diet: Cara Menyusun Halaman SEO yang Rapi',
      slug: 'obat-diet-cara-menyusun-halaman-seo-yang-rapi',
      excerpt: 'Contoh struktur halaman obat diet dengan fokus pada SEO, trust, dan pengalaman pengguna.',
      content:
        '<p>Keyword obat diet punya persaingan tinggi, jadi struktur halaman dan artikel pendukung harus saling terhubung. Pastikan setiap artikel memiliki internal link ke halaman utama, FAQ, dan promo.</p>',
      coverImage: '',
      keywords: ['obat diet', 'seo', 'artikel'],
      status: 'publish',
      metaTitle: 'Obat Diet | Cara Menyusun Halaman SEO yang Rapi',
      metaDescription: 'Pelajari struktur halaman obat diet yang rapi untuk mendukung SEO website jualan.',
      createdAt: ts,
      updatedAt: ts
    }
  ];
}

function seedPromos() {
  const ts = nowIso();
  return [
    {
      id: createId('prm'),
      title: 'Promo Launching Catherine Slim',
      slug: 'promo-launching-catherine-slim',
      description: 'Harga spesial untuk periode promo aktif dengan tombol WhatsApp dan CTA yang jelas.',
      image: '',
      buttonText: 'Klaim Promo',
      buttonLink: '/kontak',
      startDate: ts.slice(0, 10),
      endDate: '',
      status: 'publish',
      isFeatured: true,
      createdAt: ts,
      updatedAt: ts
    }
  ];
}

function bootstrapData() {
  if (!fs.existsSync(DB_FILES.settings)) writeJson(DB_FILES.settings, baseSettings());
  if (!fs.existsSync(DB_FILES.products)) writeJson(DB_FILES.products, seedProducts());
  if (!fs.existsSync(DB_FILES.articles)) writeJson(DB_FILES.articles, seedArticles());
  if (!fs.existsSync(DB_FILES.promos)) writeJson(DB_FILES.promos, seedPromos());
}

bootstrapData();

function getStore() {
  return {
    settings: { ...baseSettings(), ...readJson(DB_FILES.settings, {}) },
    products: readJson(DB_FILES.products, []),
    articles: readJson(DB_FILES.articles, []),
    promos: readJson(DB_FILES.promos, [])
  };
}

function saveStorePart(key, value) {
  writeJson(DB_FILES[key], value);
}

function publishOnly(items = []) {
  return items.filter((item) => item.status === 'publish');
}

function sortNewest(items = []) {
  return [...items].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.admin) return res.redirect(ADMIN_ROUTE);
  next();
}

function setViewLocals(req, res, next) {
  const store = getStore();
  res.locals.path = req.path;
  res.locals.settings = store.settings;
  res.locals.formatRupiah = formatRupiah;
  res.locals.publicUploadUrl = publicUploadUrl;
  res.locals.ADMIN_ROUTE = ADMIN_ROUTE;
  res.locals.year = new Date().getFullYear();
  res.locals.whatsappLink = `https://wa.me/${String(store.settings.whatsappNumber || '').replace(/\D/g, '')}`;
  next();
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true, limit: '4mb' }));
app.use(express.json({ limit: '4mb' }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 12
    }
  })
);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(setViewLocals);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    }
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(png|jpe?g|webp|gif|svg\+xml)/i.test(file.mimetype);
    if (!ok) return cb(new Error('Hanya file gambar yang diizinkan.'));
    cb(null, true);
  }
});

function renderPage(res, view, options = {}) {
  const settings = res.locals.settings || baseSettings();
  const defaultSeo = {
    title: settings.metaTitle || settings.siteName,
    description: settings.metaDescription || settings.siteDescription,
    canonical: `${BASE_URL}${res.locals.path || '/'}`,
    image: `${BASE_URL}/public/og-default.svg`,
    robots: 'index,follow'
  };
  return res.render(view, { seo: { ...defaultSeo, ...(options.seo || {}) }, ...options });
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, dataDir: ACTIVE_DATA_DIR, time: nowIso() });
});

app.get('/favicon.svg', (req, res) => {
  const settings = getStore().settings;
  const primary = settings.secondaryColor || '#7D8F69';
  const accent = settings.accentColor || '#F7F4EE';
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="18" fill="${accent}"/>
    <rect x="6" y="6" width="52" height="52" rx="14" fill="white" stroke="${primary}" stroke-width="2"/>
    <text x="32" y="38" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="${primary}">CS</text>
  </svg>`;
  res.type('image/svg+xml').send(svg);
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send([
    'User-agent: *',
    'Allow: /',
    `Disallow: ${ADMIN_ROUTE}`,
    `Disallow: ${ADMIN_ROUTE}/`,
    'Disallow: /uploads/private/',
    `Sitemap: ${BASE_URL}/sitemap.xml`
  ].join('\n'));
});

app.get('/sitemap.xml', (_req, res) => {
  const store = getStore();
  const urls = [
    '/',
    '/catherine-slim',
    '/obat-diet',
    '/produk',
    '/artikel',
    '/promo',
    '/faq',
    '/testimoni',
    '/tentang-kami',
    '/kontak',
    '/kebijakan-privasi',
    '/syarat-ketentuan',
    '/disclaimer'
  ];

  publishOnly(store.products).forEach((item) => urls.push(`/produk/${item.slug}`));
  publishOnly(store.articles).forEach((item) => urls.push(`/artikel/${item.slug}`));
  publishOnly(store.promos).forEach((item) => urls.push(`/promo/${item.slug}`));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>${BASE_URL}${url}</loc>
        <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
        <priority>${url === '/' ? '1.0' : ['\/catherine-slim', '\/obat-diet'].includes(url) ? '0.9' : '0.8'}</priority>
      </url>`
      )
      .join('')}
  </urlset>`;

  res.type('application/xml').send(xml);
});

app.get('/', (req, res) => {
  const store = getStore();
  const products = sortNewest(publishOnly(store.products)).slice(0, 6);
  const articles = sortNewest(publishOnly(store.articles)).slice(0, 4);
  const promos = sortNewest(publishOnly(store.promos)).slice(0, 3);
  renderPage(res, 'home', {
    products,
    articles,
    promos,
    seo: {
      title: 'Catherine Slim | Produk, Promo, Artikel, dan Konsultasi WhatsApp',
      description:
        'Website profesional Catherine Slim dengan produk unggulan, promo yang jelas, artikel SEO, FAQ, dan tombol WhatsApp untuk konsultasi cepat.',
      canonical: `${BASE_URL}/`
    }
  });
});

app.get('/catherine-slim', (req, res) => {
  const store = getStore();
  const products = sortNewest(publishOnly(store.products));
  const articles = sortNewest(publishOnly(store.articles)).slice(0, 6);
  renderPage(res, 'landing-catherine', {
    products,
    articles,
    seo: {
      title: 'Catherine Slim | Informasi Produk, Promo, dan FAQ',
      description: 'Lihat informasi Catherine Slim, promo terbaru, FAQ, dan artikel pendukung dalam tampilan profesional.',
      canonical: `${BASE_URL}/catherine-slim`
    }
  });
});

app.get('/obat-diet', (req, res) => {
  const store = getStore();
  const articles = sortNewest(publishOnly(store.articles));
  renderPage(res, 'landing-obat-diet', {
    articles,
    seo: {
      title: 'Obat Diet | Halaman SEO dan Panduan Catherine Slim',
      description: 'Halaman keyword obat diet dengan struktur rapi, FAQ, artikel terkait, dan jalur konsultasi WhatsApp.',
      canonical: `${BASE_URL}/obat-diet`
    }
  });
});

app.get('/produk', (req, res) => {
  const store = getStore();
  const q = String(req.query.q || '').toLowerCase().trim();
  let products = sortNewest(publishOnly(store.products));
  if (q) {
    products = products.filter((item) => [item.name, item.category, item.shortDesc, item.desc].join(' ').toLowerCase().includes(q));
  }
  renderPage(res, 'produk-list', {
    products,
    q,
    seo: {
      title: q ? `Produk Catherine Slim untuk pencarian ${q}` : 'Produk Catherine Slim | Daftar Produk dan Paket Promo',
      description: 'Lihat daftar produk Catherine Slim, paket hemat, promo aktif, dan detail produk yang profesional.',
      canonical: `${BASE_URL}/produk${q ? `?q=${encodeURIComponent(q)}` : ''}`
    }
  });
});

app.get('/produk/:slug', (req, res) => {
  const store = getStore();
  const product = publishOnly(store.products).find((item) => item.slug === req.params.slug);
  if (!product) return res.status(404).render('404', { seo: { title: 'Halaman tidak ditemukan', robots: 'noindex,nofollow' } });
  const related = sortNewest(publishOnly(store.products).filter((item) => item.slug !== product.slug)).slice(0, 4);
  renderPage(res, 'produk-detail', {
    product,
    related,
    seo: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || excerpt(product.shortDesc || product.desc, 155),
      canonical: `${BASE_URL}/produk/${product.slug}`
    }
  });
});

app.get('/artikel', (req, res) => {
  const store = getStore();
  const q = String(req.query.q || '').toLowerCase().trim();
  let articles = sortNewest(publishOnly(store.articles));
  if (q) {
    articles = articles.filter((item) => [item.title, item.excerpt, stripHtml(item.content), (item.keywords || []).join(' ')].join(' ').toLowerCase().includes(q));
  }
  renderPage(res, 'artikel-list', {
    articles,
    q,
    seo: {
      title: q ? `Artikel Catherine Slim untuk pencarian ${q}` : 'Artikel Catherine Slim | Panduan dan Konten SEO',
      description: 'Baca artikel Catherine Slim tentang produk, promo, keyword pendukung, dan panduan website profesional.',
      canonical: `${BASE_URL}/artikel${q ? `?q=${encodeURIComponent(q)}` : ''}`
    }
  });
});

app.get('/artikel/:slug', (req, res) => {
  const store = getStore();
  const article = publishOnly(store.articles).find((item) => item.slug === req.params.slug);
  if (!article) return res.status(404).render('404', { seo: { title: 'Halaman tidak ditemukan', robots: 'noindex,nofollow' } });
  const related = sortNewest(publishOnly(store.articles).filter((item) => item.slug !== article.slug)).slice(0, 4);
  renderPage(res, 'artikel-detail', {
    article,
    related,
    seo: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || excerpt(article.content, 155),
      canonical: `${BASE_URL}/artikel/${article.slug}`
    }
  });
});

app.get('/promo', (req, res) => {
  const store = getStore();
  const promos = sortNewest(publishOnly(store.promos));
  renderPage(res, 'promo-list', {
    promos,
    seo: {
      title: 'Promo Catherine Slim | Penawaran dan Paket Aktif',
      description: 'Lihat promo Catherine Slim yang sedang aktif dengan informasi penawaran dan CTA yang jelas.',
      canonical: `${BASE_URL}/promo`
    }
  });
});

app.get('/promo/:slug', (req, res) => {
  const store = getStore();
  const promo = publishOnly(store.promos).find((item) => item.slug === req.params.slug);
  if (!promo) return res.status(404).render('404', { seo: { title: 'Halaman tidak ditemukan', robots: 'noindex,nofollow' } });
  renderPage(res, 'promo-detail', {
    promo,
    seo: {
      title: promo.title,
      description: excerpt(promo.description, 155),
      canonical: `${BASE_URL}/promo/${promo.slug}`
    }
  });
});

app.get('/testimoni', (_req, res) => renderPage(res, 'testimoni', { seo: { title: 'Testimoni Catherine Slim', canonical: `${BASE_URL}/testimoni` } }));
app.get('/faq', (_req, res) => renderPage(res, 'faq', { seo: { title: 'FAQ Catherine Slim', canonical: `${BASE_URL}/faq` } }));
app.get('/tentang-kami', (_req, res) => renderPage(res, 'tentang', { seo: { title: 'Tentang Catherine Slim', canonical: `${BASE_URL}/tentang-kami` } }));
app.get('/kontak', (_req, res) => renderPage(res, 'kontak', { seo: { title: 'Kontak Catherine Slim', canonical: `${BASE_URL}/kontak` } }));
app.get('/kebijakan-privasi', (_req, res) => renderPage(res, 'kebijakan-privasi', { seo: { title: 'Kebijakan Privasi Catherine Slim', canonical: `${BASE_URL}/kebijakan-privasi` } }));
app.get('/syarat-ketentuan', (_req, res) => renderPage(res, 'syarat-ketentuan', { seo: { title: 'Syarat dan Ketentuan Catherine Slim', canonical: `${BASE_URL}/syarat-ketentuan` } }));
app.get('/disclaimer', (_req, res) => renderPage(res, 'disclaimer', { seo: { title: 'Disclaimer Catherine Slim', canonical: `${BASE_URL}/disclaimer` } }));

app.get(ADMIN_ROUTE, (req, res) => {
  if (req.session?.admin) return res.redirect(`${ADMIN_ROUTE}/dashboard`);
  renderPage(res, 'admin-login', { seo: { title: 'Login Admin', robots: 'noindex,nofollow' }, error: '' });
});

app.post(ADMIN_ROUTE, (req, res) => {
  const adminId = String(req.body.adminId || '').trim();
  const password = String(req.body.password || '');
  if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    req.session.adminId = adminId;
    return res.redirect(`${ADMIN_ROUTE}/dashboard`);
  }
  return renderPage(res, 'admin-login', {
    seo: { title: 'Login Admin', robots: 'noindex,nofollow' },
    error: 'ID atau password salah.'
  });
});

app.post(`${ADMIN_ROUTE}/logout`, requireAdmin, (req, res) => {
  req.session.destroy(() => res.redirect(ADMIN_ROUTE));
});

app.get(`${ADMIN_ROUTE}/dashboard`, requireAdmin, (req, res) => {
  const store = getStore();
  renderPage(res, 'admin-dashboard', {
    seo: { title: 'Dashboard Admin', robots: 'noindex,nofollow' },
    stats: {
      products: store.products.length,
      articles: store.articles.length,
      promos: store.promos.length,
      productsPublished: publishOnly(store.products).length,
      articlesPublished: publishOnly(store.articles).length,
      promosPublished: publishOnly(store.promos).length
    }
  });
});

app.get(`${ADMIN_ROUTE}/products`, requireAdmin, (req, res) => {
  const store = getStore();
  renderPage(res, 'admin-products', { seo: { title: 'Kelola Produk', robots: 'noindex,nofollow' }, products: sortNewest(store.products) });
});

app.get(`${ADMIN_ROUTE}/products/new`, requireAdmin, (req, res) => {
  renderPage(res, 'admin-product-form', { seo: { title: 'Tambah Produk', robots: 'noindex,nofollow' }, item: null });
});

app.get(`${ADMIN_ROUTE}/products/edit/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  const item = store.products.find((x) => x.id === req.params.id);
  if (!item) return res.redirect(`${ADMIN_ROUTE}/products`);
  renderPage(res, 'admin-product-form', { seo: { title: 'Edit Produk', robots: 'noindex,nofollow' }, item });
});

app.post(`${ADMIN_ROUTE}/products/save`, requireAdmin, upload.single('image'), (req, res) => {
  const store = getStore();
  const ts = nowIso();
  const id = String(req.body.id || '').trim();
  const item = {
    id: id || createId('prd'),
    name: String(req.body.name || '').trim(),
    slug: safeSlug(req.body.slug || req.body.name || 'produk'),
    category: String(req.body.category || '').trim(),
    shortDesc: String(req.body.shortDesc || '').trim(),
    desc: String(req.body.desc || '').trim(),
    benefits: parseLines(req.body.benefits),
    usage: parseLines(req.body.usage),
    price: Number(req.body.price || 0),
    promoPrice: Number(req.body.promoPrice || 0),
    isPromo: boolish(req.body.isPromo),
    promoLabel: String(req.body.promoLabel || '').trim(),
    image: req.file ? req.file.filename : String(req.body.currentImage || '').trim(),
    gallery: [],
    status: String(req.body.status || 'draft'),
    isFeatured: boolish(req.body.isFeatured),
    metaTitle: String(req.body.metaTitle || '').trim(),
    metaDescription: String(req.body.metaDescription || '').trim(),
    createdAt: ts,
    updatedAt: ts
  };

  const existingIndex = store.products.findIndex((x) => x.id === item.id);
  if (existingIndex >= 0) {
    item.createdAt = store.products[existingIndex].createdAt || ts;
    store.products[existingIndex] = { ...store.products[existingIndex], ...item, updatedAt: ts };
  } else {
    store.products.unshift(item);
  }
  saveStorePart('products', store.products);
  res.redirect(`${ADMIN_ROUTE}/products`);
});

app.post(`${ADMIN_ROUTE}/products/delete/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  saveStorePart('products', store.products.filter((x) => x.id !== req.params.id));
  res.redirect(`${ADMIN_ROUTE}/products`);
});

app.post(`${ADMIN_ROUTE}/products/toggle/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  const items = store.products.map((x) => (x.id === req.params.id ? { ...x, status: x.status === 'publish' ? 'nonpublish' : 'publish', updatedAt: nowIso() } : x));
  saveStorePart('products', items);
  res.redirect(`${ADMIN_ROUTE}/products`);
});

app.get(`${ADMIN_ROUTE}/articles`, requireAdmin, (req, res) => {
  const store = getStore();
  renderPage(res, 'admin-articles', { seo: { title: 'Kelola Artikel', robots: 'noindex,nofollow' }, articles: sortNewest(store.articles) });
});

app.get(`${ADMIN_ROUTE}/articles/new`, requireAdmin, (req, res) => renderPage(res, 'admin-article-form', { seo: { title: 'Tambah Artikel', robots: 'noindex,nofollow' }, item: null }));
app.get(`${ADMIN_ROUTE}/articles/edit/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  const item = store.articles.find((x) => x.id === req.params.id);
  if (!item) return res.redirect(`${ADMIN_ROUTE}/articles`);
  renderPage(res, 'admin-article-form', { seo: { title: 'Edit Artikel', robots: 'noindex,nofollow' }, item });
});
app.post(`${ADMIN_ROUTE}/articles/save`, requireAdmin, upload.single('coverImage'), (req, res) => {
  const store = getStore();
  const ts = nowIso();
  const id = String(req.body.id || '').trim();
  const item = {
    id: id || createId('art'),
    title: String(req.body.title || '').trim(),
    slug: safeSlug(req.body.slug || req.body.title || 'artikel'),
    excerpt: String(req.body.excerpt || '').trim(),
    content: String(req.body.content || '').trim(),
    coverImage: req.file ? req.file.filename : String(req.body.currentImage || '').trim(),
    keywords: parseLines(req.body.keywords),
    status: String(req.body.status || 'draft'),
    metaTitle: String(req.body.metaTitle || '').trim(),
    metaDescription: String(req.body.metaDescription || '').trim(),
    createdAt: ts,
    updatedAt: ts
  };
  const existingIndex = store.articles.findIndex((x) => x.id === item.id);
  if (existingIndex >= 0) {
    item.createdAt = store.articles[existingIndex].createdAt || ts;
    store.articles[existingIndex] = { ...store.articles[existingIndex], ...item, updatedAt: ts };
  } else {
    store.articles.unshift(item);
  }
  saveStorePart('articles', store.articles);
  res.redirect(`${ADMIN_ROUTE}/articles`);
});
app.post(`${ADMIN_ROUTE}/articles/delete/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  saveStorePart('articles', store.articles.filter((x) => x.id !== req.params.id));
  res.redirect(`${ADMIN_ROUTE}/articles`);
});
app.post(`${ADMIN_ROUTE}/articles/toggle/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  const items = store.articles.map((x) => (x.id === req.params.id ? { ...x, status: x.status === 'publish' ? 'nonpublish' : 'publish', updatedAt: nowIso() } : x));
  saveStorePart('articles', items);
  res.redirect(`${ADMIN_ROUTE}/articles`);
});

app.get(`${ADMIN_ROUTE}/promos`, requireAdmin, (req, res) => {
  const store = getStore();
  renderPage(res, 'admin-promos', { seo: { title: 'Kelola Promo', robots: 'noindex,nofollow' }, promos: sortNewest(store.promos) });
});
app.get(`${ADMIN_ROUTE}/promos/new`, requireAdmin, (req, res) => renderPage(res, 'admin-promo-form', { seo: { title: 'Tambah Promo', robots: 'noindex,nofollow' }, item: null }));
app.get(`${ADMIN_ROUTE}/promos/edit/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  const item = store.promos.find((x) => x.id === req.params.id);
  if (!item) return res.redirect(`${ADMIN_ROUTE}/promos`);
  renderPage(res, 'admin-promo-form', { seo: { title: 'Edit Promo', robots: 'noindex,nofollow' }, item });
});
app.post(`${ADMIN_ROUTE}/promos/save`, requireAdmin, upload.single('image'), (req, res) => {
  const store = getStore();
  const ts = nowIso();
  const id = String(req.body.id || '').trim();
  const item = {
    id: id || createId('prm'),
    title: String(req.body.title || '').trim(),
    slug: safeSlug(req.body.slug || req.body.title || 'promo'),
    description: String(req.body.description || '').trim(),
    image: req.file ? req.file.filename : String(req.body.currentImage || '').trim(),
    buttonText: String(req.body.buttonText || '').trim() || 'Lihat Promo',
    buttonLink: String(req.body.buttonLink || '').trim() || '/promo',
    startDate: String(req.body.startDate || '').trim(),
    endDate: String(req.body.endDate || '').trim(),
    status: String(req.body.status || 'draft'),
    isFeatured: boolish(req.body.isFeatured),
    createdAt: ts,
    updatedAt: ts
  };
  const existingIndex = store.promos.findIndex((x) => x.id === item.id);
  if (existingIndex >= 0) {
    item.createdAt = store.promos[existingIndex].createdAt || ts;
    store.promos[existingIndex] = { ...store.promos[existingIndex], ...item, updatedAt: ts };
  } else {
    store.promos.unshift(item);
  }
  saveStorePart('promos', store.promos);
  res.redirect(`${ADMIN_ROUTE}/promos`);
});
app.post(`${ADMIN_ROUTE}/promos/delete/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  saveStorePart('promos', store.promos.filter((x) => x.id !== req.params.id));
  res.redirect(`${ADMIN_ROUTE}/promos`);
});
app.post(`${ADMIN_ROUTE}/promos/toggle/:id`, requireAdmin, (req, res) => {
  const store = getStore();
  const items = store.promos.map((x) => (x.id === req.params.id ? { ...x, status: x.status === 'publish' ? 'nonpublish' : 'publish', updatedAt: nowIso() } : x));
  saveStorePart('promos', items);
  res.redirect(`${ADMIN_ROUTE}/promos`);
});

app.get(`${ADMIN_ROUTE}/media`, requireAdmin, (req, res) => {
  const files = fs.existsSync(UPLOAD_DIR)
    ? fs.readdirSync(UPLOAD_DIR).map((name) => ({ name, url: publicUploadUrl(name) })).sort((a, b) => b.name.localeCompare(a.name))
    : [];
  renderPage(res, 'admin-media', { seo: { title: 'Media Library', robots: 'noindex,nofollow' }, files });
});
app.post(`${ADMIN_ROUTE}/media/upload`, requireAdmin, upload.single('image'), (req, res) => res.redirect(`${ADMIN_ROUTE}/media`));
app.post(`${ADMIN_ROUTE}/media/delete/:name`, requireAdmin, (req, res) => {
  const fileName = path.basename(req.params.name);
  const filePath = path.join(UPLOAD_DIR, fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  res.redirect(`${ADMIN_ROUTE}/media`);
});

app.get(`${ADMIN_ROUTE}/settings`, requireAdmin, (req, res) => {
  const store = getStore();
  renderPage(res, 'admin-settings', { seo: { title: 'Pengaturan Website', robots: 'noindex,nofollow' }, item: store.settings });
});
app.post(`${ADMIN_ROUTE}/settings`, requireAdmin, (req, res) => {
  const current = getStore().settings;
  const next = {
    ...current,
    siteName: String(req.body.siteName || current.siteName).trim(),
    siteTagline: String(req.body.siteTagline || current.siteTagline).trim(),
    siteDescription: String(req.body.siteDescription || current.siteDescription).trim(),
    whatsappNumber: String(req.body.whatsappNumber || current.whatsappNumber).trim(),
    heroTitle: String(req.body.heroTitle || current.heroTitle).trim(),
    heroSubtitle: String(req.body.heroSubtitle || current.heroSubtitle).trim(),
    topPromoText: String(req.body.topPromoText || current.topPromoText).trim(),
    topPromoActive: boolish(req.body.topPromoActive),
    logoText: String(req.body.logoText || current.logoText).trim(),
    footerText: String(req.body.footerText || current.footerText).trim(),
    primaryColor: String(req.body.primaryColor || current.primaryColor).trim(),
    secondaryColor: String(req.body.secondaryColor || current.secondaryColor).trim(),
    accentColor: String(req.body.accentColor || current.accentColor).trim(),
    metaTitle: String(req.body.metaTitle || current.metaTitle).trim(),
    metaDescription: String(req.body.metaDescription || current.metaDescription).trim()
  };
  saveStorePart('settings', next);
  res.redirect(`${ADMIN_ROUTE}/settings`);
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500);
  if (req.path.startsWith(ADMIN_ROUTE)) {
    return renderPage(res, 'admin-message', { seo: { title: 'Terjadi kesalahan', robots: 'noindex,nofollow' }, message: err.message || 'Terjadi kesalahan.' });
  }
  return renderPage(res, '500', { seo: { title: 'Terjadi kesalahan', robots: 'noindex,nofollow' } });
});

app.use((req, res) => {
  res.status(404);
  renderPage(res, '404', { seo: { title: 'Halaman tidak ditemukan', robots: 'noindex,nofollow' } });
});

app.listen(PORT, () => {
  console.log(`Catherine Slim app running on port ${PORT}`);
  console.log(`Data directory: ${ACTIVE_DATA_DIR}`);
});
