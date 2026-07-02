import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

const STEPS = [
  { to: 'language', label: 'Language' },
  { to: 'domain', label: 'Website' },
  { to: 'analyzing', label: 'Analyzing', noNav: true },
  { to: 'company', label: 'Profile' },
  { to: 'topics', label: 'Topics' },
  { to: 'prompts', label: 'Prompts' },
  { to: 'writing-sample', label: 'Writing sample' },
  { to: 'payment', label: 'Plan' },
];

export function OnboardingLayout() {
  const loc = useLocation();
  const currentIdx = STEPS.findIndex((s) => loc.pathname.endsWith('/' + s.to));
  const idx = currentIdx === -1 ? 0 : currentIdx;
  const progress = Math.round(((idx + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 sm:px-10 py-5 border-b border-navy-edge/40 glass-strong sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-8 h-8 rounded-md flex items-center justify-center text-text-secondary hover:text-text-bright hover:bg-navy-elevated/50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="font-display font-bold text-text-bright leading-tight">Set up your visibility</div>
              <div className="text-[11px] text-text-muted">Step {idx + 1} of {STEPS.length}</div>
            </div>
          </div>
          <div className="text-[11px] text-text-muted font-mono">{progress}% complete</div>
        </div>
      </header>

      {/* Stepper */}
      <div className="px-6 sm:px-10 py-5 border-b border-navy-edge/40 bg-navy-deep/40">
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto">
          {STEPS.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            const Wrapper: any = s.noNav ? 'div' : NavLink;
            const wrapperProps: any = s.noNav
              ? {}
              : { to: `/onboarding/${s.to}` };
            return (
              <Wrapper
                key={s.to}
                {...wrapperProps}
                className={clsx(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-display font-semibold uppercase tracking-wider whitespace-nowrap transition-all',
                  active && 'bg-avo-teal/15 text-avo-teal border border-avo-teal/30',
                  done && !s.noNav && 'text-status-success hover:bg-status-success/10',
                  !active && !done && 'text-text-muted'
                )}
              >
                {done ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">
                    {i + 1}
                  </span>
                )}
                {s.label}
              </Wrapper>
            );
          })}
        </div>
        <div className="max-w-6xl mx-auto mt-3 h-1 rounded-full bg-navy-deep overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-avo-teal to-pillar-manifest transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <main className="flex-1 px-6 sm:px-10 py-8">
        <div className="max-w-3xl mx-auto fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
