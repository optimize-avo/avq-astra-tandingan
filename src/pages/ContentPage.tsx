import { PageHeader, Card, Pill } from '@/components/ui';
import { useApp } from '@/store/app';
import { FileText, Sparkles, Calendar, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function ContentPage() {
  const company = useApp((s) => s.company);
  const perf = Array.from({ length: 14 }).map((_, i) => ({
    d: `D${i + 1}`,
    views: 120 + Math.round(Math.sin(i / 2) * 60 + i * 4),
    mentions: Math.round((i * 0.6 + Math.cos(i / 1.5) * 3 + 6)),
  }));

  const posts = [
    { title: 'Cutting AWS bills: 12 strategies that actually work', status: 'published', views: 1840, mentions: 14, date: '2 days ago' },
    { title: 'Why we built instant rollback for stateful workloads', status: 'published', views: 920, mentions: 7, date: '1 week ago' },
    { title: 'Distributed tracing with OpenTelemetry: a primer', status: 'draft', views: 0, mentions: 0, date: 'in review' },
    { title: 'Cloud cost optimization for Kubernetes', status: 'idea', views: 0, mentions: 0, date: 'pending' },
  ];

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Content"
        title="Content engine"
        description="Generate articles, briefs, and social posts tuned to win AI answers. (Demo placeholder)"
        actions={
          <button className="btn btn-primary">
            <Sparkles className="w-4 h-4" /> Generate new content
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-3 mb-6">
        <Card>
          <div className="mono-label">Published</div>
          <div className="font-display font-bold text-3xl text-text-bright mt-2">12</div>
          <div className="text-[10px] text-text-muted mt-1 font-mono">last 30 days</div>
        </Card>
        <Card>
          <div className="mono-label">Total views</div>
          <div className="font-display font-bold text-3xl text-avo-teal mt-2">24.8k</div>
          <div className="text-[10px] text-status-success mt-1 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% MoM
          </div>
        </Card>
        <Card>
          <div className="mono-label">AI mentions</div>
          <div className="font-display font-bold text-3xl text-pillar-manifest mt-2">42</div>
          <div className="text-[10px] text-text-muted mt-1 font-mono">across tracked prompts</div>
        </Card>
        <Card>
          <div className="mono-label">Scheduled</div>
          <div className="font-display font-bold text-3xl text-text-bright mt-2">5</div>
          <div className="text-[10px] text-text-muted mt-1 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3" /> next 2 weeks
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <Card elevated>
          <div className="mono-label mb-3">Content performance · last 14 days</div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={perf} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-views" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C2B8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00C2B8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#334766' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0C182C', border: '1px solid #334766', borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="views" stroke="#00C2B8" strokeWidth={2} fill="url(#g-views)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card elevated>
          <div className="mono-label mb-3">Recent content</div>
          <div className="space-y-2">
            {posts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-md bg-navy-deep/40 border border-navy-edge">
                <FileText className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-bright truncate">{p.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Pill tone={p.status === 'published' ? 'success' : p.status === 'draft' ? 'gold' : 'muted'}>{p.status}</Pill>
                    <span className="text-[10px] text-text-muted font-mono">{p.date}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {p.status === 'published' && (
                    <>
                      <div className="text-[10px] text-text-muted font-mono">{p.views} views</div>
                      <div className="text-[10px] text-avo-teal font-mono">{p.mentions} mentions</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
