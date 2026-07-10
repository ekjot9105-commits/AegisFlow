import { type ReactNode } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles: ('admin' | 'operator' | 'volunteer' | 'fan')[] }) {
  const { hasRole, isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated || !user) {
    // In a real app, redirect to login page. Since this is an ops panel, we redirect to the public fan portal.
    return <Navigate to="/fan-portal" replace />;
  }

  if (!hasRole(allowedRoles)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-surface text-textPrimary">
        <h1 className="text-4xl font-bold text-danger mb-4">403 - Forbidden</h1>
        <p className="text-textSecondary">Your role ({user.role}) does not have clearance for this dashboard.</p>
        <button onClick={() => window.location.href = '/fan-portal'} className="mt-6 px-4 py-2 bg-primary rounded text-white">Return to Fan Portal</button>
      </div>
    );
  }

  return <>{children}</>;
}
