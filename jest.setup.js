import '@testing-library/jest-dom';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => {
  const supabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      updateUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  };
  return { createClient: jest.fn(() => supabase) };
});
