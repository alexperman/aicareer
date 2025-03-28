import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Saved Jobs Table', () => {
  const testUserId = 'test-user-id';
  const validSavedJobData = {
    user_id: testUserId,
    job_post_id: 'job-post-id',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    salary_range: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    },
    job_type: 'full-time',
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
    notes: 'Great opportunity with good benefits',
    status: 'interested',
    saved_date: new Date().toISOString()
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.user_id && data.job_post_id ? data : null,
        error: data.user_id && data.job_post_id ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validSavedJobData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validSavedJobData, ...data } : null,
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

  it('should create a new saved job', async () => {
    const result = await supabase
      .from('saved_jobs')
      .insert({ id: testUserId, ...validSavedJobData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validSavedJobData });
  });

  it('should read an existing saved job', async () => {
    const result = await supabase
      .from('saved_jobs')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validSavedJobData });
  });

  it('should update an existing saved job', async () => {
    const updateData = {
      status: 'applied',
      notes: 'Applied on company website, great fit for my skills',
      salary_range: {
        min: 140000,
        max: 200000,
        currency: 'USD'
      }
    };
    const result = await supabase
      .from('saved_jobs')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validSavedJobData, ...updateData });
  });

  it('should delete an existing saved job', async () => {
    const result = await supabase
      .from('saved_jobs')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent saved job operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('saved_jobs').select('*').eq('id', nonExistentId).single(),
      supabase.from('saved_jobs').update({ status: 'not_interested' }).eq('id', nonExistentId).single(),
      supabase.from('saved_jobs').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
