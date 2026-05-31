import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Components
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { FreelancerDashboard } from '@/pages/freelancer/FreelancerDashboard';
import { JobListPage } from '@/pages/freelancer/JobListPage';
import { JobDetailPage } from '@/pages/freelancer/JobDetailPage';
import { FreelancerBidsPage } from '@/pages/freelancer/FreelancerBidsPage';
import { MessagesPage } from '@/pages/freelancer/MessagesPage';
import { FreelancerContractsPage } from '@/pages/freelancer/FreelancerContractsPage';
import { FreelancerEarningsPage } from '@/pages/freelancer/FreelancerEarningsPage';
import { FreelancerProfilePage } from '@/pages/freelancer/FreelancerProfilePage';
import { LandingPage } from '@/pages/LandingPage';
import { ClientDashboard } from '@/pages/client/ClientDashboard';
import { PostJobPage } from '@/pages/client/PostJobPage';
import { EditJobPage } from '@/pages/client/EditJobPage';
import { BidReviewPage } from '@/pages/client/BidReviewPage';
import { ClientContractsPage } from '@/pages/client/ClientContractsPage';
import { NotificationPage } from '@/pages/client/NotificationPage';
import { ClientMessagingPage } from '@/pages/client/ClientMessagingPage';
import { ClientSettingsPage } from '@/pages/client/ClientSettingsPage';
import { SupportPage } from '@/pages/client/SupportPage';
import { FreelancerListPage } from '@/pages/client/FreelancerListPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { UserManagement } from '@/pages/admin/UserManagement';
import { useAuth } from '@/contexts/AuthContext';

// Layouts
import { DashboardLayout } from '@/layouts/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const FreelancerRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'Client') return <Navigate to="/client/dashboard" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
              <Loader2 className="h-10 w-10 animate-spin text-kefit-primary" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              <Route element={<ProtectedRoute allowedRoles={['Freelancer']} />}>
                <Route path="/dashboard" element={<FreelancerDashboard />} />
                <Route path="/jobs" element={<JobListPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/applications" element={<FreelancerBidsPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/freelancer/contracts" element={<FreelancerContractsPage />} />
                <Route path="/freelancer/earnings" element={<FreelancerEarningsPage />} />
                <Route path="/profile" element={<FreelancerProfilePage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['Client']} />}>
                <Route path="/client/dashboard" element={<ClientDashboard />} />
                <Route path="/client/post-job" element={<PostJobPage />} />
                <Route path="/client/jobs/edit/:id" element={<EditJobPage />} />
                <Route path="/client/jobs/:id" element={<BidReviewPage />} />
                <Route path="/client/contracts" element={<ClientContractsPage />} />
                <Route path="/client/messages" element={<ClientMessagingPage />} />
                <Route path="/client/notifications" element={<NotificationPage />} />
                <Route path="/client/settings" element={<ClientSettingsPage />} />
                <Route path="/client/support" element={<SupportPage />} />
                <Route path="/client/freelancers" element={<FreelancerListPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/jobs" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<AdminDashboard />} />
              </Route>

              <Route path="/:role/dashboard" element={<FreelancerRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}


