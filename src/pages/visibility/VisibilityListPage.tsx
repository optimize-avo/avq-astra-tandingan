import { Link } from 'react-router-dom';
import { useApp } from '@/store/app';
import { PageHeader, Card, Pill } from '@/components/ui';
import { Plus, Sparkles, Eye, EyeOff, BarChart3, ChevronRight } from 'lucide-react';
import { LLMS } from '@/data/dummy';
import { useMemo, useState } from 'react';
import { AddModal, SuggestionItem } from '@/components/AddModal';
import { LLMIcon } from '@/components/llm-icons';
import clsx from 'clsx';

const PROMPT_GENERATOR_POOL = [
  'What is the best {seed} for small teams?',
  'How do I compare {seed} vs the top alternatives?',
  'Which platform is easiest to use for {seed}?',
  'What are the pros and cons of {seed}?',
  'How much does {seed} cost for startups?',
  'Is {seed} worth it in 2026?',
];

function generatePromptSuggestions(seed: string, topicId?: string): Promise<SuggestionItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const company = (window as any).__demoCompany || 'your brand';
      const focus = (window as any).__demoFocusName || 'this topic';
      const seedPhrase = seed.trim() || `${company} ${focus}`;
      const result = PROMPT_GENERATOR_POOL.map((t, i) => ({
        id: 'gen' + Date.now() + '_' + i,
        label: t.replace('{seed}', seedPhrase),
        description: `Tuned for ${focus}`,
      }));
      resolve(result);
    }, 900);
  });
}

export function VisibilityListPage() {
  const prompts = useApp((s) => s.prompts);
  const addPrompt = useApp((s) => s.addPrompt);
  const addPrompts = useApp((s) => s.addPrompts);
  const addTopic = useApp((s) => s.addTopic);
  const topics = useApp((s) => s.company.topics);

  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showAddFocus, setShowAddFocus] = useState(false);

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      if (filterTopic !== 'all' && p.topicId !== filterTopic) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      return true;
    });
  }, [prompts, filterTopic, filterStatus]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof prompts>();
    for (const p of filtered) {
      const arr = map.get(p.topicId) || [];
      arr.push(p);
      map.set(p.topicId, arr);
    }
    return map;
  }, [filtered]);

  const active = prompts.filter((p) => p.status === 'active').length;
  const totalMentions = prompts.reduce((s, p) => s + p.mentions.ChatGPT + p.mentions.Gemini + p.mentions.Perplexity, 0);
  const avgSov = prompts.length
    ? Math.round((prompts.reduce((s, p) => s + (p.sov.ChatGPT + p.sov.Gemini + p.sov.Perplexity) / 3, 0) / prompts.length) * 100)
    : 0;

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Visibility"
        title="Prompt tracking"
        description="Each row is a real question your audience asks AI. Click any row to see the full conversation, sources, and how you compare to competitors."
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Active prompts', value: active, icon: Eye, color: 'text-avo-teal' },
          { label: 'Total mentions', value: totalMentions, icon: Sparkles, color: 'text-pillar-manifest' },
          { label: 'Avg share of voice', value: avgSov + '%', icon: BarChart3, color: 'text-gold-base' },
          { label: 'Archived', value: prompts.length - active, icon: EyeOff, color: 'text-text-muted' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="!p-4">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <div className="mono-label">{s.label}</div>
              </div>
              <div className="font-display font-bold text-2xl text-text-bright mt-2">{s.value}</div>
            </Card>
          );
        })}
      </div>

      {/* Filter + Add row */}
      <div className="card-elevated !p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="mono-label shrink-0">Focus</div>
          <button
            onClick={() => setFilterTopic('all')}
            className={clsx(
              'pill border transition-all',
              filterTopic === 'all'
                ? 'bg-avo-teal/15 text-avo-teal border-avo-teal/40'
                : 'bg-navy-deep text-text-secondary border-navy-edge hover:border-avo-edge'
            )}
          >
            All ({prompts.length})
          </button>
          {topics.map((t) => {
            const count = prompts.filter((p) => p.topicId === t.id).length;
            if (count === 0) return null;
            return (
              <button
                key={t.id}
                onClick={() => setFilterTopic(t.id)}
                className={clsx(
                  'pill border transition-all',
                  filterTopic === t.id
                    ? 'bg-avo-teal/15 text-avo-teal border-avo-teal/40'
                    : 'bg-navy-deep text-text-secondary border-navy-edge hover:border-avo-edge'
                )}
              >
                {t.name} ({count})
              </button>
            );
          })}

          <div className="h-5 w-px bg-navy-edge mx-1" />

          <button
            onClick={() => setFilterStatus('all')}
            className={clsx(
              'pill border transition-all',
              filterStatus === 'all'
                ? 'bg-navy-elevated text-text-bright border-navy-edge'
                : 'bg-transparent text-text-muted border-transparent hover:text-text-secondary'
            )}
          >
            All status
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={clsx(
              'pill border transition-all',
              filterStatus === 'active'
                ? 'bg-status-success/15 text-status-success border-status-success/40'
                : 'bg-transparent text-text-muted border-transparent hover:text-status-success'
            )}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('archived')}
            className={clsx(
              'pill border transition-all',
              filterStatus === 'archived'
                ? 'bg-navy-elevated text-text-muted border-navy-edge'
                : 'bg-transparent text-text-muted border-transparent'
            )}
          >
            Archived
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowAddFocus(true)}
              className="btn btn-ghost !text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> New focus
            </button>
            <button onClick={() => setShowAdd(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" /> Add prompt
            </button>
          </div>
        </div>
      </div>

      {/* Prompts grouped by focus */}
      {filtered.length === 0 ? (
        <Card elevated className="text-center !py-12">
          <Sparkles className="w-8 h-8 mx-auto text-avo-teal mb-3" />
          <div className="font-display font-semibold text-text-bright">No prompts match this filter</div>
          <p className="text-sm text-text-muted mt-1 mb-4">
            Try a different focus area, or add a new prompt to start tracking.
          </p>
          <button onClick={() => setShowAdd(true)} className="btn btn-secondary">
            <Plus className="w-4 h-4" /> Add prompt
          </button>
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([tid, items]) => {
            const topic = topics.find((t) => t.id === tid);
            return (
              <div key={tid}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-1 h-4 rounded-full bg-gradient-to-b from-avo-teal to-pillar-manifest" />
                  <h3 className="font-display font-semibold text-text-bright text-sm">
                    {topic?.name || 'Uncategorized'}
                  </h3>
                  <span className="text-xs text-text-muted font-mono">· {items.length} prompt{items.length === 1 ? '' : 's'}</span>
                </div>
                <div className="grid lg:grid-cols-2 gap-3">
                  {items.map((p) => {
                    const totalM = p.mentions.ChatGPT + p.mentions.Gemini + p.mentions.Perplexity;
                    const avgS = Math.round(((p.sov.ChatGPT + p.sov.Gemini + p.sov.Perplexity) / 3) * 100);
                    return (
                      <Link
                        key={p.id}
                        to={`/dashboard/visibility/${p.id}`}
                        className="card !p-4 hover:border-avo-teal/40 hover:bg-navy-elevated/30 transition-all group block"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="text-sm text-text-bright leading-snug group-hover:text-avo-teal line-clamp-2">
                            {p.text}
                          </div>
                          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-avo-teal shrink-0 mt-0.5" />
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          {/* LLM icons */}
                          <div className="flex items-center gap-1.5">
                            {LLMS.map((l) => (
                              <div
                                key={l}
                                className={clsx(
                                  'w-7 h-7 rounded-md flex items-center justify-center border',
                                  p.mentions[l] > 0
                                    ? l === 'ChatGPT'
                                      ? 'bg-avo-teal/15 text-avo-teal border-avo-teal/30'
                                      : l === 'Gemini'
                                        ? 'bg-gold-base/15 text-gold-base border-gold-base/30'
                                        : 'bg-vs-rose/15 text-vs-rose border-vs-rose/30'
                                    : 'bg-navy-deep text-text-disabled border-navy-edge'
                                )}
                                title={`${l}: ${p.mentions[l]} mention${p.mentions[l] === 1 ? '' : 's'}`}
                              >
                                <LLMIcon llm={l} size={14} />
                              </div>
                            ))}
                          </div>

                          <span className="text-xs text-text-muted font-mono ml-auto">
                            {Math.round((p.sov.ChatGPT + p.sov.Gemini + p.sov.Perplexity) / 3 * 100)}%
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-navy-deep overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-avo-teal to-pillar-manifest"
                              style={{ width: `${avgS}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-text-muted font-mono w-16 text-right">
                            {totalM} mention{totalM === 1 ? '' : 's'}
                          </span>
                          {p.status === 'archived' && (
                            <Pill tone="muted">archived</Pill>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add prompt modal */}
      <AddModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add a prompt"
        subtitle="Track a specific question your audience asks AI. Type it manually or let AI suggest variations."
        topicOptions={topics.map((t) => ({ id: t.id, name: t.name }))}
        topicRequired={true}
        manualLabel="Prompt text"
        manualPlaceholder="e.g. What is the best platform for managing remote engineering teams?"
        aiLabel="Generate with AI"
        aiSeedLabel="Keyword seed"
        aiSeedPlaceholder="e.g. cost, serverless, startups (comma-separated)"
        aiRunGenerator={generatePromptSuggestions}
        onSubmitManual={(text, topicId) => {
          if (!topicId) return;
          const id = addPrompt(text, topicId);
          return id;
        }}
        onSubmitAI={(items, topicId) => {
          if (!topicId) return;
          addPrompts(items.map((i) => i.label), topicId);
        }}
        aiButtonLabel="Generate prompt ideas"
      />

      {/* Add focus modal */}
      <AddModal
        open={showAddFocus}
        onClose={() => setShowAddFocus(false)}
        title="Add a focus area"
        subtitle="Focus areas are themes your audience asks about. Each becomes a bucket for prompts."
        manualLabel="Focus name"
        manualPlaceholder="e.g. Database performance tuning"
        aiLabel="Generate with AI"
        aiSeedLabel="Keyword seed"
        aiSeedPlaceholder="e.g. devops, monitoring, latency"
        aiRunGenerator={async (seed): Promise<SuggestionItem[]> => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const seedWords = seed.trim() || 'your product';
              const candidates = [
                `${seedWords[0].toUpperCase() + seedWords.slice(1)} for engineering teams`,
                `Enterprise ${seedWords}`,
                `${seedWords} best practices`,
                `${seedWords} for startups`,
              ];
              resolve(candidates.map((label, i) => ({
                id: 'fg' + Date.now() + '_' + i,
                label,
                description: 'AI-generated focus area',
              })));
            }, 700);
          });
        }}
        onSubmitManual={(text) => {
          addTopic(text, 'Custom focus area');
        }}
        onSubmitAI={(items) => {
          for (const it of items) addTopic(it.label, it.description || 'AI-generated');
        }}
        aiButtonLabel="Generate focus ideas"
      />
    </div>
  );
}
