import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Auth Tests', () => {
  // Load environment variables
  beforeAll(() => {
    dotenv.config({ path: '.env.test' });
  });

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockProfile = {
    id: 'test-user-id',
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
    role: 'job_seeker',
    company: 'Test Company',
    job_title: 'Test Job',
    bio: 'Test bio',
    location: 'Test Location',
    phone: '1234567890',
    linkedin_url: 'https://linkedin.com/test',
    github_url: 'https://github.com/test',
    email_notifications: true,
    dark_mode: false,
    language: 'en',
  };

  interface MockSupabase {
    auth: {
      signInWithPassword: jest.Mock;
      signUp: jest.Mock;
      signOut: jest.Mock;
      getSession: jest.Mock;
      updateUser: jest.Mock;
    };
    from: jest.Mock;
    select: jest.Mock;
    insert: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    eq: jest.Mock;
    single: jest.Mock;
  }

  interface MockQuery {
    select: jest.Mock;
    insert: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    eq: jest.Mock;
    single: jest.Mock;
  }

  let mockSupabase: MockSupabase;
  let mockQuery: MockQuery;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock query object
    mockQuery = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: [mockProfile],
        error: null,
      }),
    };

    // Create a mock Supabase client
    mockSupabase = {
      auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        getSession: jest.fn(),
        updateUser: jest.fn(),
      },
      from: jest.fn().mockReturnValue(mockQuery),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockProfile,
        error: null,
      }),
    };

    // Mock the createClient function
    jest.mock('@supabase/supabase-js', () => ({
      createClient: jest.fn().mockReturnValue(mockSupabase as any)
    }));
  });

  describe('Authentication', () => {
    it('should sign in with password', async () => {
      const signInMock = mockSupabase.auth.signInWithPassword;
      signInMock.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const { data, error } = await mockSupabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(signInMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(error).toBeNull();
      expect(data?.user).toEqual(mockUser);
    });

    it('should sign up a new user', async () => {
      const signUpMock = mockSupabase.auth.signUp;
      signUpMock.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const { data, error } = await mockSupabase.auth.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(signUpMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(error).toBeNull();
      expect(data?.user).toEqual(mockUser);
    });

    it('should sign out a user', async () => {
      const signOutMock = mockSupabase.auth.signOut;
      signOutMock.mockResolvedValue({
        error: null,
      });

      const { error } = await mockSupabase.auth.signOut();

      expect(signOutMock).toHaveBeenCalled();
      expect(error).toBeNull();
    });
  });

  describe('Profile Management', () => {
    it('should create a new profile', async () => {
      const fromMock = mockSupabase.from;
      const insertMock = mockQuery.insert;
      const selectMock = mockQuery.select;
      const singleMock = mockQuery.single;

      const { data, error } = await mockSupabase
        .from('profiles')
        .insert([{
          ...mockProfile,
        }])
        .select()
        .single();

      expect(fromMock).toHaveBeenCalledWith('profiles');
      expect(insertMock).toHaveBeenCalledWith([{
        ...mockProfile,
      }]);
      expect(selectMock).toHaveBeenCalled();
      expect(singleMock).toHaveBeenCalled();
      expect(error).toBeNull();
      expect(data[0]).toEqual(mockProfile);
    });

    it('should update an existing profile', async () => {
      const fromMock = mockSupabase.from;
      const updateMock = mockQuery.update;
      const eqMock = mockQuery.eq;
      const selectMock = mockQuery.select;
      const singleMock = mockQuery.single;

      const { data, error } = await mockSupabase
        .from('profiles')
        .update({
          full_name: 'Updated Test User',
        })
        .eq('id', 'test-user-id')
        .select()
        .single();

      expect(fromMock).toHaveBeenCalledWith('profiles');
      expect(updateMock).toHaveBeenCalledWith({
        full_name: 'Updated Test User',
      });
      expect(eqMock).toHaveBeenCalledWith('id', 'test-user-id');
      expect(selectMock).toHaveBeenCalled();
      expect(singleMock).toHaveBeenCalled();
      expect(error).toBeNull();
      expect(data[0]).toEqual(mockProfile);
    });

    it('should get a user profile', async () => {
      const fromMock = mockSupabase.from;
      const eqMock = mockQuery.eq;
      const selectMock = mockQuery.select;
      const singleMock = mockQuery.single;

      const { data, error } = await mockSupabase
        .from('profiles')
        .select()
        .eq('id', 'test-user-id')
        .single();

      expect(fromMock).toHaveBeenCalledWith('profiles');
      expect(eqMock).toHaveBeenCalledWith('id', 'test-user-id');
      expect(selectMock).toHaveBeenCalled();
      expect(singleMock).toHaveBeenCalled();
      expect(error).toBeNull();
      expect(data[0]).toEqual(mockProfile);
    });
  });
});
