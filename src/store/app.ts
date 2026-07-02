import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompanyProfile, Prompt, SEED_COMPANY, SEED_PROMPTS, Sentiment } from '@/data/dummy';

interface AppState {
  hasOnboarded: boolean;
  company: CompanyProfile;
  prompts: Prompt[];

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
}

const emptyPrompt = (text: string, topicId: string, id: string): Prompt => ({
  id,
  text,
  topicId,
  createdAt: new Date().toISOString(),
  status: 'active',
  mentions: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
  visibilityScore: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
  sentiment: { ChatGPT: 'neutral', Gemini: 'neutral', Perplexity: 'neutral' },
  conversation: [],
  sources: [],
  ranking: [],
  medium: [],
  fanouts: [],
});

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      company: SEED_COMPANY,
      prompts: SEED_PROMPTS,

      completeOnboarding: () => set({ hasOnboarded: true }),
      loadSeed: () => set({ company: SEED_COMPANY, prompts: SEED_PROMPTS }),
      resetOnboarding: () => set({ hasOnboarded: false }),
      resetAll: () => set({ hasOnboarded: false, company: SEED_COMPANY, prompts: SEED_PROMPTS }),

      updateCompany: (patch) => set((s) => ({ company: { ...s.company, ...patch } })),

      addTopic: (name, description) =>
        set((s) => ({
          company: { ...s.company, topics: [...s.company.topics, { id: 't' + Date.now(), name, description }] },
        })),

      removeTopic: (id) =>
        set((s) => ({
          company: { ...s.company, topics: s.company.topics.filter((t) => t.id !== id) },
        })),

      addPrompt: (text, topicId) => {
        const id = 'p' + Date.now();
        set((s) => ({ prompts: [emptyPrompt(text, topicId, id), ...s.prompts] }));
        return id;
      },

      addPrompts: (texts, topicId) => {
        const base = Date.now();
        set((s) => ({
          prompts: [
            ...texts.map((text, i) => emptyPrompt(text, topicId, 'p' + (base + i))),
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
    }),
    {
      name: 'avq-astra-demo',
      version: 2,
      migrate: (persisted: any, _version: number) => {
        if (!persisted) return persisted;
        // Normalize old schema (sov → visibilityScore) so users with stale localStorage don't crash
        const prompts = (persisted.prompts || []).map((p: any) => ({
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
        return { ...persisted, prompts };
      },
    }
  )
);
