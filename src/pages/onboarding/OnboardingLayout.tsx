import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Check, ArrowLeft, Globe2, Sparkles, Building2, Target, MessageSquare, FileText, CreditCard, Zap } from 'lucide-react';
import clsx from 'clsx';

const STEPS = [
  { to: 'start', label: 'Start', icon: Globe2 },
  { to: 'analyzing', label: 'Analyze', icon: Sparkles, noNav: true },
  { to: 'company', label: 'Brand', icon: Building2 },
  { to: 'topics', label: 'Focus areas', icon: Target },
  { to: 'prompts', label: 'Prompts', icon: MessageSquare },
  { to: 'writing-sample', label: 'Voice', icon: FileText },
  { to: 'payment', label: 'Plan', icon: CreditCard },
];

export function OnboardingLayout() {
  const loc = useLocation();
  const currentIdx = STEPS.findIndex((s) => loc.pathname.endsWith('/' + s.to));
  const idx = currentIdx === -1 ? 0 : currentIdx;
  const progress = Math.round(((idx + 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen flex">
      {/* Left sidebar — vertical stepper (NEW) */}
      <aside className="w-72 shrink-0 glass-strong border-r border-navy-edge/60 flex flex-col sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-navy-edge/40">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-avo-teal font-mono">
            <ArrowLeft className="w-3 h-3" /> Exit setup
          </Link>
          <div className="font-display font-bold text-text-bright mt-4">Set up visibility</div>
          <div className="text-[11px] text-text-muted mt-1">
            Step {idx + 1} of {STEPS.length} · {progress}% complete
          </div>
          <div className="h-1 rounded-full bg-navy-deep overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-avo-teal to-pillar-manifest transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {STEPS.map((s, i) => {
            const done = i < idx;
            const active = i === idx;
            const Wrapper: any = s.noNav ? 'div' : NavLink;
            const wrapperProps: any = s.noNav ? {} : { to: `/onboarding/${s.to}` };
            const Icon = s.icon;
            return (
              <Wrapper
                key={s.to}
                {...wrapperProps}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-all',
                  active && 'bg-avo-teal/10 text-avo-teal border border-avo-teal/20',
                  done && !s.noNav && 'text-status-success hover:bg-status-success/5',
                  !active && !done && 'text-text-muted'
                )}
              >
                <div
                  className={clsx(
                    'w-7 h-7 rounded-md flex items-center justify-center shrink-0',
                    active
                      ? 'bg-avo-teal/20 text-avo-teal'
                      : done
                        ? 'bg-status-success/15 text-status-success'
                        : 'bg-navy-deep text-text-muted border border-navy-edge'
                  )}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="flex-1">{s.label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-avo-teal pulse-dot" />
                )}
              </Wrapper>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-navy-edge/40 text-[11px] text-text-muted">
          Your inputs are saved automatically. You can exit and resume anytime.
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="px-8 py-5 border-b border-navy-edge/40 bg-navy-deep/40 flex items-center justify-end">
          <div className="text-[11px] text-text-muted font-mono">
            <span className="text-avo-teal">{progress}%</span> complete
          </div>
        </header>
        <div className="flex-1 px-8 py-10">
          <div className="max-w-3xl mx-auto fade-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
