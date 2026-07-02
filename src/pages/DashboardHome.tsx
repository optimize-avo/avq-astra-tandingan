import { Link } from 'react-router-dom';
import { useApp } from '@/store/app';
import { PageHeader, Card, Pill } from '@/components/ui';
import { Eye, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function DashboardHome() {
  const prompts = useApp((s) => s.prompts);
  const company = useApp((s) => s.company);
  const totalMentions = prompts.reduce((s, p) => s + p.mentions.ChatGPT + p.mentions.Gemini + p.mentions.Perplexity, 0);
  const avgSov = prompts.length
    ? Math.round((prompts.reduce((s, p) => s + (p.sov.ChatGPT + p.sov.Gemini + p.sov.Perplexity) / 3, 0) / prompts.length) * 100)
    : 0;

  // Dummy trend
  const trend = Array.from({ length: 14 }).map((_, i) => ({
    d: `D${i + 1}`,
    sov: Math.round((0.18 + Math.sin(i / 2) * 0.08 + (i / 30)) * 100) / 100,
    mentions: 8 + Math.round(Math.cos(i / 3) * 4 + i / 2),
  }));

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow={`${company.name}`}
        title="Dashboard"
        description="Quick snapshot across all your AI visibility. Track trends, see what's working, drill into the detail."
      />

      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card>
          <div className="mono-label">Overall SoV</div>
          <div className="font-display font-bold text-3xl text-avo-teal mt-1">{avgSov}%</div>
          <div className="text-[10px] text-status-success mt-1 font-mono">+4.2% vs last week</div>
        </Card>
        <Card>
          <div className="mono-label">Total mentions</div>
          <div className="font-display font-bold text-3xl text-text-bright mt-1">{totalMentions}</div>
          <div className="text-[10px] text-status-success mt-1 font-mono">+12 this week</div>
        </Card>
        <Card>
          <div className="mono-label">Tracked prompts</div>
          <div className="font-display font-bold text-3xl text-text-bright mt-1">{prompts.filter((p) => p.status === 'active').length}</div>
          <div className="text-[10px] text-text-muted mt-1 font-mono">{prompts.filter((p) => p.status === 'archived').length} archived</div>
        </Card>
        <Card>
          <div className="mono-label">Industry ranking</div>
          <div className="font-display font-bold text-3xl text-gold-base mt-1">#2</div>
          <div className="text-[10px] text-text-muted mt-1 font-mono">in {company.competitors.length}-brand set</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <Card elevated>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="mono-label">Share of voice · last 14 days</div>
              <div className="text-xs text-text-muted">Average across all 3 LLMs</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <XAxis dataKey="d" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#334766' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 0.6]} tickFormatter={(v) => `${Math.round((v as number) * 100)}%`} />
                <Tooltip
                  contentStyle={{ background: '#0C182C', border: '1px solid #334766', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: any) => `${Math.round((v as number) * 100)}%`}
                />
                <Line type="monotone" dataKey="sov" stroke="#00C2B8" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card elevated>
          <div className="flex items-center justify-between mb-3">
            <div className="mono-label">Top prompts</div>
            <Link to="/dashboard/visibility" className="text-[10px] text-avo-teal hover:underline font-mono uppercase tracking-wider">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {prompts
              .filter((p) => p.status === 'active')
              .slice(0, 4)
              .map((p) => {
                const sov = Math.round(((p.sov.ChatGPT + p.sov.Gemini + p.sov.Perplexity) / 3) * 100);
                return (
                  <Link
                    key={p.id}
                    to={`/dashboard/visibility/${p.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-md bg-navy-deep/40 border border-navy-edge hover:border-avo-teal/40 group"
                  >
                    <Eye className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span className="text-xs text-text-bright truncate flex-1 group-hover:text-avo-teal">{p.text}</span>
                    <span className="font-display font-bold text-sm text-avo-teal">{sov}%</span>
                  </Link>
                );
              })}
          </div>
        </Card>
      </div>

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
    </div>
  );
}
