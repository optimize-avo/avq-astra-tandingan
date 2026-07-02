import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CompanyProfile, Prompt, SEED_COMPANY, SEED_PROMPTS, Sentiment } from '@/data/dummy';

interface AppState {
  hasOnboarded: boolean;
  company: CompanyProfile;
  prompts: Prompt[];

  completeOnboarding: () => void;
  resetOnboarding: () => void;
  updateCompany: (patch: Partial<CompanyProfile>) => void;
  addTopic: (name: string, description: string) => void;
  toggleTopic: (id: string) => void;
  removeTopic: (id: string) => void;
  addPrompt: (text: string, topicId: string) => string;
  addPrompts: (texts: string[], topicId: string) => void;
  togglePromptStatus: (id: string) => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      company: SEED_COMPANY,
      prompts: SEED_PROMPTS,

      completeOnboarding: () => set({ hasOnboarded: true }),
      resetOnboarding: () =>
        set({ hasOnboarded: false, company: SEED_COMPANY, prompts: SEED_PROMPTS }),

      updateCompany: (patch) =>
        set((s) => ({ company: { ...s.company, ...patch } })),

      addTopic: (name, description) =>
        set((s) => ({
          company: {
            ...s.company,
            topics: [
              ...s.company.topics,
              { id: 't' + Date.now(), name, description },
            ],
          },
        })),

      toggleTopic: (id) =>
        set((s) => ({
          company: {
            ...s.company,
            topics: s.company.topics.map((t) =>
              t.id === id ? { ...t } : t
            ),
          },
        })),

      removeTopic: (id) =>
        set((s) => ({
          company: {
            ...s.company,
            topics: s.company.topics.filter((t) => t.id !== id),
          },
        })),

      addPrompt: (text, topicId) => {
        const id = 'p' + Date.now();
        set((s) => ({
          prompts: [
            {
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
            },
            ...s.prompts,
          ],
        }));
        return id;
      },

      addPrompts: (texts, topicId) =>
        set((s) => {
          const base = Date.now();
          const newPrompts: Prompt[] = texts.map((text, i) => ({
            id: 'p' + (base + i),
            text,
            topicId,
            createdAt: new Date().toISOString(),
            status: 'active',
            mentions: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
            visibilityScore: { ChatGPT: 0, Gemini: 0, Perplexity: 0 },
            sentiment: { ChatGPT: 'neutral' as Sentiment, Gemini: 'neutral' as Sentiment, Perplexity: 'neutral' as Sentiment },
            conversation: [],
            sources: [],
            ranking: [],
            medium: [],
            fanouts: [],
          }));
          return { prompts: [...newPrompts, ...s.prompts] };
        }),

      togglePromptStatus: (id) =>
        set((s) => ({
          prompts: s.prompts.map((p) =>
            p.id === id ? { ...p, status: p.status === 'active' ? 'archived' : 'active' } : p
          ),
        })),
    }),
    { name: 'avq-astra-demo' }
  )
);
