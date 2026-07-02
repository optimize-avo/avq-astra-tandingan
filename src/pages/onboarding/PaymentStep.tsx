import { useNavigate } from 'react-router-dom';
import { useApp } from '@/store/app';
import { Check, Sparkles, CreditCard, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    sub: '/ month',
    perks: ['Track up to 25 prompts', '3 LLMs', 'Weekly scans', 'Email reports'],
    highlight: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$149',
    sub: '/ month',
    perks: ['Unlimited prompts', '3 LLMs', 'Daily scans', 'Competitor tracking', 'Content generation'],
    highlight: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$399',
    sub: '/ month',
    perks: ['Everything in Growth', 'Multiple brands', 'API access', 'Custom prompts', 'Priority support'],
    highlight: false,
  },
];

export function PaymentStep() {
  const nav = useNavigate();
  const complete = useApp((s) => s.completeOnboarding);

  return (
    <div className="space-y-6">
      <div>
        <div className="mono-label text-avo-teal mb-1.5">Step 8 · Plan</div>
        <h2 className="font-display font-bold text-2xl text-text-bright">Pick a plan</h2>
        <p className="text-sm text-text-secondary mt-2 max-w-xl">
          You can change anytime. Skip if you're just exploring the demo.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={
              p.highlight
                ? 'card-elevated !p-4 border-avo-teal/50 ring-1 ring-avo-teal/30 relative'
                : 'card !p-4'
            }
          >
            {p.highlight && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 pill bg-avo-teal text-navy-base border border-avo-teal">
                <Sparkles className="w-3 h-3" /> Most popular
              </div>
            )}
            <div className="font-display font-bold text-text-bright">{p.name}</div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="font-display font-bold text-2xl text-text-bright">{p.price}</span>
              <span className="text-xs text-text-muted">{p.sub}</span>
            </div>
            <ul className="space-y-1.5 mt-4">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-xs text-text-secondary">
                  <Check className="w-3.5 h-3.5 text-avo-teal shrink-0 mt-0.5" />
                  {perk}
                </li>
              ))}
            </ul>
            <button className={p.highlight ? 'btn btn-primary w-full mt-4 !text-xs' : 'btn btn-secondary w-full mt-4 !text-xs'}>
              {p.highlight ? 'Start free trial' : 'Choose plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="card bg-navy-deep/60 border-navy-edge">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-text-muted shrink-0" />
          <div className="flex-1 text-sm text-text-secondary">
            Demo mode — no real payment will be charged.
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => nav('/onboarding/writing-sample')} className="btn btn-ghost">← Back</button>
        <button
          onClick={() => {
            complete();
            nav('/dashboard/visibility');
          }}
          className="btn btn-primary"
        >
          Enter dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
