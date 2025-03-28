import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Interview Preparation Table', () => {
  const testUserId = 'test-user-id';
  const validInterviewPrepData = {
    user_id: testUserId,
    application_id: 'application-id',
    interview_type: 'technical',
    interview_date: new Date().toISOString(),
    questions: [
      {
        question: 'What is your experience with React?',
        answer: 'I have 3 years of experience with React...',
        notes: 'Focus on component lifecycle and hooks'
      }
    ],
    status: 'scheduled',
    feedback: null
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.user_id && data.application_id ? data : null,
        error: data.user_id && data.application_id ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validInterviewPrepData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validInterviewPrepData, ...data } : null,
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

  it('should create a new interview preparation', async () => {
    const result = await supabase
      .from('interview_preparation')
      .insert({ id: testUserId, ...validInterviewPrepData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validInterviewPrepData });
  });

  it('should read an existing interview preparation', async () => {
    const result = await supabase
      .from('interview_preparation')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validInterviewPrepData });
  });

  it('should update an existing interview preparation', async () => {
    const updateData = {
      status: 'completed',
      feedback: 'Great performance in technical questions'
    };
    const result = await supabase
      .from('interview_preparation')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validInterviewPrepData, ...updateData });
  });

  it('should delete an existing interview preparation', async () => {
    const result = await supabase
      .from('interview_preparation')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent interview preparation operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('interview_preparation').select('*').eq('id', nonExistentId).single(),
      supabase.from('interview_preparation').update({ status: 'cancelled' }).eq('id', nonExistentId).single(),
      supabase.from('interview_preparation').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
