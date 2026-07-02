import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/app';
import { Plus, RefreshCw, Sparkles, Check } from 'lucide-react';
import clsx from 'clsx';

const SUGGESTIONS = [
  { name: 'Cloud Cost Optimization', description: 'Reducing cloud spend through automated rightsizing and scheduling.' },
  { name: 'Serverless Deployment', description: 'Deploying and scaling distributed apps without managing infrastructure.' },
  { name: 'Observability & Monitoring', description: 'Tracing, metrics, and logs for modern cloud-native apps.' },
  { name: 'Database Performance', description: 'Tuning query latency and throughput in production.' },
  { name: 'CI/CD Pipelines', description: 'Automated build, test, and deploy workflows.' },
  { name: 'Container Orchestration', description: 'Running workloads reliably across clusters.' },
];

export function TopicsStep() {
  const nav = useNavigate();
  const company = useApp((s) => s.company);
  const add = useApp((s) => s.addTopic);
  const remove = useApp((s) => s.removeTopic);
  const [newName, setNewName] = useState('');
  const [regenKey, setRegenKey] = useState(0);

  const selected = new Set(company.topics.map((t) => t.name));

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 5 · Topics</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">Pick topics to monitor</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          These are the themes people ask AI about. We'll generate prompts for each selected topic.
        </p>
      </div>

      <div className="card-elevated space-y-3">
        <div className="flex items-center justify-between">
          <div className="mono-label">AI-generated topics</div>
          <button
            onClick={() => setRegenKey((k) => k + 1)}
            className="btn btn-ghost !text-xs !py-1 !px-2"
          >
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {SUGGESTIONS.map((s) => {
            const isSelected = selected.has(s.name);
            return (
              <button
                key={s.name + regenKey}
                onClick={() => {
                  if (isSelected) {
                    const t = company.topics.find((x) => x.name === s.name);
                    if (t) remove(t.id);
                  } else {
                    add(s.name, s.description);
                  }
                }}
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

        <div className="flex items-center gap-2 pt-2 border-t border-navy-edge/40">
          <Sparkles className="w-3.5 h-3.5 text-gold-base" />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add custom topic (e.g. API rate limiting)"
            className="flex-1 bg-transparent border-b border-navy-edge focus:border-avo-teal py-1.5 text-sm text-text-bright placeholder:text-text-muted focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newName.trim()) {
                add(newName.trim(), 'Custom topic');
                setNewName('');
              }
            }}
          />
          <button
            onClick={() => {
              if (newName.trim()) {
                add(newName.trim(), 'Custom topic');
                setNewName('');
              }
            }}
            className="btn btn-secondary !text-xs !py-1.5"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        <div className="text-xs text-text-muted pt-1">
          {company.topics.length} topic{company.topics.length === 1 ? '' : 's'} selected
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/company')} className="btn btn-ghost">← Back</button>
        <button
          onClick={() => nav('/onboarding/prompts')}
          disabled={company.topics.length === 0}
          className="btn btn-primary"
        >
          Generate prompts →
        </button>
      </div>
    </div>
  );
}
