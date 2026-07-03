import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/app';
import { RefreshCw, Sparkles, Check } from 'lucide-react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';

const PROMPT_SUGGESTIONS: Record<string, string[]> = {
  t1: [
    'Platform desain subscription terbaik untuk UMKM di Indonesia?',
    'Berapa biaya langganan desain per bulan yang terjangkau?',
    'Apa bedanya design subscription dengan hire desainer freelance?',
  ],
  t2: [
    'Harga desain logo profesional di Indonesia 2025?',
    'Bagaimana cara pesan desain logo di Sribu?',
    'Brand identity lengkap mencakup apa saja?',
  ],
  t3: [
    'Desain konten Instagram untuk bisnis kecil yang menarik perhatian?',
    'Ukuran desain poster untuk media sosial yang paling populer?',
    'Template desain social media yang bisa diedit sendiri?',
  ],
  t4: [
    'Berapa biaya desain website profesional di Indonesia?',
    'UI design vs UX design — apa bedanya?',
  ],
  t5: [
    'Harga desain packaging produk cosmetic di Indonesia?',
    'Desain name card perusahaan apa saja yang perlu ada?',
  ],
  t6: [
    'Illustration style mana yang cocok untuk brand anak-anak?',
    'Mascot character design untuk brand makanan — ide kreatif?',
  ],
};

// topicIndex (0-based) + promptIndex (0-based) → stable key e.g. "0-1"
const getKey = (ti: number, pi: number) => `${ti}-${pi}`;

export function PromptsStep() {
  const nav = useNavigate();
  const company = useApp((s) => s.company);
  const addPrompt = useApp((s) => s.addPrompt);
  const [regenKey, setRegenKey] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  // Pre-select ALL prompts across all topics (not just first per topic)
  const initialPicks = useMemo(() => {
    return company.topics.map((_, ti) =>
      (PROMPT_SUGGESTIONS[`t${ti + 1}`] || []).map((_, pi) => getKey(ti, pi))
    ).flat();
  }, [company.topics]);

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

      {company.topics.length === 0 ? (
        <div className="card-elevated text-center py-8">
          <p className="text-text-secondary mb-4">No focus areas selected.</p>
          <button onClick={() => nav('/onboarding/topics')} className="btn btn-secondary">
            Go back to select focus areas
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {company.topics.map((topic, ti) => (
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
        </>
      )}

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/topics')} className="btn btn-ghost">← Back</button>
        <button
          onClick={() => {
            // Add the picked prompts (if no picks changed, use initial picks)
            const picks = picked.size ? picked : new Set(initialPicks);
            picks.forEach((key) => {
              const [ti, pi] = key.split('-').map(Number);
              const topicId = `t${ti + 1}`;
              const text = PROMPT_SUGGESTIONS[topicId]?.[pi];
              if (text) addPrompt(text, topicId);
            });
            nav('/onboarding/payment');
          }}
          className="btn btn-primary"
        >
          Save {(picked.size || initialPicks.length)} prompts →
        </button>
      </div>
    </div>
  );
}
