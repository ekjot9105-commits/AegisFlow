import { useState, useEffect, useRef } from 'react';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseWebSocketResult<T> {
  data: T | null;
  status: ConnectionStatus;
  error: Error | null;
}

export function useWebSocket<T>(url: string): UseWebSocketResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      try {
        setStatus('connecting');
        const ws = new WebSocket(url);

        ws.onopen = () => {
          setStatus('connected');
          setError(null);
          reconnectAttempts.current = 0;
        };

        ws.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
          } catch {
            // Ignore parse errors in production
          }
        };

        ws.onclose = () => {
          setStatus('disconnected');
          if (reconnectAttempts.current < maxReconnectAttempts) {
            const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            reconnectAttempts.current += 1;
            reconnectTimeout = setTimeout(connect, timeout);
          }
        };

        ws.onerror = () => {
          setStatus('error');
          setError(new Error('WebSocket connection error'));
          ws.close();
        };

        wsRef.current = ws;
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return { data, status, error };
}
