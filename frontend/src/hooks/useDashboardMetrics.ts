import { useQuery } from '@tanstack/react-query';
import { fetchKPIData } from '../services/dashboard';
import { useWebSocket } from '../services/websocket';

export function useDashboardMetrics() {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1/ws/kpi';
  const { data: wsData, status: wsStatus } = useWebSocket<Record<string, number | string>>(wsUrl);

  const isWsConnected = wsStatus === 'connected';

  const { data: queryData, isLoading } = useQuery({
    queryKey: ['kpiData'],
    queryFn: fetchKPIData,
    refetchInterval: isWsConnected ? false : 10000
  });

  const data = isWsConnected && wsData ? wsData : queryData;

  return { data, isLoading, isWsConnected };
}
