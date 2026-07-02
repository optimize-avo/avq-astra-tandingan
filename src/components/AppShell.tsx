import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Eye, ShieldCheck, FileText, Settings, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { to: '/dashboard/visibility', label: 'Visibility', icon: Eye, badge: 'NEW' },
  { to: '/dashboard/authority', label: 'Authority', icon: ShieldCheck },
  { to: '/dashboard/content', label: 'Content', icon: FileText },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function AppShell() {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 glass-strong border-r border-navy-edge/60 flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-navy-edge/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-avo-teal to-pillar-manifest flex items-center justify-center shadow-[0_4px_16px_-4px_rgba(0,194,184,0.6)]">
              <Sparkles className="w-4 h-4 text-navy-base" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-text-bright leading-tight">
                Avq Astra
              </div>
              <div className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
                Visibility Platform
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-2.5 py-4 space-y-0.5">
          <div className="px-3 pb-2 mono-label">Workspace</div>
          {NAV.map((item) => {
            const active = loc.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-display font-medium transition-all',
                  active
                    ? 'bg-avo-teal/10 text-avo-teal border border-avo-teal/20'
                    : 'text-text-secondary hover:text-text-bright hover:bg-navy-elevated/50 border border-transparent'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="pill bg-gold-base/15 text-gold-base border border-gold-base/30 text-[9px]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-navy-edge/40">
          <div className="card !p-3 bg-gradient-to-br from-avo-teal/8 to-pillar-manifest/5 border-avo-teal/20">
            <div className="text-[11px] font-display font-semibold text-text-bright mb-1">
              Demo mode
            </div>
            <div className="text-[11px] text-text-secondary leading-relaxed">
              All data is dummy. Refreshing preserves your inputs.
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
