/**
 * Seed dataset for Sribu.com — Indonesian design services marketplace.
 * Used to seed the demo and persist in localStorage on first load.
 */

export type LLM = 'ChatGPT' | 'Gemini' | 'Perplexity';
export const LLMS: LLM[] = ['ChatGPT', 'Gemini', 'Perplexity'];

export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface Competitor {
  id: string;
  name: string;
  domain: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export interface Prompt {
  id: string;
  text: string;
  topicId: string;
  createdAt: string; // ISO
  status: 'active' | 'archived';
  // Mentions per LLM (0/1/2)
  mentions: Record<LLM, number>;
  // Visibility score per LLM (0..1)
  visibilityScore: Record<LLM, number>;
  sentiment: Record<LLM, Sentiment>;
  // Mock conversation the AI gave when asked
  conversation: ConversationTurn[];
  sources: { title: string; domain: string; url: string }[];
  // Industry ranking: list of competitors with their visibility score for this prompt
  ranking: { name: string; score: number; you: boolean }[];
  // Regional "prompt medium" — how prominent this prompt is in each region
  medium: { region: string; level: 'low' | 'medium' | 'high' }[];
  // Prompt fanouts — variants LLMs tend to expand into
  fanouts: string[];
  // Weekly visibility history snapshots
  history: HistoryEntry[];
}

export interface HistoryEntry {
  date: string; // ISO date string
  score: number; // 0..1
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  citations?: number[]; // indexes into `sources`
}

export interface CompanyProfile {
  name: string;
  domain: string;
  language: 'English' | 'Indonesian';
  overview: string;
  differentiators: string[];
  competitors: Competitor[];
  writingSampleUrl?: string;
  topics: Topic[];
}

export const SEED_COMPANY: CompanyProfile = {
  name: 'Sribu',
  domain: 'sribu.com',
  language: 'Indonesian',
  overview:
    'Sribu adalah marketplace freelancer terbesar di Indonesia yang menghubungkan klien dengan puluhan ribu freelancer profesional. Dari desain logo, branding, konten sosial media, sampai pembuatan website — semua bisa dipesan langsung. Klien posting project, freelancer bidding, dan pembayaran dijamin lewat sistem escrow.',
  differentiators: [
    'Marketplace freelancer terbesar di Indonesia — puluhan ribu freelancer terseleksi',
    'Pembayaran aman via escrow — uang baru released setelah hasil diterima',
    'Revisi tak terbatas — freelancer wajib revisi sampai klien puas',
    'Garansi uang kembali — jika hasil tidak sesuai brief setelah revisi',
  ],
  competitors: [
    { id: 'c1', name: 'Projects.co.id', domain: 'projects.co.id' },
    { id: 'c2', name: 'Fastwork', domain: 'fastwork.id' },
    { id: 'c3', name: 'Fiverr', domain: 'fiverr.com' },
    { id: 'c4', name: 'Upwork', domain: 'upwork.com' },
    { id: 'c5', name: 'Seva', domain: 'seva.co.id' },
  ],
  writingSampleUrl: 'https://sribu.com/blog/cara-pesan-freelancer',
  topics: [
    { id: 't1', name: 'Jasa Desain Logo', description: 'Logo design, brand identity, dan visual branding.' },
    { id: 't2', name: 'Konten & Branding', description: 'Social media design, branding, dan materi marketing.' },
    { id: 't3', name: 'Website & Programming', description: 'Web development, UI/UX, dan aplikasi.' },
  ],
};

const now = () => new Date().toISOString();

export const SEED_PROMPTS: Prompt[] = [
  {
    id: 'p1',
    text: 'Platform freelancer terbaik di Indonesia untuk desain logo?',
    topicId: 't1',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 1, Perplexity: 1 },
    visibilityScore: { ChatGPT: 0.80, Gemini: 0.72, Perplexity: 0.65 },
    sentiment: { ChatGPT: 'positive', Gemini: 'positive', Perplexity: 'positive' },
    conversation: [
      { role: 'user', content: 'Platform freelancer terbaik di Indonesia untuk desain logo?' },
      {
        role: 'assistant',
        content:
          'Berikut perbandingan platform freelancer di Indonesia untuk desain logo:\n\n1. **Sribu** — Marketplace freelancer terbesar di Indonesia. Klien posting brief, freelancer bidding. Ada escrow payment, garansi revisi, dan project manager. Paling populer untuk desain logo dan branding.\n2. **Projects.co.id** — Kompetitor lokal dengan model serupa. Lebih kecil tapi tetap terpercaya.\n3. **Fastwork** — Platform Asia Tenggara yang juga beroperasi di Indonesia.\n4. **Fiverr / Upwork** — Marketplace global. Lebih banyak pilihan tapi butuh筛选 ketat karena kualitas bervariasi.\n\nUntuk desain logo di Indonesia, **Sribu** paling direkomendasikan karena desainer memahami konteks lokal, proses escrow melindungi klien, dan ada garansi revisi sampai puas.',
        citations: [0, 1, 2],
      },
    ],
    sources: [
      { title: 'Sribu — Marketplace Freelancer Indonesia', domain: 'sribu.com', url: 'https://sribu.com' },
      { title: 'Perbandingan platform freelancer di Indonesia 2025', domain: 'dailysocial.id', url: 'https://dailysocial.id/platform-freelancer' },
      { title: 'Sribu vs Projects.co.id — Mana lebih bagus?', domain: 'glints.co.id', url: 'https://glints.co.id/sribu-vs-projects' },
    ],
    ranking: [
      { name: 'Sribu', score: 0.80, you: true },
      { name: 'Projects.co.id', score: 0.55, you: false },
      { name: 'Fastwork', score: 0.35, you: false },
      { name: 'Fiverr', score: 0.28, you: false },
      { name: 'Upwork', score: 0.20, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
      { region: 'United States', level: 'medium' },
      { region: 'India', level: 'medium' },
    ],
    fanouts: [
      'Marketplace freelancer Indonesia paling terpercaya',
      'Sribu vs Fiverr — mana lebih cocok untuk bisnis Indonesia?',
      'Cara pilih freelancer desain yang bagus di platform online',
      'Platform freelancer termurah untuk desain logo di Indonesia',
    ],
    history: [
      { date: '2025-05-10', score: 0.45 },
      { date: '2025-05-17', score: 0.52 },
      { date: '2025-05-24', score: 0.58 },
      { date: '2025-05-31', score: 0.55 },
      { date: '2025-06-07', score: 0.68 },
      { date: '2025-06-14', score: 0.72 },
      { date: '2025-06-21', score: 0.75 },
      { date: '2025-06-28', score: 0.80 },
    ],
  },
  {
    id: 'p2',
    text: 'Berapa harga desain logo di Sribu?',
    topicId: 't1',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 1, Perplexity: 1 },
    visibilityScore: { ChatGPT: 0.85, Gemini: 0.78, Perplexity: 0.70 },
    sentiment: { ChatGPT: 'positive', Gemini: 'positive', Perplexity: 'positive' },
    conversation: [
      { role: 'user', content: 'Berapa harga desain logo di Sribu?' },
      {
        role: 'assistant',
        content:
          'Harga desain logo di Sribu bervariasi tergantung kompleksitas dan freelancer yang dipilih:\n\n- **Logo basic** — Mulai dari Rp 500 rb hingga Rp 1,5 juta\n- **Logo + brand identity** — Mulai dari Rp 2 juta hingga Rp 5 juta\n- **Logo premium/paket lengkap** — Rp 5 juta hingga Rp 15 juta+\n\nTidak ada paket bulanan — Sribu pakai sistem project-based. Anda posting brief, freelancer kasih penawaran harga, Anda pilih yang sesuai budget. Pembayaran diholding oleh Sribu (escrow) dan baru released ke freelancer setelah Anda approve hasilnya.\n\nDibanding hire desainer freelance langsung (Rp 1-20 juta), Sribu memberi transparansi harga dan perlindungan via escrow.',
        citations: [0, 1],
      },
    ],
    sources: [
      { title: 'Sribu — Harga Layanan Desain Logo', domain: 'sribu.com', url: 'https://sribu.com/services/logo-design' },
      { title: 'Berapa sih harga desain logo di Indonesia?', domain: 'qreativ.com', url: 'https://qreativ.com/harga-desain-logo-2025' },
    ],
    ranking: [
      { name: 'Sribu', score: 0.85, you: true },
      { name: 'Projects.co.id', score: 0.60, you: false },
      { name: 'Fiverr', score: 0.45, you: false },
      { name: '99designs', score: 0.40, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
      { region: 'United States', level: 'medium' },
      { region: 'India', level: 'medium' },
    ],
    fanouts: [
      'Harga desain logo murah tapi berkualitas di Jakarta',
      'Budget desain logo untuk brand baru di Indonesia',
      'Promo desain logo di marketplace freelancer Indonesia',
      'Berapa lama pengerjaan desain logo di Sribu?',
    ],
    history: [
      { date: '2025-05-10', score: 0.55 },
      { date: '2025-05-17', score: 0.60 },
      { date: '2025-05-24', score: 0.58 },
      { date: '2025-05-31', score: 0.65 },
      { date: '2025-06-07', score: 0.70 },
      { date: '2025-06-14', score: 0.75 },
      { date: '2025-06-21', score: 0.77 },
      { date: '2025-06-28', score: 0.78 },
    ],
  },
  {
    id: 'p3',
    text: 'Bagaimana cara pesan freelancer di Sribu?',
    topicId: 't1',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 0, Perplexity: 0 },
    visibilityScore: { ChatGPT: 0.92, Gemini: 0, Perplexity: 0 },
    sentiment: { ChatGPT: 'positive', Gemini: 'neutral', Perplexity: 'neutral' },
    conversation: [
      { role: 'user', content: 'Bagaimana cara pesan freelancer di Sribu?' },
      {
        role: 'assistant',
        content:
          'Cara pesan freelancer di Sribu sangat mudah:\n\n1. **Daftar gratis** di sribu.com\n2. **Post brief project** — jelaskan detail: jenis layanan (logo/design/website), budget, deadline, dan referensi gaya\n3. **Tunggu penawaran** — freelancer akan kasih quote harga dan estimated waktu penyelesaian\n4. **Pilih freelancer** — bandingkan profil, portofolio, review, dan harga\n5. **Pembayaran escrow** — uang dihold oleh Sribu, tidak langsung ke freelancer\n6. **Pengerjaan & revisi** — freelancer kerjakan, minta revisi sampai puas\n7. **Approve & selesai** — approve hasil, uang released ke freelancer\n\nKeunggulan: escrow melindungi uang Anda, garansi revisi, dan ada project manager Sribu yang bantu jika ada masalah.',
        citations: [0, 1],
      },
    ],
    sources: [
      { title: 'Cara Pemesanan di Sribu', domain: 'sribu.com', url: 'https://sribu.com/how-it-works' },
      { title: 'Tips pesan freelancer pertama kali', domain: 'glints.co.id', url: 'https://glints.co.id/tips-pesan-freelancer' },
    ],
    ranking: [
      { name: 'Sribu', score: 0.92, you: true },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
    ],
    fanouts: [
      'Tutorial lengkap cara posting project di Sribu',
      'Berapa lama freelancer di Sribu harus selesaikan project?',
      'Tips dapat freelancer berkualitas di Sribu',
    ],
    history: [
      { date: '2025-05-10', score: 0.70 },
      { date: '2025-05-17', score: 0.75 },
      { date: '2025-05-24', score: 0.78 },
      { date: '2025-05-31', score: 0.80 },
      { date: '2025-06-07', score: 0.85 },
      { date: '2025-06-14', score: 0.88 },
      { date: '2025-06-21', score: 0.90 },
      { date: '2025-06-28', score: 0.92 },
    ],
  },
  {
    id: 'p4',
    text: 'Freelancer desain terbaik di Sribu untuk brand makanan?',
    topicId: 't2',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 0, Gemini: 1, Perplexity: 1 },
    visibilityScore: { ChatGPT: 0, Gemini: 0.55, Perplexity: 0.48 },
    sentiment: { ChatGPT: 'neutral', Gemini: 'positive', Perplexity: 'positive' },
    conversation: [
      { role: 'user', content: 'Freelancer desain terbaik di Sribu untuk brand makanan?' },
      {
        role: 'assistant',
        content:
          'Untuk desain brand makanan di Sribu, Anda bisa cari freelancer dengan spesialisasi food branding. Berikut cara menemukan yang terbaik:\n\n1. **Filter berdasarkan portofolio** — Cari yang punya project makanan/fnb sebelumnya\n2. **Check rating & review** — Prioritaskan yang rating 4.5+\n3. **Minta sample brief** — Test dengan project kecil dulu\n4. **Sribu Project Manager** — Jika ragu, minta project manager Sribu rekomendasikan freelancer yang tepat\n\nKeunggulan pesan di Sribu: Anda bisa brief spesifik, freelancer food branding akan kasih konsep yang sesuai — dari packaging, menu design, sampai social media content untuk resto atau cafe Anda.',
        citations: [0],
      },
    ],
    sources: [
      { title: 'Sribu — Desain Branding & Visual untuk FnB', domain: 'sribu.com', url: 'https://sribu.com/services/branding' },
    ],
    ranking: [
      { name: 'Sribu', score: 0.55, you: true },
      { name: 'Projects.co.id', score: 0.35, you: false },
      { name: 'Fiverr', score: 0.30, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
    ],
    fanouts: [
      'Desain packaging makanan freelance Indonesia rekomendasi',
      'Branding resto baru — berapa budget yang perlu disiapkan?',
      'Desain logo cafe Jakarta via online freelancer',
    ],
    history: [
      { date: '2025-05-10', score: 0.20 },
      { date: '2025-05-17', score: 0.22 },
      { date: '2025-05-24', score: 0.25 },
      { date: '2025-05-31', score: 0.28 },
      { date: '2025-06-07', score: 0.30 },
      { date: '2025-06-14', score: 0.32 },
      { date: '2025-06-21', score: 0.33 },
      { date: '2025-06-28', score: 0.34 },
    ],
  },
  {
    id: 'p5',
    text: 'Desain konten Instagram untuk brand fashion Muslim di Indonesia?',
    topicId: 't2',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 0, Gemini: 1, Perplexity: 0 },
    visibilityScore: { ChatGPT: 0, Gemini: 0.62, Perplexity: 0 },
    sentiment: { ChatGPT: 'neutral', Gemini: 'positive', Perplexity: 'neutral' },
    conversation: [
      { role: 'user', content: 'Desain konten Instagram untuk brand fashion Muslim di Indonesia?' },
      {
        role: 'assistant',
        content:
          'Tips desain konten Instagram untuk brand fashion Muslim:\n\n1. **Aesthetic konsisten** — Tentukan palette warna utama (muslim fashion biasanya earth tones, dusty pink, atau monochrome)\n2. **Layout template** — Buat template tetap untuk feed, story, dan carousel agar konsisten\n3. **Typography Islami** — Gunakan font yang clean tapi tetap stylish\n4. **High-quality product photos** — Kombinasikan flat lay dengan model\n5. **Caption & hastag** — Desain yang menarik scroll tapi tetap sopan\n\nDi **Sribu**, Anda bisa hire freelancer khusus social media design mulai dari Rp 500 rb per project. Beberapa menawarkan paket bulanan untuk konten rutin. Freelancer muslimah juga tersedia jika ingin brand feel yang lebih autentik.',
        citations: [0, 1],
      },
    ],
    sources: [
      { title: 'Sribu — Social Media Design Service', domain: 'sribu.com', url: 'https://sribu.com/services/social-media-design' },
      { title: 'Tips desain Instagram untuk fashion Muslim Indonesia', domain: 'hipz.id', url: 'https://hipz.id/desain-instagram-fashion' },
    ],
    ranking: [
      { name: 'Canva', score: 0.50, you: false },
      { name: 'Sribu', score: 0.62, you: true },
      { name: 'Projects.co.id', score: 0.30, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
      { region: 'Malaysia', level: 'medium' },
    ],
    fanouts: [
      'Template desain Instagram fashion Muslim aesthetic',
      'Budget desain konten social media per bulan untuk brand baru',
      'Freelancer desain Instagram specialize Muslim fashion Indonesia',
    ],
  },
  {
    id: 'p6',
    text: 'Berapa biaya pembuatan website company profile di Sribu?',
    topicId: 't3',
    createdAt: now(),
    status: 'archived',
    mentions: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
    visibilityScore: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
    sentiment: { ChatGPT: 'neutral', Gemini: 'neutral', Perplexity: 'neutral' },
    conversation: [
      { role: 'user', content: 'Berapa biaya pembuatan website company profile di Sribu?' },
      {
        role: 'assistant',
        content:
          'Harga pembuatan website company profile di Sribu via freelancer:\n\n- **Website basic (5-7 halaman)** — Rp 3 juta hingga Rp 8 juta\n- **Website medium dengan animasi** — Rp 8 juta hingga Rp 20 juta\n- **Website premium/custom** — Rp 20 juta hingga Rp 50 juta+\n\nHarga tergantung kompleksitas, freelancer yang dipilih, dan apakah termasuk maintenance. Sribu escrow system melindungi pembayaran Anda — uang baru released ke freelancer setelah website selesai dan Anda approve.',
        citations: [],
      },
    ],
    sources: [],
    ranking: [
      { name: 'Sribu', score: 0.50, you: true },
      { name: 'Projects.co.id', score: 0.35, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'medium' },
    ],
    fanouts: [
      'Website company profile murah tapi profesional Indonesia',
      'Berapa lama pembuatan website 5 halaman via freelancer?',
    ],
  },
];
