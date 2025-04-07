import { render, screen } from '@testing-library/react';
import { LoginForm } from '@/components/auth/LoginForm';
import { userEvent } from '@testing-library/user-event';
import { jest } from '@jest/globals';

// Type assertion function for our mock
const getMockSupabase = (supabase: unknown): {
  auth: {
    signInWithPassword: jest.Mock;
    signInWithOAuth: jest.Mock;
  }
} => supabase as unknown as {
  auth: {
    signInWithPassword: jest.Mock;
    signInWithOAuth: jest.Mock;
  }
};

// Mock Supabase configuration
jest.mock('@/utils/supabase/config', () => ({
  SUPABASE_URL: 'mock-url',
  SUPABASE_ANON_KEY: 'mock-key',
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('LoginForm', () => {
  let mockSupabase: unknown;

  beforeEach(async () => {
    render(<LoginForm />);
    const { supabase } = await import('@/utils/supabase/config');
    mockSupabase = supabase;
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const emailSignInButton = screen.getByTestId('email-sign-in');
    const googleSignInButton = screen.getByTestId('google-sign-in');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(emailSignInButton).toBeInTheDocument();
    expect(googleSignInButton).toBeInTheDocument();
  });

  it('submits login form with valid credentials', async () => {
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const emailSignInButton = screen.getByTestId('email-sign-in');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(emailSignInButton);

    expect(getMockSupabase(mockSupabase).auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('handles Google sign-in', async () => {
    const googleSignInButton = screen.getByTestId('google-sign-in');
    await userEvent.click(googleSignInButton);

    expect(getMockSupabase(mockSupabase).auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.any(String),
      },
    });
  });
});
