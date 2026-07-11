import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseRealTimeDataOptions {
  url: string;
  queryKey: string[];
  fallbackPollingInterval?: number; // ms
}

export function useRealTimeData<T>({ url, queryKey, fallbackPollingInterval = 5000 }: UseRealTimeDataOptions) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    let isMounted = true;
    
    const connect = () => {
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          setIsConnected(true);
          reconnectAttempts.current = 0; // Reset on success
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data: T = JSON.parse(event.data);
            queryClient.setQueryData(queryKey, data);
          } catch {
            // Ignore parse errors in production
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setIsConnected(false);
          
          // Exponential backoff: min(1000 * 2^attempts, 30000)
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectAttempts.current += 1;
          reconnectTimeout = setTimeout(connect, delay);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        // Connection failed
      }
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, queryClient, queryKey]);

  return { isConnected, fallbackPollingInterval: isConnected ? false : fallbackPollingInterval };
}
