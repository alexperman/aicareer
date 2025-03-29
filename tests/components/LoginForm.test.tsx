import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

// Mock Supabase Config
jest.mock('@/utils/supabase/config', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOtp: jest.fn(),
      signInWithOAuth: jest.fn(),
    },
  }
  return { supabase: mockSupabase }
})

// Mock Next.js Router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock ThemeProvider
jest.mock('@/context/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Get mock functions
const mockSupabase = jest.requireMock('@/utils/supabase/config').supabase

describe('LoginForm', () => {
  const mockSignInWithPassword = mockSupabase.auth.signInWithPassword as jest.Mock
  const mockSignInWithOtp = mockSupabase.auth.signInWithOtp as jest.Mock
  const mockSignInWithOAuth = mockSupabase.auth.signInWithOAuth as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockSignInWithPassword.mockReset()
    mockSignInWithOtp.mockReset()
    mockSignInWithOAuth.mockReset()
  })

  it('renders form with all required fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Send Magic Link$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sign in with Google$/i })).toBeInTheDocument()
  })

  it('calls signInWithPassword with correct credentials', async () => {
    const mockData = { email: 'test@example.com', password: 'password123' }
    mockSignInWithPassword.mockResolvedValue({ data: { user: { id: '123' } }, error: null })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const signInButton = screen.getByRole('button', { name: /^Sign In$/i })

    await userEvent.type(emailInput, mockData.email)
    await userEvent.type(passwordInput, mockData.password)
    await userEvent.click(signInButton)

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: mockData.email,
      password: mockData.password,
    })
  })

  it('calls signInWithOtp for magic link', async () => {
    const mockEmail = 'test@example.com'
    mockSignInWithOtp.mockResolvedValue({ data: { user: { id: '123' } }, error: null })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    const magicLinkButton = screen.getByRole('button', { name: /^Send Magic Link$/i })

    await userEvent.type(emailInput, mockEmail)
    await userEvent.click(magicLinkButton)

    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: mockEmail,
      options: {
        emailRedirectTo: expect.stringContaining('/auth/callback'),
      },
    })
  })

  it('calls signInWithOAuth for Google sign in', async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: { user: { id: '123' } }, error: null })

    render(<LoginForm />)

    const googleSignInButton = screen.getByRole('button', { name: /^Sign in with Google$/i })
    await userEvent.click(googleSignInButton)

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback'),
      },
    })
  })

  it('renders login form with email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />)
    const signInButton = screen.getByRole('button', { name: /^Sign In$/i })
    await userEvent.click(signInButton)

    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    render(<LoginForm />)
    mockSignInWithPassword.mockResolvedValue({ error: null })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const signInButton = screen.getByRole('button', { name: /^Sign In$/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(signInButton)

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('displays error message on login failure', async () => {
    render(<LoginForm />)
    mockSignInWithPassword.mockResolvedValue({ error: { message: 'Login failed' } })

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const signInButton = screen.getByRole('button', { name: /^Sign In$/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(signInButton)

    expect(await screen.findByText('Login failed')).toBeInTheDocument()
  })
})
