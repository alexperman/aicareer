import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Job Posts Table', () => {
  const testUserId = 'test-user-id';
  const validJobPostData = {
    user_id: testUserId,
    agency_id: 'agency-id',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    salary_range: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    description: 'Looking for an experienced software engineer...',
    requirements: [
      'Experience with React and Node.js',
      'Strong problem-solving skills',
      '5+ years of experience'
    ],
    benefits: [
      'Health insurance',
      'Remote work',
      'Flexible hours'
    ],
    status: 'active',
    employment_type: 'full-time'
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.user_id && data.title ? data : null,
        error: data.user_id && data.title ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validJobPostData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validJobPostData, ...data } : null,
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

  it('should create a new job post', async () => {
    const result = await supabase
      .from('job_posts')
      .insert({ id: testUserId, ...validJobPostData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validJobPostData });
  });

  it('should read an existing job post', async () => {
    const result = await supabase
      .from('job_posts')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validJobPostData });
  });

  it('should update an existing job post', async () => {
    const updateData = {
      title: 'Lead Software Engineer',
      salary_range: {
        min: 150000,
        max: 200000,
        currency: 'USD'
      }
    };
    const result = await supabase
      .from('job_posts')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validJobPostData, ...updateData });
  });

  it('should delete an existing job post', async () => {
    const result = await supabase
      .from('job_posts')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent job post operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('job_posts').select('*').eq('id', nonExistentId).single(),
      supabase.from('job_posts').update({ status: 'inactive' }).eq('id', nonExistentId).single(),
      supabase.from('job_posts').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
