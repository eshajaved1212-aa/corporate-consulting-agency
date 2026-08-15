import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Contact from '../Contact';

// Mock the API module
vi.mock('../../api', () => ({
  submitContact: vi.fn(),
}));

describe('Contact Form Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the contact form with heading', () => {
    render(<Contact />);
    expect(screen.getByText(/send us a message/i)).toBeInTheDocument();
  });

  it('submits the form successfully with valid data', async () => {
    const { submitContact } = await import('../../api');
    submitContact.mockResolvedValueOnce({ success: true, status: 201 });

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText(/john smith/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/john@company/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/tell us about/i), { target: { value: 'Hello, I need help!' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        company: '',
        service: '',
        message: 'Hello, I need help!',
      });
    });
  });

  it('displays error on API failure', async () => {
    const { submitContact } = await import('../../api');
    submitContact.mockRejectedValueOnce(new Error('Network error'));

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText(/john smith/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText(/john@company/i), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/tell us about/i), { target: { value: 'Test message' } });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
