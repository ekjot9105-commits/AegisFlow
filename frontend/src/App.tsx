import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { ToastProvider } from './hooks/ToastContext';

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

// Mock Role-Based Access Control (RBAC)
function ProtectedRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) {
  // In a real app, use Zustand/Context to get the current user's role from their JWT
  const mockUserRole = 'admin'; // Change to 'fan' to test rejection
  
  if (!allowedRoles.includes(mockUserRole)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-surface text-white">
        <h1 className="text-4xl font-bold text-danger mb-4">403 - Forbidden</h1>
        <p className="text-textSecondary">Your role ({mockUserRole}) does not have clearance for this dashboard.</p>
        <button onClick={() => window.location.href = '/fan-portal'} className="mt-6 px-4 py-2 bg-primary rounded">Return to Fan Portal</button>
      </div>
    );
  }
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              {/* RBAC Protected Operations Routes */}
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
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SuspenseWrapper><Settings /></SuspenseWrapper>
                </ProtectedRoute>
              } />

              {/* Public/Other Roles */}
              <Route path="fan-portal" element={<SuspenseWrapper><FanPortal /></SuspenseWrapper>} />
              <Route path="volunteers" element={
                <ProtectedRoute allowedRoles={['admin', 'volunteer']}>
                  <SuspenseWrapper><VolunteerDashboard /></SuspenseWrapper>
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
