import { lazy, Suspense } from 'react';
import KPICards from '../components/dashboard/KPICards';
import SkeletonLoader from '../components/ui/SkeletonLoader';

// Lazy loading non-critical widgets to optimize initial load
const StadiumHeatmap = lazy(() => import('../components/dashboard/StadiumHeatmap'));
const IncidentTimeline = lazy(() => import('../components/dashboard/IncidentTimeline'));
const SystemHealth = lazy(() => import('../components/dashboard/SystemHealth'));
const CopilotPanel = lazy(() => import('../components/copilot/CopilotPanel'));
const RecentActivityPanel = lazy(() => import('../components/dashboard/RecentActivityPanel'));

// Fallbacks for suspense
const HeatmapFallback = () => <SkeletonLoader className="h-[400px] w-full col-span-1 lg:col-span-2" />;
const TimelineFallback = () => <SkeletonLoader className="h-[400px] w-full col-span-1" />;
const HealthFallback = () => <SkeletonLoader className="h-[200px] w-full col-span-1" />;
const CopilotFallback = () => <SkeletonLoader className="h-[600px] w-full col-span-1 lg:col-span-2" />;

export default function DashboardHome() {
  return (
    <div className="h-full flex flex-col pb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Live Operations</h2>
        <p className="text-textSecondary text-sm mt-1">FIFA World Cup 2026 - Stadium AI Command Center</p>
      </div>
      
      {/* Top KPI row */}
      <KPICards />
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Focus) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Suspense fallback={<HeatmapFallback />}>
            <StadiumHeatmap />
          </Suspense>
          
          <Suspense fallback={<CopilotFallback />}>
            <CopilotPanel />
          </Suspense>
        </div>
        
        {/* Right Column (Supporting Data) */}
        <div className="col-span-1 flex flex-col gap-6 h-full">
          <Suspense fallback={<TimelineFallback />}>
            <IncidentTimeline />
          </Suspense>
          
          <Suspense fallback={<TimelineFallback />}>
            <RecentActivityPanel />
          </Suspense>

          <Suspense fallback={<HealthFallback />}>
            <SystemHealth />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
