import { useQuery } from '@tanstack/react-query';
import { fetchKPIData } from '../../services/dashboard';
import { Card } from '../ui/Card';
import SkeletonLoader from '../ui/SkeletonLoader';
import { Users, AlertTriangle, BrainCircuit, ShieldHalf, Activity, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import { useWebSocket } from '../../services/websocket';

function AnimatedNumber({ value, format }: { value: any, format: (v: any) => string }) {
  const numericValue = typeof value === 'number' ? value : 0;
  const count = useCountUp(numericValue, 1500);

  if (typeof value === 'number') {
    return <>{format(count)}</>;
  }
  return <>{format(value)}</>;
}

const kpiConfig = [
  { key: 'crowdDensity', label: 'Crowd Density', icon: Users, format: (v: any) => `${v}%`, color: 'text-warning' },
  { key: 'activeIncidents', label: 'Active Incidents', icon: AlertTriangle, format: (v: any) => v, color: 'text-danger' },
  { key: 'aiConfidence', label: 'AI Confidence', icon: BrainCircuit, format: (v: any) => `${v}%`, color: 'text-accent' },
  { key: 'volunteers', label: 'Active Volunteers', icon: ShieldHalf, format: (v: any) => v, color: 'text-primary' },
  { key: 'medicalAlerts', label: 'Medical Alerts', icon: Activity, format: (v: any) => v, color: 'text-danger' },
  { key: 'predictionAccuracy', label: 'Prediction Accuracy', icon: Target, format: (v: any) => `${v}%`, color: 'text-accent' },
  { key: 'averageResponseTime', label: 'Avg Response Time', icon: Clock, format: (v: any) => v, color: 'text-primary' },
];

export default function KPICards() {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1/ws/kpi';
  const { data: wsData, status: wsStatus } = useWebSocket<any>(wsUrl);

  const isWsConnected = wsStatus === 'connected';

  const { data: queryData, isLoading } = useQuery({
    queryKey: ['kpiData'],
    queryFn: fetchKPIData,
    refetchInterval: isWsConnected ? false : 10000
  });

  const data = isWsConnected && wsData ? wsData : queryData;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        {Array(7).fill(0).map((_, i) => (
          <SkeletonLoader key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6"
    >
      {kpiConfig.map((config) => {
        const Icon = config.icon;
        const value = data ? data[config.key as keyof typeof data] : 0;
        
        return (
          <motion.div key={config.key} variants={item} className="h-full">
            <Card className="h-full p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-textSecondary font-medium truncate pr-2">{config.label}</span>
                <Icon size={16} className={config.color} />
              </div>
              <div className="text-2xl font-bold tracking-tight">
                <AnimatedNumber value={value} format={config.format} />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
