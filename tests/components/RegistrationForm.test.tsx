import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RegistrationForm } from '@/components/auth/RegistrationForm'
import { supabase } from '@/utils/supabase/config'

jest.mock('@/utils/supabase/config', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}))

describe('RegistrationForm', () => {
  const mockSignUp = supabase.auth.signUp as jest.Mock

  beforeEach(() => {
    mockSignUp.mockReset()
  })

  it('renders form with all required fields', () => {
    render(<RegistrationForm />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Account Type')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('validates form fields correctly', async () => {
    render(<RegistrationForm />)

    // Get form elements
    const form = screen.getByRole('form')

    // Submit empty form to trigger validation
    fireEvent.submit(form)

    // Wait for validation errors with increased timeout
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
      expect(screen.getByText('Full name is required')).toBeInTheDocument()
      expect(screen.getByText('Please select a user type')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('submits form with valid data', async () => {
    render(<RegistrationForm />)

    mockSignUp.mockResolvedValue({ error: null })

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const fullNameInput = screen.getByLabelText('Full Name')
    const userTypeSelect = screen.getByLabelText('Account Type')
    const form = screen.getByRole('form')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } })
    fireEvent.change(userTypeSelect, { target: { value: 'job_seeker' } })

    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
            user_type: 'job_seeker',
          },
        },
      })
    })
  })

  it('shows error message on registration failure', async () => {
    render(<RegistrationForm />)

    mockSignUp.mockResolvedValue({ error: { message: 'Registration failed' } })

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const fullNameInput = screen.getByLabelText('Full Name')
    const userTypeSelect = screen.getByLabelText('Account Type')
    const form = screen.getByRole('form')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(fullNameInput, { target: { value: 'Test User' } })
    fireEvent.change(userTypeSelect, { target: { value: 'job_seeker' } })

    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument()
    })
  })
})
