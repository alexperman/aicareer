import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({ error: null }),
  })),
}));

describe('ProfileForm', () => {
  const mockUserId = 'test-user-id';
  const mockInitialData = {
    full_name: 'Test User',
    occupation: 'Developer',
    bio: 'Test bio',
    location: 'Test Location',
    website: 'https://test.com',
    linkedin_url: 'https://linkedin.com/test',
    github_url: 'https://github.com/test',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      refresh: jest.fn(),
    });
  });

  it('renders form fields with initial data', () => {
    render(<ProfileForm initialData={mockInitialData} userId={mockUserId} />);

    expect(screen.getByLabelText('Full Name')).toHaveValue(mockInitialData.full_name);
    expect(screen.getByLabelText('Occupation')).toHaveValue(mockInitialData.occupation);
    expect(screen.getByLabelText('Bio')).toHaveValue(mockInitialData.bio);
    expect(screen.getByLabelText('Location')).toHaveValue(mockInitialData.location);
    expect(screen.getByLabelText('Website')).toHaveValue(mockInitialData.website);
    expect(screen.getByLabelText('LinkedIn')).toHaveValue(mockInitialData.linkedin_url);
    expect(screen.getByLabelText('GitHub')).toHaveValue(mockInitialData.github_url);
  });

  it('submits form with updated data', async () => {
    const mockForm = {
      full_name: 'Updated User',
      occupation: 'Updated Developer',
      bio: 'Updated bio',
      location: 'Updated Location',
      website: 'https://updated.com',
      linkedin_url: 'https://linkedin.com/updated',
      github_url: 'https://github.com/updated',
    };

    render(<ProfileForm initialData={mockInitialData} userId={mockUserId} />);

    // Fill form fields
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: mockForm.full_name } });
    fireEvent.change(screen.getByLabelText('Occupation'), { target: { value: mockForm.occupation } });
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: mockForm.bio } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: mockForm.location } });
    fireEvent.change(screen.getByLabelText('Website'), { target: { value: mockForm.website } });
    fireEvent.change(screen.getByLabelText('LinkedIn'), { target: { value: mockForm.linkedin_url } });
    fireEvent.change(screen.getByLabelText('GitHub'), { target: { value: mockForm.github_url } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    // Wait for async operations and verify button state
    await waitFor(() => {
      expect(submitButton).toHaveClass('disabled:pointer-events-none');
    });

    // Wait for the toast to be called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Your profile has been updated successfully.');
    });
  });
});
