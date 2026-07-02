import { ReactNode, useState } from 'react';
import { X, Sparkles, Pencil } from 'lucide-react';
import clsx from 'clsx';

export interface SuggestionItem {
  id: string;
  label: string;
  description?: string;
}

export interface AddModalProps<T extends SuggestionItem> {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  topicId?: string;                // current topic context (for "Add Prompt")
  topicOptions?: { id: string; name: string }[]; // if topics must be chosen
  topicRequired?: boolean;
  // Manual mode
  manualLabel: string;
  manualPlaceholder: string;
  onSubmitManual: (text: string, topicId?: string, extra?: string) => void | string;
  // AI mode
  aiLabel: string;
  aiSeedLabel: string;
  aiSeedPlaceholder: string;
  // AI returns suggestions (id, label, description) — picked ones call onSubmitAI for each
  aiRunGenerator: (seed: string, topicId?: string) => Promise<T[]>;
  onSubmitAI: (items: T[], topicId?: string) => void;
  aiButtonLabel?: string;
}

export function AddModal<T extends SuggestionItem>({
  open,
  onClose,
  title,
  subtitle,
  topicOptions,
  topicRequired,
  manualLabel,
  manualPlaceholder,
  onSubmitManual,
  aiLabel,
  aiSeedLabel,
  aiSeedPlaceholder,
  aiRunGenerator,
  onSubmitAI,
  aiButtonLabel = 'Generate',
}: AddModalProps<T>) {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [text, setText] = useState('');
  const [seed, setSeed] = useState('');
  const [topicId, setTopicId] = useState<string>(topicOptions?.[0]?.id || '');
  const [running, setRunning] = useState(false);
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  if (!open) return null;

  const reset = () => {
    setMode('manual');
    setText('');
    setSeed('');
    setSuggestions([]);
    setPicked(new Set());
    setRunning(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const validTopic = topicRequired ? !!topicId : true;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-base/85 backdrop-blur-sm fade-up"
      onClick={close}
    >
      <div
        className="glass-strong rounded-2xl w-full max-w-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-navy-edge/50 flex items-start justify-between">
          <div>
            <div className="font-display font-bold text-lg text-text-bright">{title}</div>
            <div className="text-xs text-text-secondary mt-1">{subtitle}</div>
          </div>
          <button onClick={close} className="text-text-muted hover:text-text-bright p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Topic picker (if required/optional) */}
        {topicOptions && (
          <div className="px-6 pt-4">
            <label className="mono-label mb-2 block">Focus / topic</label>
            <div className="flex flex-wrap gap-1.5">
              {topicOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTopicId(t.id)}
                  className={clsx(
                    'pill border transition-all',
                    topicId === t.id
                      ? 'bg-avo-teal/15 text-avo-teal border-avo-teal/40'
                      : 'bg-navy-deep text-text-secondary border-navy-edge hover:border-avo-edge'
                  )}
                >
                  {t.name}
                </button>
              ))}
              {!topicRequired && (
                <button
                  onClick={() => setTopicId('')}
                  className={clsx(
                    'pill border',
                    !topicId
                      ? 'bg-pillar-manifest/15 text-pillar-manifest border-pillar-manifest/40'
                      : 'bg-navy-deep text-text-muted border-navy-edge'
                  )}
                >
                  (no focus)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-4 flex items-center gap-1 border-b border-navy-edge/40">
          {([
            { id: 'manual', label: manualLabel, icon: Pencil },
            { id: 'ai', label: aiLabel, icon: Sparkles },
          ] as const).map((t) => {
            const Icon = t.icon;
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 text-sm font-display font-semibold border-b-2 -mb-px transition-colors',
                  active
                    ? 'text-avo-teal border-avo-teal'
                    : 'text-text-secondary border-transparent hover:text-text-bright'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[260px]">
          {mode === 'manual' ? (
            <div>
              <label className="mono-label mb-2 block">{manualLabel}</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                placeholder={manualPlaceholder}
                className="w-full bg-navy-deep border border-navy-edge rounded-lg px-3 py-2.5 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-avo-teal/50 resize-none"
              />
              <p className="text-[11px] text-text-muted mt-2">
                Type the exact question your audience asks AI. We'll track every LLM that mentions you.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mono-label mb-2 block">{aiSeedLabel} <span className="text-text-muted normal-case font-mono">(optional)</span></label>
                <input
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder={aiSeedPlaceholder}
                  className="w-full bg-navy-deep border border-navy-edge rounded-lg px-3 py-2.5 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-avo-teal/50"
                />
                <p className="text-[11px] text-text-muted mt-2">
                  Give us 1-3 keywords to steer the AI. Empty = generate from the focus above.
                </p>
              </div>

              {!suggestions.length && !running && (
                <button
                  onClick={async () => {
                    if (!validTopic && topicRequired) return;
                    setRunning(true);
                    const result = await aiRunGenerator(seed, topicId || undefined);
                    setSuggestions(result);
                    setRunning(false);
                  }}
                  disabled={!validTopic}
                  className="btn btn-primary w-full"
                >
                  <Sparkles className="w-4 h-4" />
                  {aiButtonLabel}
                </button>
              )}

              {running && (
                <div className="card-elevated flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-avo-teal pulse-dot" />
                  <span className="text-sm text-text-secondary">Thinking up good prompts…</span>
                </div>
              )}

              {!!suggestions.length && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="mono-label">Pick the ones you want</div>
                    <button
                      onClick={() => setPicked(new Set(suggestions.map((s) => s.id)))}
                      className="text-[11px] text-avo-teal hover:underline font-mono"
                    >
                      Select all
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {suggestions.map((s) => {
                      const isPicked = picked.has(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setPicked((prev) => {
                              const next = new Set(prev);
                              if (next.has(s.id)) next.delete(s.id);
                              else next.add(s.id);
                              return next;
                            });
                          }}
                          className={clsx(
                            'w-full flex items-start gap-3 p-3 rounded-lg text-left border transition-all',
                            isPicked
                              ? 'bg-avo-teal/10 border-avo-teal/40'
                              : 'bg-navy-deep/40 border-navy-edge hover:border-avo-edge'
                          )}
                        >
                          <div
                            className={clsx(
                              'w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center',
                              isPicked
                                ? 'bg-avo-teal text-navy-base'
                                : 'bg-navy-elevated border border-navy-edge'
                            )}
                          >
                            {isPicked && (
                              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 6l3 3 5-6" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-text-bright">{s.label}</div>
                            {s.description && (
                              <div className="text-xs text-text-muted mt-0.5">{s.description}</div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-edge/50 flex items-center justify-end gap-2 bg-navy-deep/30">
          <button onClick={close} className="btn btn-ghost">
            Cancel
          </button>
          {mode === 'manual' ? (
            <button
              onClick={() => {
                if (!text.trim()) return;
                onSubmitManual(text.trim(), topicId || undefined);
                close();
              }}
              disabled={!text.trim() || (topicRequired && !topicId)}
              className="btn btn-primary"
            >
              Add
            </button>
          ) : (
            <button
              onClick={() => {
                const items = suggestions.filter((s) => picked.has(s.id));
                if (!items.length) return;
                onSubmitAI(items, topicId || undefined);
                close();
              }}
              disabled={picked.size === 0}
              className="btn btn-primary"
            >
              Add {picked.size} prompt{picked.size === 1 ? '' : 's'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
