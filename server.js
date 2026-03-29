const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const slugify = require('slugify');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const BASE_URL = (process.env.BASE_URL || 'https://example.com').replace(/\/$/, '');
const SESSION_SECRET = process.env.SESSION_SECRET || 'Cathrine-slim-secret';
const ADMIN_ID = process.env.ADMIN_ID || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
const PREFERRED_DATA_DIR = process.env.DATA_DIR || '/data';
const DATA_DIR = fs.existsSync(PREFERRED_DATA_DIR)
  ? PREFERRED_DATA_DIR
  : path.join(__dirname, 'data');

const FILES = {
  products: path.join(DATA_DIR, 'products.json'),
  articles: path.join(DATA_DIR, 'articles.json'),
  promo: path.join(DATA_DIR, 'promo.json'),
  testimonials: path.join(DATA_DIR, 'testimonials.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
  popup: path.join(DATA_DIR, 'popup.json')
};

const DEFAULT_SETTINGS = {
  brandName: 'Cathrine Slim',
  brandTagline: 'Official Store',
  siteTitle: 'Cathrine Slim Official Store',
  homeTitle: 'Cathrine Slim Official Store | Cathrine Slim Asli & Obat Diet Premium',
  defaultMetaTitle: 'Cathrine Slim Official Store | Cathrine Slim Asli & Obat Diet Premium',
  defaultMetaDescription: 'Cathrine Slim Official Store hadir dengan tampilan premium, informasi lengkap produk, artikel edukasi, dan layanan pemesanan cepat via WhatsApp untuk seluruh Indonesia dan Kamboja.',
  defaultKeywords: 'Cathrine Slim, obat diet, Cathrine Slim resmi, Cathrine Slim official store, obat diet premium',
  aboutTitle: 'Tentang Cathrine Slim Official Store',
  aboutContent: '<p><strong>Cathrine Slim Official Store</strong> adalah website resmi dengan tampilan premium yang fokus menampilkan informasi produk Cathrine Slim, artikel edukasi seputar pola hidup sehat, dan layanan pemesanan via WhatsApp yang cepat dan mudah.</p><p>Kami menghadirkan pengalaman belanja yang elegan, ringan, mobile friendly, dan dibuat khusus agar kuat secara SEO untuk keyword seperti <em>Cathrine Slim</em> dan <em>obat diet</em>.</p>',
  partnerTitle: 'Jadi Mitra Cathrine Slim',
  partnerContent: '<p>Bergabunglah menjadi mitra Cathrine Slim untuk menjangkau pelanggan lebih luas. Kami membuka peluang reseller, dropship, dan partner promosi dengan sistem yang mudah dipahami.</p><p>Hubungi tim kami melalui WhatsApp untuk mendapatkan informasi katalog, promo, dan arahan kerja sama.</p>',
  heroTitle: 'Cathrine Slim Official Store',
  heroSubtitle: 'Obat Diet Premium dengan tampilan elegan, informasi lengkap, dan layanan pesan cepat via WhatsApp.',
  heroDescription: 'Cathrine Slim hadir untuk Anda yang mencari produk dengan tampilan premium, edukasi lengkap, dan pengalaman belanja yang nyaman. Website ini dirancang ringan, cepat, mobile friendly, dan sangat kuat untuk SEO.',
  shippingText: 'Bisa kirim seluruh Indonesia dan Kamboja',
  whatsappNumber: '6281234567890',
  whatsappMessage: 'Halo Cathrine Slim Official Store, saya ingin order Cathrine Slim.',
  csLabel: 'Customer Service',
  jntImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/J%26T_Express_logo.svg/512px-J%26T_Express_logo.svg.png',
  sicepatImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/SiCepat_logo.svg/512px-SiCepat_logo.svg.png',
  ogImage: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80',
  footerText: 'Cathrine Slim Official Store menghadirkan tampilan premium, ringan, dan SEO friendly untuk kebutuhan penjualan online modern.',
  themeAccent: '#d4b483',
  themeSoft: '#f5e8ea'
};

const DEFAULT_POPUP = {
  enabled: true,
  title: 'Promo Cathrine Slim',
  message: 'Dapatkan informasi promo Cathrine Slim terbaru dan konsultasi cepat via WhatsApp.',
  buttonText: 'Chat WhatsApp',
  buttonLink: ''
};

const defaultProducts = [
  {
    id: createId(),
    name: 'Cathrine Slim Original',
    slug: 'Cathrine-slim-original',
    shortDesc: 'Cathrine Slim Original dengan tampilan premium dan informasi lengkap untuk kebutuhan promosi dan penjualan online.',
    description: '<p><strong>Cathrine Slim Original</strong> ditampilkan dengan gaya premium untuk membantu meningkatkan kepercayaan calon pembeli. Halaman produk ini dibuat SEO friendly, mobile friendly, dan siap diarahkan ke checkout WhatsApp.</p><h2>Kenapa memilih Cathrine Slim?</h2><ul><li>Tampilan produk elegan dan profesional</li><li>Informasi produk rapi dan mudah dibaca</li><li>Checkout cepat via WhatsApp</li></ul>',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    price: 'Rp 285.000',
    category: 'Obat Diet',
    isPublished: true,
    metaTitle: 'Cathrine Slim Original | Cathrine Slim Official Store',
    metaDescription: 'Cathrine Slim Original hadir di website premium dengan tampilan elegan, SEO kuat, dan checkout via WhatsApp. Cocok untuk pencarian Cathrine Slim dan obat diet.',
    keywords: 'Cathrine Slim, Cathrine Slim original, obat diet, Cathrine Slim resmi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: createId(),
    name: 'Paket Cathrine Slim Premium',
    slug: 'paket-Cathrine-slim-premium',
    shortDesc: 'Paket Cathrine Slim Premium untuk promosi eksklusif dengan halaman produk SEO friendly dan desain mewah.',
    description: '<p>Paket ini cocok untuk kebutuhan penjualan dengan tampilan elegan dan pengalaman pengguna yang nyaman di desktop maupun mobile.</p><h2>Keunggulan paket premium</h2><ul><li>Visual premium</li><li>Checkout cepat</li><li>Siap untuk promosi dan optimasi SEO</li></ul>',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    price: 'Rp 499.000',
    category: 'Obat Diet',
    isPublished: true,
    metaTitle: 'Paket Cathrine Slim Premium | Obat Diet Premium',
    metaDescription: 'Paket Cathrine Slim Premium dengan tampilan premium, ringan, dan dirancang untuk ranking kuat di Google pada keyword Cathrine Slim dan obat diet.',
    keywords: 'Cathrine Slim, obat diet premium, paket Cathrine Slim',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultArticles = [
  {
    id: createId(),
    title: 'Cathrine Slim: Website Premium untuk Pencarian Obat Diet Modern',
    slug: 'Cathrine-slim-website-premium-obat-diet-modern',
    excerpt: 'Mengenal tampilan premium Cathrine Slim Official Store yang dirancang ringan, elegan, dan SEO friendly.',
    content: '<p><strong>Cathrine Slim</strong> menjadi keyword utama dalam website ini. Struktur halaman, heading, internal link, dan metadata disusun agar kuat untuk persaingan SEO.</p><h2>Kenapa halaman ini SEO friendly?</h2><p>Karena menggunakan URL rapi, heading terstruktur, konten relevan, canonical, schema, dan internal link yang menghubungkan artikel ke halaman produk seperti <a href="/produk/Cathrine-slim-original">Cathrine Slim Original</a>.</p>',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    metaTitle: 'Cathrine Slim dan Strategi SEO untuk Keyword Obat Diet',
    metaDescription: 'Pelajari bagaimana Cathrine Slim Official Store dibangun dengan struktur SEO kuat untuk keyword Cathrine Slim dan obat diet.',
    keywords: 'Cathrine Slim, obat diet, strategi seo Cathrine Slim',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: createId(),
    title: 'Tips Memilih Halaman Produk Cathrine Slim yang Meyakinkan',
    slug: 'tips-memilih-halaman-produk-Cathrine-slim-yang-meyakinkan',
    excerpt: 'Elemen penting untuk membuat halaman produk Cathrine Slim terlihat profesional dan premium.',
    content: '<p>Halaman produk yang meyakinkan harus memiliki visual yang bersih, CTA yang jelas, metadata SEO lengkap, dan navigasi yang nyaman di mobile. Dalam website ini, semua itu sudah disiapkan agar pengalaman pengguna terasa premium.</p><p>Lihat juga halaman <a href="/produk">produk Cathrine Slim</a> untuk menemukan tampilan grid yang rapi dan modern.</p>',
    coverImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
    metaTitle: 'Tips Halaman Produk Cathrine Slim yang Premium',
    metaDescription: 'Panduan membangun halaman produk Cathrine Slim yang premium, mobile friendly, dan SEO friendly untuk meningkatkan kualitas website.',
    keywords: 'Cathrine Slim, halaman produk premium, obat diet',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultPromo = [
  {
    id: createId(),
    title: 'Promo Cathrine Slim Official Store',
    slug: 'promo-Cathrine-slim-official-store',
    excerpt: 'Hubungi WhatsApp untuk mendapatkan informasi promo Cathrine Slim terbaru.',
    content: '<p>Dapatkan info promo Cathrine Slim terbaru, penawaran mitra, dan konsultasi cepat melalui WhatsApp official store.</p>',
    isPublished: true,
    metaTitle: 'Promo Cathrine Slim Terbaru',
    metaDescription: 'Halaman promo resmi Cathrine Slim untuk melihat penawaran terbaru dan menghubungi customer service.',
    keywords: 'promo Cathrine Slim, diskon Cathrine Slim',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultTestimonials = [
  {
    id: createId(),
    name: 'Alya',
    city: 'Jakarta',
    quote: 'Website Cathrine Slim ini terlihat sangat premium dan membuat saya lebih yakin untuk order via WhatsApp.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: createId(),
    name: 'Mira',
    city: 'Surabaya',
    quote: 'Tampilannya bersih, mewah, dan enak dibuka di HP. Proses chat ke customer service juga cepat.',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

initStorage();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

app.use((req, res, next) => {
  const settings = readJson(FILES.settings, DEFAULT_SETTINGS);
  const popup = readJson(FILES.popup, DEFAULT_POPUP);
  res.locals.brand = settings;
  res.locals.popup = popup;
  res.locals.currentPath = req.path;
  res.locals.baseUrl = BASE_URL;
  res.locals.isAdmin = Boolean(req.session && req.session.isAdmin);
  res.locals.whatsappLink = buildWhatsAppLink(settings.whatsappNumber, settings.whatsappMessage);
  next();
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/', (req, res) => {
  const settings = getSettings();
  const products = getPublished('products').slice(0, 4);
  const articles = getPublished('articles').slice(0, 4);
  const testimonials = getPublished('testimonials').slice(0, 6);
  res.render('home', buildPageData({
    req,
    title: settings.homeTitle,
    metaTitle: settings.homeTitle,
    metaDescription: settings.defaultMetaDescription,
    keywords: settings.defaultKeywords,
    ogImage: settings.ogImage,
    schema: [websiteSchema(), breadcrumbSchema([{ name: 'Home', url: BASE_URL + '/' }])],
    products,
    articles,
    testimonials,
    settings
  }));
});

app.get('/produk', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  let products = getPublished('products');
  if (q) {
    products = products.filter(item => `${item.name} ${item.shortDesc} ${item.description} ${item.keywords} ${item.category}`.toLowerCase().includes(q));
  }
  res.render('products', buildPageData({
    req,
    title: 'Produk Cathrine Slim',
    metaTitle: 'Produk Cathrine Slim | Cathrine Slim Official Store',
    metaDescription: 'Temukan produk Cathrine Slim dengan tampilan premium, metadata SEO lengkap, dan checkout cepat via WhatsApp.',
    keywords: 'produk Cathrine Slim, Cathrine Slim, obat diet',
    schema: [breadcrumbSchema([
      { name: 'Home', url: BASE_URL + '/' },
      { name: 'Produk', url: BASE_URL + '/produk' }
    ])],
    products,
    q
  }));
});

app.get('/produk/:slug', (req, res) => {
  const product = getPublished('products').find(item => item.slug === req.params.slug);
  if (!product) return res.status(404).render('404', buildPageData({ req, title: 'Produk tidak ditemukan', metaTitle: 'Produk tidak ditemukan' }));
  const relatedProducts = getPublished('products').filter(item => item.slug !== product.slug).slice(0, 4);
  res.render('product-detail', buildPageData({
    req,
    title: product.name,
    metaTitle: product.metaTitle || `${product.name} | Cathrine Slim Official Store`,
    metaDescription: product.metaDescription || product.shortDesc,
    keywords: product.keywords || 'Cathrine Slim, obat diet',
    ogImage: product.imageUrl,
    schema: [
      breadcrumbSchema([
        { name: 'Home', url: BASE_URL + '/' },
        { name: 'Produk', url: BASE_URL + '/produk' },
        { name: product.name, url: `${BASE_URL}/produk/${product.slug}` }
      ]),
      productSchema(product)
    ],
    product,
    relatedProducts
  }));
});

app.get('/artikel', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  let articles = getPublished('articles');
  if (q) {
    articles = articles.filter(item => `${item.title} ${item.excerpt} ${item.content} ${item.keywords}`.toLowerCase().includes(q));
  }
  res.render('articles', buildPageData({
    req,
    title: 'Artikel Cathrine Slim',
    metaTitle: 'Artikel Cathrine Slim | Cathrine Slim Official Store',
    metaDescription: 'Baca artikel Cathrine Slim yang SEO friendly, informatif, dan terhubung ke halaman produk untuk memperkuat struktur internal link.',
    keywords: 'artikel Cathrine Slim, obat diet, Cathrine Slim',
    schema: [breadcrumbSchema([
      { name: 'Home', url: BASE_URL + '/' },
      { name: 'Artikel', url: BASE_URL + '/artikel' }
    ])],
    articles,
    q
  }));
});

app.get('/artikel/:slug', (req, res) => {
  const article = getPublished('articles').find(item => item.slug === req.params.slug);
  if (!article) return res.status(404).render('404', buildPageData({ req, title: 'Artikel tidak ditemukan', metaTitle: 'Artikel tidak ditemukan' }));
  const latestArticles = getPublished('articles').filter(item => item.slug !== article.slug).slice(0, 4);
  const productLinks = getPublished('products').slice(0, 4);
  res.render('article-detail', buildPageData({
    req,
    title: article.title,
    metaTitle: article.metaTitle || article.title,
    metaDescription: article.metaDescription || article.excerpt,
    keywords: article.keywords || 'Cathrine Slim, obat diet',
    ogImage: article.coverImage,
    schema: [
      breadcrumbSchema([
        { name: 'Home', url: BASE_URL + '/' },
        { name: 'Artikel', url: BASE_URL + '/artikel' },
        { name: article.title, url: `${BASE_URL}/artikel/${article.slug}` }
      ]),
      articleSchema(article)
    ],
    article,
    latestArticles,
    productLinks
  }));
});

app.get('/promo', (req, res) => {
  const promos = getPublished('promo');
  res.render('promo', buildPageData({
    req,
    title: 'Promo Cathrine Slim',
    metaTitle: 'Promo Cathrine Slim | Cathrine Slim Official Store',
    metaDescription: 'Lihat promo Cathrine Slim resmi yang hanya tampil pada halaman promo khusus.',
    keywords: 'promo Cathrine Slim, Cathrine Slim',
    schema: [breadcrumbSchema([
      { name: 'Home', url: BASE_URL + '/' },
      { name: 'Promo', url: BASE_URL + '/promo' }
    ])],
    promos
  }));
});

app.get('/tentang-kami', (req, res) => {
  const settings = getSettings();
  res.render('page', buildPageData({
    req,
    title: settings.aboutTitle,
    metaTitle: settings.aboutTitle,
    metaDescription: stripHtml(settings.aboutContent).slice(0, 160),
    keywords: 'tentang Cathrine Slim, Cathrine Slim official store',
    schema: [breadcrumbSchema([
      { name: 'Home', url: BASE_URL + '/' },
      { name: 'Tentang Kami', url: BASE_URL + '/tentang-kami' }
    ])],
    pageTitle: settings.aboutTitle,
    pageContent: settings.aboutContent
  }));
});

app.get('/jadi-mitra', (req, res) => {
  const settings = getSettings();
  res.render('page', buildPageData({
    req,
    title: settings.partnerTitle,
    metaTitle: settings.partnerTitle,
    metaDescription: stripHtml(settings.partnerContent).slice(0, 160),
    keywords: 'jadi mitra Cathrine Slim, reseller Cathrine Slim',
    schema: [breadcrumbSchema([
      { name: 'Home', url: BASE_URL + '/' },
      { name: 'Jadi Mitra', url: BASE_URL + '/jadi-mitra' }
    ])],
    pageTitle: settings.partnerTitle,
    pageContent: settings.partnerContent
  }));
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
  const urls = [
    '/', '/produk', '/artikel', '/promo', '/tentang-kami', '/jadi-mitra'
  ];
  getPublished('products').forEach(item => urls.push(`/produk/${item.slug}`));
  getPublished('articles').forEach(item => urls.push(`/artikel/${item.slug}`));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${BASE_URL}${url}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`).join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
});

app.get('/itsiregar24', requireGuest, (req, res) => {
  res.render('admin-login', buildPageData({ req, title: 'Login Admin', metaTitle: 'Login Admin Cathrine Slim' }));
});

app.post('/itsiregar24', requireGuest, (req, res) => {
  const { adminId, password } = req.body;
  if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect('/itsiregar24/dashboard');
  }
  return res.render('admin-login', buildPageData({ req, title: 'Login Admin', metaTitle: 'Login Admin Cathrine Slim', error: 'ID atau password salah.' }));
});

app.post('/itsiregar24/logout', requireAdmin, (req, res) => {
  req.session.destroy(() => res.redirect('/itsiregar24'));
});

app.get('/itsiregar24/dashboard', requireAdmin, (req, res) => {
  res.render('admin-dashboard', buildPageData({
    req,
    title: 'Dashboard Admin',
    metaTitle: 'Dashboard Admin',
    counts: {
      products: readCollection('products').length,
      articles: readCollection('articles').length,
      promo: readCollection('promo').length,
      testimonials: readCollection('testimonials').length
    }
  }));
});

app.get('/itsiregar24/:type', requireAdmin, (req, res) => {
  const type = normalizeType(req.params.type);
  if (!type) return res.redirect('/itsiregar24/dashboard');
  if (type === 'settings') {
    return res.render('admin-settings', buildPageData({ req, title: 'SEO & Pengaturan', metaTitle: 'SEO & Pengaturan', settings: getSettings(), popup: readJson(FILES.popup, DEFAULT_POPUP) }));
  }
  const items = readCollection(type);
  return res.render('admin-list', buildPageData({ req, title: `Admin ${labelFromType(type)}`, metaTitle: `Admin ${labelFromType(type)}`, type, label: labelFromType(type), items }));
});

app.get('/itsiregar24/:type/new', requireAdmin, (req, res) => {
  const type = normalizeType(req.params.type);
  if (!type || type === 'settings') return res.redirect('/itsiregar24/dashboard');
  res.render('admin-form', buildPageData({ req, title: `Tambah ${labelFromType(type)}`, metaTitle: `Tambah ${labelFromType(type)}`, type, label: labelFromType(type), item: emptyItem(type) }));
});

app.get('/itsiregar24/:type/edit/:id', requireAdmin, (req, res) => {
  const type = normalizeType(req.params.type);
  if (!type || type === 'settings') return res.redirect('/itsiregar24/dashboard');
  const item = readCollection(type).find(entry => entry.id === req.params.id);
  if (!item) return res.redirect(`/itsiregar24/${type}`);
  res.render('admin-form', buildPageData({ req, title: `Edit ${labelFromType(type)}`, metaTitle: `Edit ${labelFromType(type)}`, type, label: labelFromType(type), item }));
});

app.post('/itsiregar24/:type/save', requireAdmin, (req, res) => {
  const type = normalizeType(req.params.type);
  if (!type || type === 'settings') return res.redirect('/itsiregar24/dashboard');
  const collection = readCollection(type);
  const now = new Date().toISOString();
  const id = req.body.id || createId();
  const base = {
    id,
    isPublished: req.body.isPublished === 'on',
    updatedAt: now
  };
  let entry;

  if (type === 'products') {
    const name = clean(req.body.name);
    entry = {
      ...base,
      name,
      slug: makeSlug(req.body.slug || name),
      shortDesc: clean(req.body.shortDesc),
      description: req.body.description || '',
      imageUrl: clean(req.body.imageUrl),
      price: clean(req.body.price),
      category: clean(req.body.category),
      metaTitle: clean(req.body.metaTitle),
      metaDescription: clean(req.body.metaDescription),
      keywords: clean(req.body.keywords)
    };
  } else if (type === 'articles' || type === 'promo') {
    const title = clean(req.body.title);
    entry = {
      ...base,
      title,
      slug: makeSlug(req.body.slug || title),
      excerpt: clean(req.body.excerpt),
      content: req.body.content || '',
      coverImage: clean(req.body.coverImage),
      metaTitle: clean(req.body.metaTitle),
      metaDescription: clean(req.body.metaDescription),
      keywords: clean(req.body.keywords)
    };
  } else if (type === 'testimonials') {
    entry = {
      ...base,
      name: clean(req.body.name),
      city: clean(req.body.city),
      quote: clean(req.body.quote),
      imageUrl: clean(req.body.imageUrl)
    };
  }

  const existing = collection.findIndex(item => item.id === id);
  if (existing > -1) {
    entry.createdAt = collection[existing].createdAt || now;
    collection[existing] = { ...collection[existing], ...entry };
  } else {
    entry.createdAt = now;
    collection.unshift(entry);
  }
  writeCollection(type, collection);
  res.redirect(`/itsiregar24/${type}`);
});

app.post('/itsiregar24/:type/delete/:id', requireAdmin, (req, res) => {
  const type = normalizeType(req.params.type);
  if (!type || type === 'settings') return res.redirect('/itsiregar24/dashboard');
  const collection = readCollection(type).filter(item => item.id !== req.params.id);
  writeCollection(type, collection);
  res.redirect(`/itsiregar24/${type}`);
});

app.post('/itsiregar24/settings', requireAdmin, (req, res) => {
  const current = getSettings();
  const settings = {
    ...current,
    siteTitle: clean(req.body.siteTitle),
    homeTitle: clean(req.body.homeTitle),
    defaultMetaTitle: clean(req.body.defaultMetaTitle),
    defaultMetaDescription: clean(req.body.defaultMetaDescription),
    defaultKeywords: clean(req.body.defaultKeywords),
    heroTitle: clean(req.body.heroTitle),
    heroSubtitle: clean(req.body.heroSubtitle),
    heroDescription: clean(req.body.heroDescription),
    aboutTitle: clean(req.body.aboutTitle),
    aboutContent: req.body.aboutContent || '',
    partnerTitle: clean(req.body.partnerTitle),
    partnerContent: req.body.partnerContent || '',
    whatsappNumber: clean(req.body.whatsappNumber),
    whatsappMessage: clean(req.body.whatsappMessage),
    csLabel: clean(req.body.csLabel),
    shippingText: clean(req.body.shippingText),
    ogImage: clean(req.body.ogImage),
    footerText: clean(req.body.footerText),
    jntImage: clean(req.body.jntImage),
    sicepatImage: clean(req.body.sicepatImage)
  };
  writeJson(FILES.settings, settings);

  const popup = {
    enabled: req.body.popupEnabled === 'on',
    title: clean(req.body.popupTitle),
    message: clean(req.body.popupMessage),
    buttonText: clean(req.body.popupButtonText),
    buttonLink: clean(req.body.popupButtonLink)
  };
  writeJson(FILES.popup, popup);
  res.redirect('/itsiregar24/settings');
});

app.use((req, res) => {
  res.status(404).render('404', buildPageData({ req, title: 'Halaman tidak ditemukan', metaTitle: 'Halaman tidak ditemukan' }));
});

app.listen(PORT, () => {
  console.log(`Cathrine Slim Official Store running on port ${PORT}`);
  console.log(`Using DATA_DIR: ${DATA_DIR}`);
});

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect('/itsiregar24');
}

function requireGuest(req, res, next) {
  if (req.session && req.session.isAdmin) return res.redirect('/itsiregar24/dashboard');
  return next();
}

function createId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function initStorage() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  ensureFile(FILES.products, defaultProducts);
  ensureFile(FILES.articles, defaultArticles);
  ensureFile(FILES.promo, defaultPromo);
  ensureFile(FILES.testimonials, defaultTestimonials);
  ensureFile(FILES.settings, DEFAULT_SETTINGS);
  ensureFile(FILES.popup, DEFAULT_POPUP);
}

function ensureFile(filePath, data) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function readCollection(type) {
  return readJson(FILES[type], []);
}

function writeCollection(type, data) {
  writeJson(FILES[type], data);
}

function getPublished(type) {
  return readCollection(type).filter(item => item.isPublished !== false).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
}

function getSettings() {
  return { ...DEFAULT_SETTINGS, ...readJson(FILES.settings, DEFAULT_SETTINGS) };
}

function normalizeType(type) {
  return ['products', 'articles', 'promo', 'testimonials', 'settings'].includes(type) ? type : null;
}

function labelFromType(type) {
  const map = {
    products: 'Produk',
    articles: 'Artikel',
    promo: 'Promo',
    testimonials: 'Testimoni',
    settings: 'SEO & Pengaturan'
  };
  return map[type] || type;
}

function emptyItem(type) {
  if (type === 'products') {
    return { id: '', name: '', slug: '', shortDesc: '', description: '', imageUrl: '', price: '', category: 'Obat Diet', isPublished: true, metaTitle: '', metaDescription: '', keywords: '' };
  }
  if (type === 'articles' || type === 'promo') {
    return { id: '', title: '', slug: '', excerpt: '', content: '', coverImage: '', isPublished: true, metaTitle: '', metaDescription: '', keywords: '' };
  }
  return { id: '', name: '', city: '', quote: '', imageUrl: '', isPublished: true };
}

function makeSlug(value) {
  return slugify(clean(value), { lower: true, strict: true, trim: true }) || createId();
}

function clean(value) {
  return String(value || '').trim();
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildPageData({ req, title, metaTitle, metaDescription, keywords, ogImage, schema = [], ...rest }) {
  const settings = getSettings();
  const canonicalUrl = `${BASE_URL}${req.path === '/' ? '/' : req.path}`;
  return {
    pageTitle: title || settings.siteTitle,
    metaTitle: metaTitle || settings.defaultMetaTitle,
    metaDescription: metaDescription || settings.defaultMetaDescription,
    keywords: keywords || settings.defaultKeywords,
    canonicalUrl,
    ogImage: ogImage || settings.ogImage,
    schema,
    ...rest
  };
}

function buildWhatsAppLink(number, message) {
  const cleanNumber = String(number || '').replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message || '')}`;
}

function websiteSchema() {
  const settings = getSettings();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteTitle,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/produk?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function productSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.imageUrl],
    description: stripHtml(product.description || product.shortDesc),
    brand: { '@type': 'Brand', name: 'Cathrine Slim' },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price: digitsOnly(product.price) || '0',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/produk/${product.slug}`
    }
  };
}

function articleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: [article.coverImage || getSettings().ogImage],
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: 'Cathrine Slim Official Store' },
    publisher: { '@type': 'Organization', name: 'Cathrine Slim Official Store' },
    description: article.metaDescription || article.excerpt,
    mainEntityOfPage: `${BASE_URL}/artikel/${article.slug}`
  };
}

function digitsOnly(value) {
  return String(value || '').replace(/[^0-9]/g, '');
}
