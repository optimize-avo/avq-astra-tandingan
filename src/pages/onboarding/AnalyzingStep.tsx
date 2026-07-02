import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';

const STAGES = [
  'Scraping homepage & sub-pages',
  'Detecting language & tone',
  'Analyzing product offering',
  'Generating differentiators',
  'Identifying direct competitors',
  'Building company profile',
];

export function AnalyzingStep() {
  const nav = useNavigate();
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= STAGES.length) {
      const t = setTimeout(() => nav('/onboarding/company'), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 700);
    return () => clearTimeout(t);
  }, [done, nav]);

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-avo-teal to-pillar-manifest items-center justify-center mb-4 shadow-[0_0_40px_-8px_rgba(0,194,184,0.6)]">
          <Sparkles className="w-6 h-6 text-navy-base" />
        </div>
        <h2 className="font-display font-bold text-2xl text-text-bright">
          Analyzing your business…
        </h2>
        <p className="text-sm text-text-secondary mt-2">
          We're reading your site and building a picture of where you fit. This usually takes under a minute.
        </p>
      </div>

      <div className="card-elevated space-y-2 max-w-xl mx-auto">
        {STAGES.map((s, i) => {
          const isDone = i < done;
          const isCurrent = i === done;
          return (
            <div key={s} className="flex items-center gap-3 px-3 py-2.5 rounded-md">
              <div
                className={
                  isDone
                    ? 'w-6 h-6 rounded-full bg-status-success/20 text-status-success flex items-center justify-center'
                    : isCurrent
                      ? 'w-6 h-6 rounded-full bg-avo-teal/15 flex items-center justify-center'
                      : 'w-6 h-6 rounded-full bg-navy-deep flex items-center justify-center'
                }
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-avo-teal pulse-dot" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                )}
              </div>
              <span
                className={
                  isDone
                    ? 'text-sm text-text-secondary line-through'
                    : isCurrent
                      ? 'text-sm text-text-bright font-display font-semibold'
                      : 'text-sm text-text-muted'
                }
              >
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
