import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp, useCurrentPrompts } from '@/store/app';
import { PageHeader, Card } from '@/components/ui';
import { Popover } from '@/components/Popover';
import { Eye, ArrowRight, Building2, ChevronDown, Plus, X, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { CompanyProfile } from '@/data/dummy';

const TREND_30 = Array.from({ length: 30 }).map((_, i) => {
  const day = new Date();
  day.setDate(day.getDate() - (29 - i));
  return {
    date: day.toISOString().slice(5, 10),
    score: Math.round((0.18 + Math.sin(i / 2.5) * 0.10 + (i / 50)) * 100) / 100,
  };
});

export function DashboardHome() {
  const prompts = useCurrentPrompts() ?? [];
  const company = useApp((s) => s.company) ?? { name: '...', domain: '', competitors: [] };
  const brands = useApp((s) => s.brands) ?? [];
  const currentBrandId = useApp((s) => s.currentBrandId) ?? '';
  const switchBrand = useApp((s) => s.switchBrand);
  const addBrand = useApp((s) => s.addBrand);

  const [showTrend, setShowTrend] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);

  const safeScore = (p: typeof prompts[0], key: string) =>
    (p.visibilityScore as Record<string, number>)?.[key] ?? 0;

  const totalMentions = prompts.reduce(
    (s, p) => {
      const m = (p.mentions as Record<string, number>) ?? {};
      return s + (m['ChatGPT'] ?? 0) + (m['Gemini'] ?? 0) + (m['Perplexity'] ?? 0);
    },
    0
  );
  const avgScore = prompts.length
    ? Math.round(
        (prompts.reduce(
          (s, p) => s + (safeScore(p, 'ChatGPT') + safeScore(p, 'Gemini') + safeScore(p, 'Perplexity')) / 3,
          0
        ) /
          prompts.length) *
          100
      )
    : 0;

  // Inline trend (14 days) for the dashboard card
  const trend = TREND_30.slice(-14);

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Dashboard"
        title="Visibility overview"
        description={`Tracking ${company.name} (${company.domain})`}
        actions={<BrandSwitcher brands={brands} currentBrandId={currentBrandId} onSwitch={switchBrand} onAdd={() => setShowAddBrand(true)} />}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card>
          <div className="mono-label">Overall Visibility Score</div>
          <div className="font-display font-bold text-3xl text-avo-teal mt-1">{avgScore}%</div>
          <div className="text-[10px] text-status-success mt-1 font-mono">+4.2% vs last week</div>
        </Card>
        <Card>
          <div className="mono-label">Total mentions</div>
          <div className="font-display font-bold text-3xl text-text-bright mt-1">{totalMentions}</div>
          <div className="text-[10px] text-status-success mt-1 font-mono">+12 this week</div>
        </Card>
        <Card>
          <div className="mono-label">Tracked prompts</div>
          <div className="font-display font-bold text-3xl text-text-bright mt-1">
            {prompts.filter((p) => p.status === 'active').length}
          </div>
          <div className="text-[10px] text-text-muted mt-1 font-mono">
            {prompts.filter((p) => p.status === 'archived').length} archived
          </div>
        </Card>
        <Card>
          <div className="mono-label">Industry ranking</div>
          <div className="font-display font-bold text-3xl text-gold-base mt-1">
            {company.competitors.length ? '#2' : '—'}
          </div>
          <div className="text-[10px] text-text-muted mt-1 font-mono">
            in {company.competitors.length}-brand set
          </div>
        </Card>
      </div>

      {/* Trend + Top prompts */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <button
          type="button"
          onClick={() => setShowTrend(true)}
          className="text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-avo-teal/50 rounded-lg"
        >
          <Card elevated className="transition-colors hover:border-avo-teal/30 group">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="mono-label">Visibility score · last 14 days</div>
                <div className="text-xs text-text-muted">Average across all 3 LLMs</div>
              </div>
              <span className="text-[10px] text-avo-teal group-hover:underline font-mono uppercase tracking-wider inline-flex items-center gap-1">
                See detail <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#334766' }} tickLine={false} tickFormatter={(v: string) => v} />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 0.6]}
                    tickFormatter={(v) => `${Math.round((v as number) * 100)}%`}
                  />
                  <Tooltip
                    contentStyle={{ background: '#0C182C', border: '1px solid #334766', borderRadius: 8, fontSize: 11 }}
                    formatter={(v: any) => `${Math.round((v as number) * 100)}%`}
                  />
                  <Line type="monotone" dataKey="score" stroke="#00C2B8" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </button>

        <Card elevated>
          <div className="flex items-center justify-between mb-3">
            <div className="mono-label">Top prompts</div>
            <Link
              to="/dashboard/visibility"
              className="text-[10px] text-avo-teal hover:underline font-mono uppercase tracking-wider"
            >
              View all →
            </Link>
          </div>
          {prompts.filter((p) => p.status === 'active').length === 0 ? (
            <div className="text-xs text-text-muted py-8 text-center">
              No prompts tracked for this brand yet.
            </div>
          ) : (
            <div className="space-y-2">
              {prompts
                .filter((p) => p.status === 'active')
                .slice(0, 4)
                .map((p) => {
                  const score = Math.round(
                    ((safeScore(p, 'ChatGPT') + safeScore(p, 'Gemini') + safeScore(p, 'Perplexity')) / 3) * 100
                  );
                  return (
                    <Link
                      key={p.id}
                      to={`/dashboard/visibility/${p.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-md bg-navy-deep/40 border border-navy-edge hover:border-avo-teal/40 group"
                    >
                      <Eye className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="text-xs text-text-bright truncate flex-1 group-hover:text-avo-teal">
                        {p.text}
                      </span>
                      <span className="font-display font-bold text-sm text-avo-teal">{score}%</span>
                    </Link>
                  );
                })}
            </div>
          )}
        </Card>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <Card className="bg-gradient-to-br from-avo-teal/8 to-pillar-manifest/5 border-avo-teal/20">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="font-display font-bold text-text-bright">Want the full picture?</div>
              <div className="text-sm text-text-secondary mt-0.5">
                Jump into Visibility to see every prompt, every LLM, and every competitor in detail.
              </div>
            </div>
            <Link to="/dashboard/visibility" className="btn btn-primary">
              Open Visibility <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      </div>

      {showTrend && <TrendPopup onClose={() => setShowTrend(false)} />}
      {showAddBrand && (
        <AddBrandModal
          onClose={() => setShowAddBrand(false)}
          onSubmit={(input) => {
            addBrand(input);
            setShowAddBrand(false);
          }}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// BrandSwitcher
// ------------------------------------------------------------------
function BrandSwitcher({
  brands,
  currentBrandId,
  onSwitch,
  onAdd,
}: {
  brands: CompanyProfile[];
  currentBrandId: string;
  onSwitch: (id: string) => void;
  onAdd: () => void;
}) {
  const active = brands.find((b) => b.id === currentBrandId) ?? brands[0];
  return (
    <Popover
      align="right"
      width={280}
      trigger={
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-navy-edge bg-navy-deep hover:border-avo-teal/40 transition-colors text-sm text-text-bright">
          <Building2 className="w-4 h-4 text-avo-teal" />
          <span className="max-w-[160px] truncate">{active?.name ?? 'Select brand'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        </span>
      }
    >
      {(close) => (
        <div className="py-1">
          {brands.length === 0 && (
            <div className="px-3 py-4 text-xs text-text-muted text-center">No brands yet.</div>
          )}
          {brands.map((b) => {
            const isActive = b.id === currentBrandId;
            return (
              <button
                key={b.id}
                onClick={() => {
                  onSwitch(b.id);
                  close();
                }}
                className={
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ' +
                  (isActive
                    ? 'bg-avo-teal/10 text-avo-teal'
                    : 'text-text-secondary hover:bg-navy-elevated/50 hover:text-text-bright')
                }
              >
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 truncate">{b.name}</span>
                <span className="text-[10px] font-mono text-text-muted">{b.domain}</span>
                {isActive && (
                  <svg viewBox="0 0 12 12" className="w-3 h-3 text-avo-teal shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6l3 3 5-6" />
                  </svg>
                )}
              </button>
            );
          })}
          <div className="border-t border-navy-edge my-1" />
          <button
            onClick={() => {
              onAdd();
              close();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-text-secondary hover:bg-navy-elevated/50 hover:text-avo-teal transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add new brand</span>
          </button>
        </div>
      )}
    </Popover>
  );
}

// ------------------------------------------------------------------
// TrendPopup (max-w-3xl, with 7d/30d/custom date filter)
// ------------------------------------------------------------------
function TrendPopup({ onClose }: { onClose: () => void }) {
  const [range, setRange] = useState<'7d' | '30d' | 'custom'>('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Esc to close — use ref so we don't re-run when onClose identity changes
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const data =
    range === '7d' ? TREND_30.slice(-7) : range === '30d' ? TREND_30 : TREND_30;
  const labelDays = range === '7d' ? 7 : range === '30d' ? 30 : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-base/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-xl border border-navy-edge shadow-2xl w-full max-w-3xl fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-navy-edge/50">
          <div>
            <div className="mono-label text-avo-teal mb-1">Visibility</div>
            <h2 className="font-display font-bold text-xl text-text-bright">Visibility trend</h2>
            <p className="text-xs text-text-muted mt-1">Average across all tracked prompts</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-bright p-1 -m-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date filter */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex bg-navy-deep border border-navy-edge rounded-lg p-0.5">
              {(['7d', '30d', 'custom'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={
                    'px-3 py-1.5 text-xs rounded-md transition-colors ' +
                    (range === r
                      ? 'bg-avo-teal text-navy-base font-medium'
                      : 'text-text-secondary hover:text-text-bright')
                  }
                >
                  {r === '7d' ? '7 days' : r === '30d' ? '30 days' : 'Custom'}
                </button>
              ))}
            </div>
            {range === 'custom' && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">From</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="bg-navy-deep border border-navy-edge rounded px-2 py-1 text-xs text-text-bright"
                />
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider">To</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="bg-navy-deep border border-navy-edge rounded px-2 py-1 text-xs text-text-bright"
                />
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="p-6 pt-4">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={{ stroke: '#334766' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 0.6]}
                  tickFormatter={(v) => `${Math.round((v as number) * 100)}%`}
                />
                <Tooltip
                  contentStyle={{ background: '#0C182C', border: '1px solid #334766', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: any) => [`${Math.round((v as number) * 100)}%`, 'Score']}
                  labelStyle={{ color: '#94A3B8' }}
                />
                <Line type="monotone" dataKey="score" stroke="#00C2B8" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-navy-deep/40 border border-navy-edge">
              <div className="mono-label mb-1">Current</div>
              <div className="font-display font-bold text-2xl text-avo-teal">
                {Math.round((data[data.length - 1]?.score ?? 0) * 100)}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-navy-deep/40 border border-navy-edge">
              <div className="mono-label mb-1">vs prev period</div>
              <div className="font-display font-bold text-2xl text-status-success flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +5.2%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-navy-deep/40 border border-navy-edge">
              <div className="mono-label mb-1">Industry avg</div>
              <div className="font-display font-bold text-2xl text-text-secondary">22.4%</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 text-[10px] text-text-muted font-mono uppercase tracking-wider text-center">
          {range === 'custom' && customFrom && customTo
            ? `Tracking ${customFrom} → ${customTo}`
            : labelDays
              ? `Tracking last ${labelDays} days`
              : 'Pick a date range'}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// AddBrandModal
// ------------------------------------------------------------------
function AddBrandModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (input: { name: string; domain: string; language: 'English' | 'Indonesian' }) => void;
}) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [language, setLanguage] = useState<'English' | 'Indonesian'>('English');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canSubmit = name.trim().length > 0 && domain.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-base/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-xl border border-navy-edge shadow-2xl w-full max-w-md fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-4 border-b border-navy-edge/50">
          <div>
            <div className="mono-label text-avo-teal mb-1">New</div>
            <h2 className="font-display font-bold text-lg text-text-bright">Add new brand</h2>
            <p className="text-xs text-text-muted mt-1">Track a new brand. You can edit details later in Settings.</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-bright p-1 -m-1" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onSubmit({ name: name.trim(), domain: domain.trim().toLowerCase(), language });
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="mono-label mb-1.5 block">Brand name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tokopedia"
              autoFocus
              className="w-full bg-navy-deep border border-navy-edge rounded-lg px-3 py-2 text-sm text-text-bright placeholder:text-text-muted focus:border-avo-teal/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mono-label mb-1.5 block">Domain</label>
            <input
              type="text"
              required
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. tokopedia.com"
              className="w-full bg-navy-deep border border-navy-edge rounded-lg px-3 py-2 text-sm text-text-bright placeholder:text-text-muted focus:border-avo-teal/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mono-label mb-1.5 block">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'English' | 'Indonesian')}
              className="w-full bg-navy-deep border border-navy-edge rounded-lg px-3 py-2 text-sm text-text-bright focus:border-avo-teal/50 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Indonesian">Indonesian</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={!canSubmit} className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus className="w-4 h-4" /> Add brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
