import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// Mock Supabase
jest.mock('@/utils/supabase/config', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockRejectedValue({
        error: {
          message: 'Failed to sign in'
        }
      }),
    },
  },
}));

describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('submits login form with valid credentials', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to sign in')).toBeInTheDocument();
    });
  });
});
