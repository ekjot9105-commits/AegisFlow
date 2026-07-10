import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import KPICards from './KPICards';

vi.mock('../../services/websocket', () => ({
  useWebSocket: () => ({ data: null, status: 'disconnected', error: null })
}));

describe('KPICards', () => {
  it('renders loading skeletons initially', () => {
    const queryClient = new QueryClient();
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <KPICards />
      </QueryClientProvider>
    );
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
