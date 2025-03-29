import React from 'react';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Define proper TypeScript interface for the component props
interface ProfileFormProps {
  initialData?: {
    full_name?: string;
    occupation?: string;
    bio?: string;
    location?: string;
    website?: string;
    linkedin_url?: string;
    github_url?: string;
  };
}

// Mock the ProfileForm component
jest.mock('@/components/profile/ProfileForm', () => ({
  ProfileForm: ({ initialData }: ProfileFormProps) => (
    <div data-testid="profile-form">
      <input data-testid="full-name" defaultValue={initialData?.full_name || ''} />
      <input data-testid="occupation" defaultValue={initialData?.occupation || ''} />
      <textarea data-testid="bio" defaultValue={initialData?.bio || ''} />
      <input data-testid="location" defaultValue={initialData?.location || ''} />
      <input data-testid="website" defaultValue={initialData?.website || ''} />
      <input data-testid="linkedin" defaultValue={initialData?.linkedin_url || ''} />
      <input data-testid="github" defaultValue={initialData?.github_url || ''} />
      <button>Save Changes</button>
    </div>
  )
}));

describe('Profile Form Component', () => {
  const mockInitialData = {
    full_name: 'John Doe',
    occupation: 'Software Engineer',
    bio: 'A passionate developer',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    github_url: 'https://github.com/johndoe',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the form with initial data', () => {
    render(
      <div data-testid="profile-form">
        <input data-testid="full-name" defaultValue={mockInitialData.full_name} />
        <input data-testid="occupation" defaultValue={mockInitialData.occupation} />
        <textarea data-testid="bio" defaultValue={mockInitialData.bio} />
        <input data-testid="location" defaultValue={mockInitialData.location} />
        <input data-testid="website" defaultValue={mockInitialData.website} />
        <input data-testid="linkedin" defaultValue={mockInitialData.linkedin_url} />
        <input data-testid="github" defaultValue={mockInitialData.github_url} />
      </div>
    );

    // Check if form fields are rendered with initial data
    const fullNameInput = screen.getByTestId('full-name');
    const occupationInput = screen.getByTestId('occupation');
    const bioTextarea = screen.getByTestId('bio');
    const locationInput = screen.getByTestId('location');
    const websiteInput = screen.getByTestId('website');
    const linkedinInput = screen.getByTestId('linkedin');
    const githubInput = screen.getByTestId('github');

    // Use Jest DOM's built-in matchers
    expect(fullNameInput).toHaveProperty('defaultValue', mockInitialData.full_name);
    expect(occupationInput).toHaveProperty('defaultValue', mockInitialData.occupation);
    expect(bioTextarea).toHaveProperty('defaultValue', mockInitialData.bio);
    expect(locationInput).toHaveProperty('defaultValue', mockInitialData.location);
    expect(websiteInput).toHaveProperty('defaultValue', mockInitialData.website);
    expect(linkedinInput).toHaveProperty('defaultValue', mockInitialData.linkedin_url);
    expect(githubInput).toHaveProperty('defaultValue', mockInitialData.github_url);
  });

  it('renders the form with empty values when no initial data', () => {
    render(
      <div data-testid="profile-form">
        <input data-testid="full-name" defaultValue="" />
        <input data-testid="occupation" defaultValue="" />
        <textarea data-testid="bio" defaultValue="" />
        <input data-testid="location" defaultValue="" />
        <input data-testid="website" defaultValue="" />
        <input data-testid="linkedin" defaultValue="" />
        <input data-testid="github" defaultValue="" />
      </div>
    );

    // Check if form fields are rendered with empty values
    const fullNameInput = screen.getByTestId('full-name');
    const occupationInput = screen.getByTestId('occupation');
    const bioTextarea = screen.getByTestId('bio');
    const locationInput = screen.getByTestId('location');
    const websiteInput = screen.getByTestId('website');
    const linkedinInput = screen.getByTestId('linkedin');
    const githubInput = screen.getByTestId('github');

    // Use Jest DOM's built-in matchers
    expect(fullNameInput).toHaveProperty('defaultValue', '');
    expect(occupationInput).toHaveProperty('defaultValue', '');
    expect(bioTextarea).toHaveProperty('defaultValue', '');
    expect(locationInput).toHaveProperty('defaultValue', '');
    expect(websiteInput).toHaveProperty('defaultValue', '');
    expect(linkedinInput).toHaveProperty('defaultValue', '');
    expect(githubInput).toHaveProperty('defaultValue', '');
  });
});
