import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Feedback Reviews Table', () => {
  const testUserId = 'test-user-id';
  const validReviewData = {
    reviewer_id: testUserId,
    target_type: 'company',
    target_id: 'company-id',
    rating: 4,
    content: 'Great experience',
    created_at: new Date().toISOString(),
    is_anonymous: false
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.reviewer_id && data.target_id ? data : null,
        error: data.reviewer_id && data.target_id ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validReviewData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validReviewData, ...data } : null,
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

  it('should create a new feedback review', async () => {
    const result = await supabase
      .from('feedback_reviews')
      .insert({ id: testUserId, ...validReviewData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validReviewData });
  });

  it('should read an existing feedback review', async () => {
    const result = await supabase
      .from('feedback_reviews')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validReviewData });
  });

  it('should update an existing feedback review', async () => {
    const updateData = { rating: 5, content: 'Updated review' };
    const result = await supabase
      .from('feedback_reviews')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validReviewData, ...updateData });
  });

  it('should delete an existing feedback review', async () => {
    const result = await supabase
      .from('feedback_reviews')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent feedback review operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('feedback_reviews').select('*').eq('id', nonExistentId).single(),
      supabase.from('feedback_reviews').update({ rating: 3 }).eq('id', nonExistentId).single(),
      supabase.from('feedback_reviews').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
