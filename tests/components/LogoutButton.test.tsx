import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the AuthContext
jest.mock('@/context/AuthContext', () => ({
  __esModule: true,
  default: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
}));

// Mock React's useContext to return our mock auth context values
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useContext: jest.fn().mockReturnValue({
      user: { id: 'test-user-id', email: 'test@example.com' },
      loading: false,
    }),
  };
});

// Mock the Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

// Mock console.error for error handling tests
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('LogoutButton', () => {
  let mockRouter: ReturnType<typeof useRouter>;
  let mockSignOut: jest.Mock;
  let mockSupabase: { auth: { signOut: jest.Mock } };

  beforeEach(() => {
    // Mock router
    mockRouter = {
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Create a Jest mock function for signOut
    mockSignOut = jest.fn().mockResolvedValue({ error: null });
    
    // Mock Supabase client
    mockSupabase = {
      auth: {
        signOut: mockSignOut,
      },
    };
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    // Reset console.error mock
    mockConsoleError.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('calls signOut on click', async () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('handles errors gracefully', async () => {
    const error = new Error('Logout failed');
    mockSignOut.mockRejectedValueOnce(error);

    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockConsoleError).toHaveBeenCalledWith('Error logging out:', error);
    });
  });
});

// Restore console.error after all tests
afterAll(() => {
  mockConsoleError.mockRestore();
});
