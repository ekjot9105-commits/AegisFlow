import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OperatorChat from '../src/components/copilot/OperatorChat';

// Mock fetch and scrollIntoView
global.fetch = vi.fn() as any;
Element.prototype.scrollIntoView = vi.fn();

describe('OperatorChat', () => {
  it('renders correctly and allows user input', async () => {
    render(<OperatorChat />);
    expect(screen.getByText(/Operations Copilot online/i)).toBeInTheDocument();
    
    const input = screen.getByPlaceholderText(/Ask AI about operations/i);
    expect(input).toBeInTheDocument();
    
    // Simulate user typing
    fireEvent.change(input, { target: { value: 'Why is Gate 4 crowded?' } });
    expect(input).toHaveValue('Why is Gate 4 crowded?');
    
    // Mock the API response
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true, data: { response: 'Test response about Gate 4' } })
    });
    
    // Simulate sending message
    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);
    
    // Message should be added to the UI immediately
    expect(await screen.findByText('Why is Gate 4 crowded?')).toBeInTheDocument();
  });
});
