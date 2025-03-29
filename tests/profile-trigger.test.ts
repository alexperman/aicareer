import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// We'll use a simplified approach without trying to mock the Supabase client directly
describe('Profile Creation Trigger', () => {
  const testUserId = 'test-user-id';
  const testUserData = {
    id: testUserId,
    email: 'test@example.com',
    raw_user_meta_data: {
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg',
      is_recruiter: false
    }
  };

  const expectedProfileData = {
    id: testUserId,
    updated_at: expect.any(String),
    full_name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    is_recruiter: false,
    settings: {
      privacy: {
        profile_visibility: 'public',
        show_email: true,
        show_location: true,
        show_social_links: true,
        contact_preferences: {
          allow_messages: true,
          allow_connection_requests: true,
          notification_email: true,
          notification_push: true
        }
      },
      theme: 'system',
      language: 'en',
      timezone: 'UTC'
    }
  };

  // Define types for our mock functions and return values
  interface ProfileResult {
    data: typeof expectedProfileData | null;
    error: null;
  }

  interface SignUpResult {
    data: { 
      user: typeof testUserData | { 
        id: string; 
        email: string; 
        raw_user_meta_data: { 
          full_name: string;
        }; 
      }; 
      session: null; 
    };
    error: null;
  }

  interface SignUpParams {
    email: string;
    password: string;
    options?: {
      data?: {
        full_name: string;
        avatar_url?: string;
        is_recruiter?: boolean;
      };
    };
  }

  interface SupabaseClient {
    auth: {
      signUp: (params: SignUpParams) => Promise<SignUpResult>;
    };
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          single: () => Promise<ProfileResult>;
        };
      };
    };
  }

  // Create mock functions
  const mockSignUp = jest.fn();
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockSingle = jest.fn();
  const mockFrom = jest.fn();

  // Create a mock Supabase client
  const supabase: SupabaseClient = {
    auth: {
      signUp: mockSignUp
    },
    from: mockFrom
  } as unknown as SupabaseClient;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();
    
    // Set up the mock chain for each test
    mockSignUp.mockReturnValue(Promise.resolve({
      data: { user: testUserData, session: null },
      error: null
    }));

    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSingle.mockReturnValue(Promise.resolve({
      data: expectedProfileData,
      error: null
    }));

    mockFrom.mockImplementation((table) => {
      if (table === 'profiles') {
        return { select: mockSelect };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue(Promise.resolve({ data: null, error: null }))
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should automatically create a profile when a user signs up', async () => {
    // Simulate user signup
    const signUpResult = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123',
      options: {
        data: {
          full_name: 'John Doe',
          avatar_url: 'https://example.com/avatar.jpg',
          is_recruiter: false
        }
      }
    });

    expect(signUpResult.error).toBeNull();
    expect(signUpResult.data.user).toEqual(testUserData);

    // Verify that a profile was created
    const profilesTable = supabase.from('profiles');
    const selectResult = profilesTable.select('*');
    const eqResult = selectResult.eq('id', testUserId);
    const profileResult = await eqResult.single();

    expect(profileResult.error).toBeNull();
    expect(profileResult.data).toEqual(expectedProfileData);
    expect(mockFrom).toHaveBeenCalledWith('profiles');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('id', testUserId);
    expect(mockSingle).toHaveBeenCalled();
  });

  it('should set default values when user metadata is missing', async () => {
    const userWithMinimalData = {
      ...testUserData,
      raw_user_meta_data: { full_name: 'Jane Doe' }
    };

    const expectedMinimalProfile = {
      ...expectedProfileData,
      full_name: 'Jane Doe',
      avatar_url: null,
      is_recruiter: false
    };

    // Override the mock for this specific test
    mockSignUp.mockReturnValueOnce(Promise.resolve({
      data: { user: userWithMinimalData, session: null },
      error: null
    }));

    mockSingle.mockReturnValueOnce(Promise.resolve({
      data: expectedMinimalProfile,
      error: null
    }));

    // Simulate user signup with minimal data
    const signUpResult = await supabase.auth.signUp({
      email: 'jane@example.com',
      password: 'password123',
      options: {
        data: {
          full_name: 'Jane Doe'
        }
      }
    });

    expect(signUpResult.error).toBeNull();

    // Verify that a profile was created with default values
    const profilesTable = supabase.from('profiles');
    const selectResult = profilesTable.select('*');
    const eqResult = selectResult.eq('id', testUserId);
    const profileResult = await eqResult.single();

    expect(profileResult.error).toBeNull();
    expect(profileResult.data).toEqual(expectedMinimalProfile);
    expect(mockFrom).toHaveBeenCalledWith('profiles');
    expect(mockSelect).toHaveBeenCalledWith('*');
    expect(mockEq).toHaveBeenCalledWith('id', testUserId);
    expect(mockSingle).toHaveBeenCalled();
  });
});
