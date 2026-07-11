// @ts-ignore
import '@testing-library/jest-dom';

import { vi } from 'vitest';

class IntersectionObserverMock {
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

class MockEventSource {
  onmessage = null;
  close = () => null;
}
vi.stubGlobal('EventSource', MockEventSource);

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock Global Fetch to prevent actual network calls during tests
const mockFetchResponse = {
  ok: true,
  json: async () => ({
    success: true,
    data: {
      recommendation: "Mocked AI Recommendation",
      confidence: 95
    }
  }),
};
vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse));
