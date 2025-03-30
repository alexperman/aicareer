import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegistrationForm } from '@/components/auth/RegistrationForm';

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
      signUp: jest.fn().mockRejectedValue({
        error: {
          message: 'Registration failed'
        }
      }),
    },
  },
}));

describe('RegistrationForm', () => {
  it('renders registration form', () => {
    render(<RegistrationForm />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Type')).toBeInTheDocument();
  });

  it('submits registration form with valid credentials', async () => {
    render(<RegistrationForm />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const fullNameInput = screen.getByLabelText('Full Name');
    const userTypeSelect = screen.getByLabelText('Account Type');
    const submitButton = screen.getByRole('button', { name: /register/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
    fireEvent.change(userTypeSelect, { target: { value: 'job_seeker' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });
});
