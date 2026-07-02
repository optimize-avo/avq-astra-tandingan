import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from '@/store/app';
import { AppShell } from '@/components/AppShell';
import { WelcomePage } from '@/pages/WelcomePage';
import { OnboardingLayout } from '@/pages/onboarding/OnboardingLayout';
import { StartStep } from '@/pages/onboarding/StartStep';
import { AnalyzingStep } from '@/pages/onboarding/AnalyzingStep';
import { CompanyStep } from '@/pages/onboarding/CompanyStep';
import { TopicsStep } from '@/pages/onboarding/TopicsStep';
import { PromptsStep } from '@/pages/onboarding/PromptsStep';
import { WritingSampleStep } from '@/pages/onboarding/WritingSampleStep';
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
        <Route path="writing-sample" element={<WritingSampleStep />} />
        <Route path="payment" element={<PaymentStep />} />
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
