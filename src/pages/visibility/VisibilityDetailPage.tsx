import { Link, useParams } from 'react-router-dom';
import { useApp } from '@/store/app';
import { PageHeader, Card, Pill } from '@/components/ui';
import { LLMS, LLM } from '@/data/dummy';
import { ArrowLeft, MessageSquare, FileText, Archive, ArchiveRestore, Sparkles, ExternalLink, X, Target, TrendingUp, TrendingDown, Minus, Plus, ChevronLeft, ChevronRight, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Popover } from '@/components/Popover';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import clsx from 'clsx';
import { useState, useEffect, useMemo } from 'react';
import { LLMIcon } from '@/components/llm-icons';

const SENTIMENT_COLOR: Record<string, string> = {
  positive: '#059669',
  neutral: '#94A3B8',
  negative: '#E3170A',
};

const LLM_COLOR: Record<LLM, string> = {
  ChatGPT: '#00C2B8',
  Gemini: '#F8B400',
  Perplexity: '#FF6A5E',
};

const HISTORY_COLOR = '#00C2B8';

function VisibilityGauge({ value, size = 140 }: { value: number; size?: number }) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? '#00C2B8' : value >= 40 ? '#F8B400' : '#FF6A5E';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1F2D44"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-display font-bold text-3xl text-text-bright leading-none tabular-nums">
            {value}
          </div>
          <div className="text-[10px] font-mono text-text-muted mt-0.5">out of 100</div>
        </div>
      </div>
    </div>
  );
}

export function VisibilityDetailPage() {
  const { id } = useParams();
  const prompts = useApp((s) => s.prompts);
  const topics = useApp((s) => s.company.topics);
  const toggle = useApp((s) => s.togglePromptStatus);
  const prompt = prompts.find((p) => p.id === id);
  const [showConv, setShowConv] = useState(false);
  const [page, setPage] = useState(0);
  const [rerunning, setRerunning] = useState(false);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!rerunning) return;
    const t = setTimeout(() => setRerunning(false), 2500);
    return () => clearTimeout(t);
  }, [rerunning]);

  const fullRanking = useMemo<{ name: string; score: number; you: boolean }[]>(() => {
    if (!prompt) return [];
    const base = [...prompt.ranking].sort((a, b) => b.score - a.score);
    const padding = ['Heroku', 'DigitalOcean', 'Linode', 'Hetzner', 'Cloudflare', 'Netlify', 'Vultr', 'Fastly', 'Akamai', 'GCP Cloud Run'];
    let i = 0;
    while (base.length < 15 && i < padding.length) {
      base.push({ name: padding[i], score: Math.max(0.04, 0.18 - i * 0.02), you: false });
      i++;
    }
    return base;
  }, [prompt]);

  const totalPages = Math.ceil(fullRanking.length / PAGE_SIZE);
  const visibleRanking = fullRanking.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => { setPage(0); }, [prompt?.id]);

  if (!prompt) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-text-secondary">Prompt not found.</p>
        <Link to="/dashboard/visibility" className="btn btn-secondary mt-4 inline-flex">← Back to list</Link>
      </div>
    );
  }

  const avgScore = Math.round(((prompt.visibilityScore.ChatGPT + prompt.visibilityScore.Gemini + prompt.visibilityScore.Perplexity) / 3) * 100);
  const mentionedCompetitors = prompt.ranking.filter((r) => !r.you && r.score > 0).map((r) => r.name);
  const sentimentCounts = ['positive', 'neutral', 'negative'].map((s) => ({
    name: s,
    value: LLMS.filter((l) => prompt.sentiment[l] === s).length,
  }));
  const topic = topics.find((t) => t.id === prompt.topicId);

  // Mocked score delta vs last week
  const scoreDelta = +12;

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <Link to="/dashboard/visibility" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-avo-teal mb-4 font-mono uppercase tracking-wider">
        <ArrowLeft className="w-3 h-3" /> All prompts
      </Link>

      {/* Hero — prominent Visibility Score */}
      <Card elevated className="mb-6 overflow-hidden" style={{ position: 'relative' }}>
        {rerunning && (
          <div className="absolute inset-0 bg-navy-base/70 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 border-avo-teal/20 border-t-avo-teal animate-spin mx-auto mb-2" />
              <div className="text-xs text-text-bright font-display">Rerunning visibility scan…</div>
            </div>
          </div>
        )}
        <div className="flex items-stretch gap-3">
          {/* Left: prompt context */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              {topic && (
                <Pill tone="teal">
                  <Target className="w-3 h-3" /> {topic.name}
                </Pill>
              )}
              <Pill tone={prompt.status === 'active' ? 'success' : 'muted'}>{prompt.status}</Pill>
            </div>
            <h1 className="font-display font-bold text-xl text-text-bright leading-snug mb-2">
              "{prompt.text}"
            </h1>

            {/* LLM presence */}
            <div className="flex items-center gap-2 flex-wrap">
              {LLMS.map((l) => {
                const sc = Math.round(prompt.visibilityScore[l] * 100);
                return (
                  <div
                    key={l}
                    className={clsx(
                      'flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs',
                      prompt.mentions[l] > 0
                        ? l === 'ChatGPT'
                          ? 'bg-avo-teal/10 border-avo-teal/30 text-avo-teal'
                          : l === 'Gemini'
                            ? 'bg-gold-base/10 border-gold-base/30 text-gold-base'
                            : 'bg-vs-rose/10 border-vs-rose/30 text-vs-rose'
                        : 'bg-navy-deep border-navy-edge text-text-disabled'
                    )}
                  >
                    <LLMIcon llm={l} size={12} />
                    <span className="font-display font-semibold">{l}</span>
                    <span className="font-mono opacity-80">{sc}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: circular gauge + score */}
          <div className="shrink-0 flex flex-col items-center justify-center pl-6 border-l border-navy-edge/50" style={{ minWidth: 180 }}>
            <div className="mono-label mb-2">Visibility Score</div>
            <VisibilityGauge value={avgScore} />
            <div className="flex items-center gap-1 mt-2 text-xs">
              {scoreDelta > 0 ? (
                <Pill tone="success"><TrendingUp className="w-3 h-3" /> +{scoreDelta}%</Pill>
              ) : scoreDelta < 0 ? (
                <Pill tone="rose"><TrendingDown className="w-3 h-3" /> {scoreDelta}%</Pill>
              ) : (
                <Pill tone="muted"><Minus className="w-3 h-3" /> 0%</Pill>
              )}
              <span className="text-text-muted">vs last week</span>
            </div>
            <div className="text-[10px] text-text-muted mt-1.5">across {LLMS.length} LLMs</div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-edge/50">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowConv(true)} className="btn btn-primary !text-xs">
              <MessageSquare className="w-3.5 h-3.5" /> See conversation
            </button>
            <Link to="/dashboard/content" className="btn btn-secondary !text-xs">
              <Sparkles className="w-3.5 h-3.5" /> Create content from this prompt
            </Link>
            <button
              onClick={() => setRerunning(true)}
              className="btn btn-secondary !text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Rerun
            </button>
          </div>

          <Popover
            align="right"
            trigger={
              <span className="p-1.5 rounded text-text-muted hover:text-text-bright hover:bg-navy-elevated/50 transition-colors cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            }
          >
            {(close) => (
              <div className="py-1">
                <button
                  onClick={() => { toggle(prompt.id); close(); }}
                  className={clsx(
                    'w-full flex items-center gap-2 px-3 py-1.5 text-xs',
                    prompt.status === 'active'
                      ? 'text-text-secondary hover:bg-navy-elevated/50 hover:text-vs-rose'
                      : 'text-text-secondary hover:bg-navy-elevated/50 hover:text-status-success'
                  )}
                >
                  {prompt.status === 'active'
                    ? <><Archive className="w-3.5 h-3.5" /> Archive prompt</>
                    : <><ArchiveRestore className="w-3.5 h-3.5" /> Restore prompt</>}
                </button>
              </div>
            )}
          </Popover>
        </div>
      </Card>

      {/* All sections inline — no more tabs */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="space-y-4">
          {/* Per-LLM breakdown */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="mono-label">Performance by LLM</div>
              <button onClick={() => console.log('Add LLM')} className="btn btn-ghost !text-xs">
                <Plus className="w-3.5 h-3.5" /> Add LLM
              </button>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {LLMS.map((l) => {
                const score = Math.round(prompt.visibilityScore[l] * 100);
                return (
                  <div key={l} className="rounded-lg border border-navy-edge bg-navy-deep/40 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <LLMIcon llm={l} size={14} className="text-text-bright" />
                        <span className="text-xs font-display font-semibold text-text-bright">{l}</span>
                      </div>
                      <Pill tone={prompt.sentiment[l] === 'positive' ? 'success' : prompt.sentiment[l] === 'negative' ? 'rose' : 'muted'}>
                        {prompt.sentiment[l]}
                      </Pill>
                    </div>
                    <div className="font-display font-bold text-2xl text-text-bright">
                      {score}<span className="text-sm text-text-muted">%</span>
                    </div>
                    <div className="text-[10px] text-text-muted mt-0.5">
                      {prompt.mentions[l]} mention{prompt.mentions[l] === 1 ? '' : 's'}
                    </div>
                    <div className="h-1 rounded-full bg-navy-deep overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${score}%`, background: LLM_COLOR[l] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Industry ranking — leaderboard style */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="mono-label">Industry leaderboard</div>
              <div className="text-[11px] text-text-muted">Where you rank against competitors</div>
            </div>
            <div className="divide-y divide-navy-edge/40">
              {visibleRanking.map((r, idx) => {
                const rank = page * PAGE_SIZE + idx + 1;
                const pct = Math.round(r.score * 100);
                return (
                  <div
                    key={r.name}
                    className={clsx(
                      'flex items-center gap-3 py-2 px-2 -mx-2 rounded-md',
                      r.you && 'bg-avo-teal/5 border border-avo-teal/30'
                    )}
                  >
                    {/* Rank */}
                    <div
                      className={clsx(
                        'w-7 h-7 rounded-md flex items-center justify-center font-display font-bold text-sm shrink-0',
                        rank === 1 ? 'bg-gold-base/15 text-gold-base border border-gold-base/30'
                          : rank === 2 ? 'bg-slate-200/10 text-slate-300 border border-slate-300/20'
                            : rank === 3 ? 'bg-amber-700/15 text-amber-600 border border-amber-700/30'
                              : 'bg-navy-deep text-text-muted border border-navy-edge'
                      )}
                    >
                      {rank}
                    </div>

                    {/* Brand initial avatar */}
                    <div
                      className={clsx(
                        'w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs shrink-0',
                        r.you ? 'bg-avo-teal text-navy-base' : 'bg-navy-elevated text-text-secondary border border-navy-edge'
                      )}
                    >
                      {r.name.charAt(0)}
                    </div>

                    {/* Name + badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={clsx('text-sm font-display font-semibold truncate', r.you ? 'text-avo-teal' : 'text-text-bright')}>
                          {r.name}
                        </span>
                        {r.you && <Pill tone="teal">you</Pill>}
                        {rank === 1 && <Pill tone="gold">#1</Pill>}
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="hidden sm:block w-32 shrink-0">
                      <div className="h-1.5 rounded-full bg-navy-deep overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            r.you ? 'bg-avo-teal' : rank === 1 ? 'bg-gold-base' : 'bg-navy-edge'
                          )}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>

                    {/* Percent */}
                    <div className="font-display font-bold text-sm text-text-bright w-12 text-right tabular-nums">
                      {pct}<span className="text-text-muted text-xs">%</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy-edge/40">
                <span className="text-[10px] text-text-muted font-mono">
                  Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, fullRanking.length)} of {fullRanking.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="btn btn-ghost !text-xs !px-2 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3 h-3" /> Prev
                  </button>
                  <span className="text-[10px] font-mono text-text-muted px-2">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="btn btn-ghost !text-xs !px-2 disabled:opacity-30"
                  >
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Sentiment */}
          <Card>
            <div className="mono-label mb-3">Sentiment</div>
            <div style={{ width: '100%', height: 140 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={sentimentCounts} dataKey="value" innerRadius={36} outerRadius={56} paddingAngle={2}>
                    {sentimentCounts.map((s) => (
                      <Cell key={s.name} fill={SENTIMENT_COLOR[s.name]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs">
              {sentimentCounts.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: SENTIMENT_COLOR[s.name] }} />
                  <span className="capitalize text-text-secondary">{s.name}</span>
                  <span className="font-mono text-text-bright">{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Sources inline */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="mono-label">Web sources cited</div>
              <div className="text-[11px] text-text-muted">{prompt.sources.length} source{prompt.sources.length === 1 ? '' : 's'}</div>
            </div>
            {prompt.sources.length === 0 ? (
              <p className="text-sm text-text-muted">No sources cited yet.</p>
            ) : (
              <div className="space-y-2">
                {prompt.sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-navy-deep/40 border border-navy-edge hover:border-avo-teal/40 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-md bg-navy-elevated flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-avo-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-bright group-hover:text-avo-teal truncate">{s.title}</div>
                      <div className="text-xs text-text-muted font-mono">{s.domain}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-avo-teal shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </Card>

          {/* Fanouts inline */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="mono-label">Prompt idea</div>
              <div className="text-[11px] text-text-muted">Ideas you can expand into</div>
            </div>
            <div className="space-y-2">
              {prompt.fanouts.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-navy-deep/40 border border-navy-edge">
                  <Sparkles className="w-4 h-4 text-pillar-manifest shrink-0" />
                  <span className="text-sm text-text-bright flex-1">{f}</span>
                  <Pill tone="muted">+ Track</Pill>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Conversation modal — kept */}
      {showConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-base/85 backdrop-blur-sm" onClick={() => setShowConv(false)}>
          <div className="glass-strong rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-navy-edge/60 flex items-center justify-between">
              <div>
                <div className="mono-label text-avo-teal">Conversation</div>
                <div className="text-sm text-text-bright font-display font-semibold mt-0.5">{prompt.text}</div>
              </div>
              <button onClick={() => setShowConv(false)} className="text-text-muted hover:text-text-bright">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {prompt.conversation.map((turn, i) => (
                <div key={i}>
                  {turn.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-avo-teal/15 border border-avo-teal/30 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-text-bright">
                        {turn.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-avo-teal to-pillar-manifest shrink-0 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-navy-base" />
                      </div>
                      <div className="max-w-[85%] bg-navy-elevated border border-navy-edge rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-text-bright leading-relaxed whitespace-pre-line">
                        {turn.content}
                      </div>
                    </div>
                  )}
                  {turn.role === 'assistant' && turn.citations && turn.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-10">
                      {turn.citations.map((c) => (
                        <a
                          key={c}
                          href={prompt.sources[c]?.url}
                          target="_blank"
                          rel="noreferrer"
                          className="pill bg-pillar-manifest/15 text-pillar-manifest border border-pillar-manifest/30 hover:bg-pillar-manifest/25"
                        >
                          <span className="font-mono">[{c + 1}]</span> {prompt.sources[c]?.domain}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-navy-edge/60 px-5 py-3 bg-navy-deep/40">
              <div className="mono-label mb-2">Summary</div>
              <p className="text-xs text-text-secondary">
                Mentioned: <span className="text-text-bright font-semibold">{prompt.ranking.find((r) => r.you)?.name}</span>
                {mentionedCompetitors.length > 0 && (
                  <>
                    {' '}and competitors{' '}
                    <span className="text-text-bright font-semibold">{mentionedCompetitors.join(', ')}</span>
                  </>
                )}
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
