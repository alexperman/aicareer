import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Profiles Table', () => {
  const testUserId = 'test-user-id';
  const validProfileData = {
    id: testUserId,
    email: 'test@example.com',
    full_name: 'John Doe',
    occupation: 'Software Engineer',
    bio: 'Experienced software engineer with a focus on web development',
    location: 'San Francisco, CA',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    experience_level: 'senior',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    github_url: 'https://github.com/johndoe',
    portfolio_url: 'https://johndoe.dev',
    preferences: {
      remote_work: true,
      job_types: ['full-time', 'contract'],
      salary_range: {
        min: 120000,
        max: 180000,
        currency: 'USD'
      }
    },
    status: 'active',
    last_active: new Date().toISOString()
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.id && data.email ? data : null,
        error: data.id && data.email ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? validProfileData : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { ...validProfileData, ...data } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      delete: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          then: jest.fn().mockResolvedValue({
            error: id === testUserId ? null : { message: 'Record not found' },
            data: null
          })
        }))
      }))
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new profile', async () => {
    const result = await supabase
      .from('profiles')
      .insert(validProfileData)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual(validProfileData);
  });

  it('should read an existing profile', async () => {
    const result = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual(validProfileData);
  });

  it('should update an existing profile', async () => {
    const updateData = {
      occupation: 'Senior Software Engineer',
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'GraphQL'],
      preferences: {
        ...validProfileData.preferences,
        salary_range: {
          min: 150000,
          max: 200000,
          currency: 'USD'
        }
      }
    };
    const result = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ ...validProfileData, ...updateData });
  });

  it('should delete an existing profile', async () => {
    const result = await supabase
      .from('profiles')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent profile operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('profiles').select('*').eq('id', nonExistentId).single(),
      supabase.from('profiles').update({ status: 'inactive' }).eq('id', nonExistentId).single(),
      supabase.from('profiles').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
