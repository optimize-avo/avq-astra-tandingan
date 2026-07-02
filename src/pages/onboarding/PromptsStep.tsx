import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/app';
import { RefreshCw, Sparkles, Check } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const PROMPT_SUGGESTIONS: Record<string, string[]> = {
  t1: [
    'How can I reduce my AWS bill without refactoring my entire application?',
    'What are the best tools for monitoring Kubernetes cost across multiple clusters?',
    'Which cloud cost optimization platforms support automatic rightsizing?',
  ],
  t2: [
    'What are the best platforms for deploying a Next.js app with automatic scaling?',
    'Which PaaS supports instant rollback for stateful applications?',
    'How do I deploy a microservices app with zero downtime?',
  ],
  t3: [
    'What is the easiest way to add distributed tracing to a microservices app?',
    'How do I add observability to a serverless app without changing my code?',
    'Best OpenTelemetry backends for production tracing',
  ],
};

export function PromptsStep() {
  const nav = useNavigate();
  const company = useApp((s) => s.company);
  const addPrompt = useApp((s) => s.addPrompt);
  const [regenKey, setRegenKey] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const seededPicks = Object.values(PROMPT_SUGGESTIONS).flat();
  // pre-select first suggestion per topic for a clean default
  const initialPicks = company.topics
    .map((t) => PROMPT_SUGGESTIONS[t.id]?.[0])
    .filter(Boolean) as string[];

  const isPicked = (text: string) =>
    picked.has(text) || (!picked.size && initialPicks.includes(text));

  const toggle = (topicId: string, text: string) => {
    const key = topicId + '::' + text;
    setPicked((prev) => {
      const next = new Set(prev.size ? prev : initialPicks.map((t) => topicIdForText(t) + '::' + t));
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 6 · Prompts</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">Pick prompts to track</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          AI suggested these questions your audience asks. Pick the ones that matter — you can edit later.
        </p>
      </div>

      <div className="space-y-4">
        {company.topics.map((topic) => (
          <div key={topic.id + regenKey} className="card-elevated">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-display font-semibold text-text-bright">{topic.name}</div>
                <div className="text-xs text-text-muted">{topic.description}</div>
              </div>
              <span className="pill bg-pillar-manifest/15 text-pillar-manifest border border-pillar-manifest/30">
                {PROMPT_SUGGESTIONS[topic.id]?.length || 0} suggestions
              </span>
            </div>
            <div className="space-y-2">
              {(PROMPT_SUGGESTIONS[topic.id] || []).map((text) => {
                const pickedState = isPicked(text);
                return (
                  <button
                    key={text}
                    onClick={() => toggle(topic.id, text)}
                    className={clsx(
                      'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all border',
                      pickedState
                        ? 'bg-avo-teal/8 border-avo-teal/30'
                        : 'bg-navy-deep/40 border-navy-edge hover:border-avo-edge'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center',
                        pickedState ? 'bg-avo-teal text-navy-base' : 'bg-navy-elevated border border-navy-edge'
                      )}
                    >
                      {pickedState && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-sm text-text-bright flex-1">{text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-avo-teal/8 to-pillar-manifest/5 border-avo-teal/20">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-avo-teal shrink-0" />
          <div className="flex-1 text-sm text-text-secondary">
            Want more? You can add custom prompts or regenerate new ones anytime from the Visibility page.
          </div>
          <button onClick={() => setRegenKey((k) => k + 1)} className="btn btn-secondary !text-xs">
            <RefreshCw className="w-3 h-3" /> Regenerate all
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/topics')} className="btn btn-ghost">← Back</button>
        <button
          onClick={() => {
            // Add the picked prompts (if no picks changed, use initial picks)
            const picks = picked.size
              ? picked
              : new Set(initialPicks.map((t) => topicIdForText(t) + '::' + t));

            const toAdd = Array.from(picks).map((k) => {
              const [tid, ...rest] = k.split('::');
              return { tid, text: rest.join('::') };
            });

            // Wipe existing prompts that came from seed if they share text with new picks (avoid duplicates)
            const existingTexts = new Set(toAdd.map((a) => a.text));
            toAdd.forEach(({ tid, text }) => {
              if (!prompts.some((p) => p.text === text)) {
                addPrompt(text, tid);
              }
            });
            nav('/onboarding/writing-sample');
          }}
          className="btn btn-primary"
        >
          Save {picked.size || initialPicks.length} prompts →
        </button>
      </div>
    </div>
  );
}

function topicIdForText(text: string): string {
  for (const [tid, arr] of Object.entries(PROMPT_SUGGESTIONS)) {
    if (arr.includes(text)) return tid;
  }
  return 't1';
}
