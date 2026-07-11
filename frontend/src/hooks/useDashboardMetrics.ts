import { useQuery } from '@tanstack/react-query';
import { fetchKPIData } from '../services/dashboard';
import { useWebSocket } from '../services/websocket';
import { config } from '../config';

export function useDashboardMetrics() {
  const wsUrl = config.wsUrl;
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
