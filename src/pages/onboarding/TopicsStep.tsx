import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Sparkles, Check } from 'lucide-react';
import clsx from 'clsx';

// Fixed Sribu topics — always show these 3, demo mode
const DEMO_TOPICS = [
  { id: 't1', name: 'Jasa Desain Logo', description: 'Logo design, brand identity, dan visual branding untuk bisnis.' },
  { id: 't2', name: 'Konten & Branding', description: 'Social media design, branding visual, dan materi marketing.' },
  { id: 't3', name: 'Website & Programming', description: 'Web development, UI/UX design, dan aplikasi digital.' },
];

export function TopicsStep() {
  const nav = useNavigate();
  const [regenKey, setRegenKey] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(
    new Set(DEMO_TOPICS.map((t) => t.name))
  );

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 4 · Focus areas</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">What should we monitor?</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          These are the themes your audience asks AI about. Each becomes a "focus" we'll generate prompts around. Pick 3-5 to start.
        </p>
      </div>

      <div className="card-elevated space-y-3">
        <div className="flex items-center justify-between">
          <div className="mono-label">AI-suggested focus areas</div>
          <button
            onClick={() => setRegenKey((k) => k + 1)}
            className="btn btn-ghost !text-xs !py-1 !px-2"
          >
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          {DEMO_TOPICS.map((s) => {
            const isSelected = selected.has(s.name);
            return (
              <button
                key={s.name + regenKey}
                onClick={() => toggle(s.name)}
                className={clsx(
                  'flex items-start gap-3 p-3 rounded-lg text-left transition-all border',
                  isSelected
                    ? 'bg-avo-teal/10 border-avo-teal/40'
                    : 'bg-navy-deep/40 border-navy-edge hover:border-avo-edge'
                )}
              >
                <div
                  className={clsx(
                    'w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center',
                    isSelected ? 'bg-avo-teal text-navy-base' : 'bg-navy-elevated border border-navy-edge'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-sm text-text-bright">{s.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">{s.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-text-muted pt-1 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-base" />
          {selected.size} focus area{selected.size === 1 ? '' : 's'} selected
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/company')} className="btn btn-ghost">← Back</button>
        <button
          onClick={() => nav('/onboarding/prompts')}
          className="btn btn-primary"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
