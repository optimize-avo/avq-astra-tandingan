import { PageHeader, Card, Pill } from '@/components/ui';
import { useApp } from '@/store/app';
import { ShieldCheck, TrendingUp, Globe, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export function AuthorityPage() {
  const company = useApp((s) => s.company);
  const data = [
    { source: 'Reddit', score: 78 },
    { source: 'G2', score: 84 },
    { source: 'Hacker News', score: 62 },
    { source: 'Medium', score: 71 },
    { source: 'YouTube', score: 48 },
    { source: 'Twitter/X', score: 56 },
  ];

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Authority"
        title={`How credible AI thinks ${company.name} is`}
        description="Aggregate sentiment, review scores, and authority signals from sources LLMs actually cite. (Demo placeholder)"
      />

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-avo-teal" />
            <div className="mono-label">Authority score</div>
          </div>
          <div className="font-display font-bold text-3xl text-avo-teal mt-2">74<span className="text-lg text-text-muted">/100</span></div>
          <div className="text-[10px] text-status-success mt-1 font-mono">+3 this week</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-gold-base" />
            <div className="mono-label">Avg review rating</div>
          </div>
          <div className="font-display font-bold text-3xl text-text-bright mt-2">4.6<span className="text-lg text-text-muted">/5</span></div>
          <div className="text-[10px] text-text-muted mt-1 font-mono">from 312 reviews</div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-pillar-manifest" />
            <div className="mono-label">Mention sources</div>
          </div>
          <div className="font-display font-bold text-3xl text-text-bright mt-2">28</div>
          <div className="text-[10px] text-text-muted mt-1 font-mono">domains tracked</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4">
        <Card elevated>
          <div className="mono-label mb-3">Authority by source</div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <XAxis dataKey="source" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={{ stroke: '#334766' }} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#0C182C', border: '1px solid #334766', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: any) => `${v}/100`}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.score >= 70 ? '#00C2B8' : d.score >= 50 ? '#F8B400' : '#E3170A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card elevated>
          <div className="mono-label mb-3">Recent reviews</div>
          <div className="space-y-3">
            {[
              { src: 'G2', rating: 5, text: '"Cut our AWS bill in half within a week. Rollback feature saved us during a bad deploy."', author: 'CTO, fintech startup' },
              { src: 'Hacker News', rating: 4, text: '"Solid DX. The OpenTelemetry integration just works."', author: '@devops_lead' },
              { src: 'Reddit r/devops', rating: 5, text: '"Underrated. Switched from a $40k/mo solution."', author: 'u/sre_throwaway' },
            ].map((r, i) => (
              <div key={i} className="rounded-lg bg-navy-deep/40 border border-navy-edge p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Pill tone="teal">{r.src}</Pill>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-gold-base text-gold-base" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-text-secondary italic">{r.text}</p>
                <div className="text-[10px] text-text-muted mt-1.5 font-mono">— {r.author}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
