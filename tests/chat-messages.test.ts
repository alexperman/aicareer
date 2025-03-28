import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import mockClient from './__mocks__/supabase';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('Chat Messages Table', () => {
  const testUserId = 'test-user-id';
  const validMessageData = {
    chat_id: 'chat-id',
    sender_id: testUserId,
    content: 'Test message',
    sent_at: new Date().toISOString(),
    is_read: false
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  beforeEach(() => {
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockImplementation((data) => ({
        data: data.chat_id && data.sender_id ? data : null,
        error: data.chat_id && data.sender_id ? null : { message: 'Invalid data provided' },
        single: jest.fn().mockReturnThis()
      })),
      select: jest.fn().mockImplementation(() => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validMessageData } : null,
            error: id === testUserId ? null : { message: 'Record not found' }
          })
        }))
      })),
      update: jest.fn().mockImplementation((data) => ({
        eq: jest.fn().mockImplementation((_, id) => ({
          single: jest.fn().mockResolvedValue({
            data: id === testUserId ? { id, ...validMessageData, ...data } : null,
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

  it('should create a new chat message', async () => {
    const result = await supabase
      .from('chat_messages')
      .insert({ id: testUserId, ...validMessageData })
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validMessageData });
  });

  it('should read an existing chat message', async () => {
    const result = await supabase
      .from('chat_messages')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validMessageData });
  });

  it('should update an existing chat message', async () => {
    const updateData = { content: 'Updated message', is_read: true };
    const result = await supabase
      .from('chat_messages')
      .update(updateData)
      .eq('id', testUserId)
      .single();

    expect(result.error).toBeNull();
    expect(result.data).toEqual({ id: testUserId, ...validMessageData, ...updateData });
  });

  it('should delete an existing chat message', async () => {
    const result = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', testUserId)
      .then();

    expect(result.error).toBeNull();
    expect(result.data).toBeNull();
  });

  it('should handle non-existent chat message operations', async () => {
    const nonExistentId = 'non-existent-id';
    const operations = await Promise.all([
      supabase.from('chat_messages').select('*').eq('id', nonExistentId).single(),
      supabase.from('chat_messages').update({ content: 'Test' }).eq('id', nonExistentId).single(),
      supabase.from('chat_messages').delete().eq('id', nonExistentId).then()
    ]);

    operations.forEach(result => {
      expect(result.error).toBeDefined();
      expect(result.error!.message).toBe('Record not found');
    });
  });
});
