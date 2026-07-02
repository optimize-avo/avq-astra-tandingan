import { Link, useParams } from 'react-router-dom';
import { useApp } from '@/store/app';
import { PageHeader, Card, Pill } from '@/components/ui';
import { LLMS, LLM } from '@/data/dummy';
import { ArrowLeft, MessageSquare, FileText, Globe, Archive, ArchiveRestore, Sparkles, ExternalLink, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import clsx from 'clsx';
import { useState } from 'react';

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

export function VisibilityDetailPage() {
  const { id } = useParams();
  const prompts = useApp((s) => s.prompts);
  const toggle = useApp((s) => s.togglePromptStatus);
  const prompt = prompts.find((p) => p.id === id);
  const [showConv, setShowConv] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'fanouts'>('overview');

  if (!prompt) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-text-secondary">Prompt not found.</p>
        <Link to="/dashboard/visibility" className="btn btn-secondary mt-4 inline-flex">← Back to list</Link>
      </div>
    );
  }

  const avgSov = Math.round(((prompt.sov.ChatGPT + prompt.sov.Gemini + prompt.sov.Perplexity) / 3) * 100);
  const mentionedCompetitors = prompt.ranking
    .filter((r) => !r.you && r.sov > 0)
    .map((r) => r.name);
  const sentimentCounts = ['positive', 'neutral', 'negative'].map((s) => ({
    name: s,
    value: LLMS.filter((l) => prompt.sentiment[l] === s).length,
  }));

  return (
    <div className="px-8 py-8 max-w-6xl mx-auto">
      <Link to="/dashboard/visibility" className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-avo-teal mb-4 font-mono uppercase tracking-wider">
        <ArrowLeft className="w-3 h-3" /> All prompts
      </Link>

      {/* Hero */}
      <Card elevated className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mono-label text-avo-teal mb-1.5">Tracked prompt</div>
            <h1 className="font-display font-bold text-xl text-text-bright leading-snug">
              "{prompt.text}"
            </h1>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {LLMS.map((l) => (
                <Pill key={l} tone={l === 'ChatGPT' ? 'teal' : l === 'Gemini' ? 'gold' : 'rose'}>
                  {l} · {prompt.mentions[l]} mention{prompt.mentions[l] === 1 ? '' : 's'}
                </Pill>
              ))}
              <Pill tone={prompt.status === 'active' ? 'success' : 'muted'}>
                {prompt.status === 'active' ? 'Active' : 'Archived'}
              </Pill>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="mono-label">Share of voice</div>
            <div className="font-display font-bold text-5xl text-avo-teal leading-none mt-1">
              {avgSov}<span className="text-2xl text-text-muted">%</span>
            </div>
            <div className="text-[11px] text-text-muted mt-1">across {LLMS.length} LLMs</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-5 pt-5 border-t border-navy-edge/50">
          <button onClick={() => setShowConv(true)} className="btn btn-primary !text-xs">
            <MessageSquare className="w-3.5 h-3.5" /> See conversation
          </button>
          <Link
            to="/dashboard/content"
            className="btn btn-secondary !text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" /> Create content from this prompt
          </Link>
          <button
            onClick={() => toggle(prompt.id)}
            className="btn btn-ghost !text-xs"
          >
            {prompt.status === 'active' ? <><Archive className="w-3.5 h-3.5" /> Archive</> : <><ArchiveRestore className="w-3.5 h-3.5" /> Restore</>}
          </button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-navy-edge/50">
        {(['overview', 'sources', 'fanouts'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={clsx(
              'px-4 py-2 text-sm font-display font-semibold border-b-2 -mb-px capitalize',
              activeTab === t
                ? 'text-avo-teal border-avo-teal'
                : 'text-text-secondary border-transparent hover:text-text-bright'
            )}
          >
            {t === 'overview' && 'Overview'}
            {t === 'sources' && `Sources (${prompt.sources.length})`}
            {t === 'fanouts' && `Fanouts (${prompt.fanouts.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
          <div className="space-y-4">
            {/* Per-LLM breakdown */}
            <Card>
              <div className="mono-label mb-3">Performance by LLM</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {LLMS.map((l) => {
                  const sov = Math.round(prompt.sov[l] * 100);
                  return (
                    <div key={l} className="rounded-lg border border-navy-edge bg-navy-deep/40 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: LLM_COLOR[l] }} />
                          <span className="text-xs font-display font-semibold text-text-bright">{l}</span>
                        </div>
                        <Pill tone={prompt.sentiment[l] === 'positive' ? 'success' : prompt.sentiment[l] === 'negative' ? 'rose' : 'muted'}>
                          {prompt.sentiment[l]}
                        </Pill>
                      </div>
                      <div className="font-display font-bold text-2xl text-text-bright">
                        {sov}<span className="text-sm text-text-muted">%</span>
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">
                        {prompt.mentions[l]} mention{prompt.mentions[l] === 1 ? '' : 's'}
                      </div>
                      <div className="h-1 rounded-full bg-navy-deep overflow-hidden mt-2">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${sov}%`, background: LLM_COLOR[l] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Industry ranking */}
            <Card>
              <div className="mono-label mb-3">Industry ranking</div>
              <p className="text-xs text-text-muted mb-3">
                How often each brand is mentioned when this prompt is asked.
              </p>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                  <BarChart data={prompt.ranking} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                    <XAxis type="number" domain={[0, 1]} hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#CBD5E1', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#0C182C', border: '1px solid #334766', borderRadius: 8, fontSize: 11 }}
                      formatter={(v: any) => `${Math.round((v as number) * 100)}%`}
                    />
                    <Bar dataKey="sov" radius={[0, 4, 4, 0]}>
                      {prompt.ranking.map((r, i) => (
                        <Cell key={i} fill={r.you ? '#00C2B8' : '#334766'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Mentioned competitors summary */}
            <Card>
              <div className="mono-label mb-2">Competitors mentioned in this prompt</div>
              {mentionedCompetitors.length === 0 ? (
                <p className="text-sm text-text-muted">No competitors were mentioned. Great position.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {mentionedCompetitors.map((c) => (
                    <Pill key={c} tone="rose">{c}</Pill>
                  ))}
                </div>
              )}
            </Card>
          </div>

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
                    <Tooltip
                      contentStyle={{ background: '#0C182C', border: '1px solid #334766', borderRadius: 8, fontSize: 11 }}
                    />
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

            {/* Prompt medium — regional */}
            <Card>
              <div className="mono-label mb-3">Prompt medium (by region)</div>
              <p className="text-xs text-text-muted mb-3">
                How prominently this prompt surfaces in each region's AI answers.
              </p>
              <div className="space-y-2">
                {prompt.medium.map((m) => (
                  <div key={m.region} className="flex items-center gap-3">
                    <Globe className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <div className="text-sm text-text-secondary flex-1">{m.region}</div>
                    <div className="flex-1 max-w-[120px]">
                      <div className="h-2 rounded-full bg-navy-deep overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            m.level === 'high' ? 'bg-score-high' : m.level === 'medium' ? 'bg-score-mid' : 'bg-vs-rose'
                          )}
                          style={{ width: m.level === 'high' ? '85%' : m.level === 'medium' ? '55%' : '25%' }}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] font-mono uppercase w-12 text-right text-text-muted">{m.level}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <Card>
          <div className="mono-label mb-3">Web sources AI cited</div>
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
      )}

      {activeTab === 'fanouts' && (
        <Card>
          <div className="mono-label mb-3">Prompt fanouts</div>
          <p className="text-xs text-text-muted mb-3">
            Variants LLMs tend to expand this prompt into. Track these for deeper coverage.
          </p>
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
      )}

      {/* Conversation modal */}
      {showConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-base/85 backdrop-blur-sm" onClick={() => setShowConv(false)}>
          <div
            className="glass-strong rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
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
