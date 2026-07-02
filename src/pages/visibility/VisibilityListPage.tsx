import { Link } from 'react-router-dom';
import { useApp } from '@/store/app';
import { PageHeader, Card, Pill } from '@/components/ui';
import { Plus, Sparkles, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { LLMS } from '@/data/dummy';
import { useState } from 'react';

export function VisibilityListPage() {
  const prompts = useApp((s) => s.prompts);
  const addPrompt = useApp((s) => s.addPrompt);
  const topics = useApp((s) => s.company.topics);
  const [showAdd, setShowAdd] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newTopic, setNewTopic] = useState(topics[0]?.id || '');

  const active = prompts.filter((p) => p.status === 'active');
  const archived = prompts.filter((p) => p.status === 'archived');

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Visibility"
        title="Prompt tracking"
        description="Each row is a real question your audience asks AI. Click any row to see the full conversation, sources, and how you compare to competitors."
        actions={
          <>
            <button onClick={() => setShowAdd(true)} className="btn btn-secondary">
              <Plus className="w-4 h-4" /> Add prompt
            </button>
            <button className="btn btn-primary">
              <Sparkles className="w-4 h-4" /> Generate with AI
            </button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Active prompts', value: active.length, icon: Eye, color: 'text-avo-teal' },
          { label: 'Total mentions', value: prompts.reduce((s, p) => s + p.mentions.ChatGPT + p.mentions.Gemini + p.mentions.Perplexity, 0), icon: Sparkles, color: 'text-pillar-manifest' },
          { label: 'Avg SoV', value: Math.round((prompts.reduce((s, p) => s + (p.sov.ChatGPT + p.sov.Gemini + p.sov.Perplexity) / 3, 0) / Math.max(1, prompts.length)) * 100) + '%', icon: BarChart3, color: 'text-gold-base' },
          { label: 'Archived', value: archived.length, icon: EyeOff, color: 'text-text-muted' },
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

      <Card elevated className="!p-0 overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_140px_120px_140px_140px] gap-4 px-5 py-3 border-b border-navy-edge/60 bg-navy-deep/40 mono-label">
          <div>Prompt</div>
          <div>Model</div>
          <div>Created</div>
          <div>Status</div>
          <div>Mentions</div>
          <div className="text-right">Share of voice</div>
        </div>
        {prompts.length === 0 && (
          <div className="px-5 py-12 text-center text-text-muted text-sm">
            No prompts yet. Add one above to get started.
          </div>
        )}
        {prompts.map((p) => {
          const totalMentions = p.mentions.ChatGPT + p.mentions.Gemini + p.mentions.Perplexity;
          const avgSov = Math.round(((p.sov.ChatGPT + p.sov.Gemini + p.sov.Perplexity) / 3) * 100);
          return (
            <Link
              key={p.id}
              to={`/dashboard/visibility/${p.id}`}
              className="grid grid-cols-[1fr_140px_140px_120px_140px_140px] gap-4 px-5 py-3.5 border-b border-navy-edge/30 hover:bg-navy-elevated/30 transition-colors items-center group"
            >
              <div className="min-w-0">
                <div className="text-sm text-text-bright truncate group-hover:text-avo-teal">{p.text}</div>
                <div className="flex items-center gap-2 mt-1">
                  {topics.find((t) => t.id === p.topicId) && (
                    <Pill tone="muted">{topics.find((t) => t.id === p.topicId)!.name}</Pill>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {LLMS.map((l) => (
                  <Pill
                    key={l}
                    tone={l === 'ChatGPT' ? 'teal' : l === 'Gemini' ? 'gold' : 'rose'}
                  >
                    {l[0]}
                  </Pill>
                ))}
              </div>
              <div className="text-xs text-text-secondary font-mono">
                {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div>
                <Pill tone={p.status === 'active' ? 'success' : 'muted'}>{p.status}</Pill>
              </div>
              <div className="text-sm font-display font-semibold text-text-bright">{totalMentions}</div>
              <div className="text-right">
                <div className="font-display font-bold text-avo-teal">{avgSov}%</div>
                <div className="h-1 rounded-full bg-navy-deep overflow-hidden mt-1">
                  <div className="h-full bg-gradient-to-r from-avo-teal to-pillar-manifest" style={{ width: `${avgSov}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
      </Card>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-base/80 backdrop-blur-sm">
          <Card elevated className="w-full max-w-md">
            <div className="font-display font-bold text-lg text-text-bright mb-1">Add a prompt manually</div>
            <p className="text-xs text-text-muted mb-4">Type the exact question you want to track.</p>
            <label className="mono-label mb-2 block">Prompt</label>
            <textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. What is the best platform for managing remote engineering teams?"
              className="w-full bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-avo-teal/50 resize-none"
            />
            <label className="mono-label mt-3 mb-2 block">Topic</label>
            <select
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="w-full bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-avo-teal/50"
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button onClick={() => setShowAdd(false)} className="btn btn-ghost">Cancel</button>
              <button
                onClick={() => {
                  if (!newPrompt.trim()) return;
                  addPrompt(newPrompt.trim(), newTopic || topics[0]?.id || 't1');
                  setShowAdd(false);
                  setNewPrompt('');
                }}
                className="btn btn-primary"
              >
                Add prompt
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
