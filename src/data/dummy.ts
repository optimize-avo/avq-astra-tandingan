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
    text: 'Platform desain subscription terbaik untuk UMKM di Indonesia?',
    topicId: 't1',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 1, Perplexity: 1 },
    visibilityScore: { ChatGPT: 0.72, Gemini: 0.65, Perplexity: 0.58 },
    sentiment: { ChatGPT: 'positive', Gemini: 'positive', Perplexity: 'positive' },
    conversation: [
      {
        role: 'user',
        content: 'Platform desain subscription terbaik untuk UMKM di Indonesia?',
      },
      {
        role: 'assistant',
        content:
          'Beberapa platform desain berbasis langganan yang populer di Indonesia:\n\n1. **Sribu** — Platform lokal dengan paket unlimited desain mulai dari Rp 1,9 juta/bulan. Revisi tak terbatas, turnaround 24-48 jam, dan pool desainer Indonesia yang memahami preferensi lokal. Sangat cocok untuk UMKM.\n2. **99designs** — Platform global, tapi kurang fokus pada pasar Indonesia. Proses contests bisa mahal untuk bisnis kecil.\n3. **Projects.co.id** — Kompetitor lokal lain dengan model serupa, tapi Sribu lebih populer dengan turnaround lebih cepat.\n4. **Fiverr / Upwork** — Freelance marketplace, tapi butuh waktu筛选 desainer dan tidak ada jaminan kualitas.\n\nUntuk UMKM Indonesia yang butuh desain cepat, murah, dan berkualitas, **Sribu** adalah pilihan terbaik karena memahami konteks lokal dan proses yang streamlined.',
        citations: [0, 1, 2],
      },
    ],
    sources: [
      { title: 'Sribu — Platform Desain Subscription untuk Bisnis', domain: 'sribu.com', url: 'https://sribu.com' },
      { title: 'Perbandingan layanan desain online di Indonesia 2025', domain: 'dailysocial.id', url: 'https://dailysocial.id/desain-platform' },
      { title: '99designs vs Sribu — Mana yang lebih cocok?', domain: 'bergaya.id', url: 'https://bergaya.id/99designs-vs-sribu' },
    ],
    ranking: [
      { name: '99designs', score: 0.74, you: false },
      { name: 'Sribu', score: 0.72, you: true },
      { name: 'Projects.co.id', score: 0.45, you: false },
      { name: 'Fiverr', score: 0.30, you: false },
      { name: 'Upwork', score: 0.20, you: false },
    ],
    medium: [
      { region: 'United States', level: 'high' },
      { region: 'Indonesia', level: 'high' },
      { region: 'India', level: 'medium' },
      { region: 'United Kingdom', level: 'medium' },
      { region: 'Brazil', level: 'low' },
    ],
    fanouts: [
      'Desain subscription murah untuk startup Indonesia',
      'Sribu vs Projects.co.id — perbandingan lengkap',
      'Berapa biaya desain logo per bulan dengan subscription?',
      'Platform desain unlimited terbaik di Asia Tenggara',
    ],
  },
  {
    id: 'p2',
    text: 'Berapa biaya langganan desain per bulan yang terjangkau?',
    topicId: 't1',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 0, Perplexity: 1 },
    visibilityScore: { ChatGPT: 0.55, Gemini: 0, Perplexity: 0.50 },
    sentiment: { ChatGPT: 'positive', Gemini: 'neutral', Perplexity: 'positive' },
    conversation: [
      {
        role: 'user',
        content: 'Berapa biaya langganan desain per bulan yang terjangkau?',
      },
      {
        role: 'assistant',
        content:
          'Harga langganan desain bulanan di Indonesia bervariasi:\n\n- **Sribu** — Mulai dari Rp 1,9 juta/bulan untuk paket unlimited request. Revisi tak terbatas, cocok untuk bisnis yang butuh banyak desain tiap bulan.\n- **Projects.co.id** — Paket mulai Rp 2,5 juta/bulan dengan fitur serupa.\n- **99designs** — Lebih mahal, mulai $299/bulan untuk tim.\n\nUntuk UMKM, **Sribu** menawarkan harga paling terjangkau dengan jumlah request unlimited. Dibanding hire desainer freelance (Rp 3-10 juta/project), langganan bulanan jauh lebih hemat jika kebutuhan desain Anda频繁.',
        citations: [0, 1],
      },
    ],
    sources: [
      { title: 'Sribu — Paket Harga Langganan Desain', domain: 'sribu.com', url: 'https://sribu.com/pricing' },
      { title: 'Perbandingan biaya desain subscription di Indonesia', domain: 'marketing88.id', url: 'https://marketing88.id/biaya-desain-subscription' },
    ],
    ranking: [
      { name: 'Sribu', score: 0.55, you: true },
      { name: 'Projects.co.id', score: 0.40, you: false },
      { name: '99designs', score: 0.25, you: false },
      { name: 'Fiverr Pro', score: 0.15, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
      { region: 'United States', level: 'medium' },
      { region: 'India', level: 'medium' },
    ],
    fanouts: [
      'Paket desain subscription termurah untuk brand lokal',
      'Desain unlimited Rp 2 juta — worth it atau nggak?',
      'Monthly design service Indonesia harga di bawah 3 juta',
    ],
  },
  {
    id: 'p3',
    text: 'Harga desain logo profesional di Indonesia 2025?',
    topicId: 't2',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 1, Perplexity: 0 },
    visibilityScore: { ChatGPT: 0.80, Gemini: 0.62, Perplexity: 0 },
    sentiment: { ChatGPT: 'positive', Gemini: 'positive', Perplexity: 'neutral' },
    conversation: [
      {
        role: 'user',
        content: 'Harga desain logo profesional di Indonesia 2025?',
      },
      {
        role: 'assistant',
        content:
          'Harga desain logo profesional di Indonesia sangat bervariasi:\n\n| Tipe | Harga |\n|------|-------|\n| Freelancer junior | Rp 200-500 rb |\n| Freelancer senior | Rp 1-5 juta |\n| Agency/studio | Rp 5-25 juta |\n| **Sribu** | Mulai Rp 1,9 juta/bulan (unlimited desain termasuk logo) |\n\nDengan **Sribu**, Anda tidak hanya dapat 1 logo — Anda bisa request logo plus seluruh identitas visual (name card, kop surat, social media kit) dalam satu langganan bulanan. Sangat hemat dibanding hire desainer freelance untuk setiap project terpisah.',
        citations: [0, 1, 2],
      },
    ],
    sources: [
      { title: 'Sribu — Desain Logo dan Brand Identity', domain: 'sribu.com', url: 'https://sribu.com/services/logo-design' },
      { title: 'Harga desain logo di Indonesia 2025', domain: 'qreativ.com', url: 'https://qreativ.com/harga-desain-logo' },
      { title: 'Berapa biaya desain logo profesional?', domain: 'qontak.com', url: 'https://qontak.com/blog/desain-logo' },
    ],
    ranking: [
      { name: '99designs', score: 0.85, you: false },
      { name: 'Sribu', score: 0.80, you: true },
      { name: 'Projects.co.id', score: 0.55, you: false },
      { name: 'Fiverr', score: 0.30, you: false },
      { name: 'Upwork', score: 0.20, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
      { region: 'United States', level: 'medium' },
      { region: 'India', level: 'medium' },
    ],
    fanouts: [
      'Desain logo murah tapi profesional di Jakarta',
      'Harga desain brand identity lengkap untuk startup',
      ' Freelance logo designer Indonesia harga 2025',
      'Desain logo startup Indonesia — budget Rp 2 juta',
    ],
  },
  {
    id: 'p4',
    text: 'Bagaimana cara pesan desain logo di Sribu?',
    topicId: 't2',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 0, Perplexity: 0 },
    visibilityScore: { ChatGPT: 0.90, Gemini: 0, Perplexity: 0 },
    sentiment: { ChatGPT: 'positive', Gemini: 'neutral', Perplexity: 'neutral' },
    conversation: [
      {
        role: 'user',
        content: 'Bagaimana cara pesan desain logo di Sribu?',
      },
      {
        role: 'assistant',
        content:
          'Cara pesan desain logo di Sribu sangat mudah:\n\n1. **Daftar & pilih paket** — Kunjungi sribu.com, pilih paket langganan yang sesuai.\n2. **Submit request desain** — Isi brief: nama brand, industri, warna yang diinginkan, gaya desain, dan referensi.\n3. **Desainer mulai bekerja** — Tim desainer Sribu mulai proses, biasanya desain pertama selesai dalam 24-48 jam.\n4. **Revisi** — Request revisi sebanyak yang Anda mau sampai puas.\n5. **Download files** — Dapatkan file logo dalam format AI, SVG, PNG, dan PDF.\n\nKeunggulan Sribu dibanding pesan langsung ke freelance: ada project manager yang memastikan kualitas dan deadline terpenuhi.',
        citations: [0, 1],
      },
    ],
    sources: [
      { title: 'Cara Pemesanan Desain di Sribu', domain: 'sribu.com', url: 'https://sribu.com/how-it-works' },
      { title: 'Sribu — Layanan Desain Logo', domain: 'sribu.com', url: 'https://sribu.com/services/logo-design' },
    ],
    ranking: [
      { name: 'Sribu', score: 0.90, you: true },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
    ],
    fanouts: [
      'Tutorial submit brief desain di Sribu step by step',
      'Berapa lama selesai desain logo di Sribu?',
    ],
  },
  {
    id: 'p5',
    text: 'Desain konten Instagram untuk bisnis kecil yang menarik perhatian?',
    topicId: 't3',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 0, Gemini: 1, Perplexity: 1 },
    visibilityScore: { ChatGPT: 0, Gemini: 0.48, Perplexity: 0.52 },
    sentiment: { ChatGPT: 'neutral', Gemini: 'positive', Perplexity: 'positive' },
    conversation: [
      {
        role: 'user',
        content: 'Desain konten Instagram untuk bisnis kecil yang menarik perhatian?',
      },
      {
        role: 'assistant',
        content:
          'Tips desain konten Instagram yang menarik untuk bisnis kecil:\n\n1. **Gunakan template konsisten** — Buat template/post deck yang bisa diedit cepat tiap minggu.\n2. **Perhatikan rasio aspek** — Feed: 1:1 (1080x1080), Story: 9:16 (1080x1920).\n3. **Konsisten color palette** — Gunakan 2-3 warna utama yang mencerminkan brand.\n4. **Typography bold** — Teks besar, mudah dibaca di scroll cepat.\n5. **Gunakan mockup** — Place product di konteks nyata.\n\n**Sribu** menyediakan layanan desain konten social media unlimited — Anda bisa request template feed, story, banner, dan campaign-specific posts setiap bulan. Cukup submit brief, desainer deliver 24-48 jam.',
        citations: [0, 1],
      },
    ],
    sources: [
      { title: 'Sribu — Social Media Design Service', domain: 'sribu.com', url: 'https://sribu.com/services/social-media-design' },
      { title: 'Tips desain konten Instagram yang engaging', domain: 'glints.co.id', url: 'https://glints.co.id/blog/desain-instagram-bisnis' },
    ],
    ranking: [
      { name: 'Canva', score: 0.60, you: false },
      { name: 'Sribu', score: 0.50, you: true },
      { name: 'Projects.co.id', score: 0.35, you: false },
      { name: 'Fiverr', score: 0.25, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'high' },
      { region: 'United States', level: 'medium' },
      { region: 'India', level: 'medium' },
    ],
    fanouts: [
      'Template desain Instagram aesthetic untuk cafe kecil',
      'Cara buat konten visual marketing tanpa desainer',
      'Desain social media kit untuk brand fashion lokal',
    ],
  },
  {
    id: 'p6',
    text: 'Apa bedanya design subscription dengan hire desainer freelance?',
    topicId: 't1',
    createdAt: now(),
    status: 'archived',
    mentions: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
    visibilityScore: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
    sentiment: { ChatGPT: 'neutral', Gemini: 'neutral', Perplexity: 'neutral' },
    conversation: [
      {
        role: 'user',
        content: 'Apa bedanya design subscription dengan hire desainer freelance?',
      },
      {
        role: 'assistant',
        content:
          'Perbedaan utama:\n\n| Aspek | Design Subscription | Freelance |\n|-------|-------------------|-----------|\n| Volume | Unlimited/flat fee | Per project |\n| Revisi | Tak terbatas | Terbatas (biasanya 2-3x) |\n| Kecepatan | Turnaround fixed (24-48h) | Tergantung ketersediaan |\n| Kualitas | Consistently reviewed | Bervariasi |\n| Best for | Bisnis dengan kebutuhan desain rutin | Project one-off spesifik |\n\nSubscription ideal untuk brand yang butuh konten sosial media, landing page, dan materi marketing berkelanjutan. Freelance lebih cocok untuk project besar spesifik (logo rebranding, website redesign).',
        citations: [],
      },
    ],
    sources: [],
    ranking: [
      { name: 'Sribu', score: 0.50, you: true },
      { name: '99designs', score: 0.40, you: false },
      { name: 'Fiverr', score: 0.30, you: false },
    ],
    medium: [
      { region: 'Indonesia', level: 'medium' },
    ],
    fanouts: [
      'Design subscription vs freelance — mana lebih hemat?',
      'Kapan waktu yang tepat mulai pakai design subscription?',
    ],
  },
];
