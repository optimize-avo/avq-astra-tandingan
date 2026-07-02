import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/app';
import { Globe2, ArrowRight } from 'lucide-react';

export function DomainStep() {
  const nav = useNavigate();
  const domain = useApp((s) => s.company.domain);
  const update = useApp((s) => s.updateCompany);
  const [val, setVal] = useState(domain);

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 2 · Website</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">What's your website?</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          We'll scrape your homepage, detect language, and analyze your product. This usually takes 10-30 seconds.
        </p>
      </div>

      <div className="card-elevated">
        <label className="mono-label mb-2 block">Website URL</label>
        <div className="flex items-center gap-2 bg-navy-deep border border-navy-edge rounded-lg px-3 py-2.5 focus-within:border-avo-teal/50">
          <Globe2 className="w-4 h-4 text-text-muted shrink-0" />
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="yourcompany.com"
            className="flex-1 bg-transparent text-text-bright placeholder:text-text-muted focus:outline-none text-sm"
          />
        </div>
        <p className="text-xs text-text-muted mt-2">
          You can add more domains later in Settings.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/language')} className="btn btn-ghost">
          ← Back
        </button>
        <button
          onClick={() => {
            const clean = val.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
            update({ domain: clean });
            nav('/onboarding/analyzing');
          }}
          disabled={!val.trim()}
          className="btn btn-primary"
        >
          Analyze website <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
