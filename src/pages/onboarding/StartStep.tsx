import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/app';
import { Globe2, Globe, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const LANGS = [
  { code: 'English', sub: 'United States, UK, AU, IN' },
  { code: 'Indonesian', sub: 'Indonesia' },
  { code: 'Japanese', sub: 'Japan' },
  { code: 'Korean', sub: 'Korea' },
] as const;

export function StartStep() {
  const nav = useNavigate();
  const company = useApp((s) => s.company);
  const update = useApp((s) => s.updateCompany);
  const [domain, setDomain] = useState(company.domain);
  const [language, setLanguage] = useState(company.language);

  return (
    <div className="space-y-7">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 1 of 7</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">
          Where do you want to be tracked?
        </h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          Pick a language and your website. We'll read your homepage and build a picture of your brand — usually under a minute.
        </p>
      </div>

      {/* Language */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe2 className="w-4 h-4 text-avo-teal" />
          <div className="font-display font-semibold text-text-bright">Language</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code as any)}
              className={clsx(
                'card !p-3 text-left transition-all flex items-center gap-3',
                language === l.code
                  ? 'border-avo-teal/50 bg-avo-teal/5 shadow-[0_0_0_1px_rgba(0,194,184,0.3)]'
                  : 'hover:border-navy-edge hover:bg-navy-elevated/30'
              )}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-md flex items-center justify-center shrink-0',
                  language === l.code ? 'bg-avo-teal/20 text-avo-teal' : 'bg-navy-elevated text-text-secondary'
                )}
              >
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-display font-semibold text-sm text-text-bright">{l.code}</div>
                <div className="text-[11px] text-text-muted">{l.sub}</div>
              </div>
              {language === l.code && (
                <div className="w-5 h-5 rounded-full bg-avo-teal flex items-center justify-center">
                  <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M2 6l3 3 5-6" className="text-navy-base" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Website */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe2 className="w-4 h-4 text-pillar-manifest" />
          <div className="font-display font-semibold text-text-bright">Website</div>
        </div>
        <div className="card-elevated">
          <label className="mono-label mb-2 block">Website URL</label>
          <div className="flex items-center gap-2 bg-navy-deep border border-navy-edge rounded-lg px-3 py-2.5 focus-within:border-avo-teal/50">
            <Globe className="w-4 h-4 text-text-muted shrink-0" />
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourcompany.com"
              className="flex-1 bg-transparent text-text-bright placeholder:text-text-muted focus:outline-none text-sm"
            />
          </div>
          <p className="text-xs text-text-muted mt-2">
            We'll scrape your homepage, detect tone, and identify your differentiators. You can edit everything in the next step.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            const clean = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
            update({ language, domain: clean });
            nav('/onboarding/analyzing');
          }}
          disabled={!domain.trim()}
          className="btn btn-primary"
        >
          Analyze <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
