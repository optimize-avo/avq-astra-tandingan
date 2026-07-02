import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Pencil } from 'lucide-react';

export function CompanyStep() {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [overview, setOverview] = useState('');
  const [diffs, setDiffs] = useState<string[]>([]);
  const [comps, setComps] = useState<{ id: string; name: string; domain: string }[]>([]);
  const [newDiff, setNewDiff] = useState('');
  const [newComp, setNewComp] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 4 · Review</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">Tell us about your company</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          Fill in your company details. This shapes the prompts and competitors we'll use next.
        </p>
      </div>

      <div className="card-elevated space-y-5">
        <Field label="Company name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-text-bright focus:outline-none focus:border-avo-teal/50"
          />
        </Field>

        <Field label="Company overview">
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            rows={4}
            className="w-full bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-text-bright focus:outline-none focus:border-avo-teal/50 resize-none"
          />
        </Field>

        <Field label="What sets your company apart?">
          <div className="space-y-2">
            {diffs.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-avo-teal shrink-0" />
                <input
                  value={d}
                  onChange={(e) => {
                    const next = [...diffs];
                    next[i] = e.target.value;
                    setDiffs(next);
                  }}
                  className="flex-1 bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-avo-teal/50"
                />
                <button
                  onClick={() => setDiffs(diffs.filter((_, j) => j !== i))}
                  className="p-2 text-text-muted hover:text-status-error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-avo-teal shrink-0" />
              <input
                value={newDiff}
                onChange={(e) => setNewDiff(e.target.value)}
                placeholder="Add another differentiator"
                className="flex-1 bg-transparent border-b border-navy-edge focus:border-avo-teal py-1.5 text-sm text-text-bright placeholder:text-text-muted focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newDiff.trim()) {
                    setDiffs([...diffs, newDiff.trim()]);
                    setNewDiff('');
                  }
                }}
              />
            </div>
          </div>
        </Field>

        <Field label="Direct competitors">
          <div className="flex flex-wrap gap-2">
            {comps.map((c) => (
              <span
                key={c.id}
                className="pill bg-pillar-manifest/15 text-pillar-manifest border border-pillar-manifest/30 flex items-center gap-1.5"
              >
                {c.name}
                <button
                  onClick={() => setComps(comps.filter((x) => x.id !== c.id))}
                  className="hover:text-text-bright"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-avo-teal" />
              <input
                value={newComp}
                onChange={(e) => setNewComp(e.target.value)}
                placeholder="Add competitor"
                className="w-32 bg-transparent border-b border-navy-edge focus:border-avo-teal py-1 text-xs text-text-bright placeholder:text-text-muted focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newComp.trim()) {
                    setComps([
                      ...comps,
                      {
                        id: 'c' + Date.now(),
                        name: newComp.trim(),
                        domain: newComp.trim().toLowerCase().replace(/\s+/g, '') + '.com',
                      },
                    ]);
                    setNewComp('');
                  }
                }}
              />
            </div>
          </div>
        </Field>

        <div className="flex items-center gap-2 text-xs text-text-muted pt-1">
          <Pencil className="w-3 h-3" />
          Click any field to edit.
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/domain')} className="btn btn-ghost">← Back</button>
        <button onClick={() => nav('/onboarding/topics')} className="btn btn-primary">
          Continue →
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mono-label mb-2 block">{label}</label>
      {children}
    </div>
  );
}
