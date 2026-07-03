import { Component, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from '@/store/app';
import { AppShell } from '@/components/AppShell';
import { WelcomePage } from '@/pages/WelcomePage';

class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false, error: null as Error | null };
  static getDerivedStateFromError(e: Error) {
    return { hasError: true, error: e };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[App ErrorBoundary]', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-deep flex items-center justify-center p-8">
          <div className="max-w-xl w-full card-elevated p-6">
            <h1 className="font-display font-bold text-xl text-status-rose mb-2">App crashed</h1>
            <pre className="text-xs text-text-muted bg-navy-base p-3 rounded overflow-auto max-h-48">
              {this.state.error?.message}\n{this.state.error?.stack}
            </pre>
            <button
              className="btn btn-ghost mt-4"
              onClick={() => {
                localStorage.removeItem('avq-astra-demo');
                window.location.reload();
              }}
            >
              Clear localStorage &amp; reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
import { OnboardingLayout } from '@/pages/onboarding/OnboardingLayout';
import { StartStep } from '@/pages/onboarding/StartStep';
import { AnalyzingStep } from '@/pages/onboarding/AnalyzingStep';
import { CompanyStep } from '@/pages/onboarding/CompanyStep';
import { TopicsStep } from '@/pages/onboarding/TopicsStep';
import { PromptsStep } from '@/pages/onboarding/PromptsStep';
import { PaymentStep } from '@/pages/onboarding/PaymentStep';
import { TrackStep } from '@/pages/onboarding/TrackStep';
import { DashboardHome } from '@/pages/DashboardHome';
import { VisibilityListPage } from '@/pages/visibility/VisibilityListPage';
import { VisibilityDetailPage } from '@/pages/visibility/VisibilityDetailPage';
import { AuthorityPage } from '@/pages/AuthorityPage';
import { ContentPage } from '@/pages/ContentPage';
import { SettingsPage } from '@/pages/SettingsPage';

export default function App() {
  const hasOnboarded = useApp((s) => s.hasOnboarded);
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />

      <Route path="/onboarding" element={<OnboardingLayout />}>
        <Route index element={<Navigate to="start" replace />} />
        <Route path="start" element={<StartStep />} />
        <Route path="analyzing" element={<AnalyzingStep />} />
        <Route path="company" element={<CompanyStep />} />
        <Route path="topics" element={<TopicsStep />} />
        <Route path="prompts" element={<PromptsStep />} />
        <Route path="payment" element={<PaymentStep />} />
        <Route path="track" element={<TrackStep />} />
      </Route>

      <Route path="/dashboard" element={<AppShell />}>
        <Route index element={<DashboardHome />} />
        <Route path="visibility" element={<VisibilityListPage />} />
        <Route path="visibility/:id" element={<VisibilityDetailPage />} />
        <Route path="authority" element={<AuthorityPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={hasOnboarded ? '/dashboard/visibility' : '/'} replace />}
      />
    </Routes>
  );
}
