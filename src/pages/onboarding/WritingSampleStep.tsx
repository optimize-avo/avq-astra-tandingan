import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/app';
import { FileText, SkipForward } from 'lucide-react';

export function WritingSampleStep() {
  const nav = useNavigate();
  const url = useApp((s) => s.company.writingSampleUrl) || '';
  const update = useApp((s) => s.updateCompany);
  const [val, setVal] = useState(url);

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 7 · Writing sample</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">Add a writing sample</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          Link a blog post or article in your brand's voice. We'll use it to generate content that sounds like you. You can skip this.
        </p>
      </div>

      <div className="card-elevated">
        <label className="mono-label mb-2 block">Blog URL (optional)</label>
        <div className="flex items-center gap-2 bg-navy-deep border border-navy-edge rounded-lg px-3 py-2.5 focus-within:border-avo-teal/50">
          <FileText className="w-4 h-4 text-text-muted shrink-0" />
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="https://yourcompany.com/blog/some-post"
            className="flex-1 bg-transparent text-text-bright placeholder:text-text-muted focus:outline-none text-sm"
          />
        </div>
        <p className="text-xs text-text-muted mt-2">
          We'll analyze tone, vocabulary, and structure to match your style in content generation.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/prompts')} className="btn btn-ghost">← Back</button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              update({ writingSampleUrl: undefined });
              nav('/onboarding/payment');
            }}
            className="btn btn-secondary"
          >
            <SkipForward className="w-3.5 h-3.5" /> Skip
          </button>
          <button
            onClick={() => {
              update({ writingSampleUrl: val.trim() || undefined });
              nav('/onboarding/payment');
            }}
            className="btn btn-primary"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
