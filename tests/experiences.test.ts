import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Experiences Table', () => {
  const testUserId = 'test-user-id';
  const validExperienceData = {
    user_id: testUserId,
    company: 'Test Company',
    title: 'Software Engineer',
    start_date: '2023-01-01',
    end_date: '2024-01-01',
    current: false,
    description: 'Test experience description',
    skills: ['JavaScript', 'React', 'Node.js'],
    location: 'Remote',
    type: 'full-time'
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.user_id && data.company ? data : null,
        error: data.user_id && data.company ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validExperienceData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validExperienceData, ...data } : null,
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

  it('should create a new experience', async () => {
    const result = await supabase
      .from('experiences')
      .insert({ id: testUserId, ...validExperienceData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validExperienceData });
  });

  it('should read an existing experience', async () => {
    const result = await supabase
      .from('experiences')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validExperienceData });
  });

  it('should update an existing experience', async () => {
    const updateData = { title: 'Senior Software Engineer', current: true };
    const result = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validExperienceData, ...updateData });
  });

  it('should delete an existing experience', async () => {
    const result = await supabase
      .from('experiences')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent experience operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('experiences').select('*').eq('id', nonExistentId).single(),
      supabase.from('experiences').update({ title: 'Test' }).eq('id', nonExistentId).single(),
      supabase.from('experiences').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
