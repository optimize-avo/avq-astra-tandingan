import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, ShieldCheck, FileText, ArrowRight, BarChart3, Globe2, Zap } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="px-6 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-avo-teal to-pillar-manifest flex items-center justify-center shadow-[0_4px_16px_-4px_rgba(0,194,184,0.6)]">
            <Sparkles className="w-4 h-4 text-navy-base" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-text-bright leading-tight">Avq Astra</div>
            <div className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Visibility Platform</div>
          </div>
        </div>
        <div className="text-sm text-text-secondary hidden sm:block">
          Internal demo · prototype
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center px-6 sm:px-10 py-10">
        <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="fade-up">
            <div className="pill bg-avo-teal/15 text-avo-teal border border-avo-teal/30 mb-5 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-avo-teal pulse-dot" /> Live prototype
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-text-bright leading-[1.05] tracking-tight">
              See how AI talks about
              <br />
              <span className="bg-gradient-to-r from-avo-teal via-pillar-manifest to-gold-base bg-clip-text text-transparent">
                your brand.
              </span>
            </h1>
            <p className="text-text-secondary text-base mt-5 max-w-xl leading-relaxed">
              Track your brand's share of voice across ChatGPT, Gemini, and Perplexity.
              Discover the prompts that matter, the sources AI cites, and the competitors
              winning the answers.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-7">
              <button
                onClick={() => navigate('/onboarding/start')}
                className="btn btn-primary text-base !px-6 !py-3"
              >
                Start demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/dashboard/visibility" className="btn btn-secondary text-base !px-6 !py-3">
                Skip to dashboard
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold-base" />
                Setup in &lt; 3 min
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-avo-teal" />
                Multi-language
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-pillar-manifest" />
                3 LLMs tracked
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative fade-up">
            <div className="absolute inset-0 bg-grid rounded-2xl opacity-50" />
            <div className="relative card-elevated !p-6 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div className="mono-label">Share of Voice</div>
                <div className="pill bg-avo-teal/15 text-avo-teal border border-avo-teal/30">Last 7 days</div>
              </div>
              {[
                { name: 'Your brand', sov: 0.34, you: true },
                { name: 'Competitor A', sov: 0.26, you: false },
                { name: 'Competitor B', sov: 0.18, you: false },
                { name: 'Competitor C', sov: 0.12, you: false },
                { name: 'Others', sov: 0.10, you: false },
              ].map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${r.you ? 'bg-avo-teal' : 'bg-text-muted'}`} />
                  <div className="text-sm text-text-secondary w-32 truncate">{r.name}</div>
                  <div className="flex-1 h-2 rounded-full bg-navy-deep overflow-hidden">
                    <div
                      className={`h-full rounded-full ${r.you ? 'bg-gradient-to-r from-avo-teal to-pillar-manifest' : 'bg-navy-edge'}`}
                      style={{ width: `${r.sov * 100}%` }}
                    />
                  </div>
                  <div className={`text-xs font-mono w-12 text-right ${r.you ? 'text-avo-teal font-semibold' : 'text-text-muted'}`}>
                    {Math.round(r.sov * 100)}%
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {[
                { name: 'ChatGPT', value: '34%', icon: Eye, color: 'text-avo-teal' },
                { name: 'Gemini', value: '34%', icon: ShieldCheck, color: 'text-pillar-manifest' },
                { name: 'Perplexity', value: '34%', icon: FileText, color: 'text-gold-base' },
              ].map((l) => {
                const Icon = l.icon;
                return (
                  <div key={l.name} className="card !p-3 text-center">
                    <Icon className={`w-4 h-4 mx-auto ${l.color}`} />
                    <div className="text-[10px] text-text-muted mt-1 uppercase tracking-wider font-mono">{l.name}</div>
                    <div className="font-display font-bold text-lg text-text-bright">{l.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-10 py-6 text-xs text-text-muted text-center border-t border-navy-edge/40">
        Avq Astra · Internal demo · All data shown is fictional
      </footer>
    </div>
  );
}
