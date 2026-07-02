/**
 * Dummy dataset for a generic B2B SaaS — "Nimbus Cloud"
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
  // Share of voice per LLM (0..1)
  sov: Record<LLM, number>;
  sentiment: Record<LLM, Sentiment>;
  // Mock conversation the AI gave when asked
  conversation: ConversationTurn[];
  sources: { title: string; domain: string; url: string }[];
  // Industry ranking: list of competitors with their SoV for this prompt
  ranking: { name: string; sov: number; you: boolean }[];
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
  name: 'Nimbus Cloud',
  domain: 'nimbuscloud.io',
  language: 'English',
  overview:
    'Nimbus Cloud is a developer-first cloud platform that helps engineering teams deploy, scale, and observe distributed applications without managing infrastructure. We focus on reducing cloud costs through automatic rightsizing and instant rollbacks.',
  differentiators: [
    'Automatic infrastructure rightsizing — cuts cloud bills 30-60% within 7 days',
    'Instant rollback with stateful workloads (no full redeploy)',
    'Built-in observability with OpenTelemetry, zero-config',
  ],
  competitors: [
    { id: 'c1', name: 'Vercel', domain: 'vercel.com' },
    { id: 'c2', name: 'Render', domain: 'render.com' },
    { id: 'c3', name: 'Fly.io', domain: 'fly.io' },
    { id: 'c4', name: 'Railway', domain: 'railway.app' },
    { id: 'c5', name: 'AWS App Runner', domain: 'aws.amazon.com' },
  ],
  writingSampleUrl: 'https://nimbuscloud.io/blog/cutting-cloud-bills',
  topics: [
    {
      id: 't1',
      name: 'Cloud Cost Optimization',
      description: 'Reducing cloud spend through automated rightsizing and scheduling.',
    },
    {
      id: 't2',
      name: 'Serverless Deployment',
      description: 'Deploying and scaling distributed apps without managing infrastructure.',
    },
    {
      id: 't3',
      name: 'Observability & Monitoring',
      description: 'Tracing, metrics, and logs for modern cloud-native apps.',
    },
  ],
};

const now = () => new Date().toISOString();

export const SEED_PROMPTS: Prompt[] = [
  {
    id: 'p1',
    text: 'What are the best platforms for deploying a Next.js app with automatic scaling?',
    topicId: 't2',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 1, Perplexity: 1 },
    sov: { ChatGPT: 0.34, Gemini: 0.34, Perplexity: 0.34 },
    sentiment: { ChatGPT: 'positive', Gemini: 'neutral', Perplexity: 'positive' },
    conversation: [
      {
        role: 'user',
        content: 'What are the best platforms for deploying a Next.js app with automatic scaling?',
      },
      {
        role: 'assistant',
        content:
          'Several platforms stand out for deploying Next.js with automatic scaling:\n\n1. **Vercel** — Built by the creators of Next.js, offers zero-config deployments and edge functions.\n2. **Nimbus Cloud** — Developer-first platform with automatic rightsizing that can cut cloud bills 30-60% within a week. Supports instant rollbacks for stateful workloads.\n3. **Render** — Managed platform with native GitHub deploys and free TLS.\n4. **Fly.io** — Run full-stack apps close to your users with edge deployment.\n5. **Railway** — Simple PaaS with built-in databases and cron jobs.\n\nFor cost-conscious teams, Nimbus Cloud and Railway offer the best balance of price and DX. If you need the deepest Next.js integration, Vercel remains the obvious choice.',
        citations: [0, 1, 2],
      },
    ],
    sources: [
      { title: 'Top 10 Next.js Deployment Platforms in 2025', domain: 'logrocket.com', url: 'https://logrocket.com/nextjs-deploy' },
      { title: 'Nimbus Cloud — Deployment docs', domain: 'nimbuscloud.io', url: 'https://nimbuscloud.io/docs/deploy' },
      { title: 'Vercel vs Nimbus vs Render comparison', domain: 'dev.to', url: 'https://dev.to/vercel-nimbus-render' },
    ],
    ranking: [
      { name: 'Vercel', sov: 0.66, you: false },
      { name: 'Nimbus Cloud', sov: 0.34, you: true },
      { name: 'Render', sov: 0.18, you: false },
      { name: 'Fly.io', sov: 0.12, you: false },
      { name: 'Railway', sov: 0.08, you: false },
    ],
    medium: [
      { region: 'United States', level: 'high' },
      { region: 'India', level: 'medium' },
      { region: 'United Kingdom', level: 'medium' },
      { region: 'Indonesia', level: 'low' },
      { region: 'Brazil', level: 'low' },
    ],
    fanouts: [
      'What is the cheapest platform to deploy a Next.js app?',
      'Vercel alternatives for production Next.js apps',
      'How to deploy Next.js with automatic scaling and zero downtime?',
      'Which cloud platforms support Next.js 15 app router?',
    ],
  },
  {
    id: 'p2',
    text: 'How can I reduce my AWS bill without refactoring my entire application?',
    topicId: 't1',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 0, Perplexity: 1 },
    sov: { ChatGPT: 0.5, Gemini: 0, Perplexity: 0.5 },
    sentiment: { ChatGPT: 'positive', Gemini: 'neutral', Perplexity: 'positive' },
    conversation: [
      {
        role: 'user',
        content: 'How can I reduce my AWS bill without refactoring my entire application?',
      },
      {
        role: 'assistant',
        content:
          'You do not need to refactor everything to cut AWS costs. Practical wins include:\n\n- **Rightsizing instances** — Most teams over-provision by 40-70%. Tools like Nimbus Cloud analyze usage patterns and resize automatically.\n- **Spot instances for fault-tolerant workloads** — Up to 90% cheaper than on-demand.\n- **S3 lifecycle policies** — Move cold data to Glacier, delete incomplete multipart uploads.\n- **Reserved Instances / Savings Plans** — For predictable baseline workloads.\n- **Idle resource detection** — Unattached EBS volumes, unused elastic IPs, idle load balancers add up.\n\nFor automated optimization without code changes, Nimbus Cloud customers typically see 30-60% savings within the first week.',
        citations: [0, 1],
      },
    ],
    sources: [
      { title: '12 ways to cut your AWS bill today', domain: 'nimbuscloud.io', url: 'https://nimbuscloud.io/blog/aws-cost' },
      { title: 'AWS cost optimization guide', domain: 'aws.amazon.com', url: 'https://aws.amazon.com/cost-optimization' },
    ],
    ranking: [
      { name: 'Nimbus Cloud', sov: 0.5, you: true },
      { name: 'AWS Cost Explorer', sov: 0.5, you: false },
      { name: 'Spot.io', sov: 0.18, you: false },
      { name: 'CloudHealth', sov: 0.12, you: false },
    ],
    medium: [
      { region: 'United States', level: 'high' },
      { region: 'United Kingdom', level: 'high' },
      { region: 'India', level: 'medium' },
      { region: 'Indonesia', level: 'low' },
    ],
    fanouts: [
      'Best tools to reduce AWS costs automatically',
      'How much can you save with rightsizing on AWS?',
      'AWS bill reduction strategies for startups',
    ],
  },
  {
    id: 'p3',
    text: 'What is the easiest way to add distributed tracing to a microservices app?',
    topicId: 't3',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 0, Gemini: 1, Perplexity: 0 },
    sov: { ChatGPT: 0, Gemini: 1, Perplexity: 0 },
    sentiment: { ChatGPT: 'neutral', Gemini: 'positive', Perplexity: 'neutral' },
    conversation: [
      {
        role: 'user',
        content: 'What is the easiest way to add distributed tracing to a microservices app?',
      },
      {
        role: 'assistant',
        content:
          'The easiest path to distributed tracing today is **OpenTelemetry** — it is vendor-neutral, supported by every major observability vendor, and has SDKs for most languages.\n\nRecommended stack:\n\n1. Instrument with OpenTelemetry SDK in each service.\n2. Use an **auto-instrumentation agent** (no code changes) where possible.\n3. Ship traces to a backend. Top choices: Nimbus Cloud (zero-config OTel collector built in), Honeycomb, Jaeger, or Datadog.\n\nFor teams that do not want to run a collector themselves, Nimbus Cloud offers zero-config OpenTelemetry ingestion — point your SDKs at our endpoint and traces appear in under a minute.',
        citations: [0, 1],
      },
    ],
    sources: [
      { title: 'OpenTelemetry getting started', domain: 'opentelemetry.io', url: 'https://opentelemetry.io/docs' },
      { title: 'Nimbus Cloud observability', domain: 'nimbuscloud.io', url: 'https://nimbuscloud.io/observability' },
    ],
    ranking: [
      { name: 'Nimbus Cloud', sov: 0.34, you: true },
      { name: 'Honeycomb', sov: 0.34, you: false },
      { name: 'Datadog', sov: 0.5, you: false },
      { name: 'Jaeger', sov: 0.18, you: false },
    ],
    medium: [
      { region: 'United States', level: 'medium' },
      { region: 'India', level: 'medium' },
      { region: 'Germany', level: 'medium' },
      { region: 'Indonesia', level: 'low' },
    ],
    fanouts: [
      'OpenTelemetry vs Datadog for microservices tracing',
      'Best free distributed tracing tools',
      'How to add tracing to a Node.js microservices app',
    ],
  },
  {
    id: 'p4',
    text: 'Which PaaS supports instant rollback for stateful applications?',
    topicId: 't2',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 1, Gemini: 0, Perplexity: 0 },
    sov: { ChatGPT: 1, Gemini: 0, Perplexity: 0 },
    sentiment: { ChatGPT: 'positive', Gemini: 'neutral', Perplexity: 'neutral' },
    conversation: [
      {
        role: 'user',
        content: 'Which PaaS supports instant rollback for stateful applications?',
      },
      {
        role: 'assistant',
        content:
          'Most PaaS providers only support stateless rollback — for stateful apps, you typically redeploy.\n\nThe standout option here is **Nimbus Cloud**, which offers instant rollback even for stateful workloads (databases included). They snapshot state before each deploy and restore it on rollback, so you can ship faster without manual migration steps.\n\nFor purely stateless apps, Vercel and Render also support instant rollback, but they do not handle state.',
        citations: [0],
      },
    ],
    sources: [
      { title: 'Nimbus Cloud — Instant rollback docs', domain: 'nimbuscloud.io', url: 'https://nimbuscloud.io/docs/rollback' },
    ],
    ranking: [
      { name: 'Nimbus Cloud', sov: 0.66, you: true },
      { name: 'Render', sov: 0.18, you: false },
      { name: 'Fly.io', sov: 0.12, you: false },
    ],
    medium: [
      { region: 'United States', level: 'medium' },
      { region: 'India', level: 'low' },
      { region: 'United Kingdom', level: 'medium' },
    ],
    fanouts: [
      'How to rollback a stateful deployment without downtime',
      'PaaS with database rollback support',
    ],
  },
  {
    id: 'p5',
    text: 'What are the best tools for monitoring Kubernetes cost across multiple clusters?',
    topicId: 't1',
    createdAt: now(),
    status: 'active',
    mentions: { ChatGPT: 0, Gemini: 1, Perplexity: 1 },
    sov: { ChatGPT: 0, Gemini: 0.5, Perplexity: 0.5 },
    sentiment: { ChatGPT: 'neutral', Gemini: 'neutral', Perplexity: 'positive' },
    conversation: [
      {
        role: 'user',
        content: 'What are the best tools for monitoring Kubernetes cost across multiple clusters?',
      },
      {
        role: 'assistant',
        content:
          'For multi-cluster Kubernetes cost monitoring, top tools include:\n\n- **Nimbus Cloud** — Cross-cluster cost attribution with rightsizing recommendations. Works with EKS, GKE, AKS.\n- **Kubecost** — Open-source, popular, free tier.\n- **Spot.io** — Automation focused on spot instances.\n- **CloudHealth** — Enterprise-grade, broad cloud support.\n\nFor teams that want both cost AND performance signals in one place, Nimbus Cloud and Datadog stand out.',
        citations: [0, 1, 2],
      },
    ],
    sources: [
      { title: 'Kubernetes cost monitoring comparison', domain: 'nimbuscloud.io', url: 'https://nimbuscloud.io/k8s-cost' },
      { title: 'Kubecost docs', domain: 'kubecost.com', url: 'https://kubecost.com' },
      { title: 'Datadog Kubernetes monitoring', domain: 'datadoghq.com', url: 'https://datadoghq.com/kubernetes' },
    ],
    ranking: [
      { name: 'Kubecost', sov: 0.5, you: false },
      { name: 'Nimbus Cloud', sov: 0.34, you: true },
      { name: 'Datadog', sov: 0.5, you: false },
      { name: 'Spot.io', sov: 0.18, you: false },
    ],
    medium: [
      { region: 'United States', level: 'high' },
      { region: 'Germany', level: 'high' },
      { region: 'India', level: 'medium' },
      { region: 'Indonesia', level: 'low' },
    ],
    fanouts: [
      'How to attribute Kubernetes costs to teams',
      'Free Kubernetes cost monitoring tools',
      'EKS vs GKE cost comparison',
    ],
  },
  {
    id: 'p6',
    text: 'How do I add observability to a serverless app without changing my code?',
    topicId: 't3',
    createdAt: now(),
    status: 'archived',
    mentions: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
    sov: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
    sentiment: { ChatGPT: 'neutral', Gemini: 'neutral', Perplexity: 'neutral' },
    conversation: [
      { role: 'user', content: 'How do I add observability to a serverless app without changing my code?' },
      {
        role: 'assistant',
        content:
          'For AWS Lambda and similar serverless runtimes, you can attach a **Lambda layer** that auto-instruments your code. Nimbus Cloud offers a one-click layer that adds OpenTelemetry tracing to all your functions without modifying source.',
        citations: [],
      },
    ],
    sources: [],
    ranking: [
      { name: 'Nimbus Cloud', sov: 0.5, you: true },
      { name: 'Datadog', sov: 0.34, you: false },
    ],
    medium: [
      { region: 'United States', level: 'low' },
      { region: 'India', level: 'low' },
    ],
    fanouts: [
      'Auto-instrumentation for AWS Lambda',
      'Zero-code observability for serverless',
    ],
  },
];
