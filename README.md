# Avq Astra — Tandingan

A frontend-only demo of an AI visibility platform, inspired by promptingco.com.

**Purpose**: Internal prototype to show stakeholders what Avq Astra's flow *could* feel like. No backend — all data is dummy and lives in localStorage.

## What's inside

- **Welcome page** — hero with mock dashboard preview, "Start demo" CTA
- **Onboarding wizard (8 steps)** — language → domain → analyzing → company review → topics → prompts → writing sample → plan
- **Visibility page** — prompt tracking table (model, created, status, mentions, share of voice) + drill-down detail with per-LLM breakdown, industry ranking chart, sentiment donut, prompt medium by region, prompt fanouts, sources, and a chat-bubble conversation modal
- **Authority / Content / Settings** — placeholder dashboards with realistic charts and dummy data
- **ADS v3 design system** — same navy + teal token palette as the real avq-astra

## Tech

- React 19 + Vite 6 + TypeScript
- Tailwind CSS 4
- Recharts (bar, line, area, pie)
- Zustand + localStorage persist
- React Router 7
- lucide-react icons

## Run

```bash
npm install
npm run dev
# → http://localhost:5180
```

## Demo flow for stakeholders

1. Open `/` → click **Start demo**
2. Walk through onboarding (each step fully interactive, skip payment)
3. End up on Visibility → click any row → see prompt detail with conversation modal
4. Use Settings → "Reset demo" to start over

## Why this exists

The real avq-astra has a flow that confuses both users and the internal team — especially around the Visibility Score. This prototype is a strawman showing an alternative: clear table-first navigation, drill-down details, and an obvious AI-conversation view so users can see *why* a prompt ranks the way it does.

## Reset

All state lives in `localStorage` under `avq-astra-demo`. Clear it from devtools to reset, or use the **Reset demo** button in Settings.

---

All company names, prompts, and conversations are fictional.
