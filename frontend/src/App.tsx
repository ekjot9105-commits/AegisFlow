import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import LandingPage from './pages/LandingPage';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { ToastProvider } from './hooks/ToastContext';
import { AuthProvider } from './hooks/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const SystemLogs = lazy(() => import('./pages/SystemLogs'));
const AIActivityLog = lazy(() => import('./pages/AIActivityLog'));
const Settings = lazy(() => import('./pages/Settings'));
const FanPortal = lazy(() => import('./pages/FanPortal'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function SuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      {children}
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<LandingPage />} />
              
              {/* Public/Other Roles (No Dashboard Sidebar/Tabs) */}
              <Route path="fan-portal" element={<SuspenseWrapper><FanPortal /></SuspenseWrapper>} />
              <Route path="volunteers" element={
                <ProtectedRoute allowedRoles={['admin', 'volunteer']}>
                  <SuspenseWrapper><VolunteerDashboard /></SuspenseWrapper>
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SuspenseWrapper><Settings /></SuspenseWrapper>
                </ProtectedRoute>
              } />

              {/* RBAC Protected Operations Routes (With Ops Tabs) */}
              <Route element={<DashboardLayout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute allowedRoles={['admin', 'operator']}>
                    <DashboardHome />
                  </ProtectedRoute>
                } />
                <Route path="analytics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SuspenseWrapper><Analytics /></SuspenseWrapper>
                  </ProtectedRoute>
                } />
                <Route path="logs" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SuspenseWrapper><SystemLogs /></SuspenseWrapper>
                  </ProtectedRoute>
                } />
                <Route path="ai-activity" element={
                  <ProtectedRoute allowedRoles={['admin', 'operator']}>
                    <SuspenseWrapper><AIActivityLog /></SuspenseWrapper>
                  </ProtectedRoute>
                } />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
