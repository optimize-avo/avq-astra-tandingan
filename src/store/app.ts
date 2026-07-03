import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompanyProfile, Prompt, SEED_COMPANY, SEED_PROMPTS, Sentiment } from '@/data/dummy';

interface AppState {
  hasOnboarded: boolean;
  brands: CompanyProfile[];
  currentBrandId: string;
  company: CompanyProfile; // mirror of brands[currentBrandId] — kept for legacy readers
  prompts: Prompt[]; // all prompts across brands; each has brandId

  completeOnboarding: () => void;
  loadSeed: () => void;
  resetOnboarding: () => void;
  resetAll: () => void;
  updateCompany: (patch: Partial<CompanyProfile>) => void;
  addTopic: (name: string, description: string) => void;
  removeTopic: (id: string) => void;
  addPrompt: (text: string, topicId: string) => string;
  addPrompts: (texts: string[], topicId: string) => void;
  togglePromptStatus: (id: string) => void;
  switchBrand: (id: string) => void;
  addBrand: (input: { name: string; domain: string; language: CompanyProfile['language'] }) => string;
}

const emptyPrompt = (text: string, topicId: string, id: string, brandId: string): Prompt => ({
  id,
  brandId,
  text,
  topicId,
  createdAt: new Date().toISOString(),
  status: 'active',
  mentions: { ChatGPT: 0, Gemini: 0, Perplexity: 0, Deepseek: 0, Claude: 0 },
  visibilityScore: { ChatGPT: 0, Gemini: 0, Perplexity: 0, Deepseek: 0, Claude: 0 },
  sentiment: { ChatGPT: 'neutral', Gemini: 'neutral', Perplexity: 'neutral', Deepseek: 'neutral', Claude: 'neutral' },
  conversation: [],
  sources: [],
  ranking: [],
  medium: [],
  fanouts: [],
  history: [],
});

const emptyCompany = (): CompanyProfile => ({
  ...SEED_COMPANY,
  topics: [],
  differentiators: [],
  competitors: [],
});

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      brands: [SEED_COMPANY],
      currentBrandId: 'brand_sribu',
      company: SEED_COMPANY,
      prompts: SEED_PROMPTS,

      completeOnboarding: () => set({ hasOnboarded: true }),
      loadSeed: () => set({
        brands: [SEED_COMPANY],
        currentBrandId: 'brand_sribu',
        company: SEED_COMPANY,
        prompts: SEED_PROMPTS,
      }),
      resetOnboarding: () => {
        const fresh = emptyCompany();
        return set({
          hasOnboarded: false,
          prompts: [],
          brands: [fresh],
          currentBrandId: 'brand_sribu',
          company: fresh,
        });
      },
      resetAll: () => set({
        hasOnboarded: false,
        brands: [SEED_COMPANY],
        currentBrandId: 'brand_sribu',
        company: SEED_COMPANY,
        prompts: SEED_PROMPTS,
      }),

      updateCompany: (patch) => set((s) => {
        const idx = s.brands.findIndex((b) => b.id === s.currentBrandId);
        if (idx < 0) return {};
        const updated = { ...s.brands[idx], ...patch };
        const newBrands = [...s.brands];
        newBrands[idx] = updated;
        return { brands: newBrands, company: updated };
      }),

      addTopic: (name, description) =>
        set((s) => {
          const idx = s.brands.findIndex((b) => b.id === s.currentBrandId);
          if (idx < 0) return {};
          const updated = {
            ...s.brands[idx],
            topics: [...s.brands[idx].topics, { id: 't' + Date.now(), name, description }],
          };
          const newBrands = [...s.brands];
          newBrands[idx] = updated;
          return { brands: newBrands, company: updated };
        }),

      removeTopic: (id) =>
        set((s) => {
          const idx = s.brands.findIndex((b) => b.id === s.currentBrandId);
          if (idx < 0) return {};
          const updated = {
            ...s.brands[idx],
            topics: s.brands[idx].topics.filter((t) => t.id !== id),
          };
          const newBrands = [...s.brands];
          newBrands[idx] = updated;
          return { brands: newBrands, company: updated };
        }),

      addPrompt: (text, topicId) => {
        const id = 'p' + Date.now();
        set((s) => ({ prompts: [emptyPrompt(text, topicId, id, s.currentBrandId), ...s.prompts] }));
        return id;
      },

      addPrompts: (texts, topicId) => {
        const base = Date.now();
        set((s) => ({
          prompts: [
            ...texts.map((text, i) => emptyPrompt(text, topicId, 'p' + (base + i), s.currentBrandId)),
            ...s.prompts,
          ],
        }));
      },

      togglePromptStatus: (id) =>
        set((s) => ({
          prompts: s.prompts.map((p) =>
            p.id === id ? { ...p, status: p.status === 'active' ? 'archived' : 'active' } : p
          ),
        })),

      switchBrand: (id) => set((s) => {
        const brand = s.brands.find((b) => b.id === id);
        if (!brand) return {};
        return { currentBrandId: id, company: brand };
      }),

      addBrand: (input) => {
        const id = 'brand_' + Date.now();
        set((s) => {
          const newBrand: CompanyProfile = {
            name: input.name,
            domain: input.domain,
            language: input.language,
            overview: '',
            differentiators: [],
            competitors: [],
            topics: [],
          };
          return {
            brands: [...s.brands, newBrand],
            currentBrandId: id,
            company: newBrand,
          };
        });
        return id;
      },
    }),
    {
      name: 'avq-astra-demo',
      version: 3,
      migrate: (persisted: any, version: number) => {
        if (!persisted) return persisted;
        // Normalize old schema (sov → visibilityScore) so users with stale localStorage don't crash
        let prompts = (persisted.prompts || []).map((p: any) => ({
          ...p,
          visibilityScore:
            p.visibilityScore ||
            p.sov ||
            { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
          ranking: (p.ranking || []).map((r: any) => ({
            name: r.name,
            score: typeof r.score === 'number' ? r.score : typeof r.sov === 'number' ? r.sov : 0,
            you: !!r.you,
          })),
        }));

        // Migrate to multi-brand (v3): wrap company into brands[], inject brandId on prompts
        if (version < 3 && persisted.company && !persisted.brands) {
          const currentBrandId = 'brand_sribu';
          prompts = prompts.map((p: any) => (p.brandId ? p : { ...p, brandId: currentBrandId }));
          return {
            ...persisted,
            brands: [persisted.company],
            currentBrandId,
            company: persisted.company,
            prompts,
          };
        }
        return { ...persisted, prompts };
      },
    }
  )
);

// ponytail: filter() returns a new array each call → rerenders on every store change.
// Fine for demo; if perf matters, memoize with shallow + useMemo or restructure.
export function useCurrentPrompts() {
  return useApp((s) => s.prompts.filter((p) => p.brandId === s.currentBrandId));
}
