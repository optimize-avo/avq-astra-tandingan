import { useNavigate } from 'react-router-dom';
import { RefreshCw, Sparkles, Check } from 'lucide-react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';

const PROMPT_SUGGESTIONS: Record<string, string[]> = {
  t1: [
    'Platform freelancer terbaik di Indonesia untuk desain logo?',
    'Berapa harga desain logo di Sribu?',
    'Bagaimana cara pesan freelancer di Sribu?',
  ],
  t2: [
    'Freelancer desain terbaik di Sribu untuk brand makanan?',
    'Desain konten Instagram untuk brand fashion Muslim di Indonesia?',
    'Template desain social media yang bisa diedit sendiri?',
  ],
  t3: [
    'Berapa biaya pembuatan website company profile di Sribu?',
    'UI design vs UX design — apa bedanya?',
    'Jasa pembuatan aplikasi mobile via freelancer Indonesia?',
  ],
};

// topicIndex (0-based) + promptIndex (0-based) → stable key e.g. "0-1"
const getKey = (ti: number, pi: number) => `${ti}-${pi}`;

// Fixed demo topics — always these 3, ignore user picks
const DEMO_TOPICS = [
  { id: 't1', name: 'Jasa Desain Logo', description: 'Logo design, brand identity, dan visual branding untuk bisnis.' },
  { id: 't2', name: 'Konten & Branding', description: 'Social media design, branding visual, dan materi marketing.' },
  { id: 't3', name: 'Website & Programming', description: 'Web development, UI/UX design, dan aplikasi digital.' },
];

export function PromptsStep() {
  const nav = useNavigate();
  const [regenKey, setRegenKey] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  // Pre-select ALL prompts across the 3 fixed demo topics
  const initialPicks = useMemo(() => {
    return DEMO_TOPICS.map((_, ti) =>
      (PROMPT_SUGGESTIONS[`t${ti + 1}`] || []).map((_, pi) => getKey(ti, pi))
    ).flat();
  }, []);

  const isPicked = (key: string) =>
    picked.has(key) || (!picked.size && initialPicks.includes(key));

  const toggle = (ti: number, pi: number) => {
    const key = getKey(ti, pi);
    setPicked((prev) => {
      const next = new Set(prev.size ? prev : initialPicks);
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
        {DEMO_TOPICS.map((topic, ti) => (
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
              {(PROMPT_SUGGESTIONS[topic.id] || []).map((text, pi) => {
                const key = getKey(ti, pi);
                const pickedState = isPicked(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggle(ti, pi)}
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
          onClick={() => nav('/onboarding/payment')}
          className="btn btn-primary"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
