import { PageHeader, Card, Pill } from '@/components/ui';
import { useApp } from '@/store/app';
import { Globe, Trash2, LogOut, Bell, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SettingsPage() {
  const company = useApp((s) => s.company);
  const update = useApp((s) => s.updateCompany);
  const reset = useApp((s) => s.resetOnboarding);
  const nav = useNavigate();

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">
      <PageHeader
        eyebrow="Settings"
        title="Workspace"
        description="Manage your tracked brand, notifications, and demo state."
      />

      <div className="space-y-4">
        <Card elevated>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-avo-teal" />
            <div className="font-display font-semibold text-text-bright">Brand</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Company name">
              <input
                value={company.name}
                onChange={(e) => update({ name: e.target.value })}
                className="w-full bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-avo-teal/50"
              />
            </Field>
            <Field label="Domain">
              <input
                value={company.domain}
                onChange={(e) => update({ domain: e.target.value })}
                className="w-full bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-avo-teal/50"
              />
            </Field>
            <Field label="Language">
              <select
                value={company.language}
                onChange={(e) => update({ language: e.target.value as any })}
                className="w-full bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-sm text-text-bright focus:outline-none focus:border-avo-teal/50"
              >
                {['English', 'Indonesian', 'Japanese', 'Korean'].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Writing sample URL">
              <input
                value={company.writingSampleUrl || ''}
                onChange={(e) => update({ writingSampleUrl: e.target.value || undefined })}
                placeholder="(optional)"
                className="w-full bg-navy-deep border border-navy-edge rounded-md px-3 py-2 text-sm text-text-bright placeholder:text-text-muted focus:outline-none focus:border-avo-teal/50"
              />
            </Field>
          </div>
        </Card>

        <Card elevated>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-pillar-manifest" />
            <div className="font-display font-semibold text-text-bright">Notifications</div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Weekly visibility digest', sub: 'Sent every Monday 9am', on: true },
              { label: 'Mention alerts', sub: 'When AI mentions your brand', on: true },
              { label: 'Competitor movement', sub: 'When a competitor overtakes you', on: false },
            ].map((n) => (
              <div key={n.label} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm text-text-bright">{n.label}</div>
                  <div className="text-xs text-text-muted">{n.sub}</div>
                </div>
                <Pill tone={n.on ? 'success' : 'muted'}>{n.on ? 'On' : 'Off'}</Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card elevated className="border-status-error/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-vs-rose" />
            <div className="font-display font-semibold text-text-bright">Demo controls</div>
          </div>
          <p className="text-xs text-text-muted mb-3">
            Reset will clear your localStorage and return to the welcome page. Useful when presenting to start fresh.
          </p>
          <button
            onClick={() => {
              reset();
              nav('/');
            }}
            className="btn btn-secondary !text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset demo
          </button>
        </Card>

        <div className="text-center pt-4 text-[11px] text-text-muted font-mono">
          Avq Astra · Demo prototype · No real account, no real data
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mono-label mb-2 block">{label}</label>
      {children}
    </div>
  );
}
