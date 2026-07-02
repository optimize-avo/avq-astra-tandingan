import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/app';
import { Globe2 } from 'lucide-react';
import clsx from 'clsx';

const LANGS = [
  { code: 'English', label: 'English', sub: 'United States, UK, AU, IN' },
  { code: 'Indonesian', label: 'Bahasa Indonesia', sub: 'Indonesia' },
  { code: 'Japanese', label: '日本語', sub: 'Japan' },
  { code: 'Korean', label: '한국어', sub: 'Korea' },
] as const;

export function LanguageStep() {
  const nav = useNavigate();
  const company = useApp((s) => s.company);
  const update = useApp((s) => s.updateCompany);

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 1 · Language</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">What language should we track?</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          We'll monitor AI answers in this language and generate prompts your audience actually asks.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => update({ language: l.code as any })}
            className={clsx(
              'card !p-4 text-left transition-all',
              company.language === l.code
                ? 'border-avo-teal/50 bg-avo-teal/5 shadow-[0_0_0_1px_rgba(0,194,184,0.3)]'
                : 'hover:border-navy-edge hover:bg-navy-elevated/30'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={clsx(
                'w-9 h-9 rounded-lg flex items-center justify-center',
                company.language === l.code ? 'bg-avo-teal/20 text-avo-teal' : 'bg-navy-elevated text-text-secondary'
              )}>
                <Globe2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-display font-semibold text-text-bright">{l.label}</div>
                <div className="text-xs text-text-muted">{l.sub}</div>
              </div>
              {company.language === l.code && (
                <div className="w-5 h-5 rounded-full bg-avo-teal flex items-center justify-center">
                  <span className="text-navy-base text-xs font-bold">✓</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={() => nav('/onboarding/domain')} className="btn btn-primary">
          Continue →
        </button>
      </div>
    </div>
  );
}
