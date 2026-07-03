import { Link } from 'react-router-dom';
import { useApp } from '@/store/app';
import { Pill } from '@/components/ui';
import { LLMS, LLM, Prompt } from '@/data/dummy';
import { useEffect, useMemo, useState } from 'react';
import { AddModal, SuggestionItem } from '@/components/AddModal';
import { LLMIcon } from '@/components/llm-icons';
import { Popover, Dropdown } from '@/components/Popover';
import {
  Plus, Sparkles, ChevronRight, ChevronDown, Target, X, Check,
  ArrowUpDown, Tag, MoreHorizontal, Filter, List as ListIcon, Layers as LayersIcon,
  Archive, RefreshCw, Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const PROMPT_GENERATOR_POOL = [
  'What is the best {seed} for small teams?',
  'How do I compare {seed} vs the top alternatives?',
  'Which platform is easiest to use for {seed}?',
  'What are the pros and cons of {seed}?',
  'How much does {seed} cost for startups?',
  'Is {seed} worth it in 2026?',
];

function generatePromptSuggestions(seed: string, _topicId?: string): Promise<SuggestionItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const phrase = seed.trim() || 'your product';
      resolve(PROMPT_GENERATOR_POOL.map((t, i) => ({
        id: 'gen' + Date.now() + '_' + i,
        label: t.replace('{seed}', phrase),
        description: 'Tuned to your audience',
      })));
    }, 800);
  });
}

function generateFocusSuggestions(seed: string): Promise<SuggestionItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const s = seed.trim() || 'your product';
      const cap = s.charAt(0).toUpperCase() + s.slice(1);
      resolve([
        { id: 'fg' + Date.now() + '_0', label: `${cap} for engineering teams`, description: 'AI-generated' },
        { id: 'fg' + Date.now() + '_1', label: `Enterprise ${s}`, description: 'AI-generated' },
        { id: 'fg' + Date.now() + '_2', label: `${cap} best practices`, description: 'AI-generated' },
        { id: 'fg' + Date.now() + '_3', label: `${cap} for startups`, description: 'AI-generated' },
      ]);
    }, 700);
  });
}

type SortKey = 'newest' | 'score' | 'mentions';

export function VisibilityListPage() {
  const prompts = useApp((s) => s.prompts);
  const addPrompt = useApp((s) => s.addPrompt);
  const addPrompts = useApp((s) => s.addPrompts);
  const addTopic = useApp((s) => s.addTopic);
  const removeTopic = useApp((s) => s.removeTopic);
  const topics = useApp((s) => s.company.topics);

  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('active');
  const [sort, setSort] = useState<SortKey>('newest');
  const [view, setView] = useState<'all' | 'byFocus'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showRerun, setShowRerun] = useState(false);
  const [rerunProgress, setRerunProgress] = useState<string | null>(null);
  const [showTrend, setShowTrend] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const [weekData, setWeekData] = useState([
    { week: 'W-7', score: 28 },
    { week: 'W-6', score: 32 },
    { week: 'W-5', score: 29 },
    { week: 'W-4', score: 35 },
    { week: 'W-3', score: 38 },
    { week: 'W-2', score: 36 },
    { week: 'W-1', score: 41 },
  ]);

  // New focus popover state
  const [newFocusName, setNewFocusName] = useState('');
  const [newFocusSeed, setNewFocusSeed] = useState('');
  const [generatedFocuses, setGeneratedFocuses] = useState<SuggestionItem[]>([]);
  const [pickedFocuses, setPickedFocuses] = useState<Set<string>>(new Set());
  const [generatingFocus, setGeneratingFocus] = useState(false);

  // Listen for "add new focus" trigger from AddModal
  useEffect(() => {
    const handler = () => {
      const btn = document.querySelector('[data-new-focus-btn]') as HTMLButtonElement;
      btn?.click();
    };
    window.addEventListener('avq:open-new-focus', handler);
    return () => window.removeEventListener('avq:open-new-focus', handler);
  }, []);

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      if (filterTopic !== 'all' && p.topicId !== filterTopic) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      return true;
    });
  }, [prompts, filterTopic, filterStatus]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sort === 'newest') copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === 'score') {
      copy.sort((a, b) =>
        (b.visibilityScore.ChatGPT + b.visibilityScore.Gemini + b.visibilityScore.Perplexity) -
        (a.visibilityScore.ChatGPT + a.visibilityScore.Gemini + a.visibilityScore.Perplexity)
      );
    }
    if (sort === 'mentions') {
      copy.sort((a, b) =>
        (b.mentions.ChatGPT + b.mentions.Gemini + b.mentions.Perplexity) -
        (a.mentions.ChatGPT + a.mentions.Gemini + a.mentions.Perplexity)
      );
    }
    return copy;
  }, [filtered, sort]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof sorted>();
    for (const p of sorted) {
      const arr = map.get(p.topicId) || [];
      arr.push(p);
      map.set(p.topicId, arr);
    }
    return map;
  }, [sorted]);

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const active = prompts.filter((p) => p.status === 'active').length;
  const archived = prompts.filter((p) => p.status === 'archived').length;
  const avgScore = prompts.length
    ? Math.round((prompts.reduce((s, p) => s + (p.visibilityScore.ChatGPT + p.visibilityScore.Gemini + p.visibilityScore.Perplexity) / 3, 0) / prompts.length) * 100)
    : 0;

  const focusItems = [
    { id: 'all', label: 'All focus areas', badge: prompts.length, icon: <Target className="w-3.5 h-3.5" /> },
    ...topics.map((t) => ({
      id: t.id,
      label: t.name,
      badge: prompts.filter((p) => p.topicId === t.id).length,
      icon: <Tag className="w-3.5 h-3.5" />,
    })),
  ];

  const currentTopicLabel = filterTopic === 'all'
    ? 'All focus areas'
    : topics.find((t) => t.id === filterTopic)?.name || 'All';

  return (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="mono-label">Visibility</div>
          </div>
          <h1 className="font-display font-bold text-xl text-text-bright">Prompt tracking</h1>
          <div className="mt-2 flex items-center gap-3">
            <div>
              <span className="text-2xl font-display font-bold text-avo-teal tabular-nums">{avgScore}%</span>
              <span className="text-xs text-text-muted font-mono ml-2">avg score</span>
            </div>
            <button
              onClick={() => setShowTrend(true)}
              className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div style={{ width: 80, height: 36 }}>
                <ResponsiveContainer>
                  <LineChart data={weekData} margin={{ top: 2, right: 2, left: -20, bottom: 2 }}>
                    <Line type="monotone" dataKey="score" stroke="#00C2B8" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRerun(true)}
            className="btn btn-secondary !text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Rerun
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-navy-deep/40 border border-navy-edge/60">
        <Filter className="w-3.5 h-3.5 text-text-muted ml-1" />

        <Dropdown
          align="left"
          width={260}
          value={filterTopic}
          onSelect={setFilterTopic}
          trigger={
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-elevated/50 hover:bg-navy-elevated border border-navy-edge text-xs">
              <Target className="w-3 h-3 text-text-muted" />
              <span className="text-text-bright font-display font-semibold">{currentTopicLabel}</span>
              <span className="text-text-muted font-mono">{prompts.filter((p) => filterTopic === 'all' || p.topicId === filterTopic).length}</span>
              <ChevronDown className="w-3 h-3 text-text-muted" />
            </div>
          }
          items={focusItems}
        />

        <NewFocusPopover
          newFocusName={newFocusName}
          setNewFocusName={setNewFocusName}
          newFocusSeed={newFocusSeed}
          setNewFocusSeed={setNewFocusSeed}
          generatedFocuses={generatedFocuses}
          setGeneratedFocuses={setGeneratedFocuses}
          pickedFocuses={pickedFocuses}
          setPickedFocuses={setPickedFocuses}
          generatingFocus={generatingFocus}
          setGeneratingFocus={setGeneratingFocus}
          addTopic={addTopic}
          generateFocusSuggestions={generateFocusSuggestions}
        />

        <div className="w-px h-5 bg-navy-edge/60 mx-1" />

        {/* View toggle (segmented) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-navy-deep border border-navy-edge rounded-md p-0.5">
            <button
              onClick={() => setView('all')}
              className={clsx(
                'flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-display font-semibold transition-colors',
                view === 'all' ? 'bg-avo-teal text-navy-base' : 'text-text-muted hover:text-text-bright'
              )}
            >
              <ListIcon className="w-3 h-3" /> All prompts
            </button>
            <button
              onClick={() => setView('byFocus')}
              className={clsx(
                'flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-display font-semibold transition-colors',
                view === 'byFocus' ? 'bg-avo-teal text-navy-base' : 'text-text-muted hover:text-text-bright'
              )}
            >
              <LayersIcon className="w-3 h-3" /> By focus
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Dropdown
            align="left"
            width={180}
            value={filterStatus}
            onSelect={(v) => setFilterStatus(v as any)}
            trigger={
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-elevated/50 hover:bg-navy-elevated border border-navy-edge text-xs">
                <span className={clsx(
                  'w-1.5 h-1.5 rounded-full',
                  filterStatus === 'active' ? 'bg-status-success' : filterStatus === 'archived' ? 'bg-text-muted' : 'bg-avo-teal'
                )} />
                <span className="text-text-bright font-display font-semibold capitalize">{filterStatus === 'all' ? 'All status' : filterStatus}</span>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </div>
            }
            items={[
              { id: 'all', label: 'All status', icon: <span className="w-1.5 h-1.5 rounded-full bg-avo-teal" /> },
              { id: 'active', label: 'Active', icon: <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> },
              { id: 'archived', label: 'Archived', icon: <span className="w-1.5 h-1.5 rounded-full bg-text-muted" /> },
            ]}
          />

          <Dropdown
            align="left"
            width={170}
            value={sort}
            onSelect={(v) => setSort(v as SortKey)}
            trigger={
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-elevated/50 hover:bg-navy-elevated border border-navy-edge text-xs">
                <ArrowUpDown className="w-3 h-3 text-text-muted" />
                <span className="text-text-bright font-display font-semibold">
                  {sort === 'newest' ? 'Newest' : sort === 'score' ? 'Highest score' : 'Most mentions'}
                </span>
                <ChevronDown className="w-3 h-3 text-text-muted" />
              </div>
            }
            items={[
              { id: 'newest', label: 'Newest' },
              { id: 'score', label: 'Highest score' },
              { id: 'mentions', label: 'Most mentions' },
            ]}
          />
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="card-elevated text-center !py-12">
          <Sparkles className="w-7 h-7 mx-auto text-avo-teal mb-2" />
          <div className="font-display font-semibold text-text-bright">No prompts match these filters</div>
          <p className="text-sm text-text-muted mt-1 mb-4">Try changing the focus area or status filter.</p>
          <button
            onClick={() => { setFilterTopic('all'); setFilterStatus('active'); }}
            className="btn btn-secondary !text-xs"
          >
            Reset filters
          </button>
        </div>
      ) : view === 'all' ? (
        <FlatTableView sorted={sorted} topics={topics} />
      ) : (
        <GroupedView
          grouped={grouped}
          topics={topics}
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
          removeTopic={removeTopic}
          setFilterTopic={setFilterTopic}
        />
      )}

      {/* Sticky bottom add bar */}
      {filtered.length > 0 && (
        <div className="sticky bottom-0 mt-3 -mx-8 px-8 py-3 bg-navy-base/80 backdrop-blur border-t border-navy-edge/60 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-xs text-text-muted font-mono">{filtered.length} prompt{filtered.length === 1 ? '' : 's'} in view</span>
            <button onClick={() => setShowAdd(true)} className="btn btn-primary !text-xs">
              <Plus className="w-3.5 h-3.5" /> Add prompt
            </button>
          </div>
        </div>
      )}

      {/* Add prompt modal */}
      <AddModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add a prompt"
        subtitle="Track a specific question your audience asks AI."
        topicOptions={topics.map((t) => ({ id: t.id, name: t.name }))}
        topicRequired={true}
        manualLabel="Prompt text"
        manualPlaceholder="e.g. What is the best platform for managing remote engineering teams?"
        aiLabel="Generate with AI"
        aiSeedLabel="Keyword seed"
        aiSeedPlaceholder="e.g. cost, serverless, startups"
        aiRunGenerator={generatePromptSuggestions}
        onSubmitManual={(text, topicId) => { if (topicId) addPrompt(text, topicId); }}
        onSubmitAI={(items, topicId) => { if (topicId) addPrompts(items.map((i) => i.label), topicId); }}
        aiButtonLabel="Generate ideas"
      />

      {/* Rerun visibility modal */}
      {showRerun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-base/85 backdrop-blur-sm" onClick={() => { if (!rerunProgress) setShowRerun(false); }}>
          <div className="card-elevated w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-semibold text-text-bright">Rerun visibility</div>
                <div className="text-xs text-text-muted mt-0.5">Select prompts and LLMs to scan</div>
              </div>
              {!rerunProgress && (
                <button onClick={() => setShowRerun(false)} className="text-text-muted hover:text-text-bright">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {rerunProgress ? (
              <div className="py-4 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-avo-teal/20 border-t-avo-teal animate-spin mx-auto mb-3" />
                <div className="text-sm text-text-bright font-display">{rerunProgress}</div>
                <div className="text-xs text-text-muted mt-1">This usually takes under a minute</div>
              </div>
            ) : (
              <>
                {/* Prompts grouped by focus */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] mono-label text-text-muted">Select by focus</div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        document.querySelectorAll('[data-rerun-prompt]').forEach((cb) => ((cb as HTMLInputElement).checked = true));
                      }} className="text-[10px] text-avo-teal hover:underline">Select all</button>
                      <span className="text-[10px] text-text-muted">·</span>
                      <button onClick={() => {
                        document.querySelectorAll('[data-rerun-prompt]').forEach((cb) => ((cb as HTMLInputElement).checked = false));
                      }} className="text-[10px] text-avo-teal hover:underline">Deselect</button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {topics.map((topic) => {
                      const topicPrompts = sorted.filter((p) => p.topicId === topic.id);
                      if (!topicPrompts.length) return null;
                      return (
                        <div key={topic.id} className="rounded-lg border border-navy-edge overflow-hidden">
                          <div className="flex items-center gap-2 px-3 py-2 bg-navy-deep/60">
                            <span className="w-1.5 h-3 rounded-full bg-gradient-to-b from-avo-teal to-pillar-manifest shrink-0" />
                            <span className="text-xs font-display font-semibold text-text-bright flex-1">{topic.name}</span>
                            <span className="text-[10px] text-text-muted font-mono">{topicPrompts.length}</span>
                          </div>
                          <div className="divide-y divide-navy-edge/20">
                            {topicPrompts.map((p) => (
                              <label key={p.id} className="flex items-center gap-2 px-3 py-2 hover:bg-navy-elevated/20 cursor-pointer">
                                <input type="checkbox" data-rerun-prompt defaultChecked className="w-3.5 h-3.5 rounded border-navy-edge accent-avo-teal" />
                                <span className="text-xs text-text-secondary truncate">{p.text}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LLMs selection */}
                <div className="mb-4">
                  <div className="text-[10px] mono-label text-text-muted mb-2">LLMs ({LLMS.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {LLMS.map((l) => (
                      <label key={l} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-navy-edge hover:border-avo-teal/40 cursor-pointer transition-colors bg-navy-deep/40">
                        <input type="checkbox" defaultChecked className="w-3 h-3 rounded accent-avo-teal" />
                        <LLMIcon llm={l} size={13} />
                        <span className="text-[11px] text-text-secondary font-display">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted mb-4 p-2 rounded bg-navy-deep/40">
                  <Zap className="w-3.5 h-3.5 text-gold-base shrink-0" />
                  <span>Estimasi: <span className="text-text-bright font-semibold">{sorted.length * LLMS.length * 2}</span> credits · <span className="text-text-bright font-semibold">{sorted.length}</span> prompt × <span className="text-text-bright font-semibold">{LLMS.length}</span> LLMs × 2</span>
                </div>

                <button
                  onClick={() => {
                    const steps = ['Scanning ChatGPT…', 'Scanning Gemini…', 'Scanning Perplexity…', 'Compiling results…'];
                    let i = 0;
                    setRerunProgress(steps[i]);
                    const iv = setInterval(() => {
                      i++;
                      if (i < steps.length) setRerunProgress(steps[i]);
                      else {
                        clearInterval(iv);
                        setTimeout(() => { setRerunProgress(null); setShowRerun(false); }, 800);
                      }
                    }, 700);
                  }}
                  className="btn btn-primary w-full"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Run visibility scan
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Trend modal */}
      {showTrend && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-base/85 backdrop-blur-sm"
          onClick={() => setShowTrend(false)}
        >
          <div className="card-elevated w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-semibold text-text-bright">Visibility trend</div>
                <div className="text-xs text-text-muted mt-0.5">Weekly performance over 8 weeks</div>
              </div>
              <button onClick={() => setShowTrend(false)} className="text-text-muted hover:text-text-bright">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Full chart */}
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={weekData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} domain={[0, 60]} tickFormatter={(v) => `${v}%`} width={36} />
                  <Tooltip
                    contentStyle={{ background: '#0F1E32', border: '1px solid #1F2D44', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: '#94A3B8' }}
                    itemStyle={{ color: '#00C2B8' }}
                    formatter={(v: number) => [`${v}%`, 'Score']}
                  />
                  <Line type="monotone" dataKey="score" stroke="#00C2B8" strokeWidth={2} dot={{ r: 3, fill: '#00C2B8' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center">
                <div className="text-lg font-display font-bold text-avo-teal">{avgScore}%</div>
                <div className="text-[10px] text-text-muted">Current</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-display font-bold text-status-success">+{Math.max(0, avgScore - (weekData[0]?.score || 0))}%</div>
                <div className="text-[10px] text-text-muted">vs 8 weeks ago</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-display font-bold text-gold-base">{Math.round(avgScore * 0.65)}%</div>
                <div className="text-[10px] text-text-muted">Industry avg</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-navy-edge/40">
              <div className="text-xs text-text-muted text-center">
                Trend data based on weekly scans across {LLMS.length} LLMs
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Flat table view (default) ---------- */

function FlatTableView({
  sorted,
  topics,
}: {
  sorted: Prompt[];
  topics: { id: string; name: string }[];
}) {
  return (
    <div className="card !p-0 overflow-hidden">
      {/* Column headers */}
      <div className="grid grid-cols-[minmax(0,1.5fr)_180px_120px_56px_56px_24px] gap-3 items-center px-3 py-2 bg-navy-deep/60 border-b border-navy-edge/60 text-[10px] uppercase tracking-wider font-mono text-text-muted">
        <div>Prompt</div>
        <div>Focus</div>
        <div>LLM presence</div>
        <div className="text-center">Mentions</div>
        <div className="text-right">Score</div>
        <div />
      </div>

      {sorted.map((p, i) => {
        const topic = topics.find((t) => t.id === p.topicId);
        const avgS = Math.round(((p.visibilityScore.ChatGPT + p.visibilityScore.Gemini + p.visibilityScore.Perplexity) / 3) * 100);
        const totalM = p.mentions.ChatGPT + p.mentions.Gemini + p.mentions.Perplexity;
        return (
          <Link
            key={p.id}
            to={`/dashboard/visibility/${p.id}`}
            className={clsx(
              'grid grid-cols-[minmax(0,1.5fr)_180px_120px_56px_56px_24px] gap-3 items-center px-3 py-2 hover:bg-navy-elevated/40 transition-colors group',
              i > 0 && 'border-t border-navy-edge/30'
            )}
          >
            {/* Prompt text — 1 line truncate */}
            <div className="min-w-0 flex items-center gap-2">
              <span className="text-sm text-text-bright truncate group-hover:text-avo-teal">
                {p.text}
              </span>
              {p.status === 'archived' && <Pill tone="muted">archived</Pill>}
            </div>

            {/* Focus label */}
            <div className="min-w-0">
              {topic ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-avo-teal/10 border border-avo-teal/25 text-avo-teal text-[11px] font-display font-semibold truncate max-w-[160px]">
                  {topic.name}
                </span>
              ) : (
                <span className="text-[11px] text-text-muted">—</span>
              )}
            </div>

            {/* LLM icons */}
            <div className="flex items-center gap-1.5">
              {LLMS.slice(0, 3).map((l) => (
                <div
                  key={l}
                  title={`${l}: ${p.mentions[l]}`}
                  className={clsx(
                    'w-5 h-5 rounded flex items-center justify-center',
                    p.mentions[l] > 0
                      ? l === 'ChatGPT' ? 'bg-avo-teal/15 text-avo-teal'
                        : l === 'Gemini' ? 'bg-gold-base/15 text-gold-base'
                        : 'bg-vs-rose/15 text-vs-rose'
                      : 'bg-navy-deep text-text-disabled opacity-40'
                  )}
                >
                  <LLMIcon llm={l} size={11} />
                </div>
              ))}
              {LLMS.length > 3 && (
                <Popover
                  align="right"
                  trigger={
                    <span className="px-1.5 h-5 rounded bg-navy-elevated text-[10px] font-mono text-text-muted hover:text-avo-teal hover:bg-avo-teal/10 cursor-pointer inline-flex items-center">
                      +{LLMS.length - 3}
                    </span>
                  }
                >
                  {() => (
                    <div className="p-2 space-y-1">
                      <div className="text-[10px] mono-label mb-1">Other LLMs</div>
                      {LLMS.slice(3).map((l) => (
                        <div key={l} className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <LLMIcon llm={l} size={11} /> {l}
                        </div>
                      ))}
                    </div>
                  )}
                </Popover>
              )}
            </div>

            {/* Mentions */}
            <div className="text-center text-[11px] font-mono text-text-muted">
              {totalM}<span className="text-text-disabled">/3</span>
            </div>

            {/* Score */}
            <div className={clsx(
              'text-right text-[11px] font-mono font-semibold tabular-nums',
              avgS >= 70 ? 'text-avo-teal' : avgS >= 40 ? 'text-gold-base' : 'text-vs-rose'
            )}>
              {avgS}<span className={clsx(
                avgS >= 70 ? 'text-avo-teal' : avgS >= 40 ? 'text-gold-base' : 'text-vs-rose'
              )}>%</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-avo-teal justify-self-end" />
          </Link>
        );
      })}
    </div>
  );
}

/* ---------- Grouped accordion view ---------- */

function GroupedView({
  grouped,
  topics,
  collapsed,
  toggleCollapse,
  removeTopic,
  setFilterTopic,
}: {
  grouped: Map<string, any[]>;
  topics: { id: string; name: string }[];
  collapsed: Set<string>;
  toggleCollapse: (id: string) => void;
  removeTopic: (id: string) => void;
  setFilterTopic: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {Array.from(grouped.entries()).map(([tid, items]) => {
        const topic = topics.find((t) => t.id === tid);
        const isCollapsed = collapsed.has(tid);
        return (
          <div key={tid} className="card !p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 hover:bg-navy-elevated/30 transition-colors">
              <button onClick={() => toggleCollapse(tid)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
                <ChevronDown className={clsx('w-3.5 h-3.5 text-text-muted transition-transform shrink-0', isCollapsed && '-rotate-90')} />
                <div className="w-1 h-3.5 rounded-full bg-gradient-to-b from-avo-teal to-pillar-manifest shrink-0" />
                <span className="font-display font-semibold text-text-bright text-sm truncate">{topic?.name || 'Uncategorized'}</span>
                <span className="text-[10px] text-text-muted font-mono shrink-0">{items.length}</span>
              </button>
              <Popover
                align="right"
                width={160}
                trigger={
                  <span className="ml-auto p-1 rounded text-text-muted hover:text-avo-teal hover:bg-avo-teal/8">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </span>
                }
              >
                {(close) => (
                  <div className="py-1">
                    <button
                      onClick={() => { setFilterTopic(tid); close(); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-navy-elevated/50 hover:text-text-bright"
                    >
                      <Filter className="w-3 h-3" /> Filter to this
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${topic?.name}"?`)) { removeTopic(tid); close(); }
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-vs-rose hover:bg-vs-rose/10"
                    >
                      <X className="w-3 h-3" /> Delete focus
                    </button>
                  </div>
                )}
              </Popover>
            </div>

            {!isCollapsed && (
              <div className="border-t border-navy-edge/40">
                {items.map((p, i) => {
                  const avgS = Math.round(((p.visibilityScore.ChatGPT + p.visibilityScore.Gemini + p.visibilityScore.Perplexity) / 3) * 100);
                  const totalM = p.mentions.ChatGPT + p.mentions.Gemini + p.mentions.Perplexity;
                  return (
                    <Link
                      key={p.id}
                      to={`/dashboard/visibility/${p.id}`}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-1.5 hover:bg-navy-elevated/40 transition-colors group',
                        i > 0 && 'border-t border-navy-edge/30'
                      )}
                    >
                      <div className="flex items-center gap-0.5 shrink-0">
                        {LLMS.map((l) => (
                          <div
                            key={l}
                            title={`${l}: ${p.mentions[l]}`}
                            className={clsx(
                              'w-5 h-5 rounded flex items-center justify-center',
                              p.mentions[l] > 0
                                ? l === 'ChatGPT' ? 'bg-avo-teal/15 text-avo-teal'
                                  : l === 'Gemini' ? 'bg-gold-base/15 text-gold-base'
                                  : 'bg-vs-rose/15 text-vs-rose'
                                : 'bg-navy-deep text-text-disabled opacity-40'
                            )}
                          >
                            <LLMIcon llm={l} size={11} />
                          </div>
                        ))}
                      </div>

                      <span className="flex-1 min-w-0 text-sm text-text-bright truncate group-hover:text-avo-teal">
                        {p.text}
                      </span>

                      <span className={clsx(
                        'text-[11px] font-mono font-semibold tabular-nums w-12 text-right shrink-0 hidden sm:block',
                        avgS >= 70 ? 'text-avo-teal' : avgS >= 40 ? 'text-gold-base' : 'text-vs-rose'
                      )}>
                        {avgS}<span className="text-text-muted">%</span>
                      </span>

                      <span className="text-[10px] font-mono text-text-muted w-12 text-right shrink-0 hidden md:block">
                        {totalM}<span className="text-text-disabled">/3</span>
                      </span>

                      {p.status === 'archived' && <Pill tone="muted">archived</Pill>}

                      <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-avo-teal shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- New focus popover (inline) ---------- */

function NewFocusPopover({
  newFocusName,
  setNewFocusName,
  newFocusSeed,
  setNewFocusSeed,
  generatedFocuses,
  setGeneratedFocuses,
  pickedFocuses,
  setPickedFocuses,
  generatingFocus,
  setGeneratingFocus,
  addTopic,
  generateFocusSuggestions,
}: {
  newFocusName: string;
  setNewFocusName: (v: string) => void;
  newFocusSeed: string;
  setNewFocusSeed: (v: string) => void;
  generatedFocuses: SuggestionItem[];
  setGeneratedFocuses: (v: SuggestionItem[]) => void;
  pickedFocuses: Set<string>;
  setPickedFocuses: React.Dispatch<React.SetStateAction<Set<string>>>;
  generatingFocus: boolean;
  setGeneratingFocus: (v: boolean) => void;
  addTopic: (name: string, description: string) => void;
  generateFocusSuggestions: (seed: string) => Promise<SuggestionItem[]>;
}) {
  return (
    <Popover
      align="left"
      width={360}
      trigger={
        <button data-new-focus-btn className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-text-muted hover:text-avo-teal hover:bg-avo-teal/8 transition-colors">
          <Plus className="w-3 h-3" /> new focus
        </button>
      }
    >
      {(close) => (
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-avo-teal" />
            <div className="font-display font-semibold text-sm text-text-bright">New focus area</div>
          </div>

          {!generatedFocuses.length && !generatingFocus && (
            <>
              <label className="mono-label mb-1.5 block">Focus name</label>
              <input
                value={newFocusName}
                onChange={(e) => setNewFocusName(e.target.value)}
                placeholder="e.g. Database performance"
                className="w-full bg-navy-deep border border-navy-edge rounded-md px-2.5 py-1.5 text-xs text-text-bright placeholder:text-text-muted focus:outline-none focus:border-avo-teal/50"
              />
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-navy-edge/60" />
                <span className="text-[10px] text-text-muted font-mono">OR</span>
                <div className="flex-1 h-px bg-navy-edge/60" />
              </div>
              <input
                value={newFocusSeed}
                onChange={(e) => setNewFocusSeed(e.target.value)}
                placeholder="Keyword seed for AI generation"
                className="w-full bg-navy-deep border border-navy-edge rounded-md px-2.5 py-1.5 text-xs text-text-bright placeholder:text-text-muted focus:outline-none focus:border-avo-teal/50"
              />
              <div className="flex items-center justify-end gap-2 mt-3">
                <button onClick={close} className="text-xs text-text-muted hover:text-text-bright px-2 py-1">Cancel</button>
                {newFocusSeed.trim() && (
                  <button
                    onClick={async () => {
                      setGeneratingFocus(true);
                      const r = await generateFocusSuggestions(newFocusSeed);
                      setGeneratedFocuses(r);
                      setGeneratingFocus(false);
                    }}
                    className="btn btn-secondary !text-xs"
                  >
                    <Sparkles className="w-3 h-3" /> Generate
                  </button>
                )}
                <button
                  onClick={() => {
                    if (newFocusName.trim()) {
                      addTopic(newFocusName.trim(), 'Custom focus');
                      setNewFocusName('');
                      setNewFocusSeed('');
                      close();
                    }
                  }}
                  disabled={!newFocusName.trim()}
                  className="btn btn-primary !text-xs"
                >
                  Add
                </button>
              </div>
            </>
          )}

          {generatingFocus && (
            <div className="flex items-center gap-2 py-3 text-xs text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-avo-teal pulse-dot" />
              Generating focus ideas…
            </div>
          )}

          {generatedFocuses.length > 0 && (
            <>
              <div className="text-[10px] mono-label mb-1.5">Pick focus areas</div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {generatedFocuses.map((f) => {
                  const picked = pickedFocuses.has(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setPickedFocuses((prev) => {
                          const next = new Set(prev);
                          if (next.has(f.id)) next.delete(f.id);
                          else next.add(f.id);
                          return next;
                        });
                      }}
                      className={clsx(
                        'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left text-xs border transition-colors',
                        picked ? 'bg-avo-teal/10 border-avo-teal/30 text-text-bright' : 'bg-navy-deep border-navy-edge text-text-secondary hover:border-avo-edge'
                      )}
                    >
                      <div className={clsx('w-3.5 h-3.5 rounded-sm shrink-0 flex items-center justify-center', picked ? 'bg-avo-teal text-navy-base' : 'bg-navy-elevated border border-navy-edge')}>
                        {picked && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className="flex-1">{f.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  onClick={() => { setGeneratedFocuses([]); setPickedFocuses(new Set()); }}
                  className="text-xs text-text-muted hover:text-text-bright px-2 py-1"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    generatedFocuses.filter((f) => pickedFocuses.has(f.id)).forEach((f) => addTopic(f.label, f.description || 'AI-generated'));
                    setGeneratedFocuses([]);
                    setPickedFocuses(new Set());
                    setNewFocusName('');
                    setNewFocusSeed('');
                    close();
                  }}
                  disabled={pickedFocuses.size === 0}
                  className="btn btn-primary !text-xs"
                >
                  Add {pickedFocuses.size}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Popover>
  );
}
