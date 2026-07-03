import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, useCurrentPrompts } from '@/store/app';
import { LLMS, LLM } from '@/data/dummy';
import { LLMIcon } from '@/components/llm-icons';
import { ArrowRight, Sparkles, Check, Zap, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

const LLM_DESC: Record<LLM, string> = {
  ChatGPT: 'OpenAI flagship',
  Gemini: 'Google AI',
  Perplexity: 'Answer engine',
  Deepseek: 'Chinese AI lab',
  Claude: 'Anthropic assistant',
};

export function TrackStep() {
  const nav = useNavigate();
  const complete = useApp((s) => s.completeOnboarding);
  const loadSeed = useApp((s) => s.loadSeed);
  const prompts = useCurrentPrompts();

  const [selected, setSelected] = useState<Set<LLM>>(new Set(LLMS));
  const [running, setRunning] = useState(false);
  const [stages, setStages] = useState<number>(0);

  const toggle = (l: LLM) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l); else next.add(l);
      return next;
    });
  };

  const credits = prompts.length * selected.size * 2;

  useEffect(() => {
    if (!running) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    [800, 1600, 2400, 3200].forEach((delay, i) => {
      timers.push(setTimeout(() => setStages(i + 1), delay));
    });
    timers.push(setTimeout(() => { complete(); nav('/dashboard/visibility'); }, 3500));
    return () => timers.forEach(clearTimeout);
  }, [running]);

  if (running) {
    const STAGE_LABELS = ['Querying ChatGPT', 'Querying Gemini', 'Querying Perplexity', 'Compiling scores'];
    return (
      <div className="space-y-6">
        <div>
          <div className="mono-label text-avo-teal mb-1.5">Running visibility scan</div>
          <h2 className="font-display font-bold text-2xl text-text-bright">Setting up your visibility</h2>
          <p className="text-sm text-text-secondary mt-2">This usually takes under a minute.</p>
        </div>
        <div className="card-elevated flex flex-col items-center py-10">
          <div className="w-12 h-12 rounded-full border-4 border-avo-teal/20 border-t-avo-teal animate-spin mb-6" />
          <div className="space-y-2 w-full max-w-xs">
            {STAGE_LABELS.map((label, i) => {
              const done = stages > i;
              const active = stages === i;
              return (
                <div key={label} className={clsx('flex items-center gap-2 text-sm transition-colors', done ? 'text-status-success' : active ? 'text-text-bright' : 'text-text-muted')}>
                  {done ? <Check className="w-4 h-4" /> : active ? <span className="w-4 h-4 rounded-full border-2 border-current pulse-dot inline-block" /> : <span className="w-4 h-4 rounded-full border border-navy-edge inline-block" />}
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 9 · Track</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">Choose LLMs to track</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          Pick the AI models you want to monitor. We'll check your prompts against each one.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {LLMS.map((l) => {
          const isSelected = selected.has(l);
          return (
            <button
              key={l}
              onClick={() => toggle(l)}
              className={clsx(
                'card !p-4 text-left transition-all relative',
                isSelected && '!border-avo-teal/50 ring-1 ring-avo-teal/30'
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-avo-teal text-navy-base flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <LLMIcon llm={l} size={28} className="text-text-bright mb-3" />
              <div className="font-display font-semibold text-text-bright">{l}</div>
              <div className="text-[11px] text-text-muted mt-1">{LLM_DESC[l]}</div>
            </button>
          );
        })}
      </div>

      <div className="card bg-navy-deep/60 border-navy-edge">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-gold-base" />
          <div className="font-display font-semibold text-text-bright">Credit estimate</div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div>
            <div className="text-[10px] mono-label text-text-muted">Prompts to run</div>
            <div className="font-display font-bold text-2xl text-text-bright tabular-nums">{prompts.length}</div>
          </div>
          <div>
            <div className="text-[10px] mono-label text-text-muted">LLMs</div>
            <div className="font-display font-bold text-2xl text-text-bright tabular-nums">{selected.size}<span className="text-sm text-text-muted"> / {LLMS.length}</span></div>
          </div>
          <div>
            <div className="text-[10px] mono-label text-text-muted">Estimated credits</div>
            <div className="font-display font-bold text-2xl text-avo-teal tabular-nums">{credits}</div>
          </div>
        </div>
        <p className="text-xs text-text-muted">
          This estimate covers running your {prompts.length} prompt{prompts.length === 1 ? '' : 's'} across {selected.size} LLM{selected.size === 1 ? '' : 's'}.
          Each prompt runs once per LLM to capture a fresh answer.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/payment')} className="btn btn-ghost">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => { if (selected.size === 0) return; setRunning(true); }}
          disabled={selected.size === 0}
          className="btn btn-primary"
        >
          <Sparkles className="w-4 h-4" /> Run Visibility <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
