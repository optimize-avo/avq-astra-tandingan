import { ReactNode } from 'react';
import clsx from 'clsx';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        {eyebrow && <div className="mono-label text-avo-teal mb-1.5">{eyebrow}</div>}
        <h1 className="font-display font-bold text-2xl text-text-bright leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className,
  elevated,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div className={clsx(elevated ? 'card-elevated' : 'card', className)}>
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'teal' | 'gold' | 'rose' | 'success' | 'warning' | 'muted';
}) {
  const tones: Record<string, string> = {
    default: 'bg-navy-elevated text-text-secondary border border-navy-edge',
    teal: 'bg-avo-teal/15 text-avo-teal border border-avo-teal/30',
    gold: 'bg-gold-base/15 text-gold-base border border-gold-base/30',
    rose: 'bg-vs-rose/15 text-vs-rose border border-vs-rose/30',
    success: 'bg-status-success/15 text-status-success border border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border border-status-warning/30',
    muted: 'bg-navy-surface text-text-muted border border-navy-edge',
  };
  return <span className={clsx('pill', tones[tone])}>{children}</span>;
}

export function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    pct >= 70 ? 'bg-score-high' : pct >= 50 ? 'bg-score-mid' : 'bg-score-low';
  return (
    <div className="h-1.5 rounded-full bg-navy-deep overflow-hidden">
      <div
        className={clsx('h-full rounded-full transition-all', color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
