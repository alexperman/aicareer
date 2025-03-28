import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Knowledge Base Table', () => {
  const testUserId = 'test-user-id';
  const validKnowledgeBaseData = {
    user_id: testUserId,
    title: 'Interview Tips for Software Engineers',
    content: {
      overview: 'Essential tips for technical interviews',
      sections: [
        {
          title: 'Technical Preparation',
          content: 'Focus on data structures and algorithms...'
        },
        {
          title: 'Behavioral Questions',
          content: 'Use the STAR method to structure responses...'
        }
      ]
    },
    category: 'interview-preparation',
    tags: ['technical-interview', 'career-advice', 'software-engineering'],
    status: 'published',
    visibility: 'public'
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
            data: id === testUserId ? { id, ...validKnowledgeBaseData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validKnowledgeBaseData, ...data } : null,
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

  it('should create a new knowledge base article', async () => {
    const result = await supabase
      .from('knowledge_base')
      .insert({ id: testUserId, ...validKnowledgeBaseData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validKnowledgeBaseData });
  });

  it('should read an existing knowledge base article', async () => {
    const result = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validKnowledgeBaseData });
  });

  it('should update an existing knowledge base article', async () => {
    const updateData = {
      title: 'Updated Interview Tips for Senior Engineers',
      tags: ['senior-level', 'system-design', 'leadership'],
      status: 'updated'
    };
    const result = await supabase
      .from('knowledge_base')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validKnowledgeBaseData, ...updateData });
  });

  it('should delete an existing knowledge base article', async () => {
    const result = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent knowledge base article operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('knowledge_base').select('*').eq('id', nonExistentId).single(),
      supabase.from('knowledge_base').update({ status: 'archived' }).eq('id', nonExistentId).single(),
      supabase.from('knowledge_base').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
