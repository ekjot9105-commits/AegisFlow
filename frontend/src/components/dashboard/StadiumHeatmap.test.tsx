import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StadiumHeatmap from './StadiumHeatmap';

describe('StadiumHeatmap', () => {
  it('renders loading skeleton initially', () => {
    const { container } = render(<StadiumHeatmap />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
